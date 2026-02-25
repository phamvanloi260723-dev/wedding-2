"use client";

import { gif } from "./gif";
import { card } from "./card";
import { like } from "./like";
import { pagination } from "./pagination";
import { dto } from "../connection/dto";
import { lang } from "../common/language";
import { storage } from "../common/storage";
import { session } from "../common/session";
import {
  escapeHtml,
  base64Encode,
  base64Decode,
  convertMarkdownToHTML,
  safeInnerHTML,
  disableButton,
  notify,
  ask,
} from "../common/util";
import {
  request,
  HTTP_GET,
  HTTP_POST,
  HTTP_DELETE,
  HTTP_PUT,
  HTTP_STATUS_CREATED,
} from "../connection/request";

let owns: ReturnType<typeof storage> | null = null;
let showHide: ReturnType<typeof storage> | null = null;
let comments: HTMLElement | null = null;
const lastRender: string[] = [];

const onNullComment = (): string => {
  const desc = lang
    .on("id", "📢 Yuk, share undangan ini biar makin rame komentarnya! 🎉")
    .on("en", "📢 Let's share this invitation to get more comments! 🎉")
    .get();

  return `<div class="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow"><p class="fw-bold p-0 m-0" style="font-size: 0.95rem;">${desc}</p></div>`;
};

const changeActionButton = (id: string, disabled: boolean) => {
  document
    .querySelector(`[data-button-action="${id}"]`)
    ?.childNodes.forEach((e: any) => {
      e.disabled = disabled;
    });
};

const removeInnerForm = (id: string) => {
  changeActionButton(id, false);
  document.getElementById(`inner-${id}`)?.remove();
};

const showOrHide = (button: HTMLElement) => {
  const ids = button.getAttribute("data-uuids")!.split(",");
  const isShow = button.getAttribute("data-show") === "true";
  const uuid = button.getAttribute("data-uuid")!;
  const currentShow = showHide!.get("show");

  button.setAttribute("data-show", isShow ? "false" : "true");
  button.innerText = isShow ? `Show replies (${ids.length})` : "Hide replies";
  showHide!.set(
    "show",
    isShow
      ? currentShow.filter((i: string) => i !== uuid)
      : [...currentShow, uuid],
  );

  for (const id of ids) {
    showHide!.set(
      "hidden",
      showHide!.get("hidden").map((i: any) => {
        if (i.uuid === id) {
          i.show = !isShow;
        }
        return i;
      }),
    );

    document.getElementById(id)?.classList.toggle("d-none", isShow);
  }
};

const showMore = (anchor: HTMLAnchorElement, uuid: string) => {
  const content = document.getElementById(`content-${uuid}`)!;
  const original = base64Decode(content.getAttribute("data-comment")!);
  const isCollapsed = anchor.getAttribute("data-show") === "false";

  safeInnerHTML(
    content,
    convertMarkdownToHTML(
      escapeHtml(
        isCollapsed
          ? original
          : original.slice(0, card.maxCommentLength) + "...",
      ),
    ),
  );
  anchor.innerText = isCollapsed ? "Sebagian" : "Selengkapnya";
  anchor.setAttribute("data-show", isCollapsed ? "true" : "false");
};

const fetchTracker = async (c: any): Promise<void> => {
  if (c.comments) {
    await Promise.all(c.comments.map((v: any) => fetchTracker(v)));
  }

  if (!c.ip || !c.user_agent || c.is_admin) {
    return;
  }

  const setResult = (result: string) => {
    const commentIp = document.getElementById(`ip-${escapeHtml(c.uuid)}`);
    if (commentIp) {
      safeInnerHTML(
        commentIp,
        `<i class="fa-solid fa-location-dot me-1"></i>${escapeHtml(c.ip)} <strong>${escapeHtml(result)}</strong>`,
      );
    }
  };

  await request(HTTP_GET, `https://apip.cc/api-json/${c.ip}`)
    .withCache()
    .withRetry()
    .default()
    .then((res: any) => res.json())
    .then((res: any) => {
      let result = "localhost";

      if (res.status === "success") {
        if (res.City.length !== 0 && res.RegionName.length !== 0) {
          result = res.City + " - " + res.RegionName;
        } else if (res.Capital.length !== 0 && res.CountryName.length !== 0) {
          result = res.Capital + " - " + res.CountryName;
        }
      }

      setResult(result);
    })
    .catch((err: any) => setResult(err.message));
};

const traverse = (items: any[], hide: any[] = []): any[] => {
  const dataShow = showHide!.get("show");

  const buildHide = (lists: any[]) =>
    lists.forEach((item: any) => {
      if (hide.find((i: any) => i.uuid === item.uuid)) {
        buildHide(item.comments);
        return;
      }

      hide.push(dto.commentShowMore(item.uuid));
      buildHide(item.comments);
    });

  const setVisible = (lists: any[]) =>
    lists.forEach((item: any) => {
      if (!dataShow.includes(item.uuid)) {
        setVisible(item.comments);
        return;
      }

      item.comments.forEach((c: any) => {
        const i = hide.findIndex((h: any) => h.uuid === c.uuid);
        if (i !== -1) {
          hide[i].show = true;
        }
      });

      setVisible(item.comments);
    });

  buildHide(items);
  setVisible(items);

  return hide;
};

const show = (): Promise<any> => {
  // remove all event listener.
  lastRender.forEach((u) => {
    like.removeListener(u);
  });

  if (comments!.getAttribute("data-loading") === "false") {
    comments!.setAttribute("data-loading", "true");
    comments!.innerHTML = card.renderLoading().repeat(pagination.getPer());
  }

  return request(
    HTTP_GET,
    `/api/v2/comment?per=${pagination.getPer()}&next=${pagination.getNext()}&lang=${lang.getLanguage()}`,
  )
    .token(session.getToken())
    .withCache(1000 * 30)
    .withForceCache()
    .send(dto.getCommentsResponseV2)
    .then(async (res: any) => {
      comments!.setAttribute("data-loading", "false");

      for (const u of lastRender) {
        await gif.remove(u);
      }

      if (res.data.lists.length === 0) {
        comments!.innerHTML = onNullComment();
        return res;
      }

      const flatten = (ii: any[]): string[] =>
        ii.flatMap((i: any) => [i.uuid, ...flatten(i.comments)]);
      lastRender.splice(0, lastRender.length, ...flatten(res.data.lists));
      showHide!.set(
        "hidden",
        traverse(res.data.lists, showHide!.get("hidden")),
      );

      let data = await card.renderContentMany(res.data.lists);
      if (res.data.lists.length < pagination.getPer()) {
        data += onNullComment();
      }

      safeInnerHTML(comments!, data);

      lastRender.forEach((u) => {
        like.addListener(u);
      });

      return res;
    })
    .then(async (res: any) => {
      comments!.dispatchEvent(new Event("undangan.comment.result"));

      if (res.data.lists && session.isAdmin()) {
        await Promise.all(res.data.lists.map((v: any) => fetchTracker(v)));
      }

      pagination.setTotal(res.data.count);
      comments!.dispatchEvent(new Event("undangan.comment.done"));
      return res;
    });
};

const remove = async (button: HTMLButtonElement) => {
  if (!ask("Are you sure?")) {
    return;
  }

  const id = button.getAttribute("data-uuid")!;

  if (session.isAdmin()) {
    owns!.set(id, button.getAttribute("data-own"));
  }

  changeActionButton(id, true);
  const btn = disableButton(button);
  const likesBtn = like.getButtonLike(id) as HTMLButtonElement;
  if (likesBtn) likesBtn.disabled = true;

  const status = await request(HTTP_DELETE, "/api/comment/" + owns!.get(id))
    .token(session.getToken())
    .send(dto.statusResponse)
    .then((res: any) => res.data.status);

  if (!status) {
    btn.restore();
    if (likesBtn) likesBtn.disabled = false;
    changeActionButton(id, false);
    return;
  }

  document
    .querySelectorAll('a[onclick="undangan.comment.showOrHide(this)"]')
    .forEach((n) => {
      const oldUuids = n.getAttribute("data-uuids")!.split(",");

      if (oldUuids.includes(id)) {
        const uuids = oldUuids.filter((i) => i !== id).join(",");
        uuids.length === 0 ? n.remove() : n.setAttribute("data-uuids", uuids);
      }
    });

  owns!.unset(id);
  document.getElementById(id)?.remove();

  if (comments!.children.length === 0) {
    comments!.innerHTML = onNullComment();
  }
};

const update = async (button: HTMLButtonElement) => {
  const id = button.getAttribute("data-uuid")!;

  let isPresent = false;
  const presence = document.getElementById(
    `form-inner-presence-${id}`,
  ) as HTMLSelectElement | null;
  if (presence) {
    presence.disabled = true;
    isPresent = presence.value === "1";
  }

  const badge = document.getElementById(`badge-${id}`);
  const isChecklist =
    !!badge && badge.getAttribute("data-is-presence") === "true";

  const gifIsOpen = gif.isOpen(id);
  const gifId = gif.getResultId(id);
  const gifCancel = gif.buttonCancel(id);

  if (gifIsOpen && gifId) {
    gifCancel.hide();
  }

  const form = document.getElementById(
    `form-inner-${id}`,
  ) as HTMLTextAreaElement | null;

  if (
    id &&
    !gifIsOpen &&
    form &&
    base64Encode(form.value) === form.getAttribute("data-original") &&
    isChecklist === isPresent
  ) {
    removeInnerForm(id);
    return;
  }

  if (!gifIsOpen && form && form.value?.trim().length === 0) {
    notify("Comments cannot be empty.").warning();
    return;
  }

  if (form) {
    form.disabled = true;
  }

  const cancel = document.querySelector(
    `[onclick="undangan.comment.cancel(this, '${id}')"]`,
  ) as HTMLButtonElement | null;
  if (cancel) {
    cancel.disabled = true;
  }

  const btn = disableButton(button);

  const status = await request(
    HTTP_PUT,
    `/api/comment/${owns!.get(id)}?lang=${lang.getLanguage()}`,
  )
    .token(session.getToken())
    .body(
      dto.updateCommentRequest(
        presence ? isPresent : null,
        gifIsOpen ? null : (form?.value ?? null),
        gifId,
      ),
    )
    .send(dto.statusResponse)
    .then((res: any) => res.data.status);

  if (form) {
    form.disabled = false;
  }

  if (cancel) {
    cancel.disabled = false;
  }

  if (presence) {
    presence.disabled = false;
  }

  btn.restore();

  if (gifIsOpen && gifId) {
    gifCancel.show();
  }

  if (!status) {
    return;
  }

  if (gifIsOpen && gifId) {
    const imgGif = document.getElementById(`img-gif-${id}`) as HTMLImageElement;
    const resultImg = document
      .getElementById(`gif-result-${id}`)
      ?.querySelector("img") as HTMLImageElement;
    if (imgGif && resultImg) imgGif.src = resultImg.src;
    gifCancel.click();
  }

  removeInnerForm(id);

  if (!gifIsOpen && form) {
    const showButton = document.querySelector(
      `[onclick="undangan.comment.showMore(this, '${id}')"]`,
    ) as HTMLElement | null;

    const content = document.getElementById(`content-${id}`)!;
    content.setAttribute("data-comment", base64Encode(form.value));

    const original = convertMarkdownToHTML(escapeHtml(form.value));
    if (form.value.length > card.maxCommentLength) {
      safeInnerHTML(
        content,
        showButton?.getAttribute("data-show") === "false"
          ? original.slice(0, card.maxCommentLength) + "..."
          : original,
      );
      showButton?.classList.replace("d-none", "d-block");
    } else {
      safeInnerHTML(content, original);
      showButton?.classList.replace("d-block", "d-none");
    }
  }

  if (presence) {
    (document.getElementById("form-presence") as HTMLSelectElement).value =
      isPresent ? "1" : "2";
    storage("information").set("presence", isPresent);
  }

  if (!presence || !badge) {
    return;
  }

  badge.classList.toggle("fa-circle-xmark", !isPresent);
  badge.classList.toggle("text-danger", !isPresent);

  badge.classList.toggle("fa-circle-check", isPresent);
  badge.classList.toggle("text-success", isPresent);
};

const send = async (button: HTMLButtonElement) => {
  const id = button.getAttribute("data-uuid");

  const name = document.getElementById("form-name") as HTMLInputElement;
  const nameValue = name.value;

  if (nameValue.length === 0) {
    notify("Name cannot be empty.").warning();

    if (id) {
      name.scrollIntoView({ block: "center" });
    }
    return;
  }

  const presence = document.getElementById(
    "form-presence",
  ) as HTMLSelectElement | null;
  if (!id && presence && presence.value === "0") {
    notify("Please select your attendance status.").warning();
    return;
  }

  const gifIsOpen = gif.isOpen(id ? id : gif.default);
  const gifId = gif.getResultId(id ? id : gif.default);
  const gifCancel = gif.buttonCancel(id);

  if (gifIsOpen && !gifId) {
    notify("Gif cannot be empty.").warning();
    return;
  }

  if (gifIsOpen && gifId) {
    gifCancel.hide();
  }

  const form = document.getElementById(
    `form-${id ? `inner-${id}` : "comment"}`,
  ) as HTMLTextAreaElement;
  if (!gifIsOpen && form.value?.trim().length === 0) {
    notify("Comments cannot be empty.").warning();
    return;
  }

  if (!id && name && !session.isAdmin()) {
    name.disabled = true;
  }

  if (!session.isAdmin() && presence && presence.value !== "0") {
    presence.disabled = true;
  }

  if (form) {
    form.disabled = true;
  }

  const cancel = document.querySelector(
    `[onclick="undangan.comment.cancel(this, '${id}')"]`,
  ) as HTMLButtonElement | null;
  if (cancel) {
    cancel.disabled = true;
  }

  const btn = disableButton(button);
  const isPresence = presence ? presence.value === "1" : true;

  if (!session.isAdmin()) {
    const info = storage("information");
    info.set("name", nameValue);

    if (!id) {
      info.set("presence", isPresence);
    }
  }

  const response = await request(
    HTTP_POST,
    `/api/comment?lang=${lang.getLanguage()}`,
  )
    .token(session.getToken())
    .body(
      dto.postCommentRequest(
        id,
        nameValue,
        isPresence,
        gifIsOpen ? null : form.value,
        gifId,
      ),
    )
    .send(dto.getCommentResponse);

  if (name) {
    name.disabled = false;
  }

  if (form) {
    form.disabled = false;
  }

  if (cancel) {
    cancel.disabled = false;
  }

  if (presence) {
    presence.disabled = false;
  }

  if (gifIsOpen && gifId) {
    gifCancel.show();
  }

  btn.restore();

  if (!response || response.code !== HTTP_STATUS_CREATED) {
    return;
  }

  owns!.set(response.data.uuid, response.data.own);

  if (form) {
    form.value = "";
  }

  if (gifIsOpen && gifId) {
    gifCancel.click();
  }

  if (!id) {
    if (pagination.reset()) {
      await show();
      comments!.scrollIntoView();
      return;
    }

    pagination.setTotal(pagination.geTotal() + 1);
    if (comments!.children.length === pagination.getPer()) {
      comments!.lastElementChild?.remove();
    }

    response.data.is_parent = true;
    response.data.is_admin = session.isAdmin();
    comments!.insertAdjacentHTML(
      "afterbegin",
      await card.renderContentMany([response.data]),
    );
    comments!.scrollIntoView();
  }

  if (id) {
    showHide!.set(
      "hidden",
      showHide!
        .get("hidden")
        .concat([dto.commentShowMore(response.data.uuid, true)]),
    );
    showHide!.set("show", showHide!.get("show").concat([id]));

    removeInnerForm(id);

    response.data.is_parent = false;
    response.data.is_admin = session.isAdmin();
    document
      .getElementById(`reply-content-${id}`)!
      .insertAdjacentHTML(
        "beforeend",
        await card.renderContentSingle(response.data),
      );

    const anchorTag = document
      .getElementById(`button-${id}`)!
      .querySelector("a");
    if (anchorTag) {
      if (anchorTag.getAttribute("data-show") === "false") {
        showOrHide(anchorTag);
      }
      anchorTag.remove();
    }

    const uuids = [response.data.uuid];
    const readMoreElement = document
      .createRange()
      .createContextualFragment(
        card.renderReadMore(
          id,
          anchorTag
            ? anchorTag.getAttribute("data-uuids")!.split(",").concat(uuids)
            : uuids,
        ),
      );

    const buttonLike = like.getButtonLike(id)!;
    buttonLike.parentNode!.insertBefore(readMoreElement, buttonLike);
  }

  like.addListener(response.data.uuid);
  lastRender.push(response.data.uuid);
};

const cancelComment = async (button: HTMLButtonElement, id: string) => {
  const presence = document.getElementById(
    `form-inner-presence-${id}`,
  ) as HTMLSelectElement | null;
  const isPresent = presence ? presence.value === "1" : false;

  const badge = document.getElementById(`badge-${id}`);
  const isChecklist =
    badge && owns!.has(id) && presence
      ? badge.getAttribute("data-is-presence") === "true"
      : false;

  const btn = disableButton(button);

  if (
    gif.isOpen(id) &&
    ((!gif.getResultId(id) && isChecklist === isPresent) ||
      ask("Are you sure?"))
  ) {
    await gif.remove(id);
    removeInnerForm(id);
    return;
  }

  const form = document.getElementById(
    `form-inner-${id}`,
  ) as HTMLTextAreaElement;
  if (
    form.value.length === 0 ||
    (base64Encode(form.value) === form.getAttribute("data-original") &&
      isChecklist === isPresent) ||
    ask("Are you sure?")
  ) {
    removeInnerForm(id);
    return;
  }

  btn.restore();
};

const reply = (uuid: string) => {
  changeActionButton(uuid, true);

  gif.remove(uuid).then(() => {
    gif.onOpen(uuid, () => gif.removeGifSearch(uuid));
    document
      .getElementById(`button-${uuid}`)!
      .insertAdjacentElement("afterend", card.renderReply(uuid));
  });
};

const edit = async (button: HTMLButtonElement, is_parent: boolean) => {
  const id = button.getAttribute("data-uuid")!;

  changeActionButton(id, true);

  if (session.isAdmin()) {
    owns!.set(id, button.getAttribute("data-own"));
  }

  const badge = document.getElementById(`badge-${id}`);
  const isChecklist =
    !!badge && badge.getAttribute("data-is-presence") === "true";

  const gifImage = document.getElementById(`img-gif-${id}`);
  if (gifImage) {
    await gif.remove(id);
  }

  const isParent = is_parent && !session.isAdmin();
  document
    .getElementById(`button-${id}`)!
    .insertAdjacentElement(
      "afterend",
      card.renderEdit(id, isChecklist, isParent, !!gifImage),
    );

  if (gifImage) {
    gif.onOpen(id, () => {
      gif.removeGifSearch(id);
      gif.removeButtonBack(id);
    });

    await gif.open(id);
    return;
  }

  const formInner = document.getElementById(
    `form-inner-${id}`,
  ) as HTMLTextAreaElement;
  const original = base64Decode(
    document.getElementById(`content-${id}`)?.getAttribute("data-comment") ??
      "",
  );

  formInner.value = original;
  formInner.setAttribute("data-original", base64Encode(original));
};

const init = () => {
  gif.init();
  like.init();
  card.init();
  pagination.init();

  comments = document.getElementById("comments");
  comments!.addEventListener("undangan.comment.show", show);

  owns = storage("owns");
  showHide = storage("comment");

  if (!showHide.has("hidden")) {
    showHide.set("hidden", []);
  }

  if (!showHide.has("show")) {
    showHide.set("show", []);
  }
};

export const comment = {
  gif,
  like,
  pagination,
  init,
  send,
  edit,
  reply,
  remove,
  update,
  cancel: cancelComment,
  show,
  showMore,
  showOrHide,
};

"use client";

import {
  escapeHtml,
  base64Encode,
  debounce,
  disableButton,
  safeInnerHTML,
  notify,
} from "../common/util";
import { lang } from "../common/language";
import { storage } from "../common/storage";
import { cache } from "../connection/cache";
import {
  request,
  defaultJSON,
  ERROR_ABORT,
  HTTP_GET,
} from "../connection/request";

const gifDefault = "default";

const breakPoint: Record<number, number> = {
  128: 2,
  256: 3,
  512: 4,
  768: 5,
};

let c: ReturnType<typeof cache> | null = null;
let objectPool: Map<string, any> | null = null;
let eventListeners: Map<string, () => void> | null = null;
let config: ReturnType<typeof storage> | null = null;

const show = (uuid: string, lists: any[], load: any = null) => {
  const ctx = objectPool!.get(uuid);

  return lists.map((data) => {
    const {
      id,
      media_formats: {
        tinygif: { url },
      },
      content_description: description,
    } = data;

    if (ctx.pointer === -1) {
      ctx.pointer = 0;
    } else if (ctx.pointer === ctx.col - 1) {
      ctx.pointer = 0;
    } else {
      ctx.pointer++;
    }

    const el = ctx.lists.childNodes[ctx.pointer] ?? null;
    if (!el) return null;

    const res = (uri: string) => {
      el.insertAdjacentHTML(
        "beforeend",
        `
        <figure class="hover-wrapper m-0 position-relative">
          <button onclick="undangan.comment.gif.click(this, '${ctx.uuid}', '${id}', '${base64Encode(url)}')" class="btn hover-area position-absolute justify-content-center align-items-center top-0 end-0 bg-overlay-auto p-1 m-1 rounded-circle border shadow-sm z-1">
            <i class="fa-solid fa-circle-check"></i>
          </button>
          <img src="${uri}" class="img-fluid" alt="${escapeHtml(description)}" style="width: 100%;">
        </figure>`,
      );
      load?.step();
    };

    return { url, res };
  });
};

const get = (url: string) => c!.get(url);

const loading = (uuid: string) => {
  const ctx = objectPool!.get(uuid);
  const list = ctx.lists;
  const load = document.getElementById(`gif-loading-${ctx.uuid}`);
  const prog = document.getElementById(`progress-bar-${ctx.uuid}`);
  const info = document.getElementById(`progress-info-${ctx.uuid}`);

  let total = 0;
  let loaded = 0;

  list.setAttribute("data-continue", "false");
  list.classList.replace("overflow-y-scroll", "overflow-y-hidden");

  const timeoutMs = 150;
  let isReleased = false;

  const timeoutId = setTimeout(() => {
    if (isReleased) return;
    if (info) info.innerText = `${loaded}/${total}`;
    if (!list.classList.contains("d-none")) {
      load?.classList.replace("d-none", "d-flex");
    }
  }, timeoutMs);

  const release = () => {
    isReleased = true;
    clearTimeout(timeoutId);
    if (!list.classList.contains("d-none")) {
      load?.classList.replace("d-flex", "d-none");
    }
    if (prog) prog.style.width = "0%";
    if (info) info.innerText = `${loaded}/${total}`;
    list.setAttribute("data-continue", "true");
    list.classList.replace("overflow-y-hidden", "overflow-y-scroll");
  };

  const until = (num: number) => {
    total = num;
    if (info) info.innerText = `${loaded}/${total}`;
  };

  const step = () => {
    loaded += 1;
    if (info) info.innerText = `${loaded}/${total}`;
    if (prog)
      prog.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";
  };

  return { release, until, step };
};

const render = (uuid: string, path: string, params: any) => {
  params = {
    media_filter: "tinygif",
    client_key: "undangan_app",
    key: config!.get("tenor_key"),
    country: lang.getCountry(),
    locale: lang.getLocale(),
    ...(params ?? {}),
  };

  const param = Object.keys(params)
    .filter((k) => params[k] !== null && params[k] !== undefined)
    .map((k) => `${k}=${encodeURIComponent(params[k])}`)
    .join("&");

  const load = loading(uuid);
  const ctx = objectPool!.get(uuid);
  const reqCancel = new Promise<void>((r) => {
    ctx.reqs.push(r);
  });

  ctx.last = request(
    HTTP_GET,
    `https://tenor.googleapis.com/v2${path}?${param}`,
  )
    .withCache()
    .withRetry()
    .withCancel(reqCancel)
    .default(defaultJSON)
    .then((r) => r.json())
    .then((j: any) => {
      if (j.error) throw new Error(j.error.message);
      if (j.results.length === 0) return j;

      ctx.next = j?.next;
      load.until(j.results.length);
      ctx.gifs.push(...j.results);

      return c!.run(show(uuid, j.results, load), reqCancel);
    })
    .catch((err: any) => {
      if (err.name === ERROR_ABORT) {
        console.warn("Fetch abort:", err);
      } else {
        notify(err).error();
      }
    })
    .finally(() => load.release());
};

const template = (uuid: string) => {
  uuid = escapeHtml(uuid);
  return `
    <label for="gif-search-${uuid}" class="form-label my-1"><i class="fa-solid fa-photo-film me-2"></i>Gif</label>
    <div class="d-flex mb-3" id="gif-search-nav-${uuid}">
      <button class="btn btn-secondary btn-sm rounded-4 shadow-sm me-1 my-1" onclick="undangan.comment.gif.back(this, '${uuid}')" data-offline-disabled="false"><i class="fa-solid fa-arrow-left"></i></button>
      <input dir="auto" type="text" name="gif-search" id="gif-search-${uuid}" autocomplete="on" class="form-control shadow-sm rounded-4" placeholder="Search for a GIF on Tenor" data-offline-disabled="false">
    </div>
    <div class="position-relative">
      <div class="position-absolute d-flex flex-column justify-content-center align-items-center top-50 start-50 translate-middle w-100 h-100 bg-overlay-auto rounded-4 z-3" id="gif-loading-${uuid}">
        <div class="progress w-25" role="progressbar" style="height: 0.5rem;" aria-label="progress bar">
          <div class="progress-bar" id="progress-bar-${uuid}" style="width: 0%"></div>
        </div>
        <small class="mt-1 text-theme-auto bg-theme-auto py-0 px-2 rounded-4" id="progress-info-${uuid}" style="font-size: 0.7rem;"></small>
      </div>
      <div id="gif-lists-${uuid}" class="d-flex rounded-4 p-0 overflow-y-scroll border" data-continue="true" style="height: 15rem;"></div>
    </div>
    <figure class="d-flex m-0 position-relative" id="gif-result-${uuid}">
      <button onclick="undangan.comment.gif.cancel('${uuid}')" id="gif-cancel-${uuid}" class="btn d-none position-absolute justify-content-center align-items-center top-0 end-0 bg-overlay-auto p-2 m-0 rounded-circle border shadow-sm z-1">
        <i class="fa-solid fa-circle-xmark"></i>
      </button>
    </figure>`;
};

const waitLastRequest = async (uuid: string) => {
  const ctx = objectPool!.get(uuid);
  ctx.reqs.forEach((f: any) => f());
  ctx.reqs.length = 0;
  if (ctx.last) {
    await ctx.last;
    ctx.last = null;
  }
};

const bootUp = async (uuid: string) => {
  await waitLastRequest(uuid);
  const ctx = objectPool!.get(uuid);
  const prevCol = ctx.col ?? 0;

  let last = 0;
  for (const [k, v] of Object.entries(breakPoint)) {
    last = v;
    if (ctx.lists.clientWidth >= parseInt(k as string)) {
      ctx.col = last;
    }
  }

  if (ctx.col === null) ctx.col = last;
  if (prevCol === ctx.col) return;

  ctx.pointer = -1;
  ctx.limit = ctx.col * 5;
  ctx.lists.innerHTML = '<div class="d-flex flex-column"></div>'.repeat(
    ctx.col,
  );

  if (ctx.gifs.length === 0) return;

  try {
    await c!.run(show(uuid, ctx.gifs));
  } catch {
    ctx.gifs.length = 0;
  }

  if (prevCol !== ctx.col) {
    ctx.lists.scroll({ top: ctx.lists.scrollHeight, behavior: "instant" });
  }

  if (ctx.gifs.length === 0) await bootUp(uuid);
};

const scroll = async (uuid: string) => {
  const ctx = objectPool!.get(uuid);
  if (ctx.lists.getAttribute("data-continue") !== "true") return;
  if (!ctx.next || ctx.next.length === 0) return;

  const isQuery = ctx.query && ctx.query.trim().length > 0;
  const params: any = { pos: ctx.next, limit: ctx.limit };
  if (isQuery) params.q = ctx.query;

  if (
    ctx.lists.scrollTop >
    (ctx.lists.scrollHeight - ctx.lists.clientHeight) * 0.8
  ) {
    await bootUp(uuid);
    render(uuid, isQuery ? "/search" : "/featured", params);
  }
};

const search = async (uuid: string, q: string | null = null) => {
  const ctx = objectPool!.get(uuid);
  ctx.query = q !== null ? q : ctx.query;
  if (!ctx.query || ctx.query.trim().length === 0) ctx.query = null;

  ctx.col = null;
  ctx.next = null;
  ctx.pointer = -1;
  ctx.gifs.length = 0;

  await bootUp(uuid);
  render(uuid, ctx.query === null ? "/featured" : "/search", {
    q: ctx.query,
    limit: ctx.limit,
  });
};

const click = async (
  button: HTMLButtonElement,
  uuid: string,
  id: string,
  urlBase64: string,
) => {
  const { base64Decode } = await import("../common/util");
  const btn = disableButton(
    button,
    '<span class="spinner-border spinner-border-sm"></span>',
    true,
  );

  const res = document.getElementById(`gif-result-${uuid}`);
  res?.setAttribute("data-id", id);
  res
    ?.querySelector(`#gif-cancel-${uuid}`)
    ?.classList.replace("d-none", "d-flex");
  res?.insertAdjacentHTML(
    "beforeend",
    `<img src="${await get(base64Decode(urlBase64))}" class="img-fluid mx-auto gif-image rounded-4" alt="selected-gif">`,
  );

  btn.restore();
  objectPool!.get(uuid).lists.classList.replace("d-flex", "d-none");
  document
    .getElementById(`gif-search-nav-${uuid}`)
    ?.classList.replace("d-flex", "d-none");
};

const cancel = (uuid: string) => {
  const res = document.getElementById(`gif-result-${uuid}`);
  res?.removeAttribute("data-id");
  res
    ?.querySelector(`#gif-cancel-${uuid}`)
    ?.classList.replace("d-flex", "d-none");
  res?.querySelector("img")?.remove();
  objectPool!.get(uuid).lists.classList.replace("d-none", "d-flex");
  document
    .getElementById(`gif-search-nav-${uuid}`)
    ?.classList.replace("d-none", "d-flex");
};

const remove = async (uuid: string | null = null) => {
  if (uuid) {
    if (objectPool?.has(uuid)) {
      await waitLastRequest(uuid);
      eventListeners?.delete(uuid);
      objectPool.delete(uuid);
    }
  } else {
    await Promise.allSettled(
      Array.from(objectPool?.keys() ?? []).map((k) => waitLastRequest(k)),
    );
    eventListeners?.clear();
    objectPool?.clear();
  }
};

const back = async (button: HTMLButtonElement, uuid: string) => {
  const btn = disableButton(
    button,
    '<span class="spinner-border spinner-border-sm"></span>',
    true,
  );
  await waitLastRequest(uuid);
  btn.restore();

  document.getElementById(`gif-form-${uuid}`)?.classList.toggle("d-none", true);
  document
    .getElementById(`comment-form-${uuid}`)
    ?.classList.toggle("d-none", false);
};

const open = (uuid: string) => {
  if (!objectPool?.has(uuid)) {
    safeInnerHTML(document.getElementById(`gif-form-${uuid}`)!, template(uuid));
    const lists = document.getElementById(`gif-lists-${uuid}`)!;

    objectPool!.set(uuid, {
      uuid,
      lists,
      last: null,
      limit: null,
      query: null,
      next: null,
      col: null,
      pointer: -1,
      gifs: [],
      reqs: [],
    });

    const deScroll = debounce(scroll, 150);
    lists.addEventListener("scroll", () => deScroll(uuid));

    const deSearch = debounce(search, 850);
    document
      .getElementById(`gif-search-${uuid}`)
      ?.addEventListener("input", (e) =>
        deSearch(uuid, (e.target as HTMLInputElement).value),
      );
  }

  document
    .getElementById(`gif-form-${uuid}`)
    ?.classList.toggle("d-none", false);
  document
    .getElementById(`comment-form-${uuid}`)
    ?.classList.toggle("d-none", true);

  if (eventListeners?.has(uuid)) {
    eventListeners.get(uuid)!();
  }

  return search(uuid);
};

const isOpen = (uuid: string) => {
  const el = document.getElementById(`gif-form-${uuid}`);
  return el && !el.classList.contains("d-none");
};

const getResultId = (uuid: string) =>
  document.getElementById(`gif-result-${uuid}`)?.getAttribute("data-id") ||
  null;

const removeGifSearch = (uuid: string) =>
  document.querySelector(`[for="gif-search-${uuid}"]`)?.remove();

const removeButtonBack = (uuid: string) =>
  document
    .querySelector(`[onclick="undangan.comment.gif.back(this, '${uuid}')"]`)
    ?.remove();

const onOpen = (uuid: string, callback: () => void) =>
  eventListeners?.set(uuid, callback);

const buttonCancel = (uuid: string | null = null) => {
  const btnCancel = document.getElementById(
    `gif-cancel-${uuid ? uuid : gifDefault}`,
  );
  return {
    show: () => btnCancel?.classList.replace("d-none", "d-flex"),
    hide: () => btnCancel?.classList.replace("d-flex", "d-none"),
    click: () => btnCancel?.dispatchEvent(new Event("click")),
  };
};

const isActive = () => !!config?.get("tenor_key");

const showButton = () => {
  document
    .querySelector(
      '[onclick="undangan.comment.gif.open(undangan.comment.gif.default)"]',
    )
    ?.classList.toggle("d-none", !config?.get("tenor_key"));
};

const initGif = () => {
  c = cache("gif");
  objectPool = new Map();
  eventListeners = new Map();
  config = storage("config");
  document.addEventListener("undangan.session", showButton);
};

export const gif = {
  default: gifDefault,
  init: initGif,
  get,
  back,
  open,
  cancel,
  click,
  remove,
  isOpen,
  onOpen,
  isActive,
  getResultId,
  buttonCancel,
  removeGifSearch,
  removeButtonBack,
};

"use client";

import { dto } from "../connection/dto";
import { storage } from "../common/storage";
import { session } from "../common/session";
import { tapTapAnimation } from "../libs/confetti";
import {
  request,
  HTTP_PATCH,
  HTTP_POST,
  HTTP_STATUS_CREATED,
} from "../connection/request";

let likes: ReturnType<typeof storage> | null = null;
let listeners: Map<string, AbortController> | null = null;

const love = async (button: HTMLButtonElement) => {
  const info = button.firstElementChild as HTMLElement;
  const heart = button.lastElementChild as HTMLElement;

  const id = button.getAttribute("data-uuid")!;
  const count = parseInt(info.getAttribute("data-count-like")!);

  button.disabled = true;

  if (navigator.vibrate) {
    navigator.vibrate(100);
  }

  if (likes!.has(id)) {
    await request(HTTP_PATCH, "/api/comment/" + likes!.get(id))
      .token(session.getToken())
      .send(dto.statusResponse)
      .then((res: any) => {
        if (res.data.status) {
          likes!.unset(id);

          heart.classList.remove("fa-solid", "text-danger");
          heart.classList.add("fa-regular");

          info.setAttribute("data-count-like", String(count - 1));
        }
      })
      .finally(() => {
        info.innerText = info.getAttribute("data-count-like")!;
        button.disabled = false;
      });
  } else {
    await request(HTTP_POST, "/api/comment/" + id)
      .token(session.getToken())
      .send(dto.uuidResponse)
      .then((res: any) => {
        if (res.code === HTTP_STATUS_CREATED) {
          likes!.set(id, res.data.uuid);

          heart.classList.remove("fa-regular");
          heart.classList.add("fa-solid", "text-danger");

          info.setAttribute("data-count-like", String(count + 1));
        }
      })
      .finally(() => {
        info.innerText = info.getAttribute("data-count-like")!;
        button.disabled = false;
      });
  }
};

const getButtonLike = (uuid: string): HTMLElement | null => {
  return document.querySelector(
    `button[onclick="undangan.comment.like.love(this)"][data-uuid="${uuid}"]`,
  );
};

const tapTap = async (div: HTMLElement) => {
  if (!navigator.onLine) {
    return;
  }

  const currentTime = Date.now();
  const tapLength = currentTime - parseInt(div.getAttribute("data-tapTime")!);
  const uuid = div.id.replace("body-content-", "");

  const isTapTap = tapLength < 300 && tapLength > 0;
  const notLiked =
    !likes!.has(uuid) && div.getAttribute("data-liked") !== "true";

  if (isTapTap && notLiked) {
    tapTapAnimation(div);

    div.setAttribute("data-liked", "true");
    await love(getButtonLike(uuid) as HTMLButtonElement);
    div.setAttribute("data-liked", "false");
  }

  div.setAttribute("data-tapTime", String(currentTime));
};

const addListener = (uuid: string) => {
  const ac = new AbortController();

  const bodyLike = document.getElementById(`body-content-${uuid}`)!;
  bodyLike.addEventListener("touchend", () => tapTap(bodyLike), {
    signal: ac.signal,
  });

  listeners!.set(uuid, ac);
};

const removeListener = (uuid: string) => {
  const ac = listeners!.get(uuid);
  if (ac) {
    ac.abort();
    listeners!.delete(uuid);
  }
};

const init = () => {
  listeners = new Map();
  likes = storage("likes");
};

export const like = {
  init,
  love,
  getButtonLike,
  addListener,
  removeListener,
};

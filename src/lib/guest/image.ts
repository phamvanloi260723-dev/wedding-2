"use client";

import { progress } from "./progress";
import { cache } from "../connection/cache";

let images: NodeListOf<HTMLImageElement> | null = null;
let c: ReturnType<typeof cache> | null = null;
const urlCache: any[] = [];

const loadedImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });

const appendImage = (el: HTMLImageElement, src: string) =>
  loadedImage(src).then((img) => {
    el.width = img.naturalWidth;
    el.height = img.naturalHeight;
    el.classList.remove("opacity-0");
    el.src = img.src;
    img.remove();
    progress.complete("image");
  });

const getByFetch = (el: HTMLImageElement) => {
  urlCache.push({
    url: el.getAttribute("data-src"),
    res: (url: string) => appendImage(el, url),
    rej: (err: any) => {
      console.error(err);
      progress.invalid("image");
    },
  });
};

const getByDefault = (el: HTMLImageElement) => {
  el.onerror = () => progress.invalid("image");
  el.onload = () => {
    el.width = el.naturalWidth;
    el.height = el.naturalHeight;
    progress.complete("image");
  };

  if (el.complete && el.naturalWidth !== 0 && el.naturalHeight !== 0) {
    progress.complete("image");
  } else if (el.complete) {
    progress.invalid("image");
  }
};

export const image = {
  hasDataSrc: () =>
    images ? Array.from(images).some((i) => i.hasAttribute("data-src")) : false,

  load: async () => {
    if (!images || !c) return;
    const imgs = Array.from(images);

    const runGroup = async (filter: (el: HTMLImageElement) => boolean) => {
      urlCache.length = 0;
      imgs
        .filter(filter)
        .forEach((el) =>
          el.hasAttribute("data-src") ? getByFetch(el) : getByDefault(el),
        );
      await c!.run(urlCache, progress.getAbort());
    };

    await runGroup((el) => el.hasAttribute("fetchpriority"));
    await runGroup((el) => !el.hasAttribute("fetchpriority"));
  },

  download: (blobUrl: string) => {
    c?.download(blobUrl, `${window.location.hostname}_image_${Date.now()}`);
  },

  init: () => {
    c = cache("image").withForceCache();
    images = document.querySelectorAll("img");
    images.forEach(() => progress.add());

    return {
      load: image.load,
      download: image.download,
      hasDataSrc: image.hasDataSrc,
    };
  },
};

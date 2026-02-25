"use client";

import { request, cacheWrapper, HTTP_GET } from "./request";

export const cache = (cacheName: string) => {
  const objectUrls = new Map<string, string>();
  const inFlightRequests = new Map<string, Promise<string>>();
  const cw = cacheWrapper(cacheName);

  let ttl = 1000 * 60 * 60 * 6;
  let forceCache = false;

  const set = (input: string | URL, res: Response) => {
    if (!res || !res.ok) {
      if (res) throw new Error(res.statusText);
      return Promise.resolve(res);
    }
    return cw.set(input, res, forceCache, ttl);
  };

  const has = (input: string | URL) => cw.has(input);
  const del = (input: string | URL) => cw.del(input);

  const get = (
    input: string,
    cancel: Promise<void> | null = null,
  ): Promise<string> => {
    if (objectUrls.has(input)) return Promise.resolve(objectUrls.get(input)!);
    if (inFlightRequests.has(input)) return inFlightRequests.get(input)!;

    const fetchPut = () =>
      request(HTTP_GET, input).withCancel(cancel).withRetry().default();

    const inflightPromise = has(input)
      .then((res) =>
        res
          ? Promise.resolve(res)
          : del(input)
              .then(fetchPut)
              .then((r) => set(input, r)),
      )
      .then((r: any) => r.blob())
      .then((b: Blob) => objectUrls.set(input, URL.createObjectURL(b)))
      .then(() => objectUrls.get(input)!)
      .finally(() => inFlightRequests.delete(input));

    inFlightRequests.set(input, inflightPromise);
    return inflightPromise;
  };

  const run = (
    items: Array<{
      url: string;
      res: (url: string) => void;
      rej?: (err: any) => void;
    } | null>,
    cancel: Promise<void> | null = null,
  ) => {
    const uniq = new Map<
      string,
      Array<[(url: string) => void, ((err: any) => void) | undefined]>
    >();
    if (items.length === 0) return Promise.resolve();

    items
      .filter((val) => val !== null)
      .forEach((val) => {
        const exist = uniq.get(val!.url) ?? [];
        uniq.set(val!.url, [...exist, [val!.res, val?.rej]]);
      });

    return Promise.allSettled(
      Array.from(uniq).map(([k, v]) =>
        get(k, cancel)
          .then((s) => {
            v.forEach((cb) => cb[0]?.(s));
            return s;
          })
          .catch((r) => {
            v.forEach((cb) => cb[1]?.(r));
            return r;
          }),
      ),
    );
  };

  const download = async (input: string, name: string) => {
    const reverse = new Map(
      Array.from(objectUrls.entries()).map(([k, v]) => [v, k]),
    );
    if (!reverse.has(input)) {
      try {
        const checkUrl = new URL(input);
        if (!checkUrl.protocol.includes("blob")) throw new Error("Is not blob");
      } catch {
        input = await get(input);
      }
    }
    return request(HTTP_GET, input).withDownload(name).default();
  };

  return {
    run,
    del,
    has,
    set,
    get,
    download,
    setTtl(v: number) {
      ttl = Number(v);
      return this;
    },
    withForceCache() {
      forceCache = true;
      return this;
    },
  };
};

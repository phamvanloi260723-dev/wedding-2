"use client";

export const HTTP_GET = "GET";
export const HTTP_PUT = "PUT";
export const HTTP_POST = "POST";
export const HTTP_PATCH = "PATCH";
export const HTTP_DELETE = "DELETE";

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_CREATED = 201;
export const HTTP_STATUS_PARTIAL_CONTENT = 206;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

export const ERROR_ABORT = "AbortError";
export const ERROR_TYPE = "TypeError";

export const defaultJSON: Record<string, string> = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const cacheRequest = "request";

export const pool = (() => {
  let cachePool: Map<string, Cache> | null = null;

  return {
    getInstance: (name: string): Cache => {
      if (!cachePool || !cachePool.has(name)) {
        throw new Error(`please init cache first: ${name}`);
      }
      return cachePool.get(name)!;
    },
    restart: async (name: string) => {
      cachePool?.set(name, null as any);
      cachePool?.delete(name);
      await window.caches.delete(name);
      await window.caches.open(name).then((c) => cachePool?.set(name, c));
    },
    init: (callback: () => void, lists: string[] = []) => {
      if (!window.isSecureContext) {
        console.error(
          "This application requires a secure context (HTTPS or localhost).",
        );
        return;
      }
      cachePool = new Map();
      Promise.all(
        lists
          .concat([cacheRequest])
          .map((v) => window.caches.open(v).then((c) => cachePool?.set(v, c))),
      )
        .then(() => callback())
        .catch((err) => console.error("Failed to init cache pool:", err));
    },
  };
})();

export const cacheWrapper = (cacheName: string) => {
  const cacheObject = pool.getInstance(cacheName);

  const set = (
    input: string | URL,
    res: Response,
    forceCache: boolean,
    ttl: number,
  ) =>
    res
      .clone()
      .arrayBuffer()
      .then((ab) => {
        if (!res.ok) return res;

        const now = new Date();
        const headers = new Headers(res.headers);

        if (!headers.has("Date")) {
          headers.set("Date", now.toUTCString());
        }

        if (forceCache || !headers.has("Cache-Control")) {
          if (!forceCache && headers.has("Expires")) {
            const expTime = new Date(headers.get("Expires")!);
            ttl = Math.max(0, expTime.getTime() - now.getTime());
          }
          if (ttl === 0) throw new Error("Cache max age cannot be 0");
          headers.set(
            "Cache-Control",
            `public, max-age=${Math.floor(ttl / 1000)}`,
          );
        }

        if (!headers.has("Content-Length")) {
          headers.set("Content-Length", String(ab.byteLength));
        }

        return cacheObject
          .put(input, new Response(ab, { headers }))
          .then(() => res);
      });

  const has = (input: string | URL): Promise<Response | null> =>
    cacheObject.match(input).then((res) => {
      if (!res) return null;
      const maxAgeMatch = res.headers
        .get("Cache-Control")
        ?.match(/max-age=(\d+)/);
      if (!maxAgeMatch) return null;
      const expTime =
        Date.parse(res.headers.get("Date") || "") +
        parseInt(maxAgeMatch[1]) * 1000;
      return Date.now() > expTime ? null : res;
    });

  const del = (input: string | URL): Promise<boolean> =>
    cacheObject.delete(input);

  return { set, has, del };
};

export const request = (method: string, path: string) => {
  const ac = new AbortController();
  const req: RequestInit & {
    headers: Headers;
    method: string;
    body?: string;
    signal: AbortSignal;
  } = {
    signal: ac.signal,
    credentials: "include" as RequestCredentials,
    headers: new Headers(defaultJSON),
    method: String(method).toUpperCase(),
  };

  let reqTtl = 0;
  let reqRetry = 0;
  let reqDelay = 0;
  let reqAttempts = 0;
  let reqNoBody = false;
  let reqForceCache = false;

  let downExt: string | null = null;
  let downName: string | null = null;
  let callbackFunc: ((a: number, b: number, c?: any) => void) | null = null;

  const baseFetch = (input: string | URL): Promise<Response> => {
    const abstractFetch = (): Promise<Response> => {
      const wrapperFetch = () =>
        window.fetch(input as any, req).then(async (res) => {
          if (reqNoBody) {
            ac.abort();
            return new Response(null, {
              status: res.status,
              statusText: res.statusText,
              headers: new Headers(res.headers),
            });
          }
          if (!res.ok || !callbackFunc) return res;

          const contentLength = parseInt(
            res.headers.get("Content-Length") ?? "0",
          );
          if (contentLength === 0) return res;

          const chunks: Uint8Array[] = [];
          let receivedLength = 0;
          const reader = res.body!.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedLength += value.length;
            await callbackFunc(receivedLength, contentLength, [...chunks]);
          }

          const contentType =
            res.headers.get("Content-Type") ?? "application/octet-stream";
          return new Response(
            new Blob(chunks as BlobPart[], { type: contentType }),
            {
              status: res.status,
              statusText: res.statusText,
              headers: new Headers(res.headers),
            },
          );
        });

      if (reqTtl === 0 || reqNoBody) return wrapperFetch();
      if (req.method !== HTTP_GET) {
        console.warn("Only method GET can be cached");
        return wrapperFetch();
      }

      const cw = cacheWrapper(cacheRequest);
      return cw.has(input).then((res) => {
        if (res) return Promise.resolve(res);
        return cw
          .del(input)
          .then(wrapperFetch)
          .then((r) => cw.set(input, r, reqForceCache, reqTtl));
      });
    };

    if (reqRetry === 0 || reqDelay === 0) return abstractFetch();

    const attempt = async (): Promise<Response> => {
      try {
        return await abstractFetch();
      } catch (error: any) {
        if (error.name === ERROR_ABORT) throw error;
        reqDelay *= 2;
        reqAttempts++;
        if (reqAttempts > reqRetry)
          throw new Error(`Max retries reached: ${error}`);
        console.warn(
          `Retrying fetch (${reqAttempts}/${reqRetry}): ${input.toString()}`,
        );
        await new Promise((resolve) => window.setTimeout(resolve, reqDelay));
        return attempt();
      }
    };

    return attempt();
  };

  const baseDownload = (res: Response): Promise<Response> => {
    if (res.status !== HTTP_STATUS_OK) return Promise.resolve(res);

    const exist = document.querySelector("a[download]");
    if (exist) document.body.removeChild(exist);

    const filename = res.headers
      .get("Content-Disposition")
      ?.match(/filename="(.+)"/)?.[1];

    return res
      .clone()
      .blob()
      .then((b) => {
        const link = document.createElement("a");
        const href = window.URL.createObjectURL(b);
        link.href = href;
        link.download = filename
          ? filename
          : `${downName}.${downExt ? downExt : (b.type.split("/")?.[1] ?? "bin")}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
        return res;
      });
  };

  return {
    send(transform: ((data: any) => any) | null = null): Promise<any> {
      if (downName) {
        Object.keys(defaultJSON).forEach((k) => req.headers.delete(k));
      }

      const apiUrl =
        typeof document !== "undefined"
          ? document.body.getAttribute("data-url") || "/api/"
          : "/api/";

      const baseUrl = apiUrl.startsWith("http")
        ? apiUrl
        : (typeof window !== "undefined"
            ? window.location.origin
            : "http://localhost:3000") + apiUrl;

      return baseFetch(new URL(path, baseUrl))
        .then((res) => {
          if (downName && res.ok) {
            return baseDownload(res).then((r) => ({
              code: r.status,
              data: r,
              error: null,
            }));
          }

          return res.json().then((json: any) => {
            if (json.error) {
              const msg = json.error.at(0);
              const isErrServer =
                res.status >= HTTP_STATUS_INTERNAL_SERVER_ERROR;
              throw new Error(
                isErrServer ? `ID: ${json.id}\n🟥 ${msg}` : `🟨 ${msg}`,
              );
            }
            if (transform) json.data = transform(json.data);
            return Object.assign(json, { code: res.status });
          });
        })
        .catch((err) => {
          if (err.name === ERROR_ABORT) {
            console.warn("Fetch aborted:", err);
            return err;
          }
          if (err.name === ERROR_TYPE) {
            err = new Error("🟥 Network error or rate limit exceeded");
          }
          console.error(err.message ?? String(err));
          throw err;
        });
    },
    withCache(ttl: number = 1000 * 60 * 60 * 6) {
      reqTtl = ttl;
      return this;
    },
    withForceCache(ttl: number = 1000 * 60 * 60 * 6) {
      reqForceCache = true;
      if (reqTtl === 0) reqTtl = ttl;
      return this;
    },
    withNoBody() {
      reqNoBody = true;
      return this;
    },
    withRetry(maxRetries: number = 3, delay: number = 1000) {
      reqRetry = maxRetries;
      reqDelay = delay;
      return this;
    },
    withCancel(cancel: Promise<void> | null) {
      if (cancel === null || cancel === undefined) return this;
      (async () => {
        await cancel;
        ac.abort();
      })();
      return this;
    },
    withDownload(name: string, ext: string | null = null) {
      downName = name;
      downExt = ext;
      return this;
    },
    withProgressFunc(
      func: ((a: number, b: number, c?: any) => void) | null = null,
    ) {
      callbackFunc = func;
      return this;
    },
    default(header: Record<string, string> | null = null): Promise<Response> {
      req.headers = new Headers(header ?? {});
      return baseFetch(path).then((res) =>
        downName ? baseDownload(res) : Promise.resolve(res),
      );
    },
    token(token: string | null) {
      if (!token) return this;
      if (token.split(".").length === 3) {
        req.headers.append("Authorization", "Bearer " + token);
        return this;
      }
      req.headers.append("x-access-key", token);
      return this;
    },
    body(body: object) {
      if (req.method === HTTP_GET)
        throw new Error("GET method does not support body");
      (req as any).body = JSON.stringify(body);
      return this;
    },
  };
};

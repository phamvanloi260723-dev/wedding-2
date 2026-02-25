"use client";

const isBrowser = typeof window !== "undefined";

export const storage = (table: string) => {
  const get = (key: string | null = null): any => {
    if (!isBrowser) return key ? null : {};
    const raw = localStorage.getItem(table);
    const data = raw ? JSON.parse(raw) : {};
    return key ? data[String(key)] : data;
  };

  const set = (key: string, value: any): void => {
    if (!isBrowser) return;
    const data = get();
    data[String(key)] = value;
    localStorage.setItem(table, JSON.stringify(data));
  };

  const has = (key: string): boolean => {
    if (!isBrowser) return false;
    return Object.keys(get()).includes(String(key));
  };

  const unset = (key: string): void => {
    if (!isBrowser) return;
    if (!has(key)) return;

    const data = get();
    delete data[String(key)];
    localStorage.setItem(table, JSON.stringify(data));
  };

  const clear = (): void => {
    if (!isBrowser) return;
    localStorage.setItem(table, "{}");
  };

  if (isBrowser && !localStorage.getItem(table)) {
    clear();
  }

  return {
    set,
    get,
    has,
    clear,
    unset,
  };
};

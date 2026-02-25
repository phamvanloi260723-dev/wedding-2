"use client";

import { storage } from "./storage";
import { dto } from "../connection/dto";
import {
  request,
  HTTP_POST,
  HTTP_GET,
  HTTP_STATUS_OK,
} from "../connection/request";

let ses: ReturnType<typeof storage> | null = null;

export const getToken = (): string | null => ses?.get("token") ?? null;

export const setToken = (token: string): void => {
  ses?.set("token", token);
};

export const login = (body: object): Promise<boolean> => {
  return request(HTTP_POST, "/api/session")
    .body(body)
    .send(dto.tokenResponse)
    .then((res: any) => {
      if (res.code === HTTP_STATUS_OK) {
        setToken(res.data.token);
      }
      return res.code === HTTP_STATUS_OK;
    });
};

export const logout = () => ses?.unset("token");

export const isAdmin = (): boolean =>
  String(getToken() ?? ".").split(".").length === 3;

export const guest = (token: string): Promise<any> => {
  return request(HTTP_GET, "/api/v2/config")
    .withCache(1000 * 60 * 30)
    .withForceCache()
    .token(token)
    .send()
    .then((res: any) => {
      if (res.code !== HTTP_STATUS_OK) {
        throw new Error("failed to get config.");
      }

      const config = storage("config");
      for (const [k, v] of Object.entries(res.data)) {
        config.set(k, v);
      }

      setToken(token);
      return res;
    });
};

export const isValid = (): boolean => {
  if (!isAdmin()) return false;
  try {
    const decoded = JSON.parse(atob(getToken()!.split(".")[1]));
    return (decoded?.exp ?? 0) > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const initSession = () => {
  ses = storage("session");
};

export const session = {
  init: initSession,
  guest,
  isValid,
  login,
  logout,
  isAdmin,
  setToken,
  getToken,
};

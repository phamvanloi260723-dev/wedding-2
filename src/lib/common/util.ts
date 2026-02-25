"use client";

export const loader =
  '<span class="spinner-border spinner-border-sm my-0 ms-0 me-1 p-0" style="height: 0.8rem; width: 0.8rem;"></span>';

const listsMarkDown: [string, string][] = [
  ["*", '<strong class="text-theme-auto">$1</strong>'],
  ["_", '<em class="text-theme-auto">$1</em>'],
  ["~", '<del class="text-theme-auto">$1</del>'],
  ["```", '<code class="font-monospace text-theme-auto">$1</code>'],
];

export const escapeHtml = (unsafe: string): string => {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const notify = (message: any) => {
  const exec = (emoji: string) => {
    window.alert(`${emoji} ${message}`);
  };
  return {
    success: () => exec("🟩"),
    error: () => exec("🟥"),
    warning: () => exec("🟨"),
    info: () => exec("🟦"),
    custom: (emoji: string) => exec(emoji),
  };
};

export const ask = (message: string): boolean =>
  window.confirm(`🟦 ${message}`);

export const safeInnerHTML = (el: HTMLElement, html: string): HTMLElement => {
  el.replaceChildren(document.createRange().createContextualFragment(html));
  return el;
};

export const changeOpacity = (
  el: HTMLElement,
  isUp: boolean,
  step: number = 0.05,
): Promise<HTMLElement> =>
  new Promise((res) => {
    let op = parseFloat(el.style.opacity);
    const target = isUp ? 1 : 0;

    const animate = () => {
      op += isUp ? step : -step;
      op = Math.max(0, Math.min(1, op));
      el.style.opacity = op.toFixed(2);

      if ((isUp && op >= target) || (!isUp && op <= target)) {
        el.style.opacity = target.toString();
        res(el);
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  });

export const timeOut = (callback: () => void, delay: number = 0): void => {
  let clear: ReturnType<typeof setTimeout> | null = null;
  const c = () => {
    callback();
    if (clear) clearTimeout(clear);
    clear = null;
  };
  clear = setTimeout(c, delay);
};

export const debounce = (
  callback: (...args: any[]) => void,
  delay: number = 100,
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
};

export const disableButton = (
  button: HTMLButtonElement,
  message: string = "Loading",
  replace: boolean = false,
) => {
  button.disabled = true;
  const tmp = button.innerHTML;
  safeInnerHTML(button, replace ? message : loader + message);
  return {
    restore: (disabled: boolean = false) => {
      button.innerHTML = tmp;
      button.disabled = disabled;
    },
  };
};

export const copy = async (
  button: HTMLButtonElement,
  message: string | null = null,
  timeout: number = 1500,
) => {
  const data = button.getAttribute("data-copy");
  if (!data || data.length === 0) {
    notify("Nothing to copy").warning();
    return;
  }

  button.disabled = true;
  try {
    await navigator.clipboard.writeText(data);
  } catch {
    button.disabled = false;
    notify("Failed to copy").error();
    return;
  }

  const tmp = button.innerHTML;
  safeInnerHTML(
    button,
    message ? message : '<i class="fa-solid fa-check"></i>',
  );
  timeOut(() => {
    button.disabled = false;
    button.innerHTML = tmp;
  }, timeout);
};

export const base64Encode = (str: string): string => {
  const encoder = new TextEncoder();
  const encodedBytes = encoder.encode(str);
  return window.btoa(String.fromCharCode(...encodedBytes));
};

export const base64Decode = (str: string): string => {
  const decoder = new TextDecoder();
  const decodedBytes = Uint8Array.from(window.atob(str), (c) =>
    c.charCodeAt(0),
  );
  return decoder.decode(decodedBytes);
};

const deviceTypes = [
  {
    type: "Mobile",
    regex: /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i,
  },
  { type: "Tablet", regex: /iPad|Android(?!.*Mobile)|Tablet/i },
  { type: "Desktop", regex: /Windows NT|Macintosh|Linux/i },
];

const browsers = [
  { name: "Chrome", regex: /Chrome|CriOS/i },
  { name: "Safari", regex: /Safari/i },
  { name: "Edge", regex: /Edg|Edge/i },
  { name: "Firefox", regex: /Firefox|FxiOS/i },
  { name: "Opera", regex: /Opera|OPR/i },
  { name: "Internet Explorer", regex: /MSIE|Trident/i },
  { name: "Samsung Browser", regex: /SamsungBrowser/i },
];

const operatingSystems = [
  { name: "Windows", regex: /Windows NT ([\d.]+)/i },
  { name: "MacOS", regex: /Mac OS X ([\d_.]+)/i },
  { name: "Android", regex: /Android ([\d.]+)/i },
  { name: "iOS", regex: /OS ([\d_]+) like Mac OS X/i },
  { name: "Linux", regex: /Linux/i },
  { name: "Ubuntu", regex: /Ubuntu/i },
  { name: "Chrome OS", regex: /CrOS/i },
];

export const parseUserAgent = (userAgent: string): string => {
  if (!userAgent || typeof userAgent !== "string") {
    return "Unknown";
  }

  const deviceType =
    deviceTypes.find((i) => i.regex.test(userAgent))?.type ?? "Unknown";
  const browser =
    browsers.find((i) => i.regex.test(userAgent))?.name ?? "Unknown";
  const osMatch = operatingSystems.find((i) => i.regex.test(userAgent));

  const osName = osMatch ? osMatch.name : "Unknown";
  const osVersion = osMatch
    ? (userAgent.match(osMatch.regex)?.[1]?.replace(/_/g, ".") ?? null)
    : null;

  return `${browser} ${deviceType} ${osVersion ? `${osName} ${osVersion}` : osName}`;
};

export const getGMTOffset = (tz: string): string => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    hour: "numeric",
  });

  let offset = (parseInt(formatter.format(now)) - now.getUTCHours() + 24) % 24;
  if (offset > 12) {
    offset -= 24;
  }

  return `GMT${offset >= 0 ? "+" : ""}${offset}`;
};

export const convertMarkdownToHTML = (str: string): string => {
  listsMarkDown.forEach(([k, v]) => {
    str = str.replace(
      new RegExp(`\\${k}(\\S(?:[\\s\\S]*?\\S)?)\\${k}`, "g"),
      v,
    );
  });
  return str;
};

export const util = {
  loader,
  ask,
  copy,
  notify,
  timeOut,
  debounce,
  escapeHtml,
  base64Encode,
  base64Decode,
  disableButton,
  safeInnerHTML,
  parseUserAgent,
  changeOpacity,
  getGMTOffset,
  convertMarkdownToHTML,
};

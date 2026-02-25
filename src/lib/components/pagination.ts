"use client";

import { disableButton, loader as loaderHtml } from "../common/util";

let perPage = 10;
let pageNow = 0;
let totalData = 0;

let page: HTMLElement | null = null;
let liPrev: HTMLElement | null = null;
let liNext: HTMLElement | null = null;
let paginate: HTMLElement | null = null;
let commentEl: HTMLElement | null = null;

const setPer = (num: number) => {
  perPage = Number(num);
};

const getPer = () => perPage;
const getNext = () => pageNow;
const geTotal = () => totalData;

const disablePrevious = () => {
  if (!liPrev!.classList.contains("disabled"))
    liPrev!.classList.add("disabled");
};

const enablePrevious = () => {
  if (liPrev!.classList.contains("disabled"))
    liPrev!.classList.remove("disabled");
};

const disableNext = () => {
  if (!liNext!.classList.contains("disabled"))
    liNext!.classList.add("disabled");
};

const enableNext = () => {
  if (liNext!.classList.contains("disabled"))
    liNext!.classList.remove("disabled");
};

const buttonAction = (button: HTMLButtonElement) => {
  disableNext();
  disablePrevious();

  const btn = disableButton(
    button,
    loaderHtml.replace("ms-0 me-1", "mx-1"),
    true,
  );

  const process = () => {
    commentEl!.addEventListener("undangan.comment.done", () => btn.restore(), {
      once: true,
    });
    commentEl!.addEventListener(
      "undangan.comment.result",
      () => commentEl!.scrollIntoView(),
      { once: true },
    );

    commentEl!.dispatchEvent(new Event("undangan.comment.show"));
  };

  const next = () => {
    pageNow += perPage;
    button.innerHTML = "Next" + button.innerHTML;
    process();
  };

  const prev = () => {
    pageNow -= perPage;
    button.innerHTML = button.innerHTML + "Prev";
    process();
  };

  return { next, prev };
};

const reset = (): boolean => {
  if (pageNow === 0) {
    return false;
  }

  pageNow = 0;
  disableNext();
  disablePrevious();

  return true;
};

const setTotal = (len: number) => {
  totalData = Number(len);

  if (totalData <= perPage && pageNow === 0) {
    paginate!.classList.add("d-none");
    return;
  }

  const current = pageNow / perPage + 1;
  const total = Math.ceil(totalData / perPage);

  page!.innerText = `${current} / ${total}`;

  if (pageNow > 0) {
    enablePrevious();
  }

  if (current >= total) {
    disableNext();
    return;
  }

  enableNext();

  if (paginate!.classList.contains("d-none")) {
    paginate!.classList.remove("d-none");
  }
};

const init = () => {
  paginate = document.getElementById("pagination");
  paginate!.innerHTML = `
    <ul class="pagination mb-2 shadow-sm rounded-4">
        <li class="page-item disabled" id="previous">
            <button class="page-link rounded-start-4" onclick="undangan.comment.pagination.previous(this)" data-offline-disabled="false">
                <i class="fa-solid fa-circle-left me-1"></i>Prev
            </button>
        </li>
        <li class="page-item disabled">
            <span class="page-link text-theme-auto" id="page"></span>
        </li>
        <li class="page-item" id="next">
            <button class="page-link rounded-end-4" onclick="undangan.comment.pagination.next(this)" data-offline-disabled="false">
                Next<i class="fa-solid fa-circle-right ms-1"></i>
            </button>
        </li>
    </ul>`;

  commentEl = document.getElementById("comments");
  page = document.getElementById("page");
  liPrev = document.getElementById("previous");
  liNext = document.getElementById("next");
};

export const pagination = {
  init,
  setPer,
  getPer,
  getNext,
  reset,
  setTotal,
  geTotal,
  previous: (btn: HTMLButtonElement) => buttonAction(btn).prev(),
  next: (btn: HTMLButtonElement) => buttonAction(btn).next(),
};

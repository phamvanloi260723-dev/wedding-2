"use client";

import { siteConfig } from "@/config/site";

export default function DateDisplay() {
    const weddingDate = new Date(siteConfig.weddingDate);

    const day = String(weddingDate.getDate()).padStart(2, "0");
    const month = String(weddingDate.getMonth() + 1).padStart(2, "0");
    const year = weddingDate.getFullYear();

    return (
        <div className="date-row m-0 p-0">
            <span className="date-day">{day}</span>
            <span className="date-dot">·</span>
            <span className="date-month">{month}</span>
            <span className="date-dot">·</span>
            <span className="date-year">{year}</span>
        </div>
    );
}
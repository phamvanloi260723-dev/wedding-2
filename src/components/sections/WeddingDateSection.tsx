"use client";

import { useEffect, useState } from "react";
import LoveAnimation from "@/components/LoveAnimation";

type EventKey = "engagement" | "wedding";

const EVENTS: Record<EventKey, { label: string; date: Date; accent: string; dotClass: string; dayNum: number }> = {
  engagement: {
    label: "Ăn hỏi",
    date: new Date("2026-01-18T00:00:00"),
    accent: "gold",
    dotClass: "wds-legend__dot--eng",
    dayNum: 18,
  },
  wedding: {
    label: "Lễ cưới",
    date: new Date("2026-01-22T00:00:00"),
    accent: "rose",
    dotClass: "wds-legend__dot--wed",
    dayNum: 22,
  },
};

export default function WeddingDateSection() {
  const [activeEvent, setActiveEvent] = useState<EventKey>("wedding");

  const calculateTimeLeft = (targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      expired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(EVENTS[activeEvent].date));

  // Recalculate when active event changes
  useEffect(() => {
    setTimeLeft(calculateTimeLeft(EVENTS[activeEvent].date));
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(EVENTS[activeEvent].date));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeEvent]);

  // Generate calendar Jan 2026 (Mon-start)
  const year = 2026;
  const month = 0;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayMon = (new Date(year, month, 1).getDay() + 6) % 7;

  const calendarDays: (number | null)[][] = [];
  let day = 1;
  for (let i = 0; i < 6; i++) {
    const row: (number | null)[] = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayMon) row.push(null);
      else if (day > daysInMonth) row.push(null);
      else row.push(day++);
    }
    if (row.some((d) => d !== null)) calendarDays.push(row);
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const ev = EVENTS[activeEvent];

  return (
    <section className="wds-section bg-white-black" id="wedding-date">
      <div className="container">

        {/* ── HEADER ── */}
        <div className="wds-header" data-aos="fade-up">
          <p className="wds-header__sub">Chúng tôi sắp kết hôn</p>
          <h2 className="font-esthetic wds-header__title">Đếm ngược đến ngày trọng đại</h2>
          <div className="wds-header__divider">
            <span className="wds-header__line" />
            <div className="wds-header__gem">Tháng 1 · 2026</div>
            <span className="wds-header__line" />
          </div>
        </div>

        <div className="wds-body">

          {/* ── CALENDAR ── */}
          <div className="wds-calendar-wrap" data-aos="fade-right">
            <div className="wds-calendar">
              <table className="wds-cal-table">
                <thead>
                  <tr>
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d, i) => (
                      <th key={i} className={i === 6 ? "wds-th--sun" : ""}>{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calendarDays.map((week, i) => (
                    <tr key={i}>
                      {week.map((d, j) => {
                        if (!d) return <td key={j} />;
                        const isEng = d === 21;
                        const isWed = d === 22;
                        const isSun = j === 6;
                        const isActiveDay = d === ev.dayNum;
                        return (
                          <td key={j}>
                            <div
                              className={[
                                "wds-day",
                                isSun && !isEng && !isWed ? "wds-day--sun" : "",
                                isEng ? "wds-day--eng" : "",
                                isWed ? "wds-day--wed" : "",
                                isActiveDay ? "wds-day--active" : "",
                              ].filter(Boolean).join(" ")}
                              onClick={() => {
                                if (isEng) setActiveEvent("engagement");
                                if (isWed) setActiveEvent("wedding");
                              }}
                              style={(isEng || isWed) ? { cursor: "pointer" } : {}}
                              title={isEng ? "Xem đếm ngược Ăn hỏi" : isWed ? "Xem đếm ngược Lễ cưới" : undefined}
                            >
                              {isWed && <span className="wds-pulse-ring" />}
                              <span className="wds-day__num">{d}</span>
                              {isEng && <span className="wds-day__badge">💍</span>}
                              {isWed && <span className="wds-day__badge">♥</span>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ── LEGEND TABS (clickable) ── */}
              <div className="wds-legend">
                {(Object.entries(EVENTS) as [EventKey, typeof EVENTS[EventKey]][]).map(([key, e]) => (
                  <button
                    key={key}
                    className={`wds-legend__item${activeEvent === key ? " wds-legend__item--active" : ""}`}
                    onClick={() => setActiveEvent(key)}
                  >
                    <span className={`wds-legend__dot ${e.dotClass}`} />
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── SINGLE COUNTDOWN ── */}
          <div className="wds-countdowns" data-aos="fade-left">
            <div className={`wds-cd-card wds-cd-card--${ev.accent}`} key={activeEvent}>
              <div className="wds-cd-card__header">
                <p className="wds-cd-card__title">
                  {timeLeft.expired ? ev.label : ev.label}
                </p>
              </div>
              <div className="wds-cd-grid">
                {[
                  { v: timeLeft.days, l: "Ngày" },
                  { v: timeLeft.hours, l: "Giờ" },
                  { v: timeLeft.minutes, l: "Phút" },
                  { v: timeLeft.seconds, l: "Giây" },
                ].map(({ v, l }, i) => (
                  <div key={i} className="wds-cd-unit">
                    <div className="wds-cd-box">
                      <span className="wds-cd-num">{pad(v)}</span>
                    </div>
                    <span className="wds-cd-label">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DRESSCODE & LOCATION ── */}
      <div className="wds-extra text-center mt-5" data-aos="fade-up">
        <p className="container text-center" style={{ fontSize: "1rem" }}>
          Để thể hiện sự thân thiện lẫn nhau, chúng tôi đề nghị quý vị
          tuân thủ quy định về trang phục sau đây:
        </p>

        {/* Love icon floating */}
        <div className="position-relative">
          <LoveAnimation top="0%" left="5%" time={2000} />
        </div>

        {/* Color circles */}
        <div className="py-3">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div
              className="shadow rounded-circle border border-secondary"
              style={{ width: "3rem", height: "3rem", backgroundColor: "white" }}
            />
            <div
              className="shadow rounded-circle border border-secondary"
              style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "black",
                marginLeft: "-1rem",
              }}
            />
          </div>
        </div>

        {/* Locations */}
        <div className="py-2">

          <p className="d-block my-1">Địa chỉ nhà chú rể</p>
          <a
            href="https://maps.app.goo.gl/E6CRjFDxxV4v57GJ9"
            target="_blank"
            className="btn btn-outline-auto btn-sm rounded-pill shadow mb-2 px-3"
          >
            <i className="fa-solid fa-map-location-dot me-2"></i>Google Maps
          </a>

          <p className="d-block my-1">Địa chỉ nhà cô dâu</p>
          <a
            href="https://maps.app.goo.gl/7jt5qC8JPukcc8NV8"
            target="_blank"
            className="btn btn-outline-auto btn-sm rounded-pill shadow mb-2 px-3"
          >
            <i className="fa-solid fa-map-location-dot me-2"></i>Google Maps
          </a>

        </div>

      </div>

      <LoveAnimation top="0%" right="5%" time={3000} wrapper />
    </section>
  );
}
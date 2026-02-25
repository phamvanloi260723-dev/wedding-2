"use client";

export default function NavbarBottom() {
  return (
    <nav
      className="navbar navbar-expand sticky-bottom rounded-top-4 border-top p-0"
      id="navbar-menu"
    >
      <ul className="navbar-nav nav-justified w-100 align-items-center">
        <li className="nav-item">
          <a className="nav-link" href="#home">
            <i className="fa-solid fa-house"></i>
            <span className="d-block" style={{ fontSize: "0.7rem" }}>
              Home
            </span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#bride">
            <i className="fa-solid fa-user-group"></i>
            <span className="d-block" style={{ fontSize: "0.7rem" }}>
              Chúng tôi
            </span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#wedding-date">
            <i className="fa-solid fa-calendar-check"></i>
            <span className="d-block" style={{ fontSize: "0.7rem" }}>
              Ngày cưới
            </span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#gallery">
            <i className="fa-solid fa-images"></i>
            <span className="d-block" style={{ fontSize: "0.7rem" }}>
              Hình ảnh
            </span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#comment">
            <i className="fa-solid fa-comments"></i>
            <span className="d-block" style={{ fontSize: "0.7rem" }}>
              Lời chúc phúc
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { PRODUCT_CONFIG, UI_COPY, type Language } from "./config";

type ActivePage = "reconstruction" | "submission";

interface SiteNavigationProps {
  language: Language;
  activePage: ActivePage;
  mobileMenuOpen: boolean;
  onLanguageChange: (language: Language) => void;
  onMenuToggle: () => void;
  onMenuClose: () => void;
}

export default function SiteNavigation({
  language,
  activePage,
  mobileMenuOpen,
  onLanguageChange,
  onMenuToggle,
  onMenuClose,
}: SiteNavigationProps) {
  const copy = UI_COPY[language];
  const siteLinks = [
    {
      id: "home",
      label: copy.navHome,
      status: "future",
    },
    {
      id: "reconstruction",
      label: copy.navReconstruction,
      href: "/",
      status: "available",
    },
    {
      id: "figures",
      label: copy.navFigures,
      status: "future",
    },
    {
      id: "writing",
      label: copy.navWriting,
      status: "future",
    },
    {
      id: "submission",
      label: copy.navSubmission,
      href: "/submission",
      status: "available",
    },
    {
      id: "about",
      label: copy.navAbout,
      status: "future",
    },
  ] as const;

  return (
    <>
      <a className="skip-link" href="#main-content">
        {copy.skipToContent}
      </a>

      <header className="mobile-header">
        <Link className="mobile-brand" href="/" aria-label="YanShu">
          <span className="brand-seal" aria-hidden="true">
            研
          </span>
          <span>
            <strong>{PRODUCT_CONFIG.productName}</strong>
            <small>YanShu</small>
          </span>
        </Link>
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={mobileMenuOpen ? copy.closeMenu : copy.mobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="site-sidebar"
          onClick={onMenuToggle}
        >
          <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
        </button>
      </header>

      {mobileMenuOpen && (
        <button
          className="nav-backdrop"
          type="button"
          aria-label={copy.closeMenu}
          onClick={onMenuClose}
        />
      )}

      <aside
        className={`site-sidebar ${mobileMenuOpen ? "is-open" : ""}`}
        id="site-sidebar"
      >
        <div className="sidebar-header">
          <Link className="brand" href="/" onClick={onMenuClose}>
            <span className="brand-seal" aria-hidden="true">
              研
            </span>
            <span className="brand-copy">
              <strong>{PRODUCT_CONFIG.productName}</strong>
              <small>{PRODUCT_CONFIG.productNameEn}</small>
            </span>
          </Link>
          <p>{copy.productTagline}</p>
          <div className="sidebar-meta-row">
            <span className="version-tag">{copy.version}</span>
            <div
              className="global-language-control"
              role="group"
              aria-label={copy.language}
            >
              <button
                type="button"
                aria-label={copy.chinese}
                aria-pressed={language === "zh"}
                className={language === "zh" ? "active" : ""}
                onClick={() => onLanguageChange("zh")}
              >
                中
              </button>
              <button
                type="button"
                aria-label={copy.english}
                aria-pressed={language === "en"}
                className={language === "en" ? "active" : ""}
                onClick={() => onLanguageChange("en")}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label={copy.navLabel}>
          <p>{copy.navDirectory}</p>
          <div className="nav-list">
            {siteLinks.map((item, index) => {
              const isActive = item.id === activePage;
              return item.status === "available" ? (
                <Link
                  className={isActive ? "active" : ""}
                  href={item.href}
                  key={item.id}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onMenuClose}
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className="nav-item is-future"
                  key={item.id}
                  aria-disabled="true"
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="nav-link-copy">
                    {item.label}
                    <small>{copy.comingSoon}</small>
                  </span>
                </span>
              );
            })}
          </div>
        </nav>

        <a
          className="sidebar-github"
          href="https://github.com/panzhzh/yanshu-workbench"
          target="_blank"
          rel="noreferrer"
        >
          <span>{copy.github}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </aside>
    </>
  );
}

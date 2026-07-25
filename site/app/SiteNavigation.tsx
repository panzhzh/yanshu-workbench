"use client";

import Link from "next/link";
import { PRODUCT_CONFIG, UI_COPY, type Language } from "./config";

type ActivePage =
  | "home"
  | "draft"
  | "reconstruction"
  | "figures"
  | "submission";

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
      href: "/",
      status: "available",
    },
    {
      id: "draft",
      label: copy.navDraft,
      href: "/draft",
      status: "available",
    },
    {
      id: "reconstruction",
      label: copy.navReconstruction,
      href: "/reconstruction",
      status: "available",
    },
    {
      id: "figures",
      label: copy.navFigures,
      href: "/figures",
      status: "available",
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

      <header className="site-topbar">
        <div className="topbar-inner">
          <Link
            className="topbar-brand"
            href="/"
            aria-label={PRODUCT_CONFIG.productNameEn}
            onClick={onMenuClose}
          >
            <span className="brand-seal" aria-hidden="true">
              研
            </span>
            <span className="topbar-brand-copy">
              <strong>{PRODUCT_CONFIG.productName}</strong>
              <small>{PRODUCT_CONFIG.productNameEn}</small>
            </span>
          </Link>

          <nav
            className={`top-navigation ${mobileMenuOpen ? "is-open" : ""}`}
            id="site-navigation"
            aria-label={copy.navLabel}
          >
            <div className="top-nav-list">
              {siteLinks.map((item) => {
                const isActive = item.id === activePage;
                return item.status === "available" ? (
                  <Link
                    className={isActive ? "active" : ""}
                    href={item.href}
                    key={item.id}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onMenuClose}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="top-nav-future"
                    key={item.id}
                    aria-disabled="true"
                  >
                    {item.label}
                    <small>{copy.comingSoon}</small>
                  </span>
                );
              })}
            </div>
            <div className="top-navigation-mobile-meta">
              <span>{copy.productTagline}</span>
              <a
                href="https://github.com/panzhzh/yanshu-workbench"
                target="_blank"
                rel="noreferrer"
              >
                {copy.github}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </nav>

          <div className="topbar-actions">
            <span className="topbar-version">{copy.version}</span>
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
            <a
              className="topbar-github"
              href="https://github.com/panzhzh/yanshu-workbench"
              target="_blank"
              rel="noreferrer"
              aria-label={copy.github}
            >
              GitHub
              <span aria-hidden="true">↗</span>
            </a>
            <button
              className="topbar-menu-button"
              type="button"
              aria-label={mobileMenuOpen ? copy.closeMenu : copy.mobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="site-navigation"
              onClick={onMenuToggle}
            >
              <span aria-hidden="true">{mobileMenuOpen ? "×" : "☰"}</span>
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <button
          className="nav-backdrop"
          type="button"
          aria-label={copy.closeMenu}
          onClick={onMenuClose}
        />
      )}
    </>
  );
}

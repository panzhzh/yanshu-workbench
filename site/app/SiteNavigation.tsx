"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { PRODUCT_CONFIG, UI_COPY, type Language } from "./config";
import {
  NAVIGATION_COPY,
  NAVIGATION_GROUPS,
  type ActivePage,
  type NavigationGroupId,
} from "./navigation";

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
  const navigationCopy = NAVIGATION_COPY[language];
  const navigationRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [openMenuId, setOpenMenuId] = useState<NavigationGroupId | null>(
    null,
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchEntries = useMemo(
    () =>
      NAVIGATION_GROUPS.flatMap((group) =>
        group.items.map((item) => ({ group, item })),
      ),
    [],
  );

  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase();
  const searchResults = useMemo(() => {
    if (!normalizedSearchQuery) return [];

    return searchEntries.filter(({ group, item }) => {
      const searchableText = [
        group.label[language],
        item.label[language],
        ...item.keywords[language],
      ]
        .join(" ")
        .toLocaleLowerCase();
      return searchableText.includes(normalizedSearchQuery);
    });
  }, [language, normalizedSearchQuery, searchEntries]);

  const resetNavigationPanels = () => {
    setOpenMenuId(null);
    setSearchOpen(false);
  };

  const closeNavigation = () => {
    resetNavigationPanels();
    onMenuClose();
  };

  const toggleMenu = (groupId: NavigationGroupId) => {
    setSearchOpen(false);
    setOpenMenuId((current) => (current === groupId ? null : groupId));
  };

  const toggleSearch = () => {
    setOpenMenuId(null);
    setSearchOpen((current) => !current);
  };

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleOutsidePointer = (event: PointerEvent) => {
      if (
        navigationRef.current &&
        !navigationRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
        setSearchOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenMenuId(null);
      setSearchOpen(false);
      if (mobileMenuOpen) onMenuClose();
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileMenuOpen, onMenuClose]);

  const stopNavigationPointerClose = (
    event: ReactPointerEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
  };

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
            onClick={closeNavigation}
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
            ref={navigationRef}
            onPointerDown={stopNavigationPointerClose}
          >
            <div className="top-nav-list">
              <Link
                className={`top-nav-home ${
                  activePage === "home" ? "active" : ""
                }`}
                href="/"
                aria-current={activePage === "home" ? "page" : undefined}
                onClick={closeNavigation}
              >
                {navigationCopy.home}
              </Link>

              {NAVIGATION_GROUPS.map((group) => {
                const isOpen = openMenuId === group.id;
                const isActive = group.items.some(
                  (item) => item.activePage === activePage,
                );
                const triggerId = `top-nav-${group.id}-trigger`;
                const panelId = `top-nav-${group.id}-panel`;

                return (
                  <div
                    className={`top-nav-group ${isOpen ? "is-open" : ""} ${
                      isActive ? "is-active" : ""
                    }`}
                    key={group.id}
                  >
                    <button
                      id={triggerId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleMenu(group.id)}
                    >
                      <span>{group.label[language]}</span>
                      <span className="top-nav-chevron" aria-hidden="true">
                        ⌄
                      </span>
                    </button>
                    <div
                      className="top-nav-dropdown"
                      id={panelId}
                      aria-labelledby={triggerId}
                      hidden={!isOpen}
                    >
                      <div className="top-nav-dropdown-panel">
                        <strong>{group.label[language]}</strong>
                        <ul>
                          {group.items.map((item) => {
                            const isCurrent =
                              item.activePage === activePage;
                            return (
                              <li key={item.id}>
                                {item.status === "available" && item.href ? (
                                  <Link
                                    className={
                                      isCurrent ? "active" : undefined
                                    }
                                    href={item.href}
                                    aria-current={
                                      isCurrent ? "page" : undefined
                                    }
                                    onClick={closeNavigation}
                                  >
                                    <span>{item.label[language]}</span>
                                    <small aria-hidden="true">→</small>
                                  </Link>
                                ) : (
                                  <span
                                    className="top-nav-child-future"
                                    aria-disabled="true"
                                  >
                                    <span>{item.label[language]}</span>
                                    <small>{copy.comingSoon}</small>
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div
                className={`top-nav-search ${searchOpen ? "is-open" : ""}`}
              >
                <button
                  className="top-nav-search-trigger"
                  type="button"
                  aria-expanded={searchOpen}
                  aria-controls="top-nav-search-panel"
                  onClick={toggleSearch}
                >
                  <span aria-hidden="true">⌕</span>
                  <span>{navigationCopy.search}</span>
                </button>
                <div
                  className="top-nav-search-dropdown"
                  id="top-nav-search-panel"
                  hidden={!searchOpen}
                >
                  <div className="top-nav-search-panel">
                    <label htmlFor="site-search-input">
                      {navigationCopy.searchLabel}
                    </label>
                    <div className="top-nav-search-input-row">
                      <span aria-hidden="true">⌕</span>
                      <input
                        id="site-search-input"
                        ref={searchInputRef}
                        type="search"
                        autoComplete="off"
                        value={searchQuery}
                        placeholder={navigationCopy.searchPlaceholder}
                        onChange={(event) =>
                          setSearchQuery(event.target.value)
                        }
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          aria-label={navigationCopy.clearSearch}
                          onClick={() => {
                            setSearchQuery("");
                            searchInputRef.current?.focus();
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {!normalizedSearchQuery ? (
                      <p className="top-nav-search-hint">
                        {navigationCopy.searchHint}
                      </p>
                    ) : (
                      <div className="top-nav-search-results">
                        <p aria-live="polite">
                          {searchResults.length > 0
                            ? `${navigationCopy.searchResults} · ${searchResults.length}`
                            : navigationCopy.noResults}
                        </p>
                        {searchResults.length > 0 && (
                          <ul>
                            {searchResults.map(({ group, item }) => {
                              const isCurrent =
                                item.activePage === activePage;
                              return (
                                <li key={`${group.id}-${item.id}`}>
                                  {item.status === "available" &&
                                  item.href ? (
                                    <Link
                                      href={item.href}
                                      aria-current={
                                        isCurrent ? "page" : undefined
                                      }
                                      onClick={closeNavigation}
                                    >
                                      <span>
                                        <strong>
                                          {item.label[language]}
                                        </strong>
                                        <small>
                                          {group.label[language]}
                                        </small>
                                      </span>
                                      <em>
                                        {isCurrent
                                          ? navigationCopy.currentPage
                                          : navigationCopy.available}
                                      </em>
                                    </Link>
                                  ) : (
                                    <span
                                      className="top-nav-search-future"
                                      aria-disabled="true"
                                    >
                                      <span>
                                        <strong>
                                          {item.label[language]}
                                        </strong>
                                        <small>
                                          {group.label[language]}
                                        </small>
                                      </span>
                                      <em>{copy.comingSoon}</em>
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
              onClick={() => {
                if (mobileMenuOpen) resetNavigationPanels();
                onMenuToggle();
              }}
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
          onClick={closeNavigation}
        />
      )}
    </>
  );
}

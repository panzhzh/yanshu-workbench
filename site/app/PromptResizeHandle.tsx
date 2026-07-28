"use client";

import { useEffect, useRef, useState } from "react";
import { UI_COPY, type Language } from "./config";

const DEFAULT_PROMPT_WIDTH = 40;
const MIN_PROMPT_WIDTH = 30;
const MAX_PROMPT_WIDTH = 60;
const KEYBOARD_STEP = 2;

function clampPromptWidth(value: number) {
  return Math.min(MAX_PROMPT_WIDTH, Math.max(MIN_PROMPT_WIDTH, value));
}

export default function PromptResizeHandle({
  language,
  controls,
}: {
  language: Language;
  controls?: string;
}) {
  const [percentage, setPercentage] = useState(DEFAULT_PROMPT_WIDTH);
  const handleRef = useRef<HTMLDivElement>(null);
  const copy = UI_COPY[language];

  useEffect(
    () => () => {
      document.body.classList.remove("is-resizing-prompt");
    },
    [],
  );

  function applyPercentage(nextPercentage: number) {
    const normalized = Math.round(clampPromptWidth(nextPercentage));
    const main = handleRef.current?.closest(".site-main") as HTMLElement | null;
    main?.style.setProperty("--prompt-rail-width", `${normalized}%`);
    setPercentage(normalized);
  }

  function percentageFromPointer(clientX: number) {
    const main = handleRef.current?.closest(".site-main") as HTMLElement | null;
    if (!main) return percentage;
    const bounds = main.getBoundingClientRect();
    return ((bounds.right - clientX) / bounds.width) * 100;
  }

  function finishResize(
    target: HTMLDivElement,
    pointerId: number,
  ) {
    if (target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }
    delete target.dataset.dragging;
    document.body.classList.remove("is-resizing-prompt");
  }

  return (
    <div
      className="prompt-resize-handle"
      ref={handleRef}
      role="separator"
      tabIndex={0}
      aria-label={copy.resizePromptRail}
      aria-controls={controls}
      title={`${copy.resizePromptRail} · ${copy.resetPromptRail}`}
      aria-orientation="vertical"
      aria-valuemin={MIN_PROMPT_WIDTH}
      aria-valuemax={MAX_PROMPT_WIDTH}
      aria-valuenow={percentage}
      aria-valuetext={`${percentage}%`}
      onDoubleClick={() => applyPercentage(DEFAULT_PROMPT_WIDTH)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          applyPercentage(percentage + KEYBOARD_STEP);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          applyPercentage(percentage - KEYBOARD_STEP);
        }
        if (event.key === "Home") {
          event.preventDefault();
          applyPercentage(MIN_PROMPT_WIDTH);
        }
        if (event.key === "End") {
          event.preventDefault();
          applyPercentage(MAX_PROMPT_WIDTH);
        }
        if (event.key === "0") {
          event.preventDefault();
          applyPercentage(DEFAULT_PROMPT_WIDTH);
        }
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = "true";
        document.body.classList.add("is-resizing-prompt");
        applyPercentage(percentageFromPointer(event.clientX));
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        applyPercentage(percentageFromPointer(event.clientX));
      }}
      onPointerUp={(event) =>
        finishResize(event.currentTarget, event.pointerId)
      }
      onPointerCancel={(event) =>
        finishResize(event.currentTarget, event.pointerId)
      }
      onLostPointerCapture={(event) => {
        delete event.currentTarget.dataset.dragging;
        document.body.classList.remove("is-resizing-prompt");
      }}
    >
      <span className="prompt-resize-line" aria-hidden="true">
        <i />
      </span>
      <span className="prompt-resize-value" aria-hidden="true">
        {percentage}%
      </span>
    </div>
  );
}

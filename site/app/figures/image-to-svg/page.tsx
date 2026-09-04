"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { IMAGE_TO_SVG_WORKBENCH } from "./config";

export default function ImageToSvgPage() {
  return <ConfigurablePromptWorkbench definition={IMAGE_TO_SVG_WORKBENCH} />;
}

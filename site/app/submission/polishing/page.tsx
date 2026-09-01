"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { FINAL_POLISHING_WORKBENCH } from "./config";

export default function FinalPolishingPage() {
  return <ConfigurablePromptWorkbench definition={FINAL_POLISHING_WORKBENCH} />;
}

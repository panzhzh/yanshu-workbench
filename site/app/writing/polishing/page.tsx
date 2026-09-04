"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { WRITING_POLISHING_WORKBENCH } from "./config";

export default function WritingPolishingPage() {
  return <ConfigurablePromptWorkbench definition={WRITING_POLISHING_WORKBENCH} />;
}

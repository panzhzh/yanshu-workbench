"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { SECTION_WRITING_WORKBENCH } from "./config";

export default function SectionWritingPage() {
  return <ConfigurablePromptWorkbench definition={SECTION_WRITING_WORKBENCH} />;
}

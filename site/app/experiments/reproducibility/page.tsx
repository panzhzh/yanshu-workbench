"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { reproducibilityDefinition } from "../config";

export default function ReproducibilityPage() {
  return <ConfigurablePromptWorkbench definition={reproducibilityDefinition} />;
}

"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { experimentCodeDefinition } from "../config";

export default function ExperimentCodePage() {
  return <ConfigurablePromptWorkbench definition={experimentCodeDefinition} />;
}

"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { experimentDesignDefinition } from "../config";

export default function ExperimentDesignPage() {
  return <ConfigurablePromptWorkbench definition={experimentDesignDefinition} />;
}

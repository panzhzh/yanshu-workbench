"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { baselineReproductionDefinition } from "../config";

export default function BaselineReproductionPage() {
  return (
    <ConfigurablePromptWorkbench definition={baselineReproductionDefinition} />
  );
}

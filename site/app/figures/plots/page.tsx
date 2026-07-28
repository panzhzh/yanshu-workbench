"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { EXPERIMENTAL_PLOTS_WORKBENCH } from "../toolsConfig";

export default function ExperimentalPlotsPage() {
  return <ConfigurablePromptWorkbench definition={EXPERIMENTAL_PLOTS_WORKBENCH} />;
}

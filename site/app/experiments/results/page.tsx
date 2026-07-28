"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { resultsAnalysisDefinition } from "../config";

export default function ResultsAnalysisPage() {
  return <ConfigurablePromptWorkbench definition={resultsAnalysisDefinition} />;
}

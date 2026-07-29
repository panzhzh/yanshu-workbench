"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { WRITING_DIAGNOSIS_WORKBENCH } from "./config";

export default function WritingDiagnosisPage() {
  return (
    <ConfigurablePromptWorkbench
      definition={WRITING_DIAGNOSIS_WORKBENCH}
    />
  );
}

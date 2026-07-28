"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { SUBMISSION_MATERIALS_WORKBENCH } from "../workflowConfig";

export default function SubmissionMaterialsPage() {
  return (
    <ConfigurablePromptWorkbench definition={SUBMISSION_MATERIALS_WORKBENCH} />
  );
}

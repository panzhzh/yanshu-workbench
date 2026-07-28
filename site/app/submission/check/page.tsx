"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { PRE_SUBMISSION_CHECK_WORKBENCH } from "../workflowConfig";

export default function PreSubmissionCheckPage() {
  return (
    <ConfigurablePromptWorkbench definition={PRE_SUBMISSION_CHECK_WORKBENCH} />
  );
}

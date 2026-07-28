"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { REVIEW_REVISION_WORKBENCH } from "../workflowConfig";

export default function ReviewRevisionPage() {
  return <ConfigurablePromptWorkbench definition={REVIEW_REVISION_WORKBENCH} />;
}

"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { REVISION_PLANNING_WORKBENCH } from "../workflowConfig";

export default function RevisionPlanningPage() {
  return (
    <ConfigurablePromptWorkbench definition={REVISION_PLANNING_WORKBENCH} />
  );
}

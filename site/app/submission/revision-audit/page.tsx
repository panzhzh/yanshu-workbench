"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { REVISION_AUDIT_WORKBENCH } from "../workflowConfig";

export default function RevisionAuditPage() {
  return <ConfigurablePromptWorkbench definition={REVISION_AUDIT_WORKBENCH} />;
}

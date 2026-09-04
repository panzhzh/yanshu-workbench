"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { CITATION_AUDIT_WORKBENCH } from "./config";

export default function CitationAuditPage() {
  return <ConfigurablePromptWorkbench definition={CITATION_AUDIT_WORKBENCH} />;
}

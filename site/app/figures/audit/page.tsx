"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { FIGURE_TABLE_AUDIT_WORKBENCH } from "../toolsConfig";

export default function FigureTableAuditPage() {
  return (
    <ConfigurablePromptWorkbench definition={FIGURE_TABLE_AUDIT_WORKBENCH} />
  );
}

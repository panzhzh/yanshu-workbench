"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { PAPER_TABLES_WORKBENCH } from "../toolsConfig";

export default function PaperTablesPage() {
  return <ConfigurablePromptWorkbench definition={PAPER_TABLES_WORKBENCH} />;
}

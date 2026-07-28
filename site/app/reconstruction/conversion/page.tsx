"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { VERSION_CONVERSION_WORKBENCH } from "./config";

export default function VersionConversionPage() {
  return (
    <ConfigurablePromptWorkbench definition={VERSION_CONVERSION_WORKBENCH} />
  );
}

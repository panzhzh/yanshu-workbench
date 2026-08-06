"use client";

import ConfigurablePromptWorkbench from "../../workbench/ConfigurablePromptWorkbench";
import { PEER_REVIEW_WORKBENCH } from "../workflowConfig";

export default function PeerReviewPage() {
  return <ConfigurablePromptWorkbench definition={PEER_REVIEW_WORKBENCH} />;
}

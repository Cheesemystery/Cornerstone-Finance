import { AppShell } from "@/components/app-shell";
import { AssistantClient } from "@/components/assistant-client";
import { PageHeader } from "@/components/page-header";
export default function AssistantPage(){return <AppShell><PageHeader title="Ask Cornerstone" description="Understand your holdings. Explore an investing idea. Ask Cornerstone."/><AssistantClient/></AppShell>}

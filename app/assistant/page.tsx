import { AppShell } from "@/components/app-shell";
import { AssistantClient } from "@/components/assistant-client";
import { PageHeader } from "@/components/page-header";
export default function AssistantPage(){return <AppShell><PageHeader title="Guided Q&A" description="Ask about your holdings or an investing concept."/><AssistantClient/></AppShell>}

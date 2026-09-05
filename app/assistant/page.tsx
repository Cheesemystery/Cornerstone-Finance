import { AppShell } from "@/components/app-shell";
import { AssistantClient } from "@/components/assistant-client";
import { PageHeader } from "@/components/page-header";
export default function AssistantPage(){return <AppShell><PageHeader eyebrow="There are no silly questions" title="Assistant" description="A friendly guide to your portfolio and the basics."/><AssistantClient/></AppShell>}

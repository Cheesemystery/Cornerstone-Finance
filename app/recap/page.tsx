import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { RecapWorkspace } from "@/components/recap-workspace";
import { recapDemoEnabled } from "@/lib/features";
export default function RecapPage(){if(!recapDemoEnabled)notFound();return <AppShell><PageHeader eyebrow="Your progress, made visible" title="Your Recap" description="Celebrate the habit. Understand the story. Keep your numbers yours."/><RecapWorkspace/></AppShell>}

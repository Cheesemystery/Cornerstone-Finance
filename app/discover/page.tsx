import { AppShell } from "@/components/app-shell";
import { DiscoverSearch } from "@/components/discover-search";
import { PageHeader } from "@/components/page-header";
export default function DiscoverPage(){return <AppShell><PageHeader eyebrow="Research workspace" title="Discover" description="Start broad, then go deeper. Every result identifies its source and freshness."/><DiscoverSearch/></AppShell>}

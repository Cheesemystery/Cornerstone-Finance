import { AppShell } from "@/components/app-shell";
import { DiscoverSearch } from "@/components/discover-search";
import { PageHeader } from "@/components/page-header";
import { ProfileSuggestions } from "@/components/profile-suggestions";
export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return <AppShell><PageHeader eyebrow="Find your next idea" title="Discover" description="Big ideas. Less guesswork."/><ProfileSuggestions/><section aria-labelledby="research-heading"><div className="section-heading discover-research"><div><p className="eyebrow">Keep exploring</p><h2 id="research-heading">Research made simple</h2></div><span>Build your reading list</span></div><DiscoverSearch key={q ?? ""} initialQuery={q ?? ""}/></section></AppShell>;
}

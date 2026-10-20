import { AppShell } from "@/components/app-shell";
import { StockResearcher } from "@/components/stock-researcher";
import { PageHeader } from "@/components/page-header";
export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <AppShell>
      <PageHeader
        eyebrow="Follow your curiosity"
        title="Discover"
        description="One stock. The chart, the context, and the questions worth asking."
      />
      <StockResearcher key={q ?? ""} initialQuery={q ?? ""} />
    </AppShell>
  );
}

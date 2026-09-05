import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { DemoPortfolio } from "@/components/demo-portfolio";


export default function PortfolioPage() {
  return <AppShell>
    <PageHeader eyebrow="Your portfolio workspace" title="Portfolio" description="Your money, at a glance." action={<Link href="/onboarding" className="button primary">Connect or import</Link>} />
    <DemoPortfolio/>
  </AppShell>;
}

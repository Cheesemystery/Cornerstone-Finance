import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PortfolioWorkspace } from "@/components/portfolio-workspace";
export default function PortfolioPage(){return <AppShell><PageHeader eyebrow="Learn by trying" title="Portfolio" description="Understand your holdings and their price changes."/><PortfolioWorkspace/></AppShell>}

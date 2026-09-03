import { AppShell } from "@/components/app-shell";
import { BriefingDashboard } from "@/components/briefing-dashboard";
import { sampleBriefing, samplePortfolio } from "@/lib/sample-data";

export default function HomePage() {
  return <AppShell><BriefingDashboard briefing={sampleBriefing} portfolio={samplePortfolio} /></AppShell>;
}

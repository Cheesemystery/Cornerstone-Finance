import { AppShell } from "@/components/app-shell";
import { PortfolioRecap } from "@/components/portfolio-recap";
import { RecapWorkspace } from "@/components/recap-workspace";
import { connectedFeaturesEnabled } from "@/lib/features";
export default function RecapPage(){return <AppShell>{connectedFeaturesEnabled?<RecapWorkspace/>:<PortfolioRecap/>}</AppShell>}

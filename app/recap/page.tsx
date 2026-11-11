import { LearningFoundation } from "@/components/learning-foundation";
import { LearningBuildingCard } from "@/components/learning-building";
import { SavedIdeas } from "@/components/saved-ideas";
import { LearningSummary } from "@/components/learning-summary";
import { AppShell } from "@/components/app-shell";
import { PortfolioRecap } from "@/components/portfolio-recap";
import { RecapWorkspace } from "@/components/recap-workspace";
import { connectedFeaturesEnabled } from "@/lib/features";
export default function RecapPage(){return <AppShell><LearningSummary/>{connectedFeaturesEnabled?<RecapWorkspace/>:<PortfolioRecap/>}<div className="studio-recap-foundation"><LearningFoundation/><details className="foundation-style-preview"><summary>Explore building styles</summary><p>This optional 24-position architectural sketch is a style preview. The six-lesson foundation above shows your curriculum progress.</p><LearningBuildingCard/></details><SavedIdeas/></div></AppShell>}

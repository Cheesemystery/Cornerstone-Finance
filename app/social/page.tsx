import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { SocialLeaderboard } from "@/components/social-leaderboard";
export default function SocialPage() {
  return <AppShell><PageHeader eyebrow="Invest in your perspective" title="Social" description="Your campus. Different strategies. A community learning together."/><SocialLeaderboard/></AppShell>;
}

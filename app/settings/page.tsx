import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { MvpSettings } from "@/components/mvp-settings";
import { DemoSettings } from "@/components/demo-settings";
import { connectedFeaturesEnabled } from "@/lib/features";
export default function SettingsPage(){return <AppShell><PageHeader eyebrow="Your space, your way" title="Settings" description="Choose your pace. Keep control of your data."/>{connectedFeaturesEnabled?<DemoSettings/>:<MvpSettings/>}</AppShell>}

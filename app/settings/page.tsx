import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { MvpSettings } from "@/components/mvp-settings";
import { DemoSettings } from "@/components/demo-settings";
import { connectedFeaturesEnabled } from "@/lib/features";
import Link from "next/link";
import { aboutContent } from "@/content/about";
export default function SettingsPage(){return <AppShell><PageHeader eyebrow="Your space, your way" title="Settings" description="Choose your pace. Keep control of your data."/>{connectedFeaturesEnabled?<DemoSettings/>:<MvpSettings/>}<section className="mvp-card workspace"><h2>{aboutContent.settings.title}</h2><p>{aboutContent.settings.description}</p><Link className="demo-link" href="/about">{aboutContent.settings.linkLabel}</Link></section></AppShell>}

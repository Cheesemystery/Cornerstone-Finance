import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { DemoSettings } from "@/components/demo-settings";
export default function SettingsPage(){return <AppShell><PageHeader eyebrow="Your space, your way" title="Settings" description="Make the demo yours. Keep control of your data."/><DemoSettings/></AppShell>}

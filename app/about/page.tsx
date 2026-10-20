import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { aboutContent } from "@/content/about";

export default function AboutPage() {
  const copy = aboutContent;
  return <AppShell>
    <PageHeader title={copy.title} description={copy.subtitle} />
    <div className="demo-stack">
      {[copy.mission, copy.story, copy.today, copy.privacy].map((section, index) => <section className="mvp-card" key={index} aria-labelledby={`about-section-${index}`}>
        <h2 id={`about-section-${index}`}>{section.title}</h2>
        {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
      </section>)}
      {copy.supporters.text.trim() && <section className="mvp-card">
        <h2>{copy.supporters.title}</h2><p>{copy.supporters.text}</p>
      </section>}
      <section className="mvp-card">
        <h2>{copy.contact.title}</h2>
        <a className="demo-link" href={`mailto:${copy.contact.email}`}>{copy.contact.email}</a>
      </section>
      <section className="mvp-card">
        <h2>{copy.waitlist.title}</h2>
        <button type="button" className="button secondary" disabled>{copy.waitlist.buttonLabel}</button>
      </section>
    </div>
  </AppShell>;
}

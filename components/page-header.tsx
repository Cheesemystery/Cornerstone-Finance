export function PageHeader({ title, description, action }: { eyebrow?: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <header className="page-header">
      <div><h1>{title}</h1><p>{description}</p></div>
      {action && <div className="header-action">{action}</div>}
    </header>
  );
}

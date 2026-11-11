import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({variant="primary",className,...props}:ComponentProps<"button"> & {variant?:"primary"|"secondary"}) {
 return <button type="button" className={cn("button",variant,className)} {...props}/>;
}
export function Card({className,...props}:ComponentProps<"section">) {
 return <section className={cn("ds-card",className)} {...props}/>;
}
export function SectionHeading({eyebrow,title,action}:{eyebrow?:string;title:string;action?:ReactNode}) {
 return <div className="ds-section-heading"><div>{eyebrow&&<p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2></div>{action}</div>;
}
export function Badge({tone="neutral",children}:{tone?:"neutral"|"success"|"warning"|"achievement";children:ReactNode}) {
 return <span className="ds-badge" data-tone={tone}>{children}</span>;
}
export function EmptyState({title,children,action}:{title:string;children:ReactNode;action?:ReactNode}) {
 return <div className="ds-empty"><h2>{title}</h2><p>{children}</p>{action}</div>;
}

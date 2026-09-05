import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { LessonReader } from "@/components/lesson-reader";
import { lessons } from "@/lib/lessons";
export function generateStaticParams(){return lessons.map(lesson=>({slug:lesson.id}));}
export default async function LessonPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!lessons.some(l=>l.id===slug))notFound();return <AppShell><LessonReader id={slug}/></AppShell>}

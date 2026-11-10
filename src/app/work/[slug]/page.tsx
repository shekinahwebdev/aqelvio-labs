import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/components/work/ProjectDetailView";
import { nextProject, projectDetail, workProjects } from "@/data/projects";

/* One page per project in the shared dataset; any other slug is a 404. */
export function generateStaticParams() {
  return workProjects.map((project) => ({ slug: project.slug }));
}

/*
 * Blocking, not streamed: every real project is prerendered above, and an
 * unknown slug must answer with a real 404 status. Reading the slug inside
 * Suspense (the instant-navigation pattern) would stream the not-found
 * page with a 200.
 */
export const instant = false;

async function load(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const project = workProjects.find((item) => item.slug === slug);
  const detail = project ? projectDetail(project.slug) : undefined;
  return project && detail ? { project, detail } : null;
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const found = await load(params);
  if (!found) return {};
  return { title: found.project.title, description: found.detail.intro };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const found = await load(params);
  if (!found) notFound();
  return <ProjectDetailView project={found.project} detail={found.detail} next={nextProject(found.project.slug)} />;
}

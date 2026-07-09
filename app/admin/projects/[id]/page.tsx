import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/project-form";
import { getProject } from "@/lib/data";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  // Map database properties if necessary to match the Project type expected by ProjectForm
  const formattedProject = {
    id: project.id,
    title: project.title,
    subtitle: project.subtitle || "",
    description: project.description || "",
    year: project.year,
    image_url: project.image_url || "",
    demo_url: project.demo_url || "",
    github_url: project.github_url || "",
    tech_stack: project.tech_stack || [],
    sort_order: project.sort_order || 0,
    is_coming_soon: !!project.is_coming_soon,
    is_visible: !!project.is_visible,
  };

  return <ProjectForm initialData={formattedProject} isEdit={true} />;
}

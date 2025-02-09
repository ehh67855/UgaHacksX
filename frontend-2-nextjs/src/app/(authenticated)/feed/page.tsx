import { PageTemplate } from "@/components/page-template";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectFeed } from "@/components/project-feed";
import { getAuthToken } from "@/services/BackendService";
import type { Project } from "@/types/project";
import { formatApiUrl } from "@/lib/utils";

export async function getProjects(): Promise<Project[]> {
  const response = await fetch(formatApiUrl(`/api/projects`), {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
}

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <PageTemplate name="Feed">
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectFeed initialProjects={projects} />
      </Suspense>
    </PageTemplate>
  );
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full" />
      ))}
    </div>
  );
}

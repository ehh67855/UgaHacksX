import { PageTemplate } from "@/components/page-template";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectFeed } from "@/components/project-feed";
import { getAuthToken } from "@/services/BackendService";
import type { Project } from "@/types/project";
import { formatApiUrl } from "@/lib/utils";
import { type Metadata } from "next";
import { NewProjectButton } from "@/components/new-project-button";

export const metadata: Metadata = {
  title: "Feed",
};

export async function getFeedProjects(): Promise<Project[]> {
  const authToken = await getAuthToken();
  const response = await fetch(formatApiUrl("/api/projects"), {
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  return response.json();
}

export default async function HomePage() {
  const feedProjects = await getFeedProjects();
  const reversedFeedProjects = feedProjects.toReversed();

  return (
    <PageTemplate name="Feed" rightSide={<NewProjectButton />}>
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectFeed initialProjects={reversedFeedProjects} />
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

import { formatApiUrl } from "@/lib/utils";
import type { Project, ProjectVersion, Comment } from "@/types/project";

export async function getProjectDetails(
  id: string,
  token: string | undefined
): Promise<Project> {
  const res = await fetch(formatApiUrl(`/api/projects/${id}`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch project details");
  return res.json();
}

export async function getProjectVersions(
  id: string,
  token: string | undefined
): Promise<ProjectVersion[]> {
  const res = await fetch(formatApiUrl(`/api/projects/${id}/versions`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch project versions");
  return res.json();
}

export async function getProjectComments(
  id: string,
  token: string | undefined
): Promise<Comment[]> {
  const res = await fetch(formatApiUrl(`/api/projects/${id}/comments`), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch project comments");
  return res.json();
}

import { formatApiUrl } from "@/lib/utils";
import type { ProjectVersion } from "@/types/project";

interface ApiVersion {
  id: number;
  name: string;
  description?: string;
  uploadDate?: string;
}

interface ApiResponse {
  id: number;
  name: string;
  description?: string;
  uploadDate?: string;
  project?: {
    projectVersions: (ApiVersion | number)[];
  };
}

export async function getVersions(
  projectId: string
): Promise<ProjectVersion[]> {
  const res = await fetch(formatApiUrl(`/api/projects/${projectId}/versions`), {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch versions");
  const responseJson: ApiResponse[] = await res.json();

  console.log("^^responseJson: ", responseJson);

  const versions: ProjectVersion[] = responseJson;

  return versions;
}

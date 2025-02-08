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

  const versions: ProjectVersion[] = [];

  // Process the latest version
  if (responseJson[0] && typeof responseJson[0] === "object") {
    const latestVersion = responseJson[0];
    versions.push({
      id: latestVersion.id,
      name: latestVersion.name,
    });

    // Process older versions
    if (
      latestVersion.project &&
      Array.isArray(latestVersion.project.projectVersions)
    ) {
      latestVersion.project.projectVersions.forEach(
        (version: ApiVersion | number) => {
          if (typeof version === "object" && version.id !== latestVersion.id) {
            versions.push({
              id: version.id,
              name: version.name,
            });
          }
        }
      );
    }
  }

  // Process any additional versions that might be directly in the array
  for (let i = 1; i < responseJson.length; i++) {
    const version = responseJson[i];
    if (typeof version === "object") {
      versions.push({
        id: version.id,
        name: version.name,
      });
    }
  }

  return versions;
}

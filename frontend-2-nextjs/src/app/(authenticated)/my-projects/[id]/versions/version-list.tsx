"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProjectVersion } from "@/types/project";
import { formatApiUrl } from "@/lib/utils";

export function VersionList({
  latestVersion,
  olderVersions,
}: {
  latestVersion: ProjectVersion | null;
  olderVersions: ProjectVersion[];
}) {
  const { toast } = useToast();

  const handleDownload = async (versionId: number, fileName: string) => {
    try {
      const response = await fetch(
        formatApiUrl(`/api/projects/download/${versionId}`)
      );
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.zip`;
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      toast({
        title: "Error",
        description: "Failed to download file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {latestVersion && (
        <Card>
          <CardHeader>
            <CardTitle>Latest Version</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold">{latestVersion.name}</h3>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() =>
                handleDownload(latestVersion.id, latestVersion.name)
              }
            >
              Download
            </Button>
          </CardFooter>
        </Card>
      )}

      {olderVersions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Previous Versions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {olderVersions.map((version) => (
                <li
                  key={version.id}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <h4 className="text-lg font-semibold">{version.name}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleDownload(version.id, version.name)}
                  >
                    Download
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

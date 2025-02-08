import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectVersion } from "@/types/project";
import { formatApiUrl } from "@/lib/utils";

export default function VersionHistory({
  versions,
}: {
  versions: ProjectVersion[];
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        {versions.length > 0 ? (
          <ul className="space-y-4">
            {versions.map((version) => (
              <li
                key={version.id}
                className="flex justify-between items-center"
              >
                <div>
                  <h5 className="font-semibold">{version.name}</h5>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      formatApiUrl(
                        `/api/projects/versions/${version.id}/download`
                      )
                    )
                  }
                >
                  Download
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No versions available
          </p>
        )}
      </CardContent>
    </Card>
  );
}

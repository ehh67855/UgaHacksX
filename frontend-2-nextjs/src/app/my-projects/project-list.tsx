import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { Project } from "@/types/project";
import { formatApiUrl } from "@/lib/utils";

async function getProjects(userLogin: string): Promise<Project[]> {
  const res = await fetch(formatApiUrl(`/api/projects/${userLogin}`), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await res.json();

  // Validate and parse the response
  if (!Array.isArray(data)) {
    throw new Error("Invalid response format");
  }

  return data.map(
    (item): Project => ({
      id: item.id?.toString() ?? "",
      name: item.name ?? "",
      description: item.description ?? "",
      datePosted: item.datePosted ?? "",
      // Map any other fields here
    })
  );
}

export default async function ProjectList({
  userLogin,
}: {
  userLogin: string;
}) {
  const router = useRouter();
  let projects: Project[];

  try {
    projects = await getProjects(userLogin);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load projects. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No projects found.</p>
    );
  }

  const handleDelete = async (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      // Implement delete logic here
      console.log("Delete project:", projectId);
      // After successful deletion, refresh the page
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription>Posted on {project.datePosted}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{project.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild>
              <Link href={`/project/${project.id}`}>View More</Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(project.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

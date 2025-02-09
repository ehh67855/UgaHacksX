"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Project } from "@/types/project";
import { formatApiUrl } from "@/lib/utils";

async function getProjects(userLogin: string): Promise<Project[]> {
  const res = await fetch(formatApiUrl(`/api/projects/user/${userLogin}`), {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await res.json();
  console.log("data:", JSON.stringify(data, null, 2));

  if (!Array.isArray(data)) {
    throw new Error("Invalid response format");
  }

  const parsedData = data.map(
    (item): Project => ({
      id: item.id?.toString() ?? "",
      name: item.name ?? "",
      description: item.description ?? "",
      owner: {
        firstName: item.owner.firstName,
        lastName: item.owner.lastName,
      },
    })
  );

  console.log("parsedData:" + JSON.stringify(parsedData, null, 2));

  return parsedData;
}

export function ProjectList({ userLogin }: { userLogin: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    getProjects(userLogin)
      .then((fetchedProjects) => {
        setProjects(fetchedProjects);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
        setIsLoading(false);
      });
  }, [userLogin]);

  const handleDelete = async (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const response = await fetch(
          formatApiUrl(`/api/projects/${projectId}/delete`),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `login=${encodeURIComponent(userLogin)}`,
          }
        );

        if (response.ok) {
          setProjects(projects.filter((project) => project.id !== projectId));
          toast({
            title: "Success",
            description: "Project deleted successfully",
          });
          router.push("/my-projects");
        } else {
          const errorData = await response.text();
          throw new Error(errorData || "Failed to delete project");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to delete project",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading projects...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (projects.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No projects found.</p>
    );
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Description: {project.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild>
              <Link href={`/project/${project.id}`}>
                <Info />
                View More
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(project.id)}
            >
              <Trash />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

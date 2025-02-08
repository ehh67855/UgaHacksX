import { Suspense } from "react";
import Link from "next/link";
import { getAuthToken, getLogin } from "@/services/BackendService";
import { Button } from "@/components/ui/button";
import { ProjectList } from "./project-list";

export default async function MyProjectsPage() {
  const authToken = await getAuthToken();
  if (!authToken) {
    throw new Error("Missing auth token.");
  }

  const userLogin = await getLogin(authToken);
  if (!userLogin) {
    throw new Error("Missing login.");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Projects</h1>
        <Button asChild>
          <Link href="/new-project">Add Project</Link>
        </Button>
      </div>

      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList userLogin={userLogin} />
      </Suspense>
    </div>
  );
}

function ProjectListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-muted animate-pulse h-32 rounded-lg"></div>
      ))}
    </div>
  );
}

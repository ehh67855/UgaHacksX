import { Suspense } from "react";
import Link from "next/link";
import { getAuthToken, getLogin } from "@/services/BackendService";
import { Button } from "@/components/ui/button";
import { ProjectList } from "./project-list";
import { PageTemplate } from "@/components/page-template";
import { Plus } from "lucide-react";

export default async function MyProjectsPage() {
  const authToken = await getAuthToken();
  const userLogin = await getLogin(authToken);
  if (!userLogin) {
    throw new Error("Missing login.");
  }

  return (
    <PageTemplate
      name="My Projects"
      rightSide={
        <Button asChild>
          <Link href="/new-project">
            <Plus />
            Add Project
          </Link>
        </Button>
      }
    >
      <Suspense fallback={<ProjectListSkeleton />}>
        <ProjectList userLogin={userLogin} />
      </Suspense>
    </PageTemplate>
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

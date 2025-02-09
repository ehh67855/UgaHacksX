import { Suspense } from "react";
import Link from "next/link";
import { getAuthToken, getLogin } from "@/services/BackendService";
import { Button } from "@/components/ui/button";
import { ProjectList } from "./project-list";
import { PageTemplate } from "@/components/page-template";
import { Plus } from "lucide-react";
import { type Metadata } from "next";
import React from "react";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";

export const metadata: Metadata = {
  title: "My Projects",
};

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
    <PageTemplate
      name="My Projects"
      rightSide={
        // <Button asChild>
        //   <Link href="/new-project">
        //     <Plus />
        //     Add Project
        //   </Link>
        // </Button>

        <Link href="/new-project">
          <MovingBorderButton
            borderRadius="1.25rem"
            className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 flex flex-row gap-2 items-center"
            containerClassName=""
          >
            <Plus className="size-4" />
            Add Project
          </MovingBorderButton>
        </Link>
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

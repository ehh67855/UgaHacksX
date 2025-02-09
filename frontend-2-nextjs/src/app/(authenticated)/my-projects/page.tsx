import { Suspense } from "react";
import Link from "next/link";
import { getAuthToken, getLogin } from "@/services/BackendService";
import { ProjectList } from "./project-list";
import { PageTemplate } from "@/components/page-template";
import { Plus } from "lucide-react";
import { type Metadata } from "next";
import React from "react";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { NewProjectButton } from "@/components/new-project-button";

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
    <PageTemplate name="My Projects" rightSide={<NewProjectButton />}>
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

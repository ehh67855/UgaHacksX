import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getAuthToken, getLogin } from "@/services/BackendService";
import ProjectDetails from "./project-details";
import VersionHistory from "./version-history";
import CommentSection from "./comment-section";
import {
  getProjectDetails,
  getProjectVersions,
  getProjectComments,
} from "./data";
import { PageTemplate } from "@/components/page-template";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "View Project",
}

export default async function ViewProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("No token");
  }
  const currentUser = await getLogin(token);
  if (!currentUser) {
    throw new Error("No currentUser");
  }

  try {
    const [project, versions, comments] = await Promise.all([
      getProjectDetails(params.id, token),
      getProjectVersions(params.id, token),
      getProjectComments(params.id, token),
    ]);

    if (!project) {
      notFound();
    }

    return (
      <PageTemplate name="View Project">
        <ProjectDetails project={project} />
        <Suspense fallback={<div>Loading versions...</div>}>
          <VersionHistory versions={versions} />
        </Suspense>
        <Suspense fallback={<div>Loading comments...</div>}>
          <CommentSection
            projectId={params.id}
            initialComments={comments}
            isLoggedIn={!!token}
            currentUser={currentUser}
          />
        </Suspense>
      </PageTemplate>
    );
  } catch (error) {
    console.error("Error loading project:", error);
    return <div>Error loading project. Please try again later.</div>;
  }
}

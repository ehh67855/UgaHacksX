import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getVersions } from "./data";
import { VersionList } from "./version-list";
import { UploadForm } from "./upload-form";
import { PageTemplate } from "@/components/page-template";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "My Project",
};

export default async function VersionsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  let versions;
  try {
    versions = await getVersions(id);
  } catch (error) {
    console.error("Error loading versions:", error);
    notFound();
  }

  const latestVersion = versions.length > 0 ? versions[0] : null;
  const olderVersions = versions.slice(1);

  console.log("versions:", versions);
  console.log("olderVersions:", olderVersions);

  return (
    <PageTemplate name="Version Uploads">
      <Suspense fallback={<div>Loading upload form...</div>}>
        <UploadForm projectId={id} />
      </Suspense>

      <Suspense fallback={<div>Loading versions...</div>}>
        <VersionList
          latestVersion={latestVersion}
          olderVersions={olderVersions}
        />
      </Suspense>
    </PageTemplate>
  );
}

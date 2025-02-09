import { type Metadata } from "next";
import { NewProjectForm } from "./form";
import { PageTemplate } from "@/components/page-template";

export const metadata: Metadata = {
  title: "New Project",
};

export default function NewProjectPage() {
  return (
    <PageTemplate name="New Project">
      <NewProjectForm />
    </PageTemplate>
  );
}

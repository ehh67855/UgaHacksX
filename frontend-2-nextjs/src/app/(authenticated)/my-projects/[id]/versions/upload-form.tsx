"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatApiUrl } from "@/lib/utils";

export function UploadForm({ projectId }: { projectId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        formatApiUrl(`/api/projects/${projectId}/upload`),
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "File uploaded successfully!",
        });
        setFile(null);
        router.refresh();
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "File upload failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Input type="file" onChange={handleFileChange} />
          <Button onClick={handleFileUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Add Version"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

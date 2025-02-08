"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getAuthToken, getLogin } from "@/services/BackendService";
import { formatApiUrl } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  file: z.instanceof(File).refine((file) => file.size < 10_000_000, {
    message: "Your file must be less than 10 MB.",
  }),
});

export default function NewProject() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      file: null,
    },
  });

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("file", data.file);
    const authToken = await getAuthToken();
    if (!authToken) {
      throw new Error("Missing auth token.");
    }
    const login = await getLogin(authToken);
    if (!login) {
      throw new Error("Missing login.");
    }
    formData.append("login", login);

    try {
      const response = await fetch(formatApiUrl("/api/projects"), {
        method: "POST",
        body: formData,
      });

      console.log("response:", response);

      const json = await response.json();
      const projectId = json["id"];
      console.log("response JSON:", json);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project uploaded successfully!",
        });

        // redirect
        router.push(`/projects/${projectId}`);
      } else {
        toast({
          title: "Error",
          description: "Failed to upload project.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading project:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-lg p-6 shadow-lg">
        <CardContent>
          <h1 className="text-2xl font-bold text-center mb-4">
            Add New Project
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter project description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Project File</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        placeholder="Project File"
                        type="file"
                        accept=".logicx,.band"
                        onChange={(event) =>
                          onChange(event.target.files && event.target.files[0])
                        }
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      Upload your Logic Pro X or GarageBand project files
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

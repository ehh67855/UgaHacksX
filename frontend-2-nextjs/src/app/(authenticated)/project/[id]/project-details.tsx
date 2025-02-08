import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Project } from '@/types/project'

export default function ProjectDetails({ project }: { project: Project }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>Posted by {project.owner?.login}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{project.description}</p>
      </CardContent>
    </Card>
  )
}

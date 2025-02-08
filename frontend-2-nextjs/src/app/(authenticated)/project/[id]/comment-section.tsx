"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Comment } from "@/types/project"
import { formatApiUrl } from "@/lib/utils"

export default function CommentSection({
  projectId,
  initialComments,
  isLoggedIn,
  currentUser,
}: {
  projectId: string
  initialComments: Comment[]
  isLoggedIn: boolean
  currentUser: string | undefined
}) {
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const router = useRouter()

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const response = await fetch(formatApiUrl(`/api/projects/${projectId}/comments`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          userLogin: currentUser,
        }),
      })

      if (response.ok) {
        const newCommentData = await response.json()
        setComments([...comments, newCommentData])
        setNewComment("")
        router.refresh()
      }
    } catch (error) {
      console.error("Error posting comment:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoggedIn ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              className="mb-2"
            />
            <Button type="submit">Post Comment</Button>
          </form>
        ) : (
          <Alert className="mb-6">
            <AlertDescription>Please log in to leave a comment.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-4">
                  <p>{comment.content}</p>
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>Posted by {comment.userLogin}</span>
                    <span>{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No comments yet. Be the first to provide feedback on this project!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


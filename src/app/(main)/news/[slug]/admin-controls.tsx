"use client";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <div className="text-xl font-semibold">Deleting Article...</div>
        <div className="text-muted-foreground">This may take a few moments</div>
      </div>
    </div>
  );
}

export function AdminControls({ slug, id }: { slug: string; id: string }) {
  const router = useRouter();
  const deleteArticle = api.news.delete.useMutation({
    onSuccess: () => {
      toast.success("Article deleted successfully");
      router.push("/news");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to delete article", {
        description: error.message,
      });
    },
  });

  return (
    <>
      {deleteArticle.isPending && <LoadingOverlay />}
      <div className="mt-6 flex gap-4">
        <Link href={`/admin/edit/news/${slug}`} prefetch={false}>
          <Button variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Article
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="gap-2"
              disabled={deleteArticle.isPending}
            >
              <Trash className="h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                article and all its content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteArticle.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteArticle.mutate({ id })}
                disabled={deleteArticle.isPending}
                className="gap-2 bg-destructive hover:bg-destructive/90"
              >
                {deleteArticle.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash className="h-4 w-4" />
                    Delete Article
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import type { User } from "@prisma/client";
import { useState } from "react";

interface UserRoleActionsProps {
  user: Pick<User, "id" | "name" | "email" | "isAdmin" | "isSuperAdmin">;
  currentUser: Pick<User, "id" | "isSuperAdmin">;
}

export function UserRoleActions({ user, currentUser }: UserRoleActionsProps) {
  const utils = api.useUtils();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [promoteToAdminDialog, setPromoteToAdminDialog] = useState(false);
  const [demoteFromAdminDialog, setDemoteFromAdminDialog] = useState(false);
  const [promoteToSuperAdminDialog, setPromoteToSuperAdminDialog] =
    useState(false);
  const [demoteFromSuperAdminDialog, setDemoteFromSuperAdminDialog] =
    useState(false);

  const makeAdmin = api.user.makeAdmin.useMutation({
    onSuccess: async () => {
      await utils.user.getAllUsers.invalidate();
      toast.success("User has been made an admin");
      setPromoteToAdminDialog(false);
      setSelectedUserId(null);
      setSelectedUserName("");
    },
  });

  const removeAdmin = api.user.removeAdmin.useMutation({
    onSuccess: async () => {
      await utils.user.getAllUsers.invalidate();
      toast.success("Admin privileges have been removed");
      setDemoteFromAdminDialog(false);
      setSelectedUserId(null);
      setSelectedUserName("");
    },
  });

  const makeSuperAdmin = api.user.makeSuperAdmin.useMutation({
    onSuccess: async () => {
      await utils.user.getAllUsers.invalidate();
      toast.success("User has been made a super admin");
      setPromoteToSuperAdminDialog(false);
      setSelectedUserId(null);
      setSelectedUserName("");
    },
  });

  const removeSuperAdmin = api.user.removeSuperAdmin.useMutation({
    onSuccess: async () => {
      await utils.user.getAllUsers.invalidate();
      toast.success("Super admin privileges have been removed");
      setDemoteFromSuperAdminDialog(false);
      setSelectedUserId(null);
      setSelectedUserName("");
    },
  });

  if (!currentUser.isSuperAdmin) return null;

  return (
    <div className="flex items-center justify-end gap-2">
      {!user.isAdmin && !user.isSuperAdmin && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedUserId(user.id);
              setSelectedUserName(user.name ?? user.email);
              setPromoteToAdminDialog(true);
            }}
            className="text-purple-600 hover:text-purple-700"
          >
            Make Admin
          </Button>

          <AlertDialog
            open={promoteToAdminDialog}
            onOpenChange={setPromoteToAdminDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Make User Admin</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to make{" "}
                  <span className="font-medium">{selectedUserName}</span> an
                  admin? They will have access to manage content and
                  applications.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setPromoteToAdminDialog(false);
                    setSelectedUserId(null);
                    setSelectedUserName("");
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => makeAdmin.mutate({ userId: selectedUserId! })}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Make Admin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {user.isAdmin && !user.isSuperAdmin && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedUserId(user.id);
              setSelectedUserName(user.name ?? user.email);
              setPromoteToSuperAdminDialog(true);
            }}
            className="text-blue-600 hover:text-blue-700"
          >
            Make Super Admin
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedUserId(user.id);
              setSelectedUserName(user.name ?? user.email);
              setDemoteFromAdminDialog(true);
            }}
            className="text-red-600 hover:text-red-700"
          >
            Remove Admin
          </Button>

          <AlertDialog
            open={promoteToSuperAdminDialog}
            onOpenChange={setPromoteToSuperAdminDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Make User Super Admin</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to make{" "}
                  <span className="font-medium">{selectedUserName}</span> a
                  super admin? They will have access to manage all users and
                  roles.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setPromoteToSuperAdminDialog(false);
                    setSelectedUserId(null);
                    setSelectedUserName("");
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    makeSuperAdmin.mutate({ userId: selectedUserId! })
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Make Super Admin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={demoteFromAdminDialog}
            onOpenChange={setDemoteFromAdminDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Admin Role</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove admin privileges from{" "}
                  <span className="font-medium">{selectedUserName}</span>? They
                  will no longer have access to admin features.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDemoteFromAdminDialog(false);
                    setSelectedUserId(null);
                    setSelectedUserName("");
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    removeAdmin.mutate({ userId: selectedUserId! })
                  }
                  className="bg-red-600 hover:bg-red-700"
                >
                  Remove Admin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {user.isSuperAdmin && user.id !== currentUser.id && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedUserId(user.id);
              setSelectedUserName(user.name ?? user.email);
              setDemoteFromSuperAdminDialog(true);
            }}
            className="text-red-600 hover:text-red-700"
          >
            Remove Super Admin
          </Button>

          <AlertDialog
            open={demoteFromSuperAdminDialog}
            onOpenChange={setDemoteFromSuperAdminDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove Super Admin Role</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove super admin privileges from{" "}
                  <span className="font-medium">{selectedUserName}</span>? They
                  will no longer have access to user management.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setDemoteFromSuperAdminDialog(false);
                    setSelectedUserId(null);
                    setSelectedUserName("");
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    removeSuperAdmin.mutate({ userId: selectedUserId! })
                  }
                  className="bg-red-600 hover:bg-red-700"
                >
                  Remove Super Admin
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}

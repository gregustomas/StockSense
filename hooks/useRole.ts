import { useAuth } from "@/context/AuthContext";

export function useRole() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const isViewer = user?.role === "viewer";
  const canEdit = isAdmin || isManager;

  return { isAdmin, isManager, isViewer, canEdit };
}

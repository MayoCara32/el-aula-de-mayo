import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutAdmin } from "@/actions/adminAuth";
import { Button } from "@/components/ui/button";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-muted/20">
      <aside className="w-full md:w-64 bg-card border-r border-border/50 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold tracking-tight">Panel Admin</h2>
          <p className="text-sm text-muted-foreground">El aula de Mayo</p>
        </div>
        
        {/* BUG-17 fix: AdminSidebarNav resalta el link activo según la ruta actual */}
        <AdminSidebarNav />

        <div className="p-4 mt-auto border-t border-border/50">
          <form action={logoutAdmin}>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" type="submit">
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}

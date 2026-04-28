import { getAdminDashboardStats, getAdminReviews } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageSquare, Star, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Download } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await getAdminDashboardStats();
  const pendingReviews = await getAdminReviews("pending");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general de tu plataforma.</p>
        </div>
        <Button variant="outline" asChild>
          <a href="/api/export?type=reviews" target="_blank">
            <Download className="w-4 h-4 mr-2" />
            Exportar Opiniones a CSV
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Totales</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opiniones Totales</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes de Revisión</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Opiniones Recientes (Pendientes)</h2>
          <Button variant="outline" asChild>
            <Link href="/admin/reviews">Ver todas</Link>
          </Button>
        </div>
        
        {pendingReviews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingReviews.slice(0, 4).map((review: any) => (
              <Card key={review.id} className="border-amber-500/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{review.student_name || "Anónimo"}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Curso: {review.courses?.name}</p>
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm font-bold">
                      {review.rating} <Star className="w-3 h-3 ml-1 fill-current" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 italic mb-4 line-clamp-3">&quot;{review.comment}&quot;</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Hace {formatDistanceToNow(new Date(review.created_at), { locale: es })}</span>
                    <Button size="sm" asChild>
                      <Link href={`/admin/reviews`}>Moderar</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border/50 rounded-xl p-8 text-center text-muted-foreground">
            No hay opiniones pendientes de revisión. ¡Todo está al día!
          </div>
        )}
      </div>
    </div>
  );
}

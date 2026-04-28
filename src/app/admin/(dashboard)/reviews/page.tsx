import { getAdminReviews, updateReviewStatus, deleteReview } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Star, CheckCircle, XCircle, Trash2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const currentStatus = (searchParams.status as "pending" | "approved" | "rejected") || undefined;
  const reviews = await getAdminReviews(currentStatus);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Opiniones</h1>
        <p className="text-muted-foreground">Modera las opiniones enviadas por los alumnos.</p>
      </div>

      <div className="flex gap-2">
        <Button variant={!currentStatus ? "default" : "outline"} asChild>
          <a href="/admin/reviews">Todas</a>
        </Button>
        <Button variant={currentStatus === "pending" ? "default" : "outline"} asChild>
          <a href="/admin/reviews?status=pending">Pendientes</a>
        </Button>
        <Button variant={currentStatus === "approved" ? "default" : "outline"} asChild>
          <a href="/admin/reviews?status=approved">Aprobadas</a>
        </Button>
        <Button variant={currentStatus === "rejected" ? "default" : "outline"} asChild>
          <a href="/admin/reviews?status=rejected">Rechazadas</a>
        </Button>
      </div>

      <div className="grid gap-6">
        {reviews.length > 0 ? (
          reviews.map((review: any) => (
            <Card key={review.id} className={
              review.status === "pending" ? "border-amber-500/50" :
              review.status === "approved" ? "border-green-500/50" :
              "border-destructive/50"
            }>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{review.student_name || "Anónimo"}</h3>
                        <p className="text-sm text-muted-foreground">Curso: {review.courses?.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enviado hace {formatDistanceToNow(new Date(review.created_at), { locale: es })}
                        </p>
                      </div>
                      <div className="flex items-center text-yellow-500 font-bold bg-yellow-500/10 px-3 py-1 rounded-full">
                        {review.rating} <Star className="w-4 h-4 ml-1 fill-current" />
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg space-y-3 text-sm">
                      <div>
                        <span className="font-semibold block mb-1">Opinión General:</span>
                        <p className="italic text-foreground/80">&quot;{review.comment}&quot;</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/50">
                        <div>
                          <span className="font-semibold block mb-1 text-green-500/80">Lo que más le gustó:</span>
                          <p className="text-muted-foreground">{review.liked_most}</p>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1 text-amber-500/80">Sugerencia de mejora:</span>
                          <p className="text-muted-foreground">{review.improvement_suggestion}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <span className="font-semibold">¿Recomendaría el curso? </span>
                        <span className={review.would_recommend ? "text-green-500" : "text-destructive"}>
                          {review.would_recommend ? "Sí" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-row lg:flex-col gap-2 justify-end lg:justify-start lg:border-l lg:border-border/50 lg:pl-6">
                    <div className="mb-2 hidden lg:block">
                      <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Estado actual</span>
                      <div className="mt-1 font-medium capitalize">
                        {review.status === "pending" && <span className="text-amber-500">Pendiente</span>}
                        {review.status === "approved" && <span className="text-green-500">Aprobada</span>}
                        {review.status === "rejected" && <span className="text-destructive">Rechazada</span>}
                      </div>
                    </div>

                    {review.status !== "approved" && (
                      <form action={async () => { "use server"; await updateReviewStatus(review.id, "approved"); }} className="w-full">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" /> Aprobar
                        </Button>
                      </form>
                    )}
                    
                    {review.status !== "rejected" && (
                      <form action={async () => { "use server"; await updateReviewStatus(review.id, "rejected"); }} className="w-full">
                        <Button variant="outline" className="w-full hover:bg-destructive/10 hover:text-destructive" size="sm">
                          <XCircle className="w-4 h-4 mr-2" /> Rechazar
                        </Button>
                      </form>
                    )}

                    <form action={async () => { "use server"; await deleteReview(review.id); }} className="w-full mt-auto lg:mt-4">
                      <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center p-12 bg-card border border-border/50 rounded-xl">
            <p className="text-muted-foreground">No hay opiniones que coincidan con este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
}

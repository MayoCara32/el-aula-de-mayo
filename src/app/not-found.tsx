import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-8">
        <GraduationCap className="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 className="text-6xl font-black tracking-tight mb-4 text-foreground">404</h1>
      <h2 className="text-2xl font-bold tracking-tight mb-6">Página no encontrada</h2>
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 leading-relaxed">
        Lo sentimos, la página que buscas no existe o ha sido movida. Es posible que el curso haya finalizado o la URL sea incorrecta.
      </p>
      <Button asChild size="lg" className="h-12 px-8">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a la página principal
        </Link>
      </Button>
    </div>
  );
}

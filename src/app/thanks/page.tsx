import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ThanksPage() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-2xl text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-4">¡Muchas gracias!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Tu opinión ha sido enviada con éxito. Será revisada brevemente antes de publicarse en la página.
        Agradezco mucho tu tiempo para ayudarme a mejorar.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/">Volver al inicio</Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/courses">Ver más cursos</Link>
        </Button>
      </div>
    </div>
  );
}

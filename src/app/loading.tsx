import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full text-muted-foreground space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-lg font-medium animate-pulse">Cargando...</p>
    </div>
  );
}

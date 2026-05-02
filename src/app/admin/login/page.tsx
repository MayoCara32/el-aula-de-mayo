"use client";

import { useState } from "react";
import { loginAdmin } from "@/actions/adminAuth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await loginAdmin(formData);

      if (result?.error) {
        setError(result.error);
      }
      // Si el login es exitoso, loginAdmin() llama a redirect() del lado del servidor
      // lo que lanza un error especial de Next.js (NEXT_REDIRECT) — es el comportamiento esperado.
    } catch (err: any) {
      // El error NEXT_REDIRECT es parte normal del flujo de redirect de Next.js
      // Solo mostramos error si NO es un redirect
      if (!err?.message?.includes('NEXT_REDIRECT')) {
        setError("Error de conexión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-10 rounded-2xl border border-border/50 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative overflow-hidden rounded-full border border-border mb-4">
            <Image 
              src="/logo.jpg" 
              alt="Logo El aula de Mayo" 
              fill 
              className="object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-foreground">
            Acceso Administrador
          </h2>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="username" className="sr-only">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Usuario"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Entrar al Panel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

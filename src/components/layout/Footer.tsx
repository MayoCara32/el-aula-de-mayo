import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p className="mb-4">
          © {new Date().getFullYear()} El aula de Mayo. Desarrollado para Marcos Guillermo Castrejón Ramírez.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/admin/login" className="hover:text-foreground transition-colors">
            Acceso Administrador
          </Link>
        </div>
      </div>
    </footer>
  );
}

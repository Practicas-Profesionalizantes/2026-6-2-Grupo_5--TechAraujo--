import {useState} from "react";
import {Login} from "lucide-react";
import type {Usuario, RolUsuario} from "../types";

interface PropiedadesLogin{alIniciarSesion:(usuario: Usuario) => void;
    cambiarARegistro: () => void;
    listaUsuario: Usuario[];
}

export function Login ({alIniciarSesion, cambiarARegistro, listaUsuarios,}: PropiedadesLogin){                              
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mensajeError, setMensajeError] = useState("");

    const manejarEnvio = (evento: React.FormEvent) => {
        evento.preventDefeault();
        setMensajeError("");

    const usuarioEncontrado = listaUsuarios.find(
        (usuario) => usuario.email === correo && usuario.contrasena === contrasena); 
        if (usuarioEncontrado){
            alIniciarSesion(usuarioEncontrado)
        }   else{
            setMensajeError("Email o contrasena incorrectos");
        }
    };
    
};
return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">TechRepair</h1>
          <p className="text-sm text-muted-foreground">
            Sistema de Gestion de Reparaciones
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl mb-6">Iniciar Sesion</h2>

          <button
            type="button"
            onClick={iniciarSesionGoogle}
            className="w-full mb-4 px-4 py-2.5 text-sm bg-background border border-border rounded-md hover:bg-muted transition-colors flex items-center justify-center gap-2.5 text-foreground"
          >
            <IconoGoogle />
            Continuar con Google
          </button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center">
              <span className="px-2 bg-card text-xs text-muted-foreground">
                o inicia sesion con email
              </span>
            </div>
          </div>

          <form onSubmit={manejarEnvio} className="space-y-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">
                Email
              </label>

              <input
                type="email"
                required
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="usuario@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">
                Contrasena
              </label>

              <input
                type="password"
                required
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
                className="w-full px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>

            {mensajeError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-xs text-red-600 dark:text-red-400">
                  {mensajeError}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2.5 text-sm bg-foreground text-background rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Iniciar Sesion
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              No tienes cuenta?{" "}
              <button
                onClick={cambiarARegistro}
                className="text-foreground hover:underline"
              >
                Registrate aqui
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
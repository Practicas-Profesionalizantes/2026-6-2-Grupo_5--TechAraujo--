import { useState } from "react";
import { X, Download, MessageSquare, Check } from "lucide-react";
import { Chat } from "./chat"; // Componente modular del chat
import type { Computadora, Usuario, Mensaje } from "../types"; 

interface PropiedadesDetallesPC {
  computadora: Computadora;
  alCerrar: () => void;
  alActualizar: (actualizaciones: Partial<Computadora>) => void;
  alExportarPDF: (computadora: Computadora) => void;
  usuarioActual: Usuario;
  tecnicos: Usuario[];
  alEnviarMensaje: (mensaje: Mensaje) => void;
}

export function PCDetails({ 
  computadora, 
  alCerrar, 
  alActualizar, 
  alExportarPDF, 
  usuarioActual, 
  tecnicos, 
  alEnviarMensaje 
}: PropiedadesDetallesPC) {
  const [mostrarChat, setMostrarChat] = useState(false);

  const listaEstados = [
    { valor: "received", etiqueta: "Recibida" },
    { valor: "diagnosing", etiqueta: "Diagnóstico" },
    { valor: "repairing", etiqueta: "Reparación" },
    { valor: "ready", etiqueta: "Lista" },
    { valor: "delivered", etiqueta: "Entregada" }
  ];

  const esAdministrador = usuarioActual.role === "administrador";
  const esTecnico = usuarioActual.role === "tecnico";
  const esTecnicoAsignado = computadora.assignedTechnicianId === usuarioActual.id;
  const puedeAccederAlChat = esAdministrador || esTecnicoAsignado;

  const tecnicoAsignado = computadora.assignedTechnicianId
    ? tecnicos.find(t => t.id === computadora.assignedTechnicianId)
    : null;

  const manejarEnvioMensaje = (texto: string) => {
    const nuevoMensaje: Mensaje = {
      id: crypto.randomUUID(),
      text: texto,
      senderId: usuarioActual.id,
      senderName: usuarioActual.name,
      timestamp: new Date().toISOString()
    };
    alEnviarMensaje(nuevoMensaje);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border w-full max-w-4xl h-[85vh] rounded-xl shadow-lg flex overflow-hidden">
        
        {/* Sección Principal de Detalles del Dispositivo */}
        <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{computadora.client}</h2>
              <p className="text-sm text-muted-foreground">{computadora.brand} {computadora.model}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alExportarPDF(computadora)}
                className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                title="Exportar como PDF"
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={alCerrar}
                className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Control del Estado del Equipo */}
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Estado del Servicio</h3>
              <select
                value={computadora.status}
                onChange={(e) => alActualizar({ status: e.target.value as Computadora["status"] })}
                disabled={!esAdministrador && !esTecnicoAsignado}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-sm text-foreground disabled:opacity-60"
              >
                {listaEstados.map((estado) => (
                  <option key={estado.valor} value={estado.valor}>{estado.etiqueta}</option>
                ))}
              </select>
            </section>

            {/* Asignación de Técnico Responsable */}
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Técnico Asignado</h3>
              <select
                value={computadora.assignedTechnicianId || ""}
                onChange={(e) => alActualizar({ assignedTechnicianId: e.target.value || null })}
                disabled={!esAdministrador}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-sm text-foreground disabled:opacity-60"
              >
                <option value="">Sin asignar</option>
                {tecnicos.map((tecnico) => (
                  <option key={tecnico.id} value={tecnico.id}>{tecnico.name}</option>
                ))}
              </select>
            </section>

            {/* Ficha de Presupuesto */}
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Presupuesto Estimado</h3>
              <input
                type="text"
                value={computadora.budget}
                onChange={(e) => alActualizar({ budget: e.target.value })}
                disabled={!esAdministrador && !esTecnicoAsignado}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-sm text-foreground disabled:opacity-60"
                placeholder="$0.00"
              />
            </section>

            {/* Cuadro de Diagnóstico Técnico */}
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Diagnóstico Técnico</h3>
              <textarea
                value={computadora.diagnosis}
                onChange={(e) => alActualizar({ diagnosis: e.target.value })}
                disabled={!esAdministrador && !esTecnicoAsignado}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-sm resize-none text-foreground disabled:opacity-60"
                rows={4}
                placeholder="Escribe el diagnóstico del hardware..."
              />
            </section>

            {/* Notas Operativas Internas */}
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Notas Internas</h3>
              <textarea
                value={computadora.notes}
                onChange={(e) => alActualizar({ notes: e.target.value })}
                disabled={!esAdministrador && !esTecnicoAsignado}
                className="w-full px-3 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring text-sm resize-none text-foreground disabled:opacity-60"
                rows={4}
                placeholder="Notas adicionales sobre la reparación..."
              />
            </section>
          </div>

          {/* Botón Flotante para Desplegar el Chat */}
          {puedeAccederAlChat && !mostrarChat && (
            <div className="p-4 bg-muted/50 border-t border-border flex justify-end">
              <button
                onClick={() => setMostrarChat(true)}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm rounded-md hover:opacity-90 transition-opacity"
              >
                <MessageSquare className="w-4 h-4" />
                Ver Chat de Soporte
              </button>
            </div>
          )}
        </div>

        {/* Sección del Panel del Chat Modular Opcional */}
        {mostrarChat && puedeAccederAlChat && (
          <div className="w-[380px] h-full flex flex-col bg-muted/30 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-background">
              <div className="flex items-center gap-2 text-foreground font-medium text-sm">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                Canal de Soporte Directo
              </div>
              <button
                onClick={() => setMostrarChat(false)}
                className="p-1 hover:bg-muted text-muted-foreground rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Chat
                messages={computadora.messages || []}
                currentUser={usuarioActual}
                onSendMessage={manejarEnvioMensaje}
                otherUserName={computadora.client}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
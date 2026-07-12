import { useState } from "react";
import { Check, X, Clock, Plus, MessageSquare, Edit } from "lucide-react";
import { Chat } from "./chat";
import { TicketDetailsModal } from "./ticket-details-modal";
import { AssignTechnicianModal } from "./assign-technician-modal";
import type { SolicitudTicket, Usuario, PC, Mensaje } from "../types";

interface PendingTicketsProps {
  tickets: SolicitudTicket[];
  onAccept: (ticketId: string, technicianId: string) => void;
  onReject: (ticketId: string) => void;
  onNewTicket: () => void;
  currentUser: Usuario;
  pcs: PC[];
  onSendMessage: (pcId: string, message: Mensaje) => void;
  onCompleteTicket: (ticketId: string, brand: string, model: string) => void;
  technicians: Usuario[];
}

export function PendingTickets({ tickets, onAccept, onReject, onNewTicket, currentUser, pcs, onSendMessage, onCompleteTicket, technicians }: PendingTicketsProps) {
  const isTech = currentUser.rol === "tecnico";
  const [filter, setFilter] = useState<"all" | "nuevo" | "pendiente" | "aprobado" | "rechazado">(isTech ? "pendiente" : "nuevo");
  const [selectedTicketForChat, setSelectedTicketForChat] = useState<string | null>(null);
  const [selectedTicketForEdit, setSelectedTicketForEdit] = useState<string | null>(null);
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<string | null>(null);

  const iscliente = currentUser.rol === "clientee";
  const isAdmin = currentUser.rol === "administrador";
  const isTechnician = currentUser.rol === "tecnico";
  const isTechnicianOrAdmin = currentUser.rol === "tecnico" || currentUser.rol === "administrador";

  
  let visibleTickets = tickets;

  if (iscliente) {
    
    visibleTickets = tickets.filter(t => t.email === currentUser.email || t.cliente === currentUser.nombre);
  } else if (isTechnician) {
    
    visibleTickets = tickets.filter(t => t.tecnicoAsignadoId === currentUser.id);
  }

  const filteredTickets = iscliente
    ? visibleTickets
    : (filter === "all" ? visibleTickets : visibleTickets.filter(t => t.status === filter));

  const selectedTicket = selectedTicketForChat
    ? tickets.find(t => t.id === selectedTicketForChat)
    : null;

  const ticketToEdit = selectedTicketForEdit
    ? tickets.find(t => t.id === selectedTicketForEdit)
    : null;

  const ticketToAssign = selectedTicketForAssign
    ? tickets.find(t => t.id === selectedTicketForAssign)
    : null;

  const selectedPC = selectedTicket?.pcId
    ? pcs.find(pc => pc.id === selectedTicket.pcId)
    : null;

  const handleSendMessage = (text: string) => {
    if (!selectedPC) return;

    const message: Mensaje = {
      id: `MSG-${Date.now()}`,
      senderId: currentUser.id,
      sendernombre: currentUser.nombre,
      senderrol: currentUser.rol,
      text,
      timestamp: new Date().toISOString()
    };
    onSendMessage(selectedPC.id, message);
  };

  if (iscliente && selectedTicketForChat && selectedTicket && selectedPC) {
    const assignedTech = selectedPC.tecnicoAsignadoId
      ? pcs.find(pc => pc.id === selectedPC.id)?.tecnicoAsignadoId
      : null;

    return (
      <div classnombre="flex-1 bg-card flex flex-col">
        <div classnombre="p-6 border-b border-border">
          <div classnombre="flex items-center justify-between">
            <div>
              <h1 classnombre="mb-1">Chat - {selectedTicket.id}</h1>
              <p classnombre="text-sm text-muted-foreground">
                {selectedTicket.brand} {selectedTicket.model}
              </p>
            </div>
            <button
              onClick={() => setSelectedTicketForChat(null)}
              classnombre="text-sm text-muted-foreground hover:text-foreground"
            >
              Volver
            </button>
          </div>
        </div>
        <div classnombre="flex-1">
          <Chat
            messages={selectedPC.messages}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            otherUsernombre={assignedTech ? "Técnico" : undefined}
          />
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "nuevo":
        return (
          <span classnombre="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded">
            Nuevo
          </span>
        );
      case "pendiente":
        return (
          <span classnombre="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded">
            <Clock classnombre="w-3 h-3" />
            Pendiente
          </span>
        );
      case "aprobado":
        return (
          <span classnombre="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-500/10 text-green-600 dark:text-green-400 rounded">
            <Check classnombre="w-3 h-3" />
            Aprobado
          </span>
        );
      case "rechazado":
        return (
          <span classnombre="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-red-500/10 text-red-600 dark:text-red-400 rounded">
            <X classnombre="w-3 h-3" />
            Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div classnombre="flex-1 bg-card overflow-y-auto">
      <div classnombre="p-4 sm:p-6">
        <div classnombre="flex items-start justify-between gap-3 mb-6">
          <div classnombre="min-w-0">
            <h1 classnombre="mb-1">{iscliente ? "Mis Solicitudes" : "Pedidos Pendientes"}</h1>
            <p classnombre="text-sm text-muted-foreground">
              {iscliente ? "Seguimiento de tus solicitudes" : "Solicitudes de reparación de clientees"}
            </p>
          </div>
          <button
            onClick={onNewTicket}
            classnombre="flex-shrink-0 px-3 py-2 text-sm bg-foreground text-background rounded-md hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            <Plus classnombre="w-4 h-4" />
            <span classnombre="hidden sm:inline">Nueva Solicitud</span>
            <span classnombre="sm:hidden">Nueva</span>
          </button>
        </div>

        {isTechnicianOrAdmin && (
          <div classnombre="flex flex-wrap gap-2 mb-6">
            {isAdmin && (
              <button
                onClick={() => setFilter("nuevo")}
                classnombre={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  filter === "nuevo"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Nuevos ({visibleTickets.filter(t => t.status === "nuevo").length})
              </button>
            )}
            <button
              onClick={() => setFilter("pendiente")}
              classnombre={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                filter === "pendiente"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Pendientes ({visibleTickets.filter(t => t.status === "pendiente").length})
            </button>
            <button
              onClick={() => setFilter("rechazado")}
              classnombre={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                filter === "rechazado"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Rechazados ({visibleTickets.filter(t => t.status === "rechazado").length})
            </button>
            <button
              onClick={() => setFilter("all")}
              classnombre={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                filter === "all"
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Todos ({visibleTickets.length})
            </button>
          </div>
        )}

        <div classnombre="space-y-3">
          {filteredTickets.length === 0 ? (
            <div classnombre="text-center py-12 text-muted-foreground">
              {iscliente ? "No tienes solicitudes aún" : `No hay solicitudes ${filter !== "all" ? filter : ""}`}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                classnombre="p-4 bg-muted border border-border rounded-lg"
              >
                <div classnombre="flex items-start justify-between gap-2 mb-3">
                  <div classnombre="min-w-0">
                    <div classnombre="flex flex-wrap items-center gap-2 mb-1">
                      <span classnombre="text-sm font-medium text-foreground">{ticket.id}</span>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p classnombre="text-xs text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleString('es-AR')}
                    </p>
                  </div>

                  <div classnombre="flex gap-1.5 flex-shrink-0">
                    {isAdmin && ticket.status === "nuevo" && (
                      <>
                        <button
                          onClick={() => setSelectedTicketForAssign(ticket.id)}
                          classnombre="p-1.5 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 rounded transition-colors"
                          title="Aceptar y asignar técnico"
                        >
                          <Check classnombre="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onReject(ticket.id)}
                          classnombre="p-1.5 bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                          title="Rechazar"
                        >
                          <X classnombre="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {isTechnicianOrAdmin && ticket.status === "pendiente" && (
                      <button
                        onClick={() => setSelectedTicketForEdit(ticket.id)}
                        classnombre="p-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                        title="Completar información"
                      >
                        <Edit classnombre="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <dl classnombre="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-3">
                  <div>
                    <dt classnombre="text-xs text-muted-foreground">Tipo</dt>
                    <dd classnombre="text-sm text-foreground capitalize">
                      {ticket.deviceType === "pc" ? "PC de escritorio" : "Laptop"}
                    </dd>
                  </div>
                  <div>
                    <dt classnombre="text-xs text-muted-foreground">clientee</dt>
                    <dd classnombre="text-sm text-foreground truncate">{ticket.cliente}</dd>
                  </div>
                  {ticket.phone && (
                    <div>
                      <dt classnombre="text-xs text-muted-foreground">Teléfono</dt>
                      <dd classnombre="text-sm text-foreground">{ticket.phone}</dd>
                    </div>
                  )}
                  {isTechnicianOrAdmin && (
                    <div classnombre={ticket.phone ? "" : "col-span-2"}>
                      <dt classnombre="text-xs text-muted-foreground">Email</dt>
                      <dd classnombre="text-sm text-foreground truncate">{ticket.email}</dd>
                    </div>
                  )}
                  
                  {ticket.tecnicoAsignadoId && (
                    <div classnombre="col-span-2">
                      <dt classnombre="text-xs text-muted-foreground">Técnico asignado</dt>
                      <dd classnombre="text-sm text-foreground">
                        {technicians.find(t => t.id === ticket.tecnicoAsignadoId)?.nombre || "No encontrado"}
                      </dd>
                    </div>
                  )}
                  {ticket.brand && ticket.model && (
                    <>
                      <div>
                        <dt classnombre="text-xs text-muted-foreground">Marca</dt>
                        <dd classnombre="text-sm text-foreground">{ticket.brand}</dd>
                      </div>
                      <div>
                        <dt classnombre="text-xs text-muted-foreground">Modelo</dt>
                        <dd classnombre="text-sm text-foreground">{ticket.model}</dd>
                      </div>
                    </>
                  )}
                </dl>

                <div>
                  <p classnombre="text-xs text-muted-foreground mb-1">Problema reportado</p>
                  <p classnombre="text-sm text-foreground bg-background p-3 rounded border border-border break-words">
                    {ticket.problem}
                  </p>
                </div>

                {iscliente && ticket.status === "aprobado" && ticket.pcId && (
                  <div classnombre="mt-3 pt-3 border-t border-border">
                    <button
                      onClick={() => setSelectedTicketForChat(ticket.id)}
                      classnombre="w-full px-3 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageSquare classnombre="w-4 h-4" />
                      Chat con Técnico
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {ticketToEdit && (
        <TicketDetailsModal
          ticket={ticketToEdit}
          onClose={() => setSelectedTicketForEdit(null)}
          onUpdate={onCompleteTicket}
        />
      )}

      {ticketToAssign && (
        <AssignTechnicianModal
          ticket={ticketToAssign}
          technicians={technicians}
          onClose={() => setSelectedTicketForAssign(null)}
          onAssign={onAccept}
        />
      )}
    </div>
  );
}

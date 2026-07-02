import { useState } from "react";
import { X, UserCheck } from "lucide-react";
import type { SolicitudTicket, Usuario } from "../types";

interface AssignTechnicianModalProps {
  ticket: SolicitudTicket;
  technicians: Usuario[];
  onClose: () => void;
  onAssign: (ticketId: string, technicianId: string) => void;
}

export function AssignTechnicianModal({
  ticket,
  technicians,
  onClose,
  onAssign
}: AssignTechnicianModalProps) {
  const [selectedTechId, setSelectedTechId] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTechId) {
      onAssign(ticket.id, selectedTechId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-md mx-4 rounded-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-medium text-foreground">
            Asignar Técnico - {ticket.id}
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-muted rounded-md space-y-2">
            <div>
              <span className="text-xs text-muted-foreground">
                Cliente:
              </span>{" "}
              <span className="text-sm text-foreground">
                {ticket.cliente}
              </span>
            </div>

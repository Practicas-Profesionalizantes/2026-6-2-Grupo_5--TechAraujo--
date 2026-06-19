export interface Mensaje {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: rol_usuario;
    text: string;
    timestamp: string;
}

export interface PC {
    id: string;
    cliente: string;
    contacto: string;
    marca: string;
    modelo: string;
    estados: "recibida"|"diagnosticando"|"reparando"|"lista"|"entregada";
    componentes: Array<{
        nombre: string;
        precio: string;
        checked: boolean;
    }>;
    repairs:Array<{
        descripcion: string;
        lista: boolean;
    }>;
    preciototal: string;
    budget: string;
    diagnostico: string;
    notas: string;
    tecnicoasignadoId: string;
    mensaje: Mensaje[]
    createdAt: string;
}

export interface TicketRequest {
    id:string;
    cliente: string;
    telefono: string;
    email: string;
    tipo_de_pc: "pc"|"laptop";
    marca: string;
    modelo: string;
    problema: string;
    estado: "nuevo"|"pendiente"|"aprobado"|"rechazado";
    tecnicoasignadoId: string;
    pcID: string;
    createdAt: string;
}
export type rol_usuario= "cliente"|"tecnico"|"administrador";
export interface usuario {
    id:string;
    email:string;
    telefono:string;
    contraseña:string;
    role: rol_usuario;
    createdAt: string;
}
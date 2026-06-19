import {useState} from "react";
import {usuarios, shield, UserCog, usuario as Usercon} from "lucide-react";
import type {usuario, rol_usuario} from "../types";

interface GestionDeUsuarioProps {
    usuarios: usuario[];
    usuarioConcurente: usuario;
    onUpdaterol_usuario: (usuarioid: string, nuevorol: rol_usuario) => void;
}

export function GestionDeUsuario ({usuarios, usuarioConcurente, onUpdaterol_usuario}: GestionDeUsuarioProps){
    const [filtro, setfiltro]= useState<"todo"|rol_usuario>("todo");
    const filtroDeUsuario = filtro === "todo" ? usuarios : usuarios.filter(u => u.role === filtro)
}


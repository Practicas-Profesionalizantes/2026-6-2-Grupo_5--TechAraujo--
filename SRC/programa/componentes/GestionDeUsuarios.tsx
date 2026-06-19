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
    const filtroDeUsuario = filtro === "todo" ? usuarios : usuarios.filter(u => u.role === filtro);
    const getRoleCon = (role: rol_usuario) => {switch(role)
        {case"administrador": return <shield className= "w-4 h-4"/>; 
            case "tecnico": return <UserCog className= "w-4 h-4" />; 
            case "cliente": return <Usercon className= "w-4 h-4" />;}
    };

    const getRoleBadge = (role: rol_usuario) => {
        const colors ={administrador: "bg-purple-500/10 text-purple-600 dark:text.purple-400",
            tecnico : "bg-blue-500/10 text-blue-600 dark:text.blue-400",
            cliente : "bg-gray-500/10 text-gray-600 dark:text.gray-400",
        };
        return(
            <span className= {inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded ${colors[role]}}>
            {getRolecon(role)}
            {role.charAt(0).toUpperCase()+ getRoleBadge.slice(1)}</span>
        )
    }

}

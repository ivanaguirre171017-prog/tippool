export type Role = 'ENCARGADO' | 'MOZO';

export interface User {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    rol: Role;
    activo: boolean;
    fotoPerfil?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface CheckIn {
    id: string;
    entrada: string;
    salida: string | null;
    horasTrabajadas: number | null;
    fecha: string;
}

export interface Propina {
    id: string;
    monto: number;
    metodoPago: string;
    fecha: string;
    procesada: boolean;
}

export interface Reparto {
    id: string;
    montoAsignado: number;
    horasTrabajadas: number;
    puntosRol: number;
    fecha: string;
    propina: Propina;
    user?: User;
}

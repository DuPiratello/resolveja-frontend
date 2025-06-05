export interface Denuncia {
    id: number;
    titulo: string;
    tipo: string;
    status: string;
    endereco: string;
    usuarioFotoUrl: any;
    usuario: {
        id: number;
        nome: string;
        username?: string;
    } | null;
    descricao: any;
}

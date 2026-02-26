import { 
  TipoOficina, 
  StatusOficina, 
  CorAdministradora, 
  Segmento, 
  Turno, 
  Turma 
} from '@/constants/enums';

export interface UserDTO {
  id?: number;
  userId?: number;
  nome: string;
  email?: string;
  role: 'ROOT' | 'ADMIN' | 'USER'; 
  corAdministradora?: CorAdministradora | null;
  ativo?: boolean;
}

export interface Oficina {
  id: number;
  escola: string;
  cidade: string;
  data: string;
  tipo: TipoOficina;
  status: StatusOficina;
  criadorNome?: string;
  corCriador?: CorAdministradora;
  instrutores?: string[];
  avaliacaoEscola?: number | null;
  quantitativoAluno?: number | null;
  acompanhanteTurma?: string;
  contatoEscola?: string;
  segmento?: Segmento;
  turno?: Turno;
  turma?: Turma;
  motivoCancelamento?: string;
}

export interface PageResponse<T> {
  items?: T[];
  content?: T[];
  totalElements?: number;
  totalPages?: number;
}
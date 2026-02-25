export interface UserDTO {
  id?: number;
  userId?: number;
  nome: string;
  email?: string;
  role: 'ROOT' | 'ADMIN' | 'USER';
  corAdministradora?: string | null;
  ativo?: boolean;
}

export interface Oficina {
  id: number;
  escola: string;
  cidade: string;
  data: string;
  tipo: 'STORY_STARTER' | 'MAKER_ROBOTICA_O_QUE_E_PAEBM_8ANO_AO_3SERIE_EM' | 'ROBOTICA_LOGISTICA_VALE_6ANO_AO_SUPERIOR' | 'ROBOTICA_PELOTIZACAO_VALE_6ANO_AO_SUPERIOR' | 'ROBOTICA_MINERACAO_VALE_6ANO_AO_SUPERIOR';
  status: 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';
  criadorNome?: string;
  corCriador?: string;
  instrutores?: string[];
  avaliacaoEscola?: number | null;
  quantitativoAluno?: number | null;
  acompanhanteTurma?: string;
  contatoEscola?: string;
  segmento?: string;
  turno?: string;
  turma?: string;
}

export interface PageResponse<T> {
  items?: T[];
  content?: T[];
  totalElements?: number;
  totalPages?: number;
}

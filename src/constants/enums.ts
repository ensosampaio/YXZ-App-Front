// --- TIPO DE OFICINA ---
export enum TipoOficina {
  STORY_STARTER = 'STORY_STARTER',
  MAKER_ROBOTICA = 'MAKER_ROBOTICA_O_QUE_E_PAEBM_8ANO_AO_3SERIE_EM',
  ROBOTICA_LOGISTICA = 'ROBOTICA_LOGISTICA_VALE_6ANO_AO_SUPERIOR',
  ROBOTICA_PELOTIZACAO = 'ROBOTICA_PELOTIZACAO_VALE_6ANO_AO_SUPERIOR',
  ROBOTICA_MINERACAO = 'ROBOTICA_MINERACAO_VALE_6ANO_AO_SUPERIOR'
}

export const TIPO_OFICINA_LABELS: Record<TipoOficina, string> = {
  [TipoOficina.STORY_STARTER]: 'Story Starter',
  [TipoOficina.MAKER_ROBOTICA]: 'Maker Robótica',
  [TipoOficina.ROBOTICA_LOGISTICA]: 'Robótica Logística',
  [TipoOficina.ROBOTICA_PELOTIZACAO]: 'Robótica Pelotização',
  [TipoOficina.ROBOTICA_MINERACAO]: 'Robótica Mineração',
};

// --- STATUS DA OFICINA ---
export enum StatusOficina {
  AGENDADA = 'AGENDADA',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export const STATUS_OFICINA_LABELS: Record<StatusOficina, string> = {
  [StatusOficina.AGENDADA]: 'Agendada',
  [StatusOficina.CONCLUIDA]: 'Concluída',
  [StatusOficina.CANCELADA]: 'Cancelada',
};

// --- COR ADMINISTRADORA ---
export enum CorAdministradora {
  ROSA = 'ROSA',
  AZUL_CEU = 'AZUL_CEU',
  AMBAR = 'AMBAR',
  ROXO_ROOT = 'ROXO_ROOT'
}

export const COR_ADMIN_LABELS: Record<CorAdministradora, string> = {
  [CorAdministradora.ROSA]: 'Rosa',
  [CorAdministradora.AZUL_CEU]: 'Azul Céu',
  [CorAdministradora.AMBAR]: 'Âmbar',
  [CorAdministradora.ROXO_ROOT]: 'Roxo Root',
};

// --- SEGMENTO ---
export enum Segmento {
  INFANTIL = 'INFANTIL',
  FUNDAMENTAL = 'FUNDAMENTAL',
  MEDIO = 'MEDIO',
  EJA = 'EJA',
  TECNICO = 'TECNICO',
  SUPERIOR = 'SUPERIOR'
}

export const SEGMENTO_LABELS: Record<Segmento, string> = {
  [Segmento.INFANTIL]: 'Infantil',
  [Segmento.FUNDAMENTAL]: 'Fundamental',
  [Segmento.MEDIO]: 'Médio',
  [Segmento.EJA]: 'EJA',
  [Segmento.TECNICO]: 'Técnico',
  [Segmento.SUPERIOR]: 'Superior',
};

// --- TURNO ---
export enum Turno {
  MATUTINO = 'MATUTINO',
  VESPERTINO = 'VESPERTINO',
  NOTURNO = 'NOTURNO'
}

export const TURNO_LABELS: Record<Turno, string> = {
  [Turno.MATUTINO]: 'Matutino',
  [Turno.VESPERTINO]: 'Vespertino',
  [Turno.NOTURNO]: 'Noturno',
};

// --- TURMA ---
export enum Turma {
  _6ANO = '_6ANO',
  _7ANO = '_7ANO',
  _8ANO = '_8ANO',
  _9ANO = '_9ANO',
  _1ANOEM = '_1ANOEM',
  _2ANOEM = '_2ANOEM',
  _3ANOEM = '_3ANOEM',
  EJA = 'EJA',
  TECNICO = 'TECNICO',
  SUPERIOR = 'SUPERIOR'
}

export const TURMA_LABELS: Record<Turma, string> = {
  [Turma._6ANO]: '6º Ano',
  [Turma._7ANO]: '7º Ano',
  [Turma._8ANO]: '8º Ano',
  [Turma._9ANO]: '9º Ano',
  [Turma._1ANOEM]: '1º Ano EM',
  [Turma._2ANOEM]: '2º Ano EM',
  [Turma._3ANOEM]: '3º Ano EM',
  [Turma.EJA]: 'EJA',
  [Turma.TECNICO]: 'Técnico',
  [Turma.SUPERIOR]: 'Superior',
};
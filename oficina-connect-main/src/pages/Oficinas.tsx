import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api, { extractErrorMessage } from '@/lib/api';
import type { Oficina, PageResponse } from '@/types';
import { Plus, Search, X, Pencil } from 'lucide-react';
import ModalNovaOficina from '@/components/ModalNovaOficina';
import ModalEditarOficina from '@/components/ModalEditarOficina';

export default function Oficinas() {
  const { user } = useAuth();
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [oficinaEditando, setOficinaEditando] = useState<Oficina | null>(null);
  const [error, setError] = useState('');
  const [filtroCidade, setFiltroCidade] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCor, setFiltroCor] = useState('');

  const fetchOficinas = async () => {
    setError('');
    try {
      let endpoint = '/oficinas?page=0&size=500';
      if (filtroStatus) endpoint = `/oficinas/filtrar/status?status=${filtroStatus}&page=0&size=500`;
      else if (filtroCor && user?.role === 'ADMIN') endpoint = `/oficinas/filtrar/cor?cor=${filtroCor}&page=0&size=500`;
      else if (filtroCidade || filtroTipo) {
        endpoint = `/oficinas/filtrar?page=0&size=500`;
        if (filtroCidade) endpoint += `&cidade=${encodeURIComponent(filtroCidade)}`;
        if (filtroTipo) endpoint += `&tipo=${filtroTipo}`;
      }
      const res = await api.get<PageResponse<Oficina>>(endpoint);
      setOficinas(res.data.items || res.data.content || []);
    } catch (error) {
      setError(extractErrorMessage(error, 'Falha ao carregar as oficinas.'));
    }
  };

  useEffect(() => { fetchOficinas(); }, []);

  const limparFiltros = async () => {
    setFiltroCidade(''); setFiltroTipo(''); setFiltroStatus(''); setFiltroCor('');
    try {
      const res = await api.get<PageResponse<Oficina>>('/oficinas?page=0&size=500');
      setOficinas(res.data.items || res.data.content || []);
    } catch (error) { 
      setError(extractErrorMessage(error, 'Falha ao limpar filtros.')); 
    }
  };

  const getCorBorda = (cor?: string) => {
    switch (cor) {
      case 'ROSA': return 'cor-border-rosa';
      case 'AZUL_CEU': return 'cor-border-azul-ceu';
      case 'AMBAR': return 'cor-border-ambar';
      case 'ROXO_ROOT': return 'cor-border-roxo';
      default: return 'border-l-4 border-border';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'AGENDADA': return 'status-badge status-agendada';
      case 'CONCLUIDA': return 'status-badge status-concluida';
      case 'CANCELADA': return 'status-badge status-cancelada';
      default: return 'status-badge';
    }
  };

  const hasFilters = filtroCidade || filtroTipo || filtroStatus || filtroCor;
  const selectClass = "rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestão de Oficinas</h2>
          <p className="text-sm text-muted-foreground">Veja e gira as oficinas planeadas e concluídas.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button onClick={() => setIsModalCreateOpen(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Nova Oficina
          </button>
        )}
      </div>

      {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Buscar por cidade..."
            value={filtroCidade}
            onChange={(e) => { setFiltroCidade(e.target.value); setFiltroStatus(''); setFiltroCor(''); }}
            className="w-full rounded-lg border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <select className={selectClass} value={filtroTipo} onChange={(e) => { setFiltroTipo(e.target.value); setFiltroStatus(''); setFiltroCidade(''); setFiltroCor(''); }}>
          <option value="">Tipo (Todos)</option>
          <option value="STORY_STARTER">Story Starter</option>
          <option value="MAKER_ROBOTICA_O_QUE_E_PAEBM_8ANO_AO_3SERIE_EM">Maker Robótica</option>
          <option value="ROBOTICA_LOGISTICA_VALE_6ANO_AO_SUPERIOR">Robótica Logística</option>
          <option value="ROBOTICA_PELOTIZACAO_VALE_6ANO_AO_SUPERIOR">Robótica Pelotização</option>
          <option value="ROBOTICA_MINERACAO_VALE_6ANO_AO_SUPERIOR">Robótica Mineração</option>
        </select>
        <select className={selectClass} value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value); setFiltroTipo(''); setFiltroCidade(''); setFiltroCor(''); }}>
          <option value="">Status (Todos)</option>
          <option value="AGENDADA">Agendada</option>
          <option value="CONCLUIDA">Concluída</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
        {user?.role === 'ADMIN' && (
          <select className={selectClass} value={filtroCor} onChange={(e) => { setFiltroCor(e.target.value); setFiltroTipo(''); setFiltroCidade(''); setFiltroStatus(''); }}>
            <option value="">Cor (Todas)</option>
            <option value="ROSA">Rosa</option>
            <option value="AZUL_CEU">Azul Céu</option>
            <option value="AMBAR">Âmbar</option>
            <option value="ROXO_ROOT">Roxo Root</option>
          </select>
        )}
        <button onClick={fetchOficinas} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Buscar</button>
        {hasFilters && (
          <button onClick={limparFiltros} className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <X className="h-3.5 w-3.5" /> Limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Escola / Cidade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Criador</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Instrutores</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Acompanhante</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nota</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {oficinas.map((oficina) => (
                <tr key={oficina.id} className={`hover:bg-muted/30 transition-colors ${getCorBorda(oficina.corCriador)}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">{oficina.escola}</p>
                    <p className="text-xs text-muted-foreground">{oficina.cidade}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-card-foreground">{oficina.data}</td>
                  <td className="px-4 py-3"><span className={getStatusClass(oficina.status)}>{oficina.status}</span></td>
                  <td className="px-4 py-3 text-sm text-card-foreground">{oficina.criadorNome || '-'}</td>
                  <td className="px-4 py-3">
  {oficina.instrutores && oficina.instrutores.length > 0 ? (
    <div className="flex flex-wrap gap-1.5">
      {oficina.instrutores.map((instrutor, index) => (
        <span 
          key={index} 
          className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground border border-border/50"
        >
          {instrutor}
        </span>
      ))}
    </div>
  ) : (
    <span className="text-muted-foreground">-</span>
  )}
</td>
                  <td className="px-4 py-3 text-sm text-card-foreground">{oficina.acompanhanteTurma || '-'}</td>
                  <td className="px-4 py-3 text-sm text-card-foreground">{oficina.avaliacaoEscola ? `⭐ ${oficina.avaliacaoEscola}/10` : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    {user?.role === 'USER' && (
                      <button onClick={() => setOficinaEditando(oficina)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
                        <Pencil className="h-3.5 w-3.5" /> Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {oficinas.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhuma oficina encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalNovaOficina isOpen={isModalCreateOpen} onClose={() => setIsModalCreateOpen(false)} onSuccess={fetchOficinas} />
      <ModalEditarOficina oficina={oficinaEditando} isOpen={!!oficinaEditando} onClose={() => setOficinaEditando(null)} onSuccess={fetchOficinas} />
    </div>
  );
}

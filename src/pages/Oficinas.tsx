import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api, { extractErrorMessage } from '@/lib/api';
import type { Oficina, PageResponse } from '@/types';
import { Plus, Search, X, Download } from 'lucide-react';
import ModalNovaOficina from '@/components/ModalNovaOficina';
import ModalEditarOficina from '@/components/ModalEditarOficina';
import ModalShell from '@/components/ModalShell';
import TabelaOficinas from '@/components/TabelaOficinas';
import { TIPO_OFICINA_LABELS, STATUS_OFICINA_LABELS, COR_ADMIN_LABELS } from '@/constants/enums';

export default function Oficinas() {
  const { user } = useAuth();
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [oficinaEditando, setOficinaEditando] = useState<Oficina | null>(null);
  const [error, setError] = useState('');
  
  // Filtros da Tabela Principal
  const [filtroCidade, setFiltroCidade] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCor, setFiltroCor] = useState('');

  // Novos Estados para o Modal de Exportação
  const [isModalExportOpen, setIsModalExportOpen] = useState(false);
  const [exportFiltros, setExportFiltros] = useState({
    dataInicio: '', dataFim: '', tipo: '', status: ''
  });

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

  const exportarParaExcel = async () => {
    try {
      const res = await api.get<PageResponse<Oficina>>('/oficinas?page=0&size=5000');
      let dadosExportacao = res.data.items || res.data.content || [];

      // LÓGICA DE FILTRAGEM DO CSV
      if (exportFiltros.dataInicio) dadosExportacao = dadosExportacao.filter(o => o.data && o.data >= exportFiltros.dataInicio);
      if (exportFiltros.dataFim) dadosExportacao = dadosExportacao.filter(o => o.data && o.data <= exportFiltros.dataFim);
      if (exportFiltros.tipo) dadosExportacao = dadosExportacao.filter(o => o.tipo === exportFiltros.tipo);
      if (exportFiltros.status) dadosExportacao = dadosExportacao.filter(o => o.status === exportFiltros.status);

      if (dadosExportacao.length === 0) {
        setError('Nenhum dado encontrado para os filtros selecionados.');
        setIsModalExportOpen(false);
        return;
      }

      const cabecalhos = ['ID', 'Escola', 'Cidade', 'Data', 'Tipo', 'Status', 'Criador', 'Instrutores', 'Nota', 'Qtd Alunos', 'Acompanhante', 'Segmento', 'Turno', 'Turma'];
      const linhas = dadosExportacao.map(oficina => [
        oficina.id, `"${oficina.escola || ''}"`, `"${oficina.cidade || ''}"`, oficina.data || '',
        oficina.tipo || '', oficina.status || '', `"${oficina.criadorNome || ''}"`,
        `"${oficina.instrutores ? oficina.instrutores.join(', ') : ''}"`, oficina.avaliacaoEscola || '',
        oficina.quantitativoAluno || '', `"${oficina.acompanhanteTurma || ''}"`, oficina.segmento || '',
        oficina.turno || '', oficina.turma || ''
      ]);

      const csvContent = [cabecalhos.join(';'), ...linhas.map(row => row.join(';'))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);

      const dataHoje = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `relatorio_oficinas_${dataHoje}.csv`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsModalExportOpen(false);

    } catch (error) {
      setError(extractErrorMessage(error, 'Erro ao exportar dados.'));
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
  const modalInputClass = "w-full rounded-lg border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Gestão de Oficinas</h2>
          <p className="text-sm text-muted-foreground">Veja e gira as oficinas planeadas e concluídas.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalExportOpen(true)} 
            className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Download className="h-4 w-4" /> Exportar BI
          </button>

          {user?.role === 'ADMIN' && (
            <button onClick={() => setIsModalCreateOpen(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Nova Oficina
            </button>
          )}
        </div>
      </div>

      {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      {/* Filters da Tabela Principal */}
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
          {Object.entries(TIPO_OFICINA_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select className={selectClass} value={filtroStatus} onChange={(e) => { setFiltroStatus(e.target.value); setFiltroTipo(''); setFiltroCidade(''); setFiltroCor(''); }}>
          <option value="">Status (Todos)</option>
          {Object.entries(STATUS_OFICINA_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {user?.role === 'ADMIN' && (
          <select className={selectClass} value={filtroCor} onChange={(e) => { setFiltroCor(e.target.value); setFiltroTipo(''); setFiltroCidade(''); setFiltroStatus(''); }}>
            <option value="">Cor (Todas)</option>
            {Object.entries(COR_ADMIN_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        )}
        <button onClick={fetchOficinas} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Buscar</button>
        {hasFilters && (
          <button onClick={limparFiltros} className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
            <X className="h-3.5 w-3.5" /> Limpar
          </button>
        )}
      </div>

      {/* Componente da Tabela Importado */}
      <TabelaOficinas 
        oficinas={oficinas} 
        onEditar={setOficinaEditando} 
        getCorBorda={getCorBorda} 
        getStatusClass={getStatusClass} 
      />

      <ModalNovaOficina isOpen={isModalCreateOpen} onClose={() => setIsModalCreateOpen(false)} onSuccess={fetchOficinas} />
      <ModalEditarOficina oficina={oficinaEditando} isOpen={!!oficinaEditando} onClose={() => setOficinaEditando(null)} onSuccess={fetchOficinas} />
      
      {/* Modal de Exportação */}
      <ModalShell
        isOpen={isModalExportOpen}
        onClose={() => setIsModalExportOpen(false)}
        title="Exportar Dados (Excel / BI)"
        subtitle="Selecione os filtros para gerar a planilha. Deixe em branco para exportar tudo."
        footer={
          <>
            <button onClick={() => setIsModalExportOpen(false)} className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</button>
            <button onClick={exportarParaExcel} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Download className="h-4 w-4" /> Baixar Planilha
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">A partir de (Data Inicial)</label>
              <input 
                type="date" 
                className={modalInputClass} 
                value={exportFiltros.dataInicio} 
                onChange={(e) => setExportFiltros({...exportFiltros, dataInicio: e.target.value})} 
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-card-foreground">Até (Data Final)</label>
              <input 
                type="date" 
                className={modalInputClass} 
                value={exportFiltros.dataFim} 
                onChange={(e) => setExportFiltros({...exportFiltros, dataFim: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Tipo de Oficina</label>
            <select className={modalInputClass} value={exportFiltros.tipo} onChange={(e) => setExportFiltros({...exportFiltros, tipo: e.target.value})}>
              <option value="">Todos os Tipos</option>
              {Object.entries(TIPO_OFICINA_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-card-foreground">Status</label>
            <select className={modalInputClass} value={exportFiltros.status} onChange={(e) => setExportFiltros({...exportFiltros, status: e.target.value})}>
              <option value="">Todos os Status</option>
              {Object.entries(STATUS_OFICINA_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}
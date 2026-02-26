import { Pencil } from 'lucide-react';
import type { Oficina } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { STATUS_OFICINA_LABELS } from '@/constants/enums';

interface TabelaOficinasProps {
  oficinas: Oficina[];
  onEditar: (oficina: Oficina) => void;
  getCorBorda: (cor?: string) => string;
  getStatusClass: (status: string) => string;
}

export default function TabelaOficinas({ oficinas, onEditar, getCorBorda, getStatusClass }: TabelaOficinasProps) {
  const { user } = useAuth();

  return (
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
                
                {/* --- AQUI ESTÁ A MUDANÇA NO STATUS --- */}
                <td className="px-4 py-3">
                  <div className="flex flex-col items-start gap-1">
                    <span className={getStatusClass(oficina.status)}>
                      {STATUS_OFICINA_LABELS[oficina.status] || oficina.status}
                    </span>
                    
                    {oficina.status === 'CANCELADA' && oficina.motivoCancelamento && (
                      <span 
                        className="text-[11px] font-medium text-destructive/80 max-w-[150px] truncate" 
                        title={oficina.motivoCancelamento}
                      >
                        Motivo: {oficina.motivoCancelamento}
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 text-sm text-card-foreground">{oficina.criadorNome || '-'}</td>
                <td className="px-4 py-3">
                  {oficina.instrutores && oficina.instrutores.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {oficina.instrutores.map((instrutor, index) => (
                        <span key={index} className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground border border-border/50">{instrutor}</span>
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
                    <button onClick={() => onEditar(oficina)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
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
  );
}
import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '@/lib/api';
import type { Oficina } from '@/types';
import ModalShell from '@/components/ModalShell';

interface Props {
  oficina: Oficina | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEditarOficina({ oficina, isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    status: 'AGENDADA', instrutores: '', avaliacaoEscola: '', quantitativoAluno: '', acompanhanteTurma: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (oficina && isOpen) {
      setFormData({
        status: oficina.status || 'AGENDADA',
        instrutores: oficina.instrutores ? oficina.instrutores.join(', ') : '',
        avaliacaoEscola: oficina.avaliacaoEscola?.toString() || '',
        quantitativoAluno: oficina.quantitativoAluno?.toString() || '',
        acompanhanteTurma: oficina.acompanhanteTurma || ''
      });
    }
  }, [oficina, isOpen]);

  if (!isOpen || !oficina) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const payload = {
      status: formData.status,
      instrutores: formData.instrutores ? formData.instrutores.split(',').map(s => s.trim()).filter(Boolean) : [],
      avaliacaoEscola: formData.avaliacaoEscola ? parseInt(formData.avaliacaoEscola) : null,
      quantitativoAluno: formData.quantitativoAluno ? parseInt(formData.quantitativoAluno) : null,
      acompanhanteTurma: formData.acompanhanteTurma
    };
    try {
      await api.patch(`/oficinas/${oficina.id}`, payload);
      onSuccess();
      onClose();
    } catch (error) {
      setError(extractErrorMessage(error, 'Erro ao atualizar oficina.'));
    }
  };

  const inputClass = "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-card-foreground";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Detalhes"
      subtitle={oficina.escola}
      footer={
        <>
          <button onClick={onClose} className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancelar</button>
          <button onClick={handleSubmit as any} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Salvar</button>
        </>
      }
    >
      {error && <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Status da Oficina</label>
          <select className={inputClass} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="AGENDADA">Agendada</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Instrutores (separados por vírgula)</label>
          <input className={inputClass} value={formData.instrutores} onChange={(e) => setFormData({...formData, instrutores: e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Avaliação (1 a 10)</label>
            <input type="number" min="1" max="10" className={inputClass} value={formData.avaliacaoEscola} onChange={(e) => setFormData({...formData, avaliacaoEscola: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Qtd. Alunos</label>
            <input type="number" className={inputClass} value={formData.quantitativoAluno} onChange={(e) => setFormData({...formData, quantitativoAluno: e.target.value})} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Acompanhante da Turma</label>
          <input className={inputClass} value={formData.acompanhanteTurma} onChange={(e) => setFormData({...formData, acompanhanteTurma: e.target.value})} />
        </div>
      </form>
    </ModalShell>
  );
}

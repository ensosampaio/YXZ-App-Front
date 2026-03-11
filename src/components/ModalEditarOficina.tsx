import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '@/lib/api';
import type { Oficina } from '@/types';
import ModalShell from '@/components/ModalShell';
import { STATUS_OFICINA_LABELS } from '@/constants/enums';

interface Props {
  oficina: Oficina | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEditarOficina({ oficina, isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    status: 'AGENDADA', 
    instrutores: '', 
    avaliacaoEscola: '', 
    quantitativoAluno: '', 
    acompanhanteTurma: '',
    motivoCancelamento: ''
  });
  
  // Novos estados para o Google Drive
  const [fotos, setFotos] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (oficina && isOpen) {
      setFormData({
        status: oficina.status || 'AGENDADA',
        instrutores: oficina.instrutores ? oficina.instrutores.join(', ') : '',
        avaliacaoEscola: oficina.avaliacaoEscola?.toString() || '',
        quantitativoAluno: oficina.quantitativoAluno?.toString() || '',
        acompanhanteTurma: oficina.acompanhanteTurma || '',
        motivoCancelamento: oficina.motivoCancelamento || ''
      });
      // Limpa as fotos antigas sempre que o modal abre
      setFotos(null);
    }
  }, [oficina, isOpen]);

  if (!isOpen || !oficina) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    const payload = {
      status: formData.status,
      instrutores: formData.instrutores ? formData.instrutores.split(',').map(s => s.trim()).filter(Boolean) : [],
      avaliacaoEscola: formData.avaliacaoEscola ? parseInt(formData.avaliacaoEscola) : null,
      quantitativoAluno: formData.quantitativoAluno ? parseInt(formData.quantitativoAluno) : null,
      acompanhanteTurma: formData.acompanhanteTurma,
      motivoCancelamento: formData.status === 'CANCELADA' ? formData.motivoCancelamento : null
    };

    try {
      // 1. Atualiza os dados de texto normais
      await api.patch(`/oficinas/${oficina.id}`, payload);

      // 2. Se o usuário selecionou fotos, envia para o novo endpoint do Drive
      if (fotos && fotos.length > 0) {
        const fotosData = new FormData();
        Array.from(fotos).forEach(foto => {
          fotosData.append('fotos', foto);
        });

        await api.post(`/oficinas/${oficina.id}/fotos`, fotosData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError(extractErrorMessage(error, 'Erro ao atualizar oficina.'));
    } finally {
      setIsSubmitting(false);
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
          <button 
            onClick={onClose} 
            disabled={isSubmitting} 
            className="rounded-lg border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit as any} 
            disabled={isSubmitting} 
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </>
      }
    >
      {error && <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Status da Oficina</label>
          <select className={inputClass} value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            {Object.entries(STATUS_OFICINA_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* --- CAMPO CONDICIONAL PARA CANCELAMENTO --- */}
        {formData.status === 'CANCELADA' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className={`${labelClass} text-destructive`}>Motivo do Cancelamento</label>
            <textarea 
              className={`${inputClass} border-destructive/50 focus:border-destructive focus:ring-destructive/20`} 
              value={formData.motivoCancelamento} 
              onChange={(e) => setFormData({...formData, motivoCancelamento: e.target.value})}
              placeholder="Descreva brevemente o porquê do cancelamento..."
              rows={3}
              required
            />
          </div>
        )}

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

        {/* --- CAMPO NOVO: UPLOAD DE FOTOS --- */}
        <div className="mt-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-4">
          <label className={`${labelClass} text-primary`}>Anexar Fotos da Oficina (Google Drive)</label>
          <p className="mb-3 text-xs text-muted-foreground">Selecione as imagens para comprovação da oficina.</p>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
            onChange={(e) => setFotos(e.target.files)} 
          />
        </div>

      </form>
    </ModalShell>
  );
}
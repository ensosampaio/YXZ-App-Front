import { useState } from 'react';
import api, { extractErrorMessage } from '@/lib/api';
import ModalShell from '@/components/ModalShell';
import { 
  TIPO_OFICINA_LABELS, 
  SEGMENTO_LABELS, 
  TURNO_LABELS, 
  TURMA_LABELS 
} from '@/constants/enums';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalNovaOficina({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    escola: '', cidade: '', data: '', tipo: 'STORY_STARTER',
    contatoEscola: '', segmento: 'FUNDAMENTAL', turno: 'MATUTINO', turma: '_6ANO'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/oficinas', formData);
      onSuccess();
      onClose();
      setFormData({ escola: '', cidade: '', data: '', tipo: 'STORY_STARTER', contatoEscola: '', segmento: 'FUNDAMENTAL', turno: 'MATUTINO', turma: '_6ANO' });
    } catch (error) {
      setError(extractErrorMessage(error, 'Erro ao criar oficina.'));
    }
  };

  const inputClass = "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-card-foreground";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Oficina"
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
          <label className={labelClass}>Escola</label>
          <input className={inputClass} value={formData.escola} onChange={(e) => setFormData({...formData, escola: e.target.value})} required />
        </div>
        <div>
          <label className={labelClass}>Cidade</label>
          <input className={inputClass} value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} required />
        </div>
        <div>
          <label className={labelClass}>Data</label>
          <input type="date" className={inputClass} value={formData.data} onChange={(e) => setFormData({...formData, data: e.target.value})} required />
        </div>
        <div>
          <label className={labelClass}>Contato da Escola</label>
          <input className={inputClass} value={formData.contatoEscola} onChange={(e) => setFormData({...formData, contatoEscola: e.target.value})} />
        </div>
        <div>
          <label className={labelClass}>Tipo de Oficina</label>
          <select className={inputClass} value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})}>
            {Object.entries(TIPO_OFICINA_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Segmento</label>
            <select className={inputClass} value={formData.segmento} onChange={(e) => setFormData({...formData, segmento: e.target.value})}>
              {Object.entries(SEGMENTO_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Turno</label>
            <select className={inputClass} value={formData.turno} onChange={(e) => setFormData({...formData, turno: e.target.value})}>
              {Object.entries(TURNO_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Turma</label>
            <select className={inputClass} value={formData.turma} onChange={(e) => setFormData({...formData, turma: e.target.value})}>
              {Object.entries(TURMA_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}
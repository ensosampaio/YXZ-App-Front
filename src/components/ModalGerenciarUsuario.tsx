import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '@/lib/api';
import type { UserDTO } from '@/types';
import ModalShell from '@/components/ModalShell';

interface Props {
  isOpen: boolean;
  usuario: UserDTO | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalGerenciarUsuario({ isOpen, usuario, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '', role: 'USER', corAdministradora: '', ativo: true });
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario && isOpen) {
      setFormData({
        nome: usuario.nome || '', role: usuario.role || 'USER',
        corAdministradora: usuario.corAdministradora || '',
        ativo: usuario.ativo !== false, email: '', senha: ''
      });
    } else if (isOpen) {
      setFormData({ nome: '', email: '', senha: '', role: 'USER', corAdministradora: '', ativo: true });
    }
  }, [usuario, isOpen]);

  if (!isOpen) return null;
  const isEdit = !!usuario;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isEdit) {
        await api.patch(`/admin/users/${usuario.id}`, {
          nome: formData.nome, role: formData.role, ativo: formData.ativo,
          corAdministradora: formData.role === 'ADMIN' ? formData.corAdministradora : null
        });
      } else {
        await api.post('/admin/users', {
          nome: formData.nome, email: formData.email, senha: formData.senha, role: formData.role,
          corAdministradora: formData.role === 'ADMIN' ? formData.corAdministradora : null
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      setError(extractErrorMessage(error, 'Erro ao processar usuário.'));
    }
  };

  const inputClass = "w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  const labelClass = "mb-1.5 block text-sm font-medium text-card-foreground";

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Editar Utilizador' : 'Novo Utilizador'}
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
          <label className={labelClass}>Nome</label>
          <input className={inputClass} value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
        </div>
        {!isEdit && (
          <>
            <div>
              <label className={labelClass}>E-mail</label>
              <input type="email" className={inputClass} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div>
              <label className={labelClass}>Palavra-passe</label>
              <input type="password" className={inputClass} value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})} required />
            </div>
          </>
        )}
        <div>
          <label className={labelClass}>Role</label>
          <select className={inputClass} value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value, corAdministradora: e.target.value !== 'ADMIN' ? '' : formData.corAdministradora})}>
            <option value="USER">Usuário Comum</option>
            <option value="ADMIN">Administrador</option>
            {usuario?.role === 'ROOT' && <option value="ROOT">Root (Super Admin)</option>}
          </select>
        </div>
        {formData.role === 'ADMIN' && (
          <div>
            <label className={labelClass}>Cor</label>
            <select className={inputClass} value={formData.corAdministradora} onChange={(e) => setFormData({...formData, corAdministradora: e.target.value})}>
              <option value="">Selecione uma cor...</option>
              <option value="ROSA">Rosa</option>
              <option value="AZUL_CEU">Azul Céu</option>
              <option value="AMBAR">Âmbar</option>
              <option value="ROXO">Roxo</option>
            </select>
          </div>
        )}
        {isEdit && usuario?.role !== 'ROOT' && (
          <label className="flex items-center gap-2 text-sm text-card-foreground">
            <input type="checkbox" checked={formData.ativo} onChange={(e) => setFormData({...formData, ativo: e.target.checked})} className="rounded border" />
            Ativo no Sistema
          </label>
        )}
      </form>
    </ModalShell>
  );
}

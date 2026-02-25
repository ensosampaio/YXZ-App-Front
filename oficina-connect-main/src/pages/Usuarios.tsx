import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '@/lib/api'
import type { UserDTO, PageResponse } from '@/types';
import { Plus, Pencil, ShieldCheck, ShieldAlert } from 'lucide-react';
import ModalGerenciarUsuario from '@/components/ModalGerenciarUsuario';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<UserDTO[]>([]);
  const [usuarioEditando, setUsuarioEditando] = useState<UserDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchUsuarios = async () => {
    try {
      const res = await api.get<PageResponse<UserDTO>>('/admin/users');
      setUsuarios(res.data.items || res.data.content || []);
    } catch (error) {
      setError(extractErrorMessage(error, 'Falha ao carregar usuários.'));
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Gestão de Utilizadores</h2>
        <button onClick={() => { setUsuarioEditando(null); setIsModalOpen(true); }} className="flex items-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-medium text-success-foreground hover:bg-success/90">
          <Plus className="h-4 w-4" /> Novo
        </button>
      </div>

      {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome / Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {usuarios.map(usr => (
                <tr key={usr.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">{usr.nome}</p>
                    <p className="text-xs text-muted-foreground">{usr.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="status-badge bg-secondary text-secondary-foreground border-border">{usr.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-sm ${usr.ativo ? 'text-success' : 'text-destructive'}`}>
                      {usr.ativo ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                      {usr.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setUsuarioEditando(usr); setIsModalOpen(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20">
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalGerenciarUsuario isOpen={isModalOpen} usuario={usuarioEditando} onClose={() => setIsModalOpen(false)} onSuccess={fetchUsuarios} />
    </div>
  );
}

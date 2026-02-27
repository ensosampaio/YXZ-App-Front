import { useState, useEffect } from 'react';
import api, { extractErrorMessage } from '@/lib/api'; 
import type { Oficina } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [oficinasMes, setOficinasMes] = useState<Oficina[]>([]);
  const [error, setError] = useState(''); 

  const fetchOficinas = async () => {
    setError('');
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; 
      
      const res = await api.get<Oficina[]>(`/oficinas/calendario?ano=${year}&mes=${month}`);
      setOficinasMes(res.data || []);
    } catch (err) {
      setError(extractErrorMessage(err, 'Falha ao carregar o calendário.'));
    }
  };

  useEffect(() => { 
    fetchOficinas(); 
  }, [currentDate]);

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  // Função para mapear a cor do criador para as classes do Tailwind (Fundo e Texto)
  const getCorClasses = (cor?: string) => {
    switch (cor) {
      case 'ROSA': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'AZUL_CEU': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'AMBAR': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'ROXO_ROOT': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Calendário de Oficinas</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="rounded-lg border p-2 text-muted-foreground hover:bg-muted">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[160px] text-center text-sm font-semibold text-foreground">{monthNames[month]} de {year}</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="rounded-lg border p-2 text-muted-foreground hover:bg-muted">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="grid grid-cols-7 border-b bg-muted/50">
          {weekDays.map(d => (
            <div key={d} className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} className="min-h-[100px] border-b border-r bg-muted/20" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayOficinas = oficinasMes.filter(o => parseInt(o.data.split('-')[2]) === day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            
            return (
              <div key={day} className={`min-h-[100px] border-b border-r p-2 ${isToday ? 'bg-primary/5' : ''}`}>
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${isToday ? 'bg-primary text-primary-foreground' : 'text-card-foreground'}`}>
                  {day}
                </span>
                <div className="mt-1 space-y-1">
                  {dayOficinas.slice(0, 2).map(o => {
                    const corClasses = getCorClasses(o.corCriador);
                    // Pega apenas a classe de background (a primeira) para usar na bolinha do tooltip
                    const bgClass = corClasses.split(' ')[0]; 

                    return (
                      <div key={o.id} className="relative group">

                        {/* Evento no calendário com as cores aplicadas */}
                        <div className={`truncate cursor-help rounded border px-1.5 py-0.5 text-[10px] font-medium ${corClasses}`}>
                          {o.escola}
                        </div>
                        
                        {/* Tooltip Hover */}
                        <div className="absolute bottom-full left-1/2 z-50 mb-2 hidden w-max -translate-x-1/2 flex-col rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg group-hover:flex">
                          <div className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r bg-popover"></div>
                          
                          <div className="relative z-10 flex flex-col gap-1.5">
                            <span className="font-bold text-popover-foreground">{o.escola}</span>
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              Criado por: 
                              <span className="flex items-center gap-1 font-medium text-foreground">
                                <span className={`inline-block h-2.5 w-2.5 rounded-full ${bgClass}`}></span>
                                {o.criadorNome || 'Desconhecido'}
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              Status: <span className="font-medium text-foreground">{o.status}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {dayOficinas.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">+{dayOficinas.length - 2} mais</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
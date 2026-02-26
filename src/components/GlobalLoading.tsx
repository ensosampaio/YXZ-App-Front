import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const show = () => setIsLoading(true);
    const hide = () => setIsLoading(false);
    window.addEventListener('show-global-loading', show);
    window.addEventListener('hide-global-loading', hide);
    return () => {
      window.removeEventListener('show-global-loading', show);
      window.removeEventListener('hide-global-loading', hide);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl bg-card px-6 py-4 shadow-xl">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm font-medium text-card-foreground">A carregar...</span>
      </div>
    </div>
  );
}

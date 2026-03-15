'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '@/components/ui/badge';

const statusTooltips: Record<string, string> = {
  exploration:
    "Phase d'exploration , L'opportunité est identifiée, les données sont repérées, mais le marché n'est pas encore validé sur le terrain.",
  validation:
    'Phase de validation , Des interviews prospects sont en cours ou un MVP est en test pour confirmer la demande réelle.',
  ready:
    'Prêt à lancer , Le marché est validé, le MVP est testé, les premiers clients ont payé. Go build.'
};

const difficultyTooltips: Record<string, string> = {
  facile:
    'Facile , MVP réalisable en 3-5 semaines par un dev solo. Peu de données à croiser, APIs simples, pas de pipeline complexe.',
  moyenne:
    "Moyenne , MVP en 5-8 semaines. Nécessite de croiser plusieurs sources de données ou d'implémenter une logique métier spécifique.",
  complexe:
    'Complexe , MVP en 8+ semaines. Gros volume de données à ingérer, croisements multiples, ou pipeline de traitement nécessaire.'
};

const statusColors: Record<string, string> = {
  exploration: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  validation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ready: 'bg-green-500/20 text-green-400 border-green-500/30'
};

const difficultyColors: Record<string, string> = {
  facile: 'bg-green-500/20 text-green-400 border-green-500/30',
  moyenne: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  complexe: 'bg-red-500/20 text-red-400 border-red-500/30'
};

function TooltipBadge({
  label,
  tooltip,
  colorClass
}: {
  label: string;
  tooltip: string;
  colorClass: string;
}) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => setMounted(true), []);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      left: rect.left + rect.width / 2,
      top: rect.top - 8
    });
  }, []);

  const show = useCallback(() => {
    updatePosition();
    setVisible(true);
  }, [updatePosition]);

  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!visible) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [visible, updatePosition]);

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <Badge className={`cursor-help ${colorClass}`}>{label}</Badge>
      </span>
      {mounted &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none fixed z-[9999] w-72 whitespace-normal rounded-md border border-border bg-popover px-3 py-2 text-left text-xs font-normal text-popover-foreground shadow-lg transition-opacity duration-150"
            style={{
              left: coords.left,
              top: coords.top,
              transform: 'translate(-50%, -100%)',
              opacity: visible ? 1 : 0
            }}
          >
            {tooltip}
            <span
              className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-border"
              aria-hidden
            />
          </span>,
          document.body
        )}
    </>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <TooltipBadge
      label={status}
      tooltip={statusTooltips[status] ?? status}
      colorClass={statusColors[status] ?? ''}
    />
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <TooltipBadge
      label={difficulty}
      tooltip={difficultyTooltips[difficulty] ?? difficulty}
      colorClass={difficultyColors[difficulty] ?? ''}
    />
  );
}

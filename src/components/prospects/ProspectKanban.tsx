'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { PROSPECT_STATUTS, PIPELINE_COMMERCIAL } from '@/lib/types';
import type { ProspectStatut } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import { Phone, Mail, Flame, Snowflake, Sun, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProspectKanbanProps {
  prospects: any[];
  onStatutChange: (id: string, statut: ProspectStatut) => void;
}

/* ── Couleurs d'accent par colonne ── */
const columnAccents: Record<string, string> = {
  prescripteur: '#14b8a6',
  prospect: '#9ca3af',
  prise_contact: '#0ea5e9',
  r1: '#3b82f6',
  r2: '#6366f1',
  proposition: '#8b5cf6',
  acompte: '#a855f7',
  perdu: '#ef4444',
};

const tempConfig: Record<string, { icon: typeof Flame; color: string; bg: string }> = {
  chaud: { icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
  tiede: { icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
  froid: { icon: Snowflake, color: 'text-blue-500', bg: 'bg-blue-50' },
};

export default function ProspectKanban({ prospects, onStatutChange }: ProspectKanbanProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Pipeline commercial + perdu
  const pipelineStatuts = [...PIPELINE_COMMERCIAL, PROSPECT_STATUTS.find(s => s.value === 'perdu')!];

  // Prescripteurs vs prospects classiques
  const prescripteurs = prospects.filter(p => p.type_contact === 'prescripteur');
  const regularProspects = prospects.filter(p => p.type_contact !== 'prescripteur');

  /* ── Sync dual scrollbar (top + bottom) ── */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const ro = new ResizeObserver(() => setContentWidth(el.scrollWidth));
      ro.observe(el);
      setContentWidth(el.scrollWidth);
      return () => ro.disconnect();
    }
  }, [prospects]);

  const syncing = useRef(false);
  const syncScroll = useCallback((source: 'top' | 'bottom') => {
    if (syncing.current) return;
    syncing.current = true;
    const top = topBarRef.current;
    const bottom = scrollRef.current;
    if (top && bottom) {
      if (source === 'top') bottom.scrollLeft = top.scrollLeft;
      else top.scrollLeft = bottom.scrollLeft;
    }
    requestAnimationFrame(() => { syncing.current = false; });
  }, []);

  /* ── Drag & Drop handlers ── */
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    // Prescripteur column doesn't accept drops
    if (colKey === 'prescripteur') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colKey) setDragOverCol(colKey);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if actually leaving the column
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatut: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id && targetStatut !== 'prescripteur') {
      onStatutChange(id, targetStatut as ProspectStatut);
    }
    setDragOverCol(null);
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDragOverCol(null);
    setDraggingId(null);
  };

  /* ── Render a single card ── */
  const renderCard = (prospect: any) => {
    const TempIcon = tempConfig[prospect.temperature]?.icon || Sun;
    const tempColor = tempConfig[prospect.temperature]?.color || 'text-gray-400';
    const tempBg = tempConfig[prospect.temperature]?.bg || 'bg-gray-50';
    const displayName = prospect.entreprise || `${prospect.prenom} ${prospect.nom}`.trim() || 'Sans nom';
    const isDragging = draggingId === prospect.id;

    return (
      <div
        key={prospect.id}
        draggable
        onDragStart={(e) => handleDragStart(e, prospect.id)}
        onDragEnd={handleDragEnd}
        onClick={() => router.push(`/prospects/${prospect.id}`)}
        className={`bg-white rounded-lg border border-gray-200/80 shadow-sm p-3 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-md hover:border-gray-300 group
          ${isDragging ? 'opacity-30 scale-[0.97]' : ''}`}
      >
        {/* Nom + température */}
        <div className="flex items-start justify-between mb-1.5">
          <h4 className="text-[13px] font-semibold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug flex-1 mr-2">
            {displayName}
          </h4>
          <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${tempBg}`}>
            <TempIcon className={`w-3 h-3 ${tempColor}`} />
          </div>
        </div>

        {/* Sous-nom */}
        {prospect.entreprise && (prospect.prenom || prospect.nom) && (
          <p className="text-xs text-gray-500 mb-1.5">{prospect.prenom} {prospect.nom}</p>
        )}

        {/* Icônes contact + source */}
        <div className="flex items-center gap-1.5 text-gray-400 mb-2">
          {prospect.telephone && <Phone className="w-3 h-3" />}
          {prospect.email && <Mail className="w-3 h-3" />}
          {prospect.source && (
            <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 truncate max-w-[90px]">
              {prospect.source}
            </span>
          )}
        </div>

        {/* Badge prescripteur */}
        {prospect.type_contact === 'prescripteur' && (
          <div className="mb-2">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              🤝 Prescripteur
            </span>
          </div>
        )}

        {/* Footer : sélecteur statut + avatar */}
        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
          <select
            value={prospect.statut}
            onChange={(e) => { e.stopPropagation(); onStatutChange(prospect.id, e.target.value as ProspectStatut); }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-[10px] border border-gray-200 rounded-full px-2 py-0.5 bg-gray-50 cursor-pointer max-w-[120px] hover:bg-white transition-colors focus:outline-none focus:ring-1 focus:ring-brand-300"
          >
            {PROSPECT_STATUTS.filter(s => ['prospect','prise_contact','r1','r2','proposition','acompte','perdu'].includes(s.value)).map((s) => (
              <option key={s.value} value={s.value}>{s.emoji} {s.label}</option>
            ))}
          </select>
          {prospect.assigned_profile && (
            <div
              className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold"
              title={prospect.assigned_profile.full_name}
            >
              {getInitials(prospect.assigned_profile.full_name)}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ── Build columns ── */
  const columns = [
    {
      key: 'prescripteur',
      label: 'Prescripteurs',
      emoji: '🤝',
      items: prescripteurs,
      accent: columnAccents.prescripteur,
      isSpecial: true,
    },
    ...pipelineStatuts.map(s => ({
      key: s.value,
      label: s.label,
      emoji: s.emoji,
      items: regularProspects.filter(p => p.statut === s.value),
      accent: columnAccents[s.value] || '#9ca3af',
      isSpecial: false,
    })),
  ];

  return (
    <div className="space-y-0 -mx-2">
      {/* ── Scrollbar en haut ── */}
      <div
        ref={topBarRef}
        onScroll={() => syncScroll('top')}
        className="overflow-x-auto overflow-y-hidden mx-2"
        style={{ height: 14 }}
      >
        <div style={{ width: contentWidth || '100%', height: 1 }} />
      </div>

      {/* ── Board ── */}
      <div
        ref={scrollRef}
        onScroll={() => syncScroll('bottom')}
        className="overflow-x-auto px-2 pb-4"
      >
        <div className="flex gap-3 min-h-[520px]" style={{ width: 'max-content' }}>
          {columns.map((col, idx) => {
            const isOver = dragOverCol === col.key;
            return (
              <div
                key={col.key}
                className="flex flex-col"
                style={{ width: 272 }}
              >
                {/* Header Notion-style : dot + label + count */}
                <div className="flex items-center gap-2 px-1 mb-2 h-7">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: col.accent }}
                  />
                  <span className="text-[13px] font-semibold text-gray-700 whitespace-nowrap">
                    {col.label}
                  </span>
                  <span className="text-[12px] font-medium text-gray-400 tabular-nums">
                    {col.items.length}
                  </span>
                  {col.isSpecial && <Users className="w-3.5 h-3.5 text-teal-400 ml-auto" />}
                </div>

                {/* Séparateur entre prescripteurs et pipeline */}
                {col.isSpecial && (
                  <div className="absolute" />
                )}

                {/* Colonne droppable */}
                <div
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.key)}
                  className={`flex-1 rounded-xl p-1.5 space-y-2 transition-all duration-200
                    ${isOver
                      ? 'bg-brand-50 ring-2 ring-brand-300/60 shadow-inner'
                      : 'bg-gray-50/50'
                    }
                    ${col.isSpecial && !isOver ? 'bg-teal-50/30' : ''}
                  `}
                >
                  {col.items.map(renderCard)}
                  {col.items.length === 0 && (
                    <div className={`flex flex-col items-center justify-center py-10 text-[11px] transition-colors rounded-lg border-2 border-dashed
                      ${isOver
                        ? 'border-brand-300 text-brand-500 bg-brand-50/50'
                        : 'border-transparent text-gray-400'
                      }`}
                    >
                      {isOver ? '↓ Déposer ici' : col.isSpecial ? 'Aucun prescripteur' : 'Aucun prospect'}
                    </div>
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

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { PIPELINE_PROJET, PROSPECT_STATUTS } from '@/lib/types';
import type { ProspectStatut } from '@/lib/types';
import { getInitials } from '@/lib/utils';
import { Phone, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClientKanbanProps {
  prospects: any[];
  onStatutChange: (id: string, statut: ProspectStatut) => void;
}

/* ── Couleurs d'accent par colonne ── */
const columnAccents: Record<string, string> = {
  brief: '#d946ef',       // fuchsia-500
  maquette: '#ec4899',    // pink-500
  validation_maquette: '#f43f5e', // rose-500
  pre_prod: '#f59e0b',    // amber-500
  validation_pre_prod: '#f97316', // orange-500
  production: '#10b981',  // emerald-500
  suivi: '#22c55e',       // green-500
};

const projetStatutsOnly = PROSPECT_STATUTS.filter(s =>
  ['brief', 'maquette', 'validation_maquette', 'pre_prod', 'validation_pre_prod', 'production', 'suivi'].includes(s.value)
);

export default function ClientKanban({ prospects, onStatutChange }: ClientKanbanProps) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

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
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colKey) setDragOverCol(colKey);
  };

  const handleDragLeave = (e: React.DragEvent) => {
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
    if (id) {
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
        {/* Nom + initiales */}
        <div className="flex items-start justify-between mb-1.5">
          <h4 className="text-[13px] font-semibold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug flex-1 mr-2">
            {displayName}
          </h4>
          <div className="w-6 h-6 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center text-[10px] font-bold shrink-0">
            {getInitials(displayName)}
          </div>
        </div>

        {/* Sous-nom */}
        {prospect.entreprise && (prospect.prenom || prospect.nom) && (
          <p className="text-xs text-gray-500 mb-1.5">{prospect.prenom} {prospect.nom}</p>
        )}

        {/* Type de prestation */}
        {prospect.type_prestation && (
          <div className="mb-1.5">
            <span className="text-[10px] text-brand-600 bg-brand-50 rounded-full px-2 py-0.5 font-medium border border-brand-100">
              {prospect.type_prestation}
            </span>
          </div>
        )}

        {/* Contact + tarif */}
        <div className="flex items-center gap-1.5 text-gray-400 mb-2">
          {prospect.telephone && <Phone className="w-3 h-3" />}
          {prospect.email && <Mail className="w-3 h-3" />}
          {prospect.tarif_propose && (
            <span className="ml-auto text-[11px] font-semibold text-green-600">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prospect.tarif_propose)}
            </span>
          )}
        </div>

        {/* Footer : sélecteur statut + avatar */}
        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
          <select
            value={prospect.statut}
            onChange={(e) => { e.stopPropagation(); onStatutChange(prospect.id, e.target.value as ProspectStatut); }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-[10px] border border-gray-200 rounded-full px-2 py-0.5 bg-gray-50 cursor-pointer max-w-[120px] hover:bg-white transition-colors focus:outline-none focus:ring-1 focus:ring-brand-300"
          >
            {projetStatutsOnly.map((s) => (
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
  const columns = PIPELINE_PROJET.map(s => ({
    key: s.value,
    label: s.label,
    emoji: s.emoji,
    items: prospects.filter(p => p.statut === s.value),
    accent: columnAccents[s.value] || '#9ca3af',
  }));

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
          {columns.map((col) => {
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
                </div>

                {/* Colonne droppable */}
                <div
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.key)}
                  className={`flex-1 rounded-xl p-1.5 space-y-2 transition-all duration-200
                    ${isOver
                      ? 'bg-brand-50 ring-2 ring-brand-300/60 shadow-inner'
                      : 'bg-gray-50/50'
                    }`}
                >
                  {col.items.map(renderCard)}
                  {col.items.length === 0 && (
                    <div className={`flex flex-col items-center justify-center py-10 text-[11px] transition-colors rounded-lg border-2 border-dashed
                      ${isOver
                        ? 'border-brand-300 text-brand-500 bg-brand-50/50'
                        : 'border-transparent text-gray-400'
                      }`}
                    >
                      {isOver ? '↓ Déposer ici' : 'Aucun projet'}
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

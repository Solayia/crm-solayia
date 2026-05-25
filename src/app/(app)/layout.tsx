'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { getCurrentUser } from './actions';

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Vue d\'ensemble de votre activite' },
  '/prospects': { title: 'Prospects', subtitle: 'Gestion du pipeline commercial' },
  '/clients': { title: 'Clients', subtitle: 'Base clients et suivi MRR' },
  '/devis': { title: 'Devis', subtitle: 'Gestion des devis et factures' },
  '/projets': { title: 'Projets', subtitle: 'Suivi des projets en cours' },
  '/parametres/equipe': { title: 'Equipe', subtitle: 'Gestion des membres et roles' },
  '/parametres/entreprise': { title: 'Entreprise', subtitle: 'Informations et parametres' },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  const loadUser = useCallback(async () => {
    const u = await getCurrentUser();
    setUser(u);
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const matchedKey = Object.keys(pageTitles).find((key) => pathname.startsWith(key));
  const pageInfo = matchedKey ? pageTitles[matchedKey] : { title: 'CRM Solayia' };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={user}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

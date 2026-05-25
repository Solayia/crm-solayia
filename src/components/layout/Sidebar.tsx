'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, getInitials } from '@/lib/utils';
import { logoutAction } from '@/app/(auth)/login/actions';
import {
  LayoutDashboard, Target, Users, FileText, FolderKanban,
  Settings, Building2, UsersRound, ChevronLeft, ChevronRight, LogOut, X,
} from 'lucide-react';

const mainNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/prospects', label: 'Prospects', icon: Target },
  { href: '/clients', label: 'Clients', icon: Users },
];

const commercialNav = [
  { href: '/devis', label: 'Devis', icon: FileText },
  { href: '/projets', label: 'Projets', icon: FolderKanban },
];

const settingsNav = [
  { href: '/parametres/equipe', label: 'Equipe', icon: UsersRound },
  { href: '/parametres/entreprise', label: 'Entreprise', icon: Building2 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  user?: { full_name: string; role: string; email: string } | null;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose, user }: SidebarProps) {
  const pathname = usePathname();

  const userName = user?.full_name || 'Utilisateur';
  const userRole = user?.role === 'admin' ? 'Admin' : 'Membre';
  const userInitials = getInitials(userName);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }) => (
    <Link
      href={href}
      onClick={onMobileClose}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
        isActive(href)
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-slate-300 hover:bg-slate-800 hover:text-white',
        collapsed && 'justify-center px-2'
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );

  const NavSection = ({ label, items }: { label: string; items: typeof mainNav }) => (
    <div className="space-y-1">
      {!collapsed && (
        <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      )}
      {items.map((item) => (
        <NavItem key={item.href} {...item} />
      ))}
    </div>
  );

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn('flex items-center h-16 border-b border-slate-700/50', collapsed ? 'justify-center px-2' : 'justify-between px-4')}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-wide">SOLAYIA</span>
              <span className="text-brand-400 text-xs ml-1.5 font-medium">CRM</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
        )}
        {/* Desktop toggle */}
        <button onClick={onToggle} className="hidden lg:flex text-slate-400 hover:text-white p-1 rounded transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        {/* Mobile close */}
        <button onClick={onMobileClose} className="lg:hidden text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        <NavSection label="General" items={mainNav} />
        <NavSection label="Commercial" items={commercialNav} />
        <NavSection label="Parametres" items={settingsNav} />
      </nav>

      {/* User */}
      <div className="border-t border-slate-700/50 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold">
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">{userRole}</p>
            </div>
            <form action={logoutAction}>
              <button type="submit" className="text-slate-400 hover:text-red-400 transition-colors p-1">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold" title={userName}>
              {userInitials}
            </div>
            <form action={logoutAction}>
              <button type="submit" className="text-slate-400 hover:text-red-400 transition-colors p-1">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onMobileClose} />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col transition-transform duration-300 lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-sidebar transition-all duration-200 shrink-0',
        collapsed ? 'w-[68px]' : 'w-64'
      )}>
        {sidebarContent}
      </aside>
    </>
  );
}

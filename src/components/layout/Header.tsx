'use client';

import { Menu, Search, Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, onMenuClick, actions }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-64">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Actions */}
        {actions}
      </div>
    </header>
  );
}

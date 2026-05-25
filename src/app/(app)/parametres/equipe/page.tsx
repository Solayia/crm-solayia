'use client';

import { useState } from 'react';
import { Plus, Shield, User, MoreVertical, Mail } from 'lucide-react';
import { mockProfiles } from '@/lib/mock-data';
import { formatDate, getInitials } from '@/lib/utils';

export default function EquipePage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'membre'>('membre');

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Membres de l&apos;equipe</h2>
          <p className="text-sm text-gray-500">{mockProfiles.length} membre{mockProfiles.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowInvite(!showInvite)} className="btn-primary">
          <Plus className="w-4 h-4" />
          Inviter
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Inviter un nouveau membre</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="input-field pl-9"
                  placeholder="email@exemple.fr"
                />
              </div>
            </div>
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as 'admin' | 'membre')} className="input-field w-auto">
              <option value="membre">Membre</option>
              <option value="admin">Admin</option>
            </select>
            <button className="btn-primary whitespace-nowrap">Envoyer l&apos;invitation</button>
          </div>
          <p className="text-xs text-gray-400 mt-2">L&apos;utilisateur recevra un email avec un lien de connexion.</p>
        </div>
      )}

      {/* Members list */}
      <div className="card divide-y divide-gray-100">
        {mockProfiles.map((profile) => (
          <div key={profile.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold">
                {getInitials(profile.full_name)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{profile.full_name}</p>
                <p className="text-xs text-gray-500">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {profile.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-amber-500" />
                ) : (
                  <User className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  profile.role === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {profile.role === 'admin' ? 'Admin' : 'Membre'}
                </span>
              </div>
              <span className="text-xs text-gray-400 hidden sm:inline">Depuis {formatDate(profile.created_at)}</span>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800 font-medium">Securite des roles</p>
        <p className="text-xs text-amber-600 mt-1">
          Les membres ne peuvent pas modifier leur propre role. Seuls les administrateurs peuvent gerer les roles.
          Le dernier administrateur ne peut pas etre retrograde.
        </p>
      </div>
    </div>
  );
}

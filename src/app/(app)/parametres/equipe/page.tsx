'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Shield, User, Trash2, Mail, Copy, Check, UserPlus } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';
import { getProfiles, inviteMember, deleteMember, updateMemberRole } from './actions';

export default function EquipePage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'membre'>('membre');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ success?: boolean; error?: string; tempPassword?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const loadData = useCallback(async () => {
    const data = await getProfiles();
    setProfiles(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleInvite = async () => {
    if (!inviteEmail || !inviteName) return;
    setInviteLoading(true);
    setInviteResult(null);
    const result = await inviteMember(inviteEmail, inviteName, inviteRole);
    setInviteResult(result);
    if ('success' in result && result.success) {
      setInviteEmail('');
      setInviteName('');
      await loadData();
    }
    setInviteLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer le membre "${name}" ? Cette action est irreversible.`)) return;
    const result = await deleteMember(id);
    if (result.error) {
      alert(result.error);
    } else {
      await loadData();
    }
  };

  const handleRoleChange = async (id: string, newRole: 'admin' | 'membre') => {
    const result = await updateMemberRole(id, newRole);
    if (result.error) {
      alert(result.error);
    } else {
      await loadData();
    }
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Membres de l&apos;equipe</h2>
          <p className="text-sm text-gray-500">{profiles.length} membre{profiles.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setShowInvite(!showInvite); setInviteResult(null); }} className="btn-primary">
          <Plus className="w-4 h-4" />
          Inviter
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Inviter un nouveau membre</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Nom complet *</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="input-field pl-9"
                    placeholder="Prenom Nom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
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
            </div>
            <div className="flex items-center gap-3">
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as 'admin' | 'membre')} className="input-field w-auto">
                <option value="membre">Membre</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={handleInvite} disabled={inviteLoading || !inviteEmail || !inviteName} className="btn-primary whitespace-nowrap">
                {inviteLoading ? 'Creation...' : 'Creer le compte'}
              </button>
            </div>
          </div>

          {/* Result message */}
          {inviteResult?.error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{inviteResult.error}</p>
            </div>
          )}
          {inviteResult?.success && inviteResult.tempPassword && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium mb-2">Compte cree avec succes !</p>
              <div className="flex items-center gap-2 bg-white border border-green-200 rounded px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">Mot de passe temporaire :</p>
                  <p className="text-sm font-mono text-gray-900 truncate">{inviteResult.tempPassword}</p>
                </div>
                <button onClick={() => copyPassword(inviteResult.tempPassword!)} className="p-1.5 text-gray-400 hover:text-green-600 rounded hover:bg-green-50 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-green-600 mt-2">Communiquez ce mot de passe au nouveau membre pour sa premiere connexion.</p>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-2">Un compte sera cree avec un mot de passe temporaire a communiquer au nouveau membre.</p>
        </div>
      )}

      {/* Members list */}
      <div className="card divide-y divide-gray-100">
        {profiles.map((profile) => (
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
                <select
                  value={profile.role}
                  onChange={(e) => handleRoleChange(profile.id, e.target.value as 'admin' | 'membre')}
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border-0 cursor-pointer ${
                    profile.role === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <option value="admin">Admin</option>
                  <option value="membre">Membre</option>
                </select>
              </div>
              <span className="text-xs text-gray-400 hidden sm:inline">Depuis {formatDate(profile.created_at)}</span>
              <button
                onClick={() => handleDelete(profile.id, profile.full_name)}
                className="p-1.5 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors"
                title="Supprimer le membre"
              >
                <Trash2 className="w-4 h-4" />
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

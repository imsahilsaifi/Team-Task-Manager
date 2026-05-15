import { useState } from 'react';
import { UserMinus, Shield, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';

export default function MemberList({ projectId, members, currentUserId, isAdmin, onMembersChange }) {
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState('MEMBER');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!addEmail.trim()) return;

    setAddLoading(true);
    try {
      const { data } = await api.post(`/projects/${projectId}/members`, {
        email: addEmail.trim(),
        role: addRole,
      });
      toast.success('Member added!');
      onMembersChange([...members, data.member]);
      setAddEmail('');
      setAddRole('MEMBER');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add member';
      setAddError(msg);
      toast.error(msg);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    setRemovingId(userId);
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
      toast.success('Member removed');
      onMembersChange(members.filter((m) => m.userId !== userId));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add member form — ADMIN only */}
      {isAdmin && (
        <form onSubmit={handleAddMember} className="card p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Member</h3>
          {addError && (
            <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1.5 rounded">
              {addError}
            </p>
          )}
          <div className="flex gap-2">
            <input
              type="email"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              className="input flex-1"
              placeholder="member@email.com"
            />
            <select
              value={addRole}
              onChange={(e) => setAddRole(e.target.value)}
              className="input w-32"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button
              type="submit"
              disabled={addLoading}
              className="btn-primary whitespace-nowrap flex items-center gap-2"
            >
              {addLoading ? <LoadingSpinner size="sm" /> : null}
              Add
            </button>
          </div>
        </form>
      )}

      {/* Member list */}
      <div className="space-y-2">
        {members.map((m) => (
          <div
            key={m.id}
            className="card px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {m.user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {m.user?.name}
                  {m.userId === currentUserId && (
                    <span className="ml-1.5 text-xs text-blue-500">(you)</span>
                  )}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{m.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`badge flex items-center gap-1 ${m.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                {m.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {m.role}
              </span>
              {isAdmin && m.userId !== currentUserId && (
                <button
                  onClick={() => handleRemove(m.userId)}
                  disabled={removingId === m.userId}
                  className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                  title="Remove member"
                >
                  {removingId === m.userId ? <LoadingSpinner size="sm" /> : <UserMinus className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

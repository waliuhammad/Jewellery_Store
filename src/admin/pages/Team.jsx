import React, { useState } from 'react';
import { UserPlus, Crown, Briefcase, Headphones, Trash2, Edit2, ShieldCheck, Check } from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import { Drawer, useAdminToast, ConfirmDialog, SelectInput } from '../components/ui';
import { formatDate } from '../lib/format';
import { mockData } from '../data/mockStore';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function Team() {
  const { admin } = useAdminAuth();
  const toast = useAdminToast();
  const [team, setTeam] = useState(mockData.team || []);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: '' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'manager',
  });

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast?.show('Please fill in all member fields', 'error');
      return;
    }

    const newMember = {
      id: `usr-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      joined: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setTeam((prev) => [...prev, newMember]);
    toast?.show(`Added ${newMember.name} as ${newMember.role}`, 'success');
    setDrawerOpen(false);
    setFormData({ name: '', email: '', role: 'manager' });
  };

  const handleToggleStatus = (id) => {
    const member = team.find((m) => m.id === id);
    if (member?.email === admin?.email) {
      toast?.show('You cannot deactivate your own account', 'error');
      return;
    }

    setTeam((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = m.status === 'active' ? 'inactive' : 'active';
          toast?.show(`${m.name} is now ${next}`, 'info');
          return { ...m, status: next };
        }
        return m;
      })
    );
  };

  const handleRoleChange = (id, newRole) => {
    const admins = team.filter((m) => m.role === 'admin' && m.status === 'active');
    const member = team.find((m) => m.id === id);

    if (member?.role === 'admin' && newRole !== 'admin' && admins.length <= 1) {
      toast?.show('Cannot demote the last remaining Administrator', 'error');
      return;
    }

    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    toast?.show('Role permissions updated', 'success');
  };

  const confirmRemove = () => {
    const { id } = deleteConfirm;
    const admins = team.filter((m) => m.role === 'admin');
    const member = team.find((m) => m.id === id);

    if (member?.role === 'admin' && admins.length <= 1) {
      toast?.show('Cannot remove the last remaining Administrator', 'error');
      setDeleteConfirm({ open: false, id: null, name: '' });
      return;
    }

    setTeam((prev) => prev.filter((m) => m.id !== id));
    toast?.show('Team member removed', 'info');
    setDeleteConfirm({ open: false, id: null, name: '' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        subtitle="Manage your staff roles, permissions and back-office access"
        action={
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium bg-ink text-ivory hover:bg-gold hover:text-ink rounded-md transition-colors"
          >
            <UserPlus size={16} /> Add Member
          </button>
        }
      />

      {/* 3 Role Definition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-paper p-5 rounded-lg border border-hairline space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-champagne text-ink flex items-center justify-center">
              <Crown size={16} />
            </div>
            <h4 className="font-display text-base font-semibold text-ink">Administrator</h4>
          </div>
          <p className="text-xs font-sans text-taupe leading-relaxed">
            Full root privileges including global store configuration, team role management, and
            permanent deletion rights.
          </p>
        </div>

        <div className="bg-paper p-5 rounded-lg border border-hairline space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E4EBE3] text-sage flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            <h4 className="font-display text-base font-semibold text-ink">Store Manager</h4>
          </div>
          <p className="text-xs font-sans text-taupe leading-relaxed">
            Manage products, categories, orders, transactions, discount coupons, customer reviews,
            and messages.
          </p>
        </div>

        <div className="bg-paper p-5 rounded-lg border border-hairline space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F6E9CF] text-[#8A6A1F] flex items-center justify-center">
              <Headphones size={16} />
            </div>
            <h4 className="font-display text-base font-semibold text-ink">Support Agent</h4>
          </div>
          <p className="text-xs font-sans text-taupe leading-relaxed">
            Order tracking updates, fulfillment notes, client inquiry replies, and customer details
            view only.
          </p>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-paper rounded-lg border border-hairline overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-cream border-b border-hairline text-[11px] text-taupe uppercase tracking-wider">
              <tr>
                <th scope="col" className="py-3 px-4 font-medium">Team Member</th>
                <th scope="col" className="py-3 px-4 font-medium">Email</th>
                <th scope="col" className="py-3 px-4 font-medium">Role</th>
                <th scope="col" className="py-3 px-4 font-medium">Joined</th>
                <th scope="col" className="py-3 px-4 font-medium">Status</th>
                <th scope="col" className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {team.map((m) => {
                const isSelf = m.email.toLowerCase() === admin?.email?.toLowerCase();
                return (
                  <tr key={m.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-ink">
                      <div className="flex items-center gap-2">
                        <span>{m.name}</span>
                        {isSelf && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-champagne text-ink">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-taupe">{m.email}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={m.role}
                        disabled={isSelf}
                        onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        className="px-2 py-1 text-xs font-sans bg-cream border border-hairline rounded text-ink focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="admin">Administrator</option>
                        <option value="manager">Store Manager</option>
                        <option value="support">Support Agent</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-taupe">{formatDate(m.joined)}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(m.id)}
                        disabled={isSelf}
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase font-sans ${
                          m.status === 'active'
                            ? 'bg-[#DDE9DE] text-sage'
                            : 'bg-hairline text-taupe'
                        } ${isSelf ? 'cursor-default' : 'hover:opacity-80'}`}
                      >
                        {m.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isSelf && (
                        <button
                          onClick={() => setDeleteConfirm({ open: true, id: m.id, name: m.name })}
                          className="p-1.5 text-taupe hover:text-garnet hover:bg-[#F3D9D6] rounded transition-colors"
                          aria-label="Remove member"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddMember} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ayesha Khan"
              className="w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ayesha@minhajewellers.com"
              className="w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-sans uppercase tracking-wider text-taupe font-medium mb-1">
              Assigned Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-sm font-sans bg-cream border border-hairline rounded-md text-ink"
            >
              <option value="admin">Administrator (Full Access)</option>
              <option value="manager">Store Manager (Products &amp; Orders)</option>
              <option value="support">Support Agent (Inquiries &amp; Tracking)</option>
            </select>
          </div>

          <div className="p-3 bg-cream rounded border border-hairline text-xs font-sans text-taupe">
            An invite email with temporary password credentials will be sent to the staff member.
          </div>

          <div className="pt-6 border-t border-hairline flex gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="flex-1 py-2 text-xs font-sans font-medium border border-ink/20 rounded text-taupe hover:bg-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-sans font-medium bg-ink text-ivory rounded hover:bg-gold hover:text-ink transition-colors"
            >
              Add Member
            </button>
          </div>
        </form>
      </Drawer>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Remove Team Member"
        message={`Are you sure you want to revoke back-office access for ${deleteConfirm.name}?`}
        confirmLabel="Remove"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: '' })}
      />
    </div>
  );
}

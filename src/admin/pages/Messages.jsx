import React, { useState } from 'react';
import { Mail, MessageSquare, Download, Trash2, Reply, Phone, Check, ExternalLink } from 'lucide-react';
import PageHeader from '../layouts/PageHeader';
import { Tabs, Drawer, useAdminToast, EmptyState, ConfirmDialog } from '../components/ui';
import { formatDate, exportCSV } from '../lib/format';
import { mockData } from '../data/mockStore';

export default function Messages() {
  const toast = useAdminToast();
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState(mockData.messages || []);
  const [subscribers, setSubscribers] = useState(mockData.subscribers || []);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: '', id: null });

  const unreadCount = messages.filter((m) => !m.read).length;

  const tabs = [
    { value: 'messages', label: 'Messages', count: unreadCount },
    { value: 'subscribers', label: 'Subscribers', count: subscribers.length },
  ];

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
      );
    }
  };

  const handleToggleRead = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: !m.read } : m))
    );
  };

  const handleDelete = () => {
    const { type, id } = deleteConfirm;
    if (type === 'message') {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      toast?.show('Message deleted', 'info');
    } else if (type === 'subscriber') {
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast?.show('Subscriber removed', 'info');
    }
    setDeleteConfirm({ open: false, type: '', id: null });
  };

  const handleExportSubscribers = () => {
    exportCSV(
      'minha-jewellers-subscribers',
      subscribers.map((s) => ({
        Email: s.email,
        DateSubscribed: formatDate(s.date),
        Status: s.status,
      })),
      ['Email', 'DateSubscribed', 'Status']
    );
    toast?.show('Subscriber list exported as CSV', 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbox"
        subtitle="Customer messages and newsletter subscribers"
        action={
          activeTab === 'subscribers' && (
            <button
              onClick={handleExportSubscribers}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium bg-noir text-ivory hover:bg-ink rounded-md transition-colors"
            >
              <Download size={15} /> Export CSV
            </button>
          )
        }
      />

      <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'messages' ? (
        messages.length === 0 ? (
          <div className="bg-paper rounded-lg border border-hairline p-12">
            <EmptyState
              icon={Mail}
              title="Your inbox is clear"
              message="No customer inquiries or contact requests at this moment."
            />
          </div>
        ) : (
          <div className="bg-paper rounded-lg border border-hairline overflow-hidden shadow-sm">
            <div className="divide-y divide-hairline">
              {messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleOpenMessage(m)}
                  className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                    !m.read
                      ? 'bg-[#FFF9ED] border-l-4 border-l-gold shadow-2xs hover:bg-[#FFF4DC]'
                      : 'hover:bg-cream/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRead(m.id);
                      }}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        !m.read ? 'bg-gold ring-2 ring-gold/30' : 'bg-hairline hover:bg-taupe'
                      }`}
                      title={!m.read ? 'Mark as read' : 'Mark as unread'}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-sans text-sm ${!m.read ? 'font-bold text-ink' : 'font-semibold text-ink/80'}`}>
                          {m.sender}
                        </span>
                        <span className="text-xs text-taupe hidden sm:inline font-medium">({m.email})</span>
                      </div>
                      <p className={`font-sans text-xs mt-0.5 line-clamp-1 ${!m.read ? 'text-ink font-semibold' : 'text-taupe font-medium'}`}>
                        {m.subject} — <span className={!m.read ? 'text-ink/80' : 'opacity-80'}>{m.message}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-sans text-taupe font-semibold">{formatDate(m.date)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({ open: true, type: 'message', id: m.id });
                      }}
                      className="p-1.5 text-taupe hover:text-garnet hover:bg-[#FCE7E6] rounded transition-colors"
                      aria-label="Delete message"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* Subscribers Tab */
        subscribers.length === 0 ? (
          <div className="bg-paper rounded-lg border border-hairline p-12">
            <EmptyState
              icon={Mail}
              title="No subscribers yet"
              message="Customers who subscribe to your newsletter will appear here."
            />
          </div>
        ) : (
          <div className="bg-paper rounded-lg border border-hairline overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead className="bg-cream border-b border-hairline text-[11px] text-taupe uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="py-3 px-4 font-medium">Subscriber Email</th>
                    <th scope="col" className="py-3 px-4 font-medium">Date Subscribed</th>
                    <th scope="col" className="py-3 px-4 font-medium">Status</th>
                    <th scope="col" className="py-3 px-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-cream/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-ink">{s.email}</td>
                      <td className="py-3.5 px-4 text-taupe">{formatDate(s.date)}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium font-sans uppercase bg-[#DDE9DE] text-sage">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setDeleteConfirm({ open: true, type: 'subscriber', id: s.id })}
                          className="p-1.5 text-taupe hover:text-garnet hover:bg-[#F3D9D6] rounded transition-colors"
                          aria-label="Remove subscriber"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Message Detail Drawer */}
      <Drawer
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title={selectedMessage?.subject || 'Client Inquiry'}
      >
        {selectedMessage && (
          <div className="p-6 space-y-6">
            <div className="pb-4 border-b border-hairline">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {selectedMessage.sender}
                  </h3>
                  <p className="text-xs text-taupe">{selectedMessage.email}</p>
                </div>
                <span className="text-xs text-taupe font-sans">
                  {formatDate(selectedMessage.date)}
                </span>
              </div>
              {selectedMessage.phone && (
                <p className="text-xs text-ink mt-2 flex items-center gap-1.5">
                  <Phone size={13} className="text-taupe" /> {selectedMessage.phone}
                </p>
              )}
            </div>

            <div>
              <h4 className="text-xs font-sans uppercase tracking-wider text-taupe font-semibold mb-2">
                Subject
              </h4>
              <p className="font-sans text-sm font-medium text-ink">{selectedMessage.subject}</p>
            </div>

            <div>
              <h4 className="text-xs font-sans uppercase tracking-wider text-taupe font-semibold mb-2">
                Message Body
              </h4>
              <div className="p-4 bg-cream rounded-lg border border-hairline text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">
                {selectedMessage.message}
              </div>
            </div>

            <div className="pt-4 border-t border-hairline flex flex-wrap gap-3">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="flex-1 py-2.5 text-center text-xs font-sans font-medium bg-ink text-ivory rounded hover:bg-gold hover:text-ink transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={15} /> Reply via Email
              </a>
              {selectedMessage.phone && (
                <a
                  href={`https://wa.me/92${selectedMessage.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 text-center text-xs font-sans font-medium bg-[#E4EBE3] text-sage rounded hover:bg-sage hover:text-ivory transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={15} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        isOpen={deleteConfirm.open}
        title="Confirm Deletion"
        message="Are you sure you want to permanently remove this entry?"
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ open: false, type: '', id: null })}
      />
    </div>
  );
}

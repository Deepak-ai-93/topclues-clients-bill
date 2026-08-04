'use client';

import React, { useState, useEffect } from 'react';
import { 
  getAdminClientsPageData, 
  createClient, 
  updateClient, 
  deleteClient, 
  regeneratePassword 
} from '../../../lib/actions';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Key, 
  X, 
  Mail, 
  User, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';

interface ClientProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(null);

  // Notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  // Forms
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAdminClientsPageData();
      setClients(data.clients as ClientProfile[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 5000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleOpenAddModal = () => {
    setClientName('');
    setEmail('');
    setPassword('');
    setTempPassword(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (client: ClientProfile) => {
    setSelectedClient(client);
    setClientName(client.name);
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !email) {
      triggerToast('Please fill in Client Name and Email.', true);
      return;
    }

    try {
      const res = await createClient({ clientName, email, password });
      if (res.success) {
        loadData();
        if (res.clientPassword) {
          setTempPassword(res.clientPassword);
          triggerToast(`Client account provisioned successfully.`);
        } else {
          setShowAddModal(false);
          triggerToast(`Client account provisioned successfully.`);
        }
      } else {
        triggerToast(res.error || 'Failed to create client.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !clientName) return;

    try {
      const res = await updateClient(selectedClient.id, { clientName });
      if (res.success) {
        loadData();
        setShowEditModal(false);
        triggerToast('Client profile updated successfully.');
      } else {
        triggerToast(res.error || 'Failed to update client profile.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleDelete = async (clientId: string, clientName: string) => {
    if (!confirm(`Are you sure you want to permanently delete the client account for "${clientName}"? This will delete all their billing documents and revoke their access.`)) {
      return;
    }

    try {
      const res = await deleteClient(clientId);
      if (res.success) {
        loadData();
        triggerToast('Client account permanently deleted.');
      } else {
        triggerToast(res.error || 'Failed to delete client account.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const handleResetPassword = async (clientId: string, clientName: string) => {
    if (!confirm(`Are you sure you want to regenerate the password for "${clientName}"?`)) {
      return;
    }

    try {
      const res = await regeneratePassword(clientId);
      if (res.success && res.newTempPassword) {
        alert(`Password regenerated successfully!\n\nNew Temporary Password: ${res.newTempPassword}\n\nPlease share this credential securely with the client.`);
        triggerToast('Password regenerated successfully.');
      } else {
        triggerToast(res.error || 'Failed to regenerate password.', true);
      }
    } catch (err: any) {
      triggerToast(err.message || 'An error occurred.', true);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Toast notifications */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-primary text-white rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold border border-primary-800">
          <CheckCircle className="w-4 h-4 text-accent-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-rose-950 text-white border border-rose-900 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Clients Console</h1>
          <p className="text-sm text-neutral-500 mt-1">Register new client accounts and manage security credentials.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white hover:bg-primary-700 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm flex items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by client name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400 font-mono">RETRIEVING PARTNERSHIP LOGS...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-16 text-center">
            <User className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-neutral-900">No client accounts found</h3>
            <p className="text-xs text-neutral-400 mt-1">Register a new client using the provisioning tool.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Client Name</th>
                  <th className="py-3 px-6">Email Address</th>
                  <th className="py-3 px-6">Created Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-neutral-50/40 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-900">{client.name}</td>
                    <td className="py-4 px-6 font-mono text-neutral-500">{client.email}</td>
                    <td className="py-4 px-6 text-neutral-500">
                      {new Date(client.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(client)}
                          className="p-1.5 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded-lg transition-all"
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(client.id, client.name)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id, client.name)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-neutral-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Add Client</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-neutral-400 hover:text-primary rounded-lg hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              {tempPassword ? (
                <div className="p-4 bg-accent-50 border border-accent-100 rounded-xl space-y-3">
                  <div className="flex gap-2">
                    <CheckCircle className="w-4 h-4 text-accent-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-xs font-semibold text-accent-800">Account Provisioned Successfully</h3>
                      <p className="text-[10px] text-accent-600 mt-0.5">Please share these temporary credentials securely with the client:</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-accent-100 font-mono text-[11px] space-y-1">
                    <div><span className="text-neutral-400">Email:</span> <span className="font-semibold text-neutral-800">{email}</span></div>
                    <div><span className="text-neutral-400">Password:</span> <span className="font-bold text-neutral-900 select-all">{tempPassword}</span></div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full py-1.5 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Client Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe or Acme Inc."
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="email"
                        required
                        placeholder="client@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Password (Optional)</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="password"
                        placeholder="Auto-generated if left blank"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-all cursor-pointer"
                    >
                      Add Client
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-neutral-200 w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-900">Edit Client Profile</h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 text-neutral-400 hover:text-primary rounded-lg hover:bg-neutral-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Email Address (Read-only)</label>
                <div className="relative opacity-60">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    disabled
                    value={selectedClient.email}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs text-neutral-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Client Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-2 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold hover:bg-neutral-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-700 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

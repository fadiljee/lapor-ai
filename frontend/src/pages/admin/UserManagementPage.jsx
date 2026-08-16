import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Users, Plus, Edit, Trash2, X, Check, Save } from 'lucide-react';
import { api } from '../../services/api';

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    role: 'warga',
    instansi: '',
    password: ''
  });
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getUsers();
      setUsers(res);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ nama: '', email: '', role: 'warga', instansi: '', password: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      nama: u.nama || '',
      email: u.email || '',
      role: u.role || 'warga',
      instansi: u.instansi || '',
      password: '' // Kosongkan password saat edit, isi jika ingin mengubah
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
    try {
      await api.deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Gagal menghapus pengguna");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Edit mode
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) delete dataToUpdate.password;
        await api.updateUser(editingUser.id, dataToUpdate);
      } else {
        // Create mode
        if (!formData.password) {
          alert('Password wajib diisi untuk pengguna baru');
          return;
        }
        await api.createUser(formData);
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Gagal menyimpan pengguna");
    }
  };

  const getRoleLabel = (role) => {
    const roleTitles = {
      warga: 'Warga',
      petugas: 'Petugas',
      admin: 'Admin'
    };
    return roleTitles[role] || role;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-bg-base">
        <div className="bg-white border border-border p-5 rounded-lg mb-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <h1 className="font-serif font-bold text-xl text-text-primary">
                Manajemen User
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Kelola hak akses pengguna, petugas, dan entitas terkait.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah User
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm font-semibold border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white border border-border rounded-lg overflow-x-auto shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 font-bold">Nama</th>
                <th className="p-3 font-bold">Email</th>
                <th className="p-3 font-bold">Role</th>
                <th className="p-3 font-bold">Instansi</th>
                <th className="p-3 font-bold">Terdaftar Pada</th>
                <th className="p-3 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-text-secondary animate-pulse font-medium">
                    Memuat data...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-text-secondary">
                    Belum ada data pengguna.
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="hover:bg-bg-base transition-colors">
                    <td className="p-3 font-semibold text-text-primary">{u.nama}</td>
                    <td className="p-3 text-text-secondary">{u.email}</td>
                    <td className="p-3">
                      <span className="bg-accent/10 text-accent font-bold px-2 py-1 rounded text-xs">
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td className="p-3 text-text-secondary">{u.instansi || '-'}</td>
                    <td className="p-3 text-text-secondary">{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="p-3 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal User Form */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-white">
              <h2 className="font-bold font-serif">{editingUser ? 'Edit User' : 'Tambah User Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="hover:bg-primary-dark p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Nama Lengkap</label>
                <input 
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                  placeholder="Masukkan nama pengguna..."
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Alamat Email</label>
                <input 
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm disabled:bg-bg-base disabled:text-text-secondary"
                  placeholder="email@contoh.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded focus:border-accent outline-none bg-white text-sm"
                  >
                    <option value="warga">Warga</option>
                    <option value="petugas">Petugas Verifikasi</option>
                    <option value="admin">Admin Instansi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">Instansi (Opsional)</label>
                  <input 
                    type="text"
                    value={formData.instansi}
                    onChange={(e) => setFormData({...formData, instansi: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded focus:border-accent outline-none text-sm"
                    placeholder="Contoh: BPBD"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">
                  Password {editingUser ? '(Kosongkan jika tidak diubah)' : '*'}
                </label>
                <input 
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded focus:border-accent outline-none transition-all text-sm"
                  placeholder="Masukkan password..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-border rounded text-sm font-semibold hover:bg-bg-base transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:opacity-90 text-white rounded text-sm font-bold transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

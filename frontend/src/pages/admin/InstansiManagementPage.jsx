import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Building2, Plus, Edit, Trash2, X, Check, Save } from 'lucide-react';
import { api } from '../../services/api';

export function InstansiManagementPage() {
  const [instansiList, setInstansiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: ''
  });

  useEffect(() => {
    fetchInstansi();
  }, []);

  const fetchInstansi = async () => {
    try {
      setLoading(true);
      const res = await api.getInstansi();
      setInstansiList(res || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Gagal memuat data instansi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ nama: '', deskripsi: '' });
    setShowModal(true);
  };

  const handleOpenEdit = (instansi) => {
    setEditingId(instansi.id);
    setFormData({ nama: instansi.nama, deskripsi: instansi.deskripsi || '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus instansi ini? User yang terhubung mungkin akan terdampak.")) return;
    try {
      await api.deleteInstansi(id);
      fetchInstansi();
    } catch (err) {
      alert(err.message || "Gagal menghapus instansi");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama) return;
    try {
      if (editingId) {
        await api.updateInstansi(editingId, formData);
      } else {
        await api.createInstansi(formData);
      }
      setShowModal(false);
      fetchInstansi();
    } catch (err) {
      alert(err.message || "Gagal menyimpan instansi");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 bg-bg-base">
        <div className="bg-white border border-border p-5 rounded-lg mb-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-primary" />
            <div>
              <h1 className="font-serif font-bold text-xl text-text-primary">
                Manajemen Instansi
              </h1>
              <p className="text-xs text-text-secondary mt-1">
                Kelola daftar instansi atau dinas teknis yang menjadi tujuan disposisi pengaduan.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Instansi
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
                <th className="p-3 font-bold">Nama Instansi</th>
                <th className="p-3 font-bold">Deskripsi</th>
                <th className="p-3 font-bold">Tanggal Dibuat</th>
                <th className="p-3 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-text-secondary animate-pulse font-medium">
                    Memuat data...
                  </td>
                </tr>
              ) : instansiList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-text-secondary">
                    Belum ada data instansi.
                  </td>
                </tr>
              ) : (
                instansiList.map(inst => (
                  <tr key={inst.id} className="hover:bg-bg-base transition-colors">
                    <td className="p-3 font-semibold text-text-primary">{inst.nama}</td>
                    <td className="p-3 text-text-secondary">{inst.deskripsi || '-'}</td>
                    <td className="p-3 text-text-secondary">{new Date(inst.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="p-3 flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(inst)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit Instansi"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(inst.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus Instansi"
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

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-white">
              <h2 className="font-bold font-serif">{editingId ? 'Edit Instansi' : 'Tambah Instansi Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="hover:bg-primary-dark p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Nama Instansi</label>
                <input 
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                  placeholder="Misal: Dinas Sosial (Dinsos)"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-text-secondary mb-1">Deskripsi Singkat</label>
                <textarea 
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
                  placeholder="Keterangan opsional"
                  rows={3}
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
                  disabled={!formData.nama}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:opacity-90 text-white rounded text-sm font-bold transition-colors shadow-sm disabled:opacity-50"
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

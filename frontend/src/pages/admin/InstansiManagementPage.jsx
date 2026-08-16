import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

export function InstansiManagementPage() {
  const [instansiList, setInstansiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newInstansi, setNewInstansi] = useState({ nama: '', deskripsi: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInstansi();
  }, []);

  const fetchInstansi = async () => {
    try {
      setLoading(true);
      const res = await api.get('/instansi');
      setInstansiList(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal memuat data instansi');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstansi = async (e) => {
    e.preventDefault();
    if (!newInstansi.nama) return;
    
    try {
      setIsSubmitting(true);
      const res = await api.post('/instansi', newInstansi);
      setInstansiList([...instansiList, res.data]);
      setNewInstansi({ nama: '', deskripsi: '' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal menambahkan instansi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInstansi = async (id) => {
    if (!window.confirm('Yakin ingin menghapus instansi ini? User yang menggunakan instansi ini mungkin akan terdampak.')) return;
    
    try {
      await api.delete(`/instansi/${id}`);
      setInstansiList(instansiList.filter(i => i.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || 'Gagal menghapus instansi');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-heading text-text-primary flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary" />
          Manajemen Instansi
        </h1>
        <p className="text-text-secondary">
          Kelola daftar instansi atau dinas teknis yang menjadi tujuan disposisi pengaduan.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-border-color p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Tambah Instansi Baru
            </h2>
            <form onSubmit={handleAddInstansi} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Nama Instansi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newInstansi.nama}
                  onChange={e => setNewInstansi({...newInstansi, nama: e.target.value})}
                  className="w-full px-4 py-2 border border-border-color rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Misal: Dinas Sosial (Dinsos)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={newInstansi.deskripsi}
                  onChange={e => setNewInstansi({...newInstansi, deskripsi: e.target.value})}
                  className="w-full px-4 py-2 border border-border-color rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="Keterangan opsional"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !newInstansi.nama}
                className="w-full py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Menyimpan...' : 'Simpan Instansi'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-border-color overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-base border-b border-border-color">
                    <th className="py-4 px-6 text-sm font-bold text-text-primary">Nama Instansi</th>
                    <th className="py-4 px-6 text-sm font-bold text-text-primary">Deskripsi</th>
                    <th className="py-4 px-6 text-sm font-bold text-text-primary text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-text-secondary">Memuat data...</td>
                    </tr>
                  ) : instansiList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-text-secondary">Belum ada data instansi</td>
                    </tr>
                  ) : (
                    instansiList.map((inst) => (
                      <tr key={inst.id} className="border-b border-border-color last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-semibold text-text-primary">{inst.nama}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-text-secondary">
                          {inst.deskripsi || '-'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteInstansi(inst.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
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
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Mail, Phone } from 'lucide-react';
import API from '../services/api';
import { formatDate } from '../utils/formatters';
import AdminLayout from '../components/AdminLayout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/auth/users');
        setUsers(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="font-playfair font-bold text-3xl text-charcoal dark:text-white">
            Registered Clients & Accounts
          </h1>
          <p className="text-xs text-gray-400">Overview of active registered user accounts.</p>
        </div>

        <div className="bg-white dark:bg-darkbg-card rounded-3xl border border-lilac-soft overflow-hidden shadow-luxury">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-warm dark:bg-darkbg-input text-gray-700 dark:text-gray-200 font-semibold">
              <tr>
                <th className="p-4">Client Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-cream-warm/40 transition">
                  <td className="p-4 flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover border" />
                    <span className="font-bold text-charcoal dark:text-white">{u.name}</span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'admin' ? 'bg-plum-primary text-white' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

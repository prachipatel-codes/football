'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/store/auth';
import toast from 'react-hot-toast';

export default function AdminUsers(){
  const [users, setUsers] = useState<any[]>([]);
  const load = ()=> apiFetch('/api/admin/users').then(r=>r.json()).then(d=>setUsers(d.users||[]));
  useEffect(()=>{ load(); }, []);
  async function toggle(u:any){
    const role = u.role==='ADMIN'?'PLAYER':'ADMIN';
    if(!confirm(`Make ${u.name} ${role}?`)) return;
    const res = await apiFetch('/api/admin/users', { method:'PATCH', body: JSON.stringify({ userId:u.id, role })});
    if(res.ok){ toast.success('Updated'); load(); } else toast.error('fail');
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full text-sm">
        <thead className="bg-white/[0.04] text-white/60">
          <tr><th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Phone</th><th className="text-left p-3">City</th><th className="text-left p-3">Role</th><th></th></tr>
        </thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id} className="border-t border-white/8">
              <td className="p-3">{u.name}</td>
              <td className="p-3 text-white/70">{u.email}</td>
              <td className="p-3 text-white/70">{u.phone}</td>
              <td className="p-3">{u.city||'—'}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3 text-right">
                <button onClick={()=>toggle(u)} className="text-xs px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/5">
                  {u.role==='ADMIN' ? 'Demote' : 'Promote'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

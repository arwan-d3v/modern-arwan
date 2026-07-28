"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";
import { ref, get, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";

export default function UsersManagementPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(rtdb, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const usersList = Object.values(data) as UserProfile[];
          setUsers(usersList);
        }
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (uid: string, newRole: UserRole) => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/updateRole', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid, role: newRole })
      });
      if (!res.ok) {
        throw new Error('Failed to update role');
      }
      
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error(error);
      alert("Failed to update role");
    }
  };

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="p-8 min-h-screen bg-background text-foreground">
        <h1 className="text-3xl font-bold mb-8 text-accent-cyan">User Management</h1>
        
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-white/10">
              <thead>
                <tr className="bg-white/5">
                  <th className="p-4 border border-white/10">User</th>
                  <th className="p-4 border border-white/10">Email</th>
                  <th className="p-4 border border-white/10">Role</th>
                  <th className="p-4 border border-white/10">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.uid} className="border border-white/10">
                    <td className="p-4 flex items-center gap-3">
                      {u.photoURL ? (
                        <img src={u.photoURL} alt={u.displayName || "User"} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">?</div>
                      )}
                      <span>{u.displayName || u.uid}</span>
                    </td>
                    <td className="p-4 text-white/70">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${u.role === 'super_admin' ? 'bg-red-500/20 text-red-400' : u.role === 'family' ? 'bg-accent-cyan/20 text-accent-cyan' : 'bg-white/10'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleUpdate(u.uid, e.target.value as UserRole)}
                        className="bg-background border border-white/20 p-2 rounded text-sm outline-none"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="family">Family</option>
                        <option value="pro">Pro</option>
                        <option value="student">Student</option>
                        <option value="guest">Guest</option>
                        <option value="public">Public</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

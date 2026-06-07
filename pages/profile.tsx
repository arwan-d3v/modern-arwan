// pages/profile.tsx
import { useState } from 'react';
import Image from 'next/image';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('guest');
  const [avatar, setAvatar] = useState('/avatar_placeholder.png');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook into Firebase Auth / Realtime DB to persist changes.
    console.log('Profile saved', { name, email, role, avatar });
    alert('Profile saved (mock).');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', background: '#1a1a1a', color: '#fff', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center' }}>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label>
            Name:
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </label>
          <label>
            Email:
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </label>
          <label>
            Role:
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
              <option value="guest">Guest</option>
              <option value="family">Family</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </label>
          <label>
            Avatar:
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Image src={avatar} alt="Avatar" width={80} height={80} style={{ borderRadius: '50%' }} />
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </label>
          <button type="submit" style={{ padding: '0.75rem', background: '#00f2ff', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
}

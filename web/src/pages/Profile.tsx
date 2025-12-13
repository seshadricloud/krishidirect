import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Profile() {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    api.get('/auth/me').then(r => setProfile(r.data)).catch(() => setProfile(null));
  }, []);
  if (!profile) return <div>Please log in</div>;
  return <div><h2>{profile.name ?? 'Profile'}</h2><pre>{JSON.stringify(profile, null, 2)}</pre></div>;
}
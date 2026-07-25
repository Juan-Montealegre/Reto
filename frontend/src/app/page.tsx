'use client';

import { useState, useEffect } from 'react';

interface Repo {
  name: string;
  description: string;
  html_url: string;
  stars: number;
  forks: number;
  language: string;
  updated_at: string;
}

interface GitHubProfile {
  username: string;
  name: string;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
  location: string;
  company: string;
  blog: string;
  twitter_username: string;
  created_at: string;
  repos: Repo[];
}

export default function Home() {
  const [usernameInput, setUsernameInput] = useState('');
  const [currentUsername, setCurrentUsername] = useState('Juan-Montealegre');
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (username: string) => {
    if (!username.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3001/user/${username}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Usuario "${username}" no encontrado.`);
        }
        throw new Error('Ocurrió un error al obtener el perfil.');
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setProfile(null);
      setError(err instanceof Error ? err.message : 'Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile(currentUsername);
  }, [currentUsername]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) {
      setCurrentUsername(usernameInput.trim());
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>GitHub Profile Viewer</h1>
      </header>

      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Obteniendo datos de GitHub...</p>
        </div>
      )}

      {error && !loading && (
        <div className="error-card">
          <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Ups! Algo salió mal</p>
          <p>{error}</p>
        </div>
      )}

      {profile && !loading && !error && (
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-wrapper">
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="avatar-img"
              />
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{profile.name}</h2>
              <a
                href={profile.html_url}
                target="_blank"
                rel="noreferrer"
                className="profile-username"
              >
                @{profile.username}
              </a>
              <p className="profile-bio">{profile.bio}</p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">{profile.public_repos}</span>
              <span className="stat-label">Repos</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.public_gists}</span>
              <span className="stat-label">Gists</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.followers}</span>
              <span className="stat-label">Seguidores</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.following}</span>
              <span className="stat-label">Siguiendo</span>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </span>
              <span>{profile.location}</span>
            </div>

            <div className="detail-item">
              <span className="detail-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18v3H3V3Z" />
                </svg>
              </span>
              <span>{profile.company}</span>
            </div>

            {profile.blog && (
              <div className="detail-item">
                <span className="detail-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253m0 0A17.919 17.919 0 0 0 12 10.5c2.998 0 5.74 1.1 7.843 2.918" />
                  </svg>
                </span>
                <a
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noreferrer"
                  className="detail-link"
                >
                  {profile.blog}
                </a>
              </div>
            )}

            {profile.twitter_username && (
              <div className="detail-item">
                <span className="detail-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
                <a
                  href={`https://x.com/${profile.twitter_username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="detail-link"
                >
                  @{profile.twitter_username}
                </a>
              </div>
            )}
          </div>

          {profile.repos && profile.repos.length > 0 && (
            <div className="repos-section">
              <h3 className="repos-title">Últimos Repositorios</h3>
              <div className="repos-grid">
                {profile.repos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-card"
                  >
                    <div className="repo-header">
                      <span className="repo-name" title={repo.name}>{repo.name}</span>
                      <span className="repo-lang">{repo.language}</span>
                    </div>
                    <p className="repo-desc">{repo.description}</p>
                    <div className="repo-stats">
                      <span className="repo-stat">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.178-.372.673-.372.85 0l2.25 4.67 5.097.74c.408.06.57.561.275.855l-3.69 3.6 1.01 5.065c.08.402-.34.708-.707.513L12 18.257l-4.57 2.4c-.367.195-.788-.11-.707-.512l1.01-5.066-3.69-3.6c-.294-.294-.131-.795.275-.855l5.097-.74 2.25-4.67Z" />
                        </svg>
                        {repo.stars}
                      </span>
                      <span className="repo-stat">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="14" height="14">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                        </svg>
                        {repo.forks}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="contributions-section">
            <h3 className="repos-title">Contribuciones en el último año</h3>
            <div className="contributions-chart-wrapper">
              <img
                src={`https://ghchart.rshah.org/8b5cf6/${profile.username}`}
                alt={`Contribuciones de ${profile.name}`}
                className="contributions-chart"
              />
            </div>
          </div>

          <div className="card-footer">
            <a
              href={profile.html_url}
              target="_blank"
              rel="noreferrer"
              className="github-btn"
            >
              <span>Ver en GitHub</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="16" height="16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

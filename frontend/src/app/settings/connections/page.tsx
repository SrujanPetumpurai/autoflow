  'use client'
  import { useEffect, useState } from 'react'
  import ConnectorCard from '@/components/ConnectorCard'
  import { BACKEND_URL } from '@/app/config'
  import axios from 'axios'

  type Provider = {
    id: string;
    name: string;
    icon: string;
    scopes: string[];
    isActive: boolean;
    isConnected: boolean;
  }

  export default function Connections() {
    const [connections, setConnections] = useState<Provider[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const getProviders = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get(`${BACKEND_URL}/api/v1/provider`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          setConnections(response.data)
        } finally {
          setLoading(false)
        }
      }
      getProviders()
    }, [])

    const handleDisconnect = async (providerId: string) => {
      const token = localStorage.getItem('token')
      await axios.delete(`${BACKEND_URL}/api/v1/provider/${providerId}/disconnect`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setConnections(prev => prev.map(c =>
        c.id === providerId ? { ...c, isConnected: false } : c
      ))
    }

    const connected = connections.filter(c => c.isConnected)
    const available = connections.filter(c => !c.isConnected)

    return (
      <div className="connections-page">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

          .connections-page {
            min-height: 100vh;
            background: #0a0a0f;
            font-family: 'DM Sans', sans-serif;
            color: #e8e8f0;
            padding: 48px 32px;
          }

          .connections-header {
            margin-bottom: 52px;
          }

          .connections-eyebrow {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #6b6b8a;
            margin-bottom: 12px;
          }

          .connections-title {
            font-family: 'Syne', sans-serif;
            font-size: clamp(32px, 5vw, 48px);
            font-weight: 800;
            color: #f0f0fa;
            line-height: 1.05;
            margin: 0 0 16px;
            letter-spacing: -0.02em;
          }

          .connections-subtitle {
            font-size: 15px;
            color: #6b6b8a;
            font-weight: 300;
            max-width: 420px;
            line-height: 1.6;
          }

          .connections-stats {
            display: flex;
            gap: 32px;
            margin-top: 36px;
            padding-top: 36px;
            border-top: 1px solid rgba(255,255,255,0.06);
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .stat-value {
            font-family: 'Syne', sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: #f0f0fa;
            line-height: 1;
          }

          .stat-value.accent {
            color: #7c6af7;
          }

          .stat-label {
            font-size: 12px;
            color: #6b6b8a;
            font-weight: 400;
            letter-spacing: 0.05em;
          }

          .stat-divider {
            width: 1px;
            background: rgba(255,255,255,0.06);
            align-self: stretch;
          }

          .section {
            margin-bottom: 40px;
          }

          .section-label {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
          }

          .section-label-text {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #6b6b8a;
          }

          .section-label-line {
            flex: 1;
            height: 1px;
            background: rgba(255,255,255,0.06);
          }

          .section-badge {
            font-size: 11px;
            font-weight: 500;
            color: #7c6af7;
            background: rgba(124, 106, 247, 0.12);
            border: 1px solid rgba(124, 106, 247, 0.2);
            border-radius: 20px;
            padding: 2px 10px;
            font-family: 'DM Sans', sans-serif;
          }

          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 12px;
          }

          .loading-state {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .skeleton-card {
            height: 80px;
            border-radius: 14px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            animation: shimmer 1.6s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }

          .skeleton-card::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%);
            animation: sweep 1.6s ease-in-out infinite;
          }

          @keyframes shimmer {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }

          @keyframes sweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .empty-state {
            padding: 40px;
            text-align: center;
            border-radius: 16px;
            border: 1px dashed rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.015);
          }

          .empty-state-icon {
            font-size: 32px;
            margin-bottom: 12px;
            opacity: 0.5;
          }

          .empty-state-text {
            font-size: 14px;
            color: #6b6b8a;
          }

          @media (max-width: 640px) {
            .connections-page { padding: 32px 20px; }
            .connections-stats { gap: 20px; }
            .cards-grid { grid-template-columns: 1fr; }
          }
        `}</style>

        <div className="connections-header">
          <p className="connections-eyebrow">Integrations</p>
          <h1 className="connections-title">Connections</h1>
          <p className="connections-subtitle">
            Manage your third-party integrations and control what data each service can access.
          </p>

          {!loading && (
            <div className="connections-stats">
              <div className="stat-item">
                <span className="stat-value accent">{connected.length}</span>
                <span className="stat-label">Connected</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">{connections.length}</span>
                <span className="stat-label">Total available</span>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        ) : (
          <>
            {connected.length > 0 && (
              <div className="section">
                <div className="section-label">
                  <span className="section-label-text">Active</span>
                  <div className="section-label-line" />
                  <span className="section-badge">{connected.length}</span>
                </div>
                <div className="cards-grid">
                  {connected.map(provider => (
                    <ConnectorCard
                      key={provider.id}
                      providerId={provider.id}
                      icon={provider.icon}
                      name={provider.name}
                      isConnected={provider.isConnected}
                      onDisconnect={() => handleDisconnect(provider.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {available.length > 0 && (
              <div className="section">
                <div className="section-label">
                  <span className="section-label-text">Available</span>
                  <div className="section-label-line" />
                </div>
                <div className="cards-grid">
                  {available.map(provider => (
                    <ConnectorCard
                      key={provider.id}
                      providerId={provider.id}
                      icon={provider.icon}
                      name={provider.name}
                      isConnected={provider.isConnected}
                      onDisconnect={() => handleDisconnect(provider.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {connections.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">⚡</div>
                <p className="empty-state-text">No integrations available yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    )
  }
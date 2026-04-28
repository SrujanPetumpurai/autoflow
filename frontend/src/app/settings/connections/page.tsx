'use client'
import { useEffect, useState } from 'react'
import ConnectorCard from '@/components/ConnectorCard'
import { BACKEND_URL } from '@/app/config'
import axios from 'axios'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { Plug, Globe } from 'lucide-react'
import BackArrow from '@/components/BackArrow'
import { Appbar } from '@/components/Appbar'
type Provider = {
  id: string
  name: string
  icon: string
  scopes: string[]
  isActive: boolean
  isConnected: boolean
}

export default function Connections() {
  const [connections, setConnections] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProviders = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${BACKEND_URL}/api/v1/provider`, {
          headers: { Authorization: `Bearer ${token}` },
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
      headers: { Authorization: `Bearer ${token}` },
    })
    setConnections((prev) =>
      prev.map((c) => (c.id === providerId ? { ...c, isConnected: false } : c))
    )
  }

  const connected = connections.filter((c) => c.isConnected)
  const available = connections.filter((c) => !c.isConnected)

  return (
    
    <div className="min-h-screen bg-background text-foreground">
      <Appbar></Appbar>
      <BackArrow></BackArrow>
      {/* Top accent line */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto max-w-3xl px-6 py-14 md:px-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-muted">
              <Plug className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              Integrations
            </span>
          </div>

          <h1 className="mb-2 text-[26px] font-medium tracking-tight text-foreground">
            Connections
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Manage your third‑party integrations and control what data each service can access.
          </p>

          {/* Stats pill */}
          {!loading && (
            <div className="mt-6 flex w-fit overflow-hidden rounded-xl border border-border bg-muted/40">
              <div className="flex flex-col gap-0.5 px-5 py-3">
                <span className="text-[22px] font-medium leading-none text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {connected.length}
                </span>
                <span className="text-[11px] tracking-wide text-muted-foreground">Connected</span>
              </div>
              <div className="w-px bg-border" />
              <div className="flex flex-col gap-0.5 px-5 py-3">
                <span className="text-[22px] font-medium leading-none tabular-nums">
                  {connections.length}
                </span>
                <span className="text-[11px] tracking-wide text-muted-foreground">Total available</span>
              </div>
              <div className="w-px bg-border" />
              <div className="flex flex-col gap-0.5 px-5 py-3">
                <span className="text-[22px] font-medium leading-none text-muted-foreground tabular-nums">
                  {available.length}
                </span>
                <span className="text-[11px] tracking-wide text-muted-foreground">Not connected</span>
              </div>
            </div>
          )}
        </div>

        <Separator className="mb-8" />

        {/* ── Skeletons ── */}
        {loading && (
          <div className="space-y-10">
            {[2, 4].map((count, i) => (
              <div key={i}>
                <div className="mb-4 flex items-center gap-3">
                  <Skeleton className="h-3 w-14 rounded" />
                  <Skeleton className="h-px flex-1" />
                </div>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: count }).map((_, j) => (
                    <Skeleton key={j} className="h-[66px] rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Content ── */}
        {!loading && (
          <div className="space-y-10">

            {/* Connected */}
            {connected.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                      Active
                    </span>
                  </div>
                  <Separator className="flex-1" />
                  <Badge variant="secondary" className="rounded-full px-2.5 text-[11px] font-medium">
                    {connected.length}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2">
                  {connected.map((provider) => (
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
              </section>
            )}

            {/* Available */}
            {available.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                    <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                      Available
                    </span>
                  </div>
                  <Separator className="flex-1" />
                </div>
                <div className="flex flex-col gap-2">
                  {available.map((provider) => (
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
              </section>
            )}

            {/* Empty */}
            {connections.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No integrations yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Available integrations will appear here once configured.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
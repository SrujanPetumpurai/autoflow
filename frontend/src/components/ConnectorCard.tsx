import { PROVIDER_CONFIG } from "@/app/config"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Unplug, Plug } from "lucide-react"
import { useState } from "react"

export default function ConnectorCard({
  icon,
  name,
  isConnected,
  providerId,
  onDisconnect,
}: {
  icon: string
  name: string
  providerId: string
  isConnected: boolean
  onDisconnect: () => void
}) {
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    setLoading(true)
    try {
      const config = PROVIDER_CONFIG[providerId]
      const token = localStorage.getItem("token")
      const response = await axios.get(config.connectUrl, {
        headers: { Authorization: `Bearer ${token}` },
      })
      window.location.href = response.data.url
    } finally {
      setLoading(false)
    }
  }

  const handleDisconnect = () => {
    setLoading(true)
    try {
      onDisconnect()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="group transition-all duration-200 hover:shadow-md hover:border-border/80">
      <CardContent className="flex items-center justify-between gap-4 p-4">

        {/* Left: icon + name + status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted p-1.5">
              <img
                src={icon}
                alt={name}
                className="h-full w-full object-contain"
              />
            </div>
            {/* Connection status dot */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background ${
                isConnected ? "bg-emerald-500" : "bg-muted-foreground/30"
              }`}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {name}
            </p>
            <Badge
              variant={isConnected ? "secondary" : "outline"}
              className={`mt-0.5 h-4 rounded-sm px-1.5 text-[10px] font-medium tracking-wide ${
                isConnected
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                  : "text-muted-foreground"
              }`}
            >
              {isConnected ? "Connected" : "Not connected"}
            </Badge>
          </div>
        </div>

        {/* Right: action button */}
        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={handleDisconnect}
            className="flex-shrink-0 border-destructive/40 text-destructive hover:bg-destructive/5 hover:border-destructive hover:text-destructive"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Unplug className="h-3.5 w-3.5" />
            )}
            <span className="ml-1.5">Disconnect</span>
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={loading}
            onClick={handleConnect}
            className="flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plug className="h-3.5 w-3.5" />
            )}
            <span className="ml-1.5">Connect</span>
          </Button>
        )}

      </CardContent>
    </Card>
  )
}
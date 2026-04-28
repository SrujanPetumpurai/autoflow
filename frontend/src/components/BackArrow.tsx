import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export default function BackArrow() {
  const router = useRouter()
  return (
    <button className="absolute left-20 top-20 transition-colors hover:text-gray-400" onClick={() => router.back()}>
      <ArrowLeft className="h-4 w-4" />
    </button>
  )
}
"use client";
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Appbar = () => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
            <div className="flex justify-between gap-8 items-center">
                <div
                    className="text-xl font-extrabold tracking-tight text-slate-900 cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    Autoflow
                </div>
                <Button
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    Home
                </Button>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-slate-900"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" /> Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/settings/connections")} className="text-destructive focus:text-destructive">
                            <Link2 className="mr-2 h-4 w-4" /> Connections
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    variant="ghost"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    onClick={() => router.push('/about')}
                >
                    About
                </Button>

                <Button
                    variant="ghost"
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                    onClick={() => router.push("/login")}
                >
                    Login
                </Button>

                <Button
                    className="rounded-full bg-green-700 px-5 text-sm font-semibold text-white hover:bg-green-800 transition-all hover:-translate-y-0.5 hover:shadow-md"
                    onClick={() => router.push("/signup")}
                >
                    Signup
                </Button>
            </div>
        </div>
    )
}
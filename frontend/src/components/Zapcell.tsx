import { cn } from "@/lib/utils"
import { Plus, Zap } from "lucide-react"

export const ZapCell = ({
    name,
    index,
    onClick
}: {
    name?: string;
    index: number;
    onClick: () => void;
}) => {
    const isTrigger = index === 1;
    const isEmpty = !name || name === "Trigger" || name === "Action";

    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative w-[320px] cursor-pointer rounded-2xl border bg-white p-5 shadow-sm",
                "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                isTrigger
                    ? "border-orange-200 hover:border-orange-400"
                    : "border-slate-200 hover:border-slate-400",
                isEmpty && "border-dashed"
            )}
        >
            <div className={cn(
                "absolute -top-2.5 -left-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold shadow-sm",
                isTrigger
                    ? "bg-orange-500 text-white"
                    : "bg-slate-700 text-white"
            )}>
                {index}
            </div>

            <div className="flex items-center gap-3">
                <div className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl",
                    isTrigger ? "bg-orange-50" : "bg-slate-50"
                )}>
                    <Zap className={cn(
                        "h-4 w-4",
                        isTrigger ? "text-orange-500" : "text-slate-400"
                    )} />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                        {isTrigger ? "Trigger" : "Action"}
                    </p>
                    <p className={cn(
                        "truncate text-sm font-medium",
                        isEmpty ? "text-slate-300" : "text-slate-800"
                    )}>
                        {isEmpty ? `Click to select ${isTrigger ? "trigger" : "action"}` : name}
                    </p>
                </div>

              
                <Plus className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:rotate-90",
                    isEmpty ? "text-slate-300" : "text-slate-400",
                    !isEmpty && "rotate-45"
                )} />
            </div>
        </div>
    )
}
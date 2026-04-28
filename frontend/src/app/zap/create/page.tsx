"use client";

import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { Input } from "@/components/Input";
import { ZapCell } from "@/components/Zapcell";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus, Zap } from "lucide-react"

function useAvailableActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState([]);
    const [availableTriggers, setAvailableTriggers] = useState([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`)
            .then(x => setAvailableTriggers(x.data.availableTriggers))
        axios.get(`${BACKEND_URL}/api/v1/action/available`)
            .then(x => setAvailableActions(x.data.availableActions))
    }, [])

    return { availableActions, availableTriggers }
}

export default function() {
    const router = useRouter();
    const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();

    const [selectedTrigger, setSelectedTrigger] = useState<{
        id: string;
        name: string;
    }>();
    const [selectedActions, setSelectedActions] = useState<{
        index: number;
        availableActionId: string;
        availableActionName: string;
        metadata: any;
    }[]>([]);
    const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

    return (
        <div className="min-h-screen bg-slate-50">
            <Appbar />

            {/* Top bar */}
            <div className="flex items-center justify-between  border-slate-200 bg-white px-6 py-3 ">
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-slate-600">New Zap</span>
                </div>
                <Button
                    onClick={async () => {
                        if (!selectedTrigger?.id) return;
                        await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                            availableTriggerId: selectedTrigger.id,
                            triggerMetadata: {},
                            actions: selectedActions.map(a => ({
                                availableActionId: a.availableActionId,
                                actionMetadata: a.metadata,
                            }))
                        }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                        });
                        router.push("/dashboard");
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                    Publish
                </Button>
            </div>

            {/* Canvas */}
            <div className="flex min-h-[calc(100vh-112px)] flex-col items-center justify-center py-16">

                {/* Flow line container */}
                <div className="flex flex-col items-center gap-0">

                    {/* Trigger */}
                    <ZapCell
                        onClick={() => setSelectedModalIndex(1)}
                        name={selectedTrigger?.name ?? "Trigger"}
                        index={1}
                    />

                    {/* Connector line + actions */}
                    {(selectedActions.length > 0 || true) && (
                        <>
                            {selectedActions.map((action) => (
                                <div key={action.index} className="flex flex-col items-center">
                                    {/* Vertical line */}
                                    <div className="h-8 w-px bg-slate-300" />
                                    <ZapCell
                                        onClick={() => setSelectedModalIndex(action.index)}
                                        name={action.availableActionName || "Action"}
                                        index={action.index}
                                    />
                                </div>
                            ))}

                            {/* Add action button */}
                            <div className="flex flex-col items-center">
                                <div className="h-8 w-px bg-slate-300" />
                                <button
                                    onClick={() => {
                                        setSelectedActions(a => [...a, {
                                            index: a.length + 2,
                                            availableActionId: "",
                                            availableActionName: "",
                                            metadata: {}
                                        }])
                                    }}
                                    className="group flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white text-slate-400 shadow-sm transition-all duration-200 hover:border-orange-400 hover:text-orange-500 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <Plus className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {selectedModalIndex !== null && (
                <Modal
                    availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions}
                    onSelect={(props) => {
                        if (props === null) {
                            setSelectedModalIndex(null);
                            return;
                        }
                        if (selectedModalIndex === 1) {
                            setSelectedTrigger({ id: props.id, name: props.name });
                        } else {
                            setSelectedActions(a => {
                                const newActions = [...a];
                                newActions[selectedModalIndex - 2] = {
                                    index: selectedModalIndex,
                                    availableActionId: props.id,
                                    availableActionName: props.name,
                                    metadata: props.metadata
                                };
                                return newActions;
                            });
                        }
                        setSelectedModalIndex(null);
                    }}
                    index={selectedModalIndex}
                />
            )}
        </div>
    )
}

function Modal({ index, onSelect, availableItems }: {
    index: number;
    onSelect: (props: null | { name: string; id: string; metadata: any }) => void;
    availableItems: { summary?: string; id: string; name: string; image: string }[];
}) {
    const [step, setStep] = useState(0);
    const [selectedAction, setSelectedAction] = useState<{ id: string; name: string }>();
    const isTrigger = index === 1;

    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open) onSelect(null) }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isTrigger ? "bg-orange-50" : "bg-slate-50"}`}>
                            <Zap className={`h-3.5 w-3.5 ${isTrigger ? "text-orange-500" : "text-slate-500"}`} />
                        </div>
                        <DialogTitle className="text-base">
                            Select {isTrigger ? "Trigger" : "Action"}
                        </DialogTitle>
                    </div>
                </DialogHeader>

                {/* Step 0 — pick item */}
                {step === 0 && (
                    <Accordion type="single" collapsible className="max-w-lg">
                        {availableItems.map(({ id, name, image, summary }) => (
                            <AccordionItem key={id} value={id}>
                                <AccordionTrigger className="hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <img className="h-5 w-5 rounded" src={image} alt={name} />
                                        <span className="text-sm font-medium">{name}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-3 pl-8">
                                    <p className="text-sm italic text-muted-foreground">{summary}</p>
                                    <Button
                                        className="w-fit self-end transition-all hover:-translate-y-0.5 hover:shadow-sm"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (isTrigger) {
                                                onSelect({ id, name, metadata: {} });
                                            } else {
                                                setStep(1);
                                                setSelectedAction({ id, name });
                                            }
                                        }}
                                    >
                                        Select
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}

                {/* Step 1 — configure */}
                {step === 1 && selectedAction?.id === "email" && (
                    <EmailSelector setMetadata={(metadata) => onSelect({ ...selectedAction, metadata })} />
                )}
                {step === 1 && selectedAction?.id === "send-sol" && (
                    <SolanaSelector setMetadata={(metadata) => onSelect({ ...selectedAction, metadata })} />
                )}
            </DialogContent>
        </Dialog>
    );
}

function EmailSelector({ setMetadata }: { setMetadata: (params: any) => void }) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");

    return (
        <div className="flex flex-col gap-3">
            <Input label="To" type="text" placeholder="recipient@email.com" onChange={(e) => setEmail(e.target.value)} />
            <Input label="Body" type="text" placeholder="Message body..." onChange={(e) => setBody(e.target.value)} />
            <Button
                className="w-fit self-end bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setMetadata({ email, body })}
            >
                Confirm
            </Button>
        </div>
    )
}

function SolanaSelector({ setMetadata }: { setMetadata: (params: any) => void }) {
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");

    return (
        <div className="flex flex-col gap-3">
            <Input label="To" type="text" placeholder="Wallet address" onChange={(e) => setAddress(e.target.value)} />
            <Input label="Amount" type="text" placeholder="0.00 SOL" onChange={(e) => setAmount(e.target.value)} />
            <Button
                className="w-fit self-end bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => setMetadata({ amount, address })}
            >
                Confirm
            </Button>
        </div>
    )
}
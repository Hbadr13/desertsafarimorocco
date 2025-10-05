'use client'
import { useState } from "react"
import { Button } from "./button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Check, CheckCircle, Clock4, Shield, X } from "lucide-react"

const StatusUpdateButton = ({ bookingId, currentStatus, newStatus, label }: {
    bookingId: string;
    currentStatus: string;
    newStatus: string;
    label: string;
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusUpdate = async () => {
        setIsUpdating(true)
        try {
            const res = await fetch(`/api/admin/bookings/${bookingId}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus
                })
            })

            if (res.ok) {
                const result = await res.json()
                alert(`Booking status updated to ${newStatus} successfully!`)
                window.location.reload()
            } else {
                const error = await res.json()
                alert(`Error: ${error.error || "Failed to update status"}`)
            }
        } catch (error) {
            alert("Error updating booking status")
            console.error("Status update error:", error)
        } finally {
            setIsUpdating(false)
            setIsDialogOpen(false)
        }
    }

    const getStatusColor = () => {
        switch (newStatus) {
            case 'confirmed':
                return 'text-green-600 border-green-300 hover:bg-green-50'
            case 'cancelled':
                return 'text-red-600 border-red-300 hover:bg-red-50'
            case 'pending':
                return 'text-yellow-600 border-yellow-300 hover:bg-yellow-50'
            default:
                return 'text-blue-600 border-blue-300 hover:bg-blue-50'
        }
    }

    const getStatusIcon = () => {
        switch (newStatus) {
            case 'confirmed':
                return <CheckCircle />
            case 'cancelled':
                return <X />
            case 'pending':
                return <Clock4 />
            default:
                return <Shield />
        }
    }

    const getDialogTitle = () => {
        switch (newStatus) {
            case 'confirmed':
                return "Confirm Booking"
            case 'cancelled':
                return "Cancel Booking"
            case 'pending':
                return "Set as Pending"
            default:
                return "Update Status"
        }
    }

    const getDialogDescription = () => {
        switch (newStatus) {
            case 'confirmed':
                return `Are you sure you want to confirm this booking? This will mark the booking as confirmed and notify the customer.`
            case 'cancelled':
                return `Are you sure you want to cancel this booking? This action cannot be undone and the customer will be notified.`
            case 'pending':
                return `Are you sure you want to set this booking back to pending status?`
            default:
                return `Are you sure you want to update the booking status to ${newStatus}?`
        }
    }

    return (
        <>
            <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                size="sm"
                className={`rounded-lg ${getStatusColor()} transition-colors`}
                disabled={currentStatus === newStatus || isUpdating}
            >
                {getStatusIcon()} {label}
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl bg-white">
                    <DialogHeader>
                        <DialogTitle className={`flex items-center gap-2 ${newStatus === 'confirmed' ? 'text-green-600' :
                            newStatus === 'cancelled' ? 'text-red-600' :
                                'text-yellow-600'
                            }`}>
                            {getStatusIcon()} {getDialogTitle()}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 pt-2">
                            {getDialogDescription()}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            onClick={handleStatusUpdate}
                            disabled={isUpdating}
                            className={`flex-1 rounded-xl py-3 ${newStatus === 'confirmed' ?
                                'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                                newStatus === 'cancelled' ?
                                    'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' :
                                    'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'
                                }`}
                        >
                            {isUpdating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Yes, {newStatus === 'confirmed' ? 'Confirm' : newStatus === 'cancelled' ? 'Cancel' : 'Update'}
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isUpdating}
                            variant="outline"
                            className="flex-1 rounded-xl py-3 border-slate-300 hover:bg-slate-50"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default StatusUpdateButton
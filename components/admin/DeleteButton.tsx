"use client"

import { useState } from "react"
import { Trash2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DeleteButton({ notAllow, id, type }: { notAllow: boolean, id: string, type: "categories" | "tours" | "packages" | "bookings" }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        alert(`${type.slice(0, -1)} deleted successfully!`)
        window.location.reload()
      } else {
        const error = await res.json()
        alert(`Error: ${error.error || "Failed to delete"}`)
      }
    } catch (error) {
      alert("Error deleting item")
      console.error("Delete error:", error)
    } finally {
      setIsDeleting(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        size="sm"
        className="text-red-500 bg-transparent rounded-xl border-[1.3px] border-red-300 hover:bg-red-50 transition-colors"
        disabled={isDeleting || notAllow}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white ">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Are you sure you want to delete this {type.slice(0, -1)}? This action cannot be undone and all associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-xl py-3"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Yes, Delete
                </>
              )}
            </Button>

            <Button
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
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
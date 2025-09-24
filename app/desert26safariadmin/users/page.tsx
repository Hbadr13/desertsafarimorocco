import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Plus, Edit, Trash2, UsersIcon } from "lucide-react"

async function getUsers() {
  try {
    const db = await getDatabase()
    const users = await db
      .collection<User>("users")
      .find({}, { projection: { password: 0, resetToken: 0, resetTokenExpiry: 0 } })
      .sort({ createdAt: -1 })
      .toArray()
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage admin users</p>
        </div>
        <Link href="/desert26safariadmin/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {users.length > 0 ? (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user._id?.toString()}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Created: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                    <div className="flex gap-2">
                      <Link href={`/desert26safariadmin/users/${user._id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground text-center mb-4">Get started by creating your first admin user</p>
            <Link href="/desert26safariadmin/users/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

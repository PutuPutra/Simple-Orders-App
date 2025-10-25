import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Header } from "@/components/header"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const user = await getSession()

  if (!user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <DashboardContent />
      </main>
    </div>
  )
}

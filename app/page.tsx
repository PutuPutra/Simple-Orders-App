import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

export default async function HomePage() {
  const user = await getSession()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <LoginForm />
    </main>
  )
}

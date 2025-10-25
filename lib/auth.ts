import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
}

// In-memory user store (for demo purposes)
const users: Map<string, { email: string; password: string; name: string }> = new Map([
  ["user@example.com", { email: "user@example.com", password: "password123", name: "Demo User" }],
])

export async function login(email: string, password: string): Promise<User | null> {
  const user = users.get(email)

  if (!user || user.password !== password) {
    return null
  }

  const sessionUser: User = {
    id: email,
    email: user.email,
    name: user.name,
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("session", JSON.stringify(sessionUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return sessionUser
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")

  if (!session) {
    return null
  }

  try {
    return JSON.parse(session.value) as User
  } catch {
    return null
  }
}

export async function register(email: string, password: string, name: string): Promise<User | null> {
  if (users.has(email)) {
    return null // User already exists
  }

  users.set(email, { email, password, name })

  return login(email, password)
}

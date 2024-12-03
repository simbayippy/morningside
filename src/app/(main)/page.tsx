// app/(main)/page.tsx
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { signOut } from '../(auth)/actions'

export default async function AuthButton() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  return data?.user ? (
    <div className="flex items-center gap-4">
      Hey, {data.user.email}!
      <form action={signOut}>
        <button className="bg-btn-background hover:bg-btn-background-hover rounded-md px-4 py-2 no-underline">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="bg-btn-background hover:bg-btn-background-hover flex rounded-md px-3 py-2 no-underline"
    >
      Login
    </Link>
  );
}
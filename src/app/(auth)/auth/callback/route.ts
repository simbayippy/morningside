import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const code = searchParams.get('code')
  const supabase = await createClient()

  if (code) {
    console.log("Handling OAuth callback with code")
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      console.log("Successfully exchanged code for session, redirecting to home")
      redirect('/')
    }
    console.log("Failed to exchange code:", error)
  }

  if (token_hash && type) {
    console.log("Handling email verification")
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      console.log("Successfully verified OTP, redirecting to home")
      redirect('/')
    }
    console.log("Failed to verify OTP:", error)
  }

  console.log("No valid token_hash or code found, redirecting to error page")
  redirect('/error')
}
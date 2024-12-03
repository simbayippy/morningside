'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export type AuthResponse = {
  error: string | null;
};

export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log(error)
    return { error: error.message }
  }
  
  revalidatePath('/', 'layout')
  redirect('/')
  
  // This return is just for TypeScript - the redirect will prevent it from being reached
  return { error: null }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log(error)
    redirect('/error')
  }

  // Redirect to verification page instead of trying to sign in
  redirect('/verify-email')
}

export async function signOut(formData?: FormData): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error(error)
  }
  
  revalidatePath('/', 'layout')
  redirect('/login')
}
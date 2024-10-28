import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, message } = body

  // Hier kun je email service toevoegen (SendGrid, etc.)
  // En de berichten opslaan in Supabase

  const supabase = createRouteHandlerClient({ cookies })
  
  const { error } = await supabase
    .from('contact_messages')
    .insert([{ name, email, message }])

  if (error) {
    return NextResponse.json(
      { error: 'Er is iets misgegaan' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: 'Bericht succesvol verzonden' },
    { status: 200 }
  )
}

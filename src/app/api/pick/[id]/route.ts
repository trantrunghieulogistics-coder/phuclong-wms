import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('pick_tasks')
      .select('*, items:pick_task_items(*), picker:profiles(full_name)')
      .eq('id', params.id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { status, picker_id, completed_at } = body

    const updates: Record<string, string> = {}
    if (status) updates.status = status
    if (picker_id) updates.picker_id = picker_id
    if (completed_at) updates.completed_at = completed_at

    const { data, error } = await supabaseAdmin
      .from('pick_tasks')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
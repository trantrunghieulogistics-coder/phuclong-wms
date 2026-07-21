import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabaseAdmin
      .from('pick_tasks')
      .select('*, items:pick_task_items(*), picker:profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { task_code, order_ids, created_by } = body

    const { data: task, error: taskError } = await supabaseAdmin
      .from('pick_tasks')
      .insert({
        task_code,
        status: 'open',
        created_by,
      })
      .select()
      .single()

    if (taskError) return NextResponse.json({ error: taskError.message }, { status: 500 })

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*, items:order_items(*)')
      .in('id', order_ids)

    if (ordersError) return NextResponse.json({ error: ordersError.message }, { status: 500 })

    const allItems = orders.flatMap((order: any) => 
      order.items?.map((item: any) => ({
        task_id: task.id,
        sku: item.sku,
        location: item.location || 'A-01-01',
        quantity_needed: item.quantity,
      })) || []
    )

    if (allItems.length > 0) {
      await supabaseAdmin.from('pick_task_items').insert(allItems)
    }

    await supabaseAdmin
      .from('orders')
      .update({ status: 'picking' })
      .in('id', order_ids)

    return NextResponse.json({ data: task }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
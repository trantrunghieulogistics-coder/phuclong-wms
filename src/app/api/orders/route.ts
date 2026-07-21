import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabaseAdmin
      .from('orders')
      .select('*, items:order_items(*)')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) query = query.eq('status', status)
    if (platform) query = query.eq('platform', platform)

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orders } = body

    const results = []

    for (const orderData of orders) {
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          platform: orderData.platform,
          platform_order_id: orderData.platform_order_id,
          so_code: orderData.so_code,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          address: orderData.address,
          district: orderData.district,
          province: orderData.province,
          tracking_number: orderData.tracking_number,
          carrier: orderData.carrier,
          status: 'pending',
          sla_deadline: orderData.sla_deadline,
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error creating order:', orderError)
        continue
      }

      if (orderData.items?.length > 0) {
        await supabaseAdmin
          .from('order_items')
          .insert(
            orderData.items.map((item: any) => ({
              order_id: order.id,
              sku: item.sku,
              product_name: item.product_name,
              quantity: item.quantity,
              unit: item.unit,
            }))
          )
      }

      results.push(order)
    }

    return NextResponse.json({ data: results }, { status: 201 })

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
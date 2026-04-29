import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// ── Tipos de BD ──────────────────────────────────────────────────────────────
export type DbProduct = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  compare_price: number | null
  weight: string
  category_id: string
  ingredients: string
  image_url: string
  in_stock: boolean
  rating: number
  review_count: number
  created_at: string
}

export type DbOrder = {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_notes: string | null
  total: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  created_at: string
}

export type DbOrderItem = {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  subtotal: number
}

// ── SQL para crear las tablas (ejecutar en Supabase SQL Editor) ───────────────
/*
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  long_description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  weight text,
  category_id uuid references categories(id),
  ingredients text,
  benefits text[],
  image_url text,
  images text[],
  in_stock boolean default true,
  rating numeric(3,1) default 5.0,
  review_count integer default 0,
  tags text[],
  created_at timestamptz default now()
);

create table combos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2) not null,
  savings numeric(10,2) not null,
  image_url text,
  tag text,
  created_at timestamptz default now()
);

create table combo_items (
  id uuid primary key default gen_random_uuid(),
  combo_id uuid references combos(id) on delete cascade,
  product_id uuid references products(id),
  quantity integer default 1
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_colonia text,
  customer_city text,
  customer_notes text,
  total numeric(10,2) not null,
  status text default 'pending',
  whatsapp_sent boolean default false,
  created_at timestamptz default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity integer not null,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null
);
*/

// ── Helpers de órdenes ────────────────────────────────────────────────────────
export async function createOrder(data: {
  name: string
  phone: string
  address: string
  colonia: string
  city: string
  notes: string
  total: number
  items: { productId: string; productName: string; quantity: number; unitPrice: number }[]
}) {
  if (!supabase) return { success: false, error: 'Supabase not configured' }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: data.name,
      customer_phone: data.phone,
      customer_address: data.address,
      customer_colonia: data.colonia,
      customer_city: data.city,
      customer_notes: data.notes || null,
      total: data.total,
      status: 'pending',
      whatsapp_sent: true,
    })
    .select()
    .single()

  if (orderError || !order) return { success: false, error: orderError }

  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

  if (itemsError) return { success: false, error: itemsError }
  return { success: true, orderId: order.id }
}

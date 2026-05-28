import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { POSSaleRecord } from '@/types'

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

// ── POS ───────────────────────────────────────────────────────────────────────
/*  SQL — ejecutar en Supabase SQL Editor:

create table pos_sales (
  id            uuid primary key,
  user_id       text not null,
  user_name     text not null,
  user_role     text not null,
  subtotal      numeric(10,2) not null,
  discount      numeric(10,2) default 0,
  total         numeric(10,2) not null,
  payment_method text not null,
  commission    numeric(10,2) default 0,
  created_at    timestamptz default now()
);

create table pos_sale_items (
  id           uuid primary key default gen_random_uuid(),
  sale_id      uuid references pos_sales(id) on delete cascade,
  product_id   text not null,
  product_name text not null,
  quantity     integer not null,
  unit_price   numeric(10,2) not null,
  subtotal     numeric(10,2) not null
);
*/

export async function savePOSSale(sale: POSSaleRecord) {
  if (!supabase) return { success: false, error: 'Supabase not configured' }

  const { error: saleError } = await supabase.from('pos_sales').insert({
    id:             sale.id,
    user_id:        sale.userId,
    user_name:      sale.userName,
    user_role:      sale.userRole,
    subtotal:       sale.subtotal,
    discount:       sale.discount,
    total:          sale.total,
    payment_method: sale.paymentMethod,
    commission:     sale.commission,
    created_at:     sale.createdAt,
  })

  if (saleError) return { success: false, error: saleError }

  const saleItems = sale.items.map((item) => ({
    sale_id:      sale.id,
    product_id:   item.productId,
    product_name: item.productName,
    quantity:     item.quantity,
    unit_price:   item.unitPrice,
    subtotal:     item.subtotal,
  }))

  const { error: itemsError } = await supabase.from('pos_sale_items').insert(saleItems)
  if (itemsError) return { success: false, error: itemsError }
  return { success: true }
}

// ── CMS: product overrides ────────────────────────────────────────────────────
/*  SQL — ejecutar en Supabase SQL Editor:

create table product_settings (
  product_id  text primary key,
  price       numeric(10,2),
  in_stock    boolean,
  image_url   text,
  description text,
  cost        numeric(10,2),
  updated_at  timestamptz default now()
);
alter table product_settings enable row level security;
create policy "public read" on product_settings for select using (true);
create policy "allow all"   on product_settings for all    using (true) with check (true);

-- Si la tabla ya existe, agregar la columna cost:
-- alter table product_settings add column if not exists cost numeric(10,2);
*/

export type ProductOverride = {
  price?:       number
  inStock?:     boolean
  imageUrl?:    string
  description?: string
  cost?:        number
}

export async function getProductSettings(): Promise<Record<string, ProductOverride>> {
  if (!supabase) return {}
  const { data, error } = await supabase.from('product_settings').select('*')
  if (error || !data) return {}
  return Object.fromEntries(
    data.map((s: any) => [
      s.product_id,
      {
        ...(s.price       != null && { price:       s.price }),
        ...(s.in_stock    != null && { inStock:     s.in_stock }),
        ...(s.image_url   != null && { imageUrl:    s.image_url }),
        ...(s.description != null && { description: s.description }),
        ...(s.cost        != null && { cost:        s.cost }),
      },
    ])
  )
}

export async function saveProductSetting(productId: string, updates: ProductOverride) {
  if (!supabase) return { success: false }
  const { error } = await supabase.from('product_settings').upsert(
    {
      product_id:  productId,
      price:       updates.price,
      in_stock:    updates.inStock,
      image_url:   updates.imageUrl,
      description: updates.description,
      cost:        updates.cost ?? null,
      updated_at:  new Date().toISOString(),
    },
    { onConflict: 'product_id' }
  )
  return { success: !error, error }
}

export async function uploadProductImage(productId: string, file: File): Promise<string | null> {
  if (!supabase) return null
  const ext      = file.name.split('.').pop() ?? 'jpg'
  const filename = `${productId}-custom.${ext}`
  const { error } = await supabase.storage
    .from('productos')
    .upload(filename, file, { upsert: true, contentType: file.type })
  if (error) return null
  const { data } = supabase.storage.from('productos').getPublicUrl(filename)
  return data.publicUrl
}

export async function getPOSSales(): Promise<POSSaleRecord[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('pos_sales')
    .select('*, pos_sale_items(*)')
    .order('created_at', { ascending: false })
    .limit(500)

  if (error || !data) return []

  return data.map((s: any) => ({
    id:            s.id,
    userId:        s.user_id,
    userName:      s.user_name,
    userRole:      s.user_role,
    subtotal:      s.subtotal,
    discount:      s.discount,
    total:         s.total,
    paymentMethod: s.payment_method,
    commission:    s.commission,
    createdAt:     s.created_at,
    items: (s.pos_sale_items ?? []).map((i: any) => ({
      productId:   i.product_id,
      productName: i.product_name,
      quantity:    i.quantity,
      unitPrice:   i.unit_price,
      subtotal:    i.subtotal,
    })),
  }))
}

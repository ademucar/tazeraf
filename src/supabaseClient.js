import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase istemcisi oluşturulur oluşturulmaz URL'deki oturum bilgisini işleyip
// adres çubuğunu temizliyor. Bağlantının hangi amaçla geldiğini (doğrulama mı,
// şifre sıfırlama mı) anlayabilmek için adresi ÖNCE burada yakalıyoruz.
export const acilisUrl = typeof window !== 'undefined' ? window.location.href : ''

export function acilisTipi() {
  try {
    const u = new URL(acilisUrl)
    const hash = new URLSearchParams(u.hash.replace(/^#/, ''))
    return hash.get('type') || u.searchParams.get('type') || ''
  } catch {
    return ''
  }
}

export const supabase = createClient(url, key)

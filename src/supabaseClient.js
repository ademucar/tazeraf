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

// Supabase iki farklı akış kullanabiliyor:
//   - implicit: adres "#access_token=...&type=recovery" ile döner
//   - PKCE:     adres "?code=..." ile döner, "type" HİÇ YOK
// PKCE'de type'a bakmak işe yaramadığı için bağlantıyı üretirken adrese kendi
// işaretimizi koyuyoruz (?mod=sifre / ?mod=dogrulama) ve burada okuyoruz.
// Böylece Supabase hangi akışı seçerse seçsin doğru ekranı açabiliyoruz.
export function acilisModu() {
  try {
    return new URL(acilisUrl).searchParams.get('mod') || ''
  } catch {
    return ''
  }
}

export const ADRES_SIFRE = window.location.origin + '/?mod=sifre'
export const ADRES_DOGRULAMA = window.location.origin + '/?mod=dogrulama'

// "Beni hatırla" işareti bu anahtarda tutulur ve oturumun nerede saklanacağını
// belirler: işaretliyse localStorage (tarayıcı kapansa da kalır), değilse
// sessionStorage (sekme kapanınca oturum düşer). Ortak kullanılan market
// bilgisayarlarında ikincisi önemli.
const HATIRLA_ANAHTARI = 'tazeraf.beniHatirla'

export function beniHatirlaOku() {
  try { return localStorage.getItem(HATIRLA_ANAHTARI) !== 'hayir' } catch { return true }
}
export function beniHatirlaYaz(deger) {
  try { localStorage.setItem(HATIRLA_ANAHTARI, deger ? 'evet' : 'hayir') } catch { /* depolama kapalı olabilir */ }
}

// Tek bir depolama arayüzü; her çağrıda güncel tercihe göre hedefi seçer.
// Böylece kullanıcı işareti değiştirdiğinde istemciyi yeniden kurmak gerekmez.
const oturumDeposu = {
  getItem: (k) => {
    try { return localStorage.getItem(k) ?? sessionStorage.getItem(k) } catch { return null }
  },
  setItem: (k, v) => {
    try {
      if (beniHatirlaOku()) { localStorage.setItem(k, v); sessionStorage.removeItem(k) }
      else { sessionStorage.setItem(k, v); localStorage.removeItem(k) }
    } catch { /* depolama kapalı olabilir */ }
  },
  removeItem: (k) => {
    try { localStorage.removeItem(k); sessionStorage.removeItem(k) } catch { /* yoksay */ }
  },
}

export const supabase = createClient(url, key, {
  auth: { storage: oturumDeposu, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})

import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { supabase } from './supabaseClient'

function durumHesapla(sktTarihi) {
  if (!sktTarihi) return { ad:'—', key:'gecmis', gun:0 }
  const bugun = new Date(); bugun.setHours(0, 0, 0, 0)
  const skt = new Date(sktTarihi + 'T00:00:00')
  const gun = Math.round((skt - bugun) / 86400000)
  if (gun < 0)  return { ad:'Geçmiş',   key:'gecmis',   gun }
  if (gun <= 2) return { ad:'Acil',     key:'acil',     gun }
  if (gun <= 7) return { ad:'Yaklaşan', key:'yaklasan', gun }
  return          { ad:'Rahat',    key:'rahat',    gun }
}
function gunMetni(gun) {
  if (gun < 0)  return `${Math.abs(gun)} gün geçti`
  if (gun === 0) return 'Bugün son gün'
  return `${gun} gün kaldı`
}
function tarihTR(s) {
  if (!s) return '—'
  const [y,m,d] = s.split('-')
  return `${d}.${m}.${y}`
}

// Supabase'deki "Lowercase, uppercase letters and digits" kuralıyla birebir aynı
// olmalı; aksi halde form kabul eder, sunucu reddeder. Türkçe'ye özgü harfler
// (Ğ, Ş, İ...) Supabase'in A-Z listesinde yok — bu yüzden burada da sadece A-Z.
const SIFRE_KURALLARI = [
  { ad: 'En az 8 karakter',  sina: s => s.length >= 8 },
  { ad: 'Bir büyük harf (A-Z)', sina: s => /[A-Z]/.test(s) },
  { ad: 'Bir küçük harf (a-z)', sina: s => /[a-z]/.test(s) },
  { ad: 'Bir rakam (0-9)',   sina: s => /[0-9]/.test(s) },
]
const sifreGecerli = s => SIFRE_KURALLARI.every(k => k.sina(s))

export default function App() {
  const [session, setSession] = useState(null)
  const [isletme, setIsletme] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(true)

  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [mesaj, setMesaj] = useState('')
  const [isletmeAdi, setIsletmeAdi] = useState('')

  const [personelListesi, setPersonelListesi] = useState([])
  const [yeniPersonel, setYeniPersonel] = useState('')
  const [aktifPersonelId, setAktifPersonelId] = useState(() => localStorage.getItem('aktifPersonelId') || '')

  const [kategoriListesi, setKategoriListesi] = useState([])
  const [yeniKategori, setYeniKategori] = useState('')

  const [urunListesi, setUrunListesi] = useState([])
  const [fotoUrlleri, setFotoUrlleri] = useState({})
  const [urunAdi, setUrunAdi] = useState('')
  const [sktTarihi, setSktTarihi] = useState('')
  const [urunKategoriId, setUrunKategoriId] = useState('')
  const [foto, setFoto] = useState(null)
  const [fotoOnizleme, setFotoOnizleme] = useState('')
  const [kaydediliyor, setKaydediliyor] = useState(false)

  const [aktifSekme, setAktifSekme] = useState('tumu')
  const [arama, setArama] = useState('')

  const [sayfa, setSayfa] = useState('ana')
  const [ayarlarAcik, setAyarlarAcik] = useState(false)
  const [duzenMarketAdi, setDuzenMarketAdi] = useState('')
  const [menuAcik, setMenuAcik] = useState(false)
  const [urunEkleAcik, setUrunEkleAcik] = useState(false)
  const [toplaModal, setToplaModal] = useState(null)
  const [toplaPersonelId, setToplaPersonelId] = useState('')
  const [modalMesaj, setModalMesaj] = useState('')
  const [ayarMesaj, setAyarMesaj] = useState('')
  const [sayfaMesaj, setSayfaMesaj] = useState('')
  const [authModu, setAuthModu] = useState('giris')
  const [yeniSifre, setYeniSifre] = useState('')
  const [secilenKategori, setSecilenKategori] = useState(null)

  const [sifreYenileme, setSifreYenileme] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((e, s) => {
      // Şifre sıfırlama linkiyle gelindiğinde önce yeni şifre belirlenir
      if (e === 'PASSWORD_RECOVERY') { setSifreYenileme(true); setMesaj('') }
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setIsletme(null); setYukleniyor(false); return }
    setYukleniyor(true)
    supabase.from('isletme').select('*').eq('id', session.user.id).maybeSingle()
      .then(({ data }) => { setIsletme(data); setYukleniyor(false) })
  }, [session])

  useEffect(() => { if (isletme) { personelYukle(); kategoriYukle(); urunYukle(); eskiToplananlariTemizle() } }, [isletme])

  useEffect(() => {
    if (!isletme) return
    const kanal = supabase
      .channel('urun-degisiklik')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'urun', filter: `isletme_id=eq.${isletme.id}` }, () => { urunYukle() })
      .subscribe()
    return () => { supabase.removeChannel(kanal) }
  }, [isletme])

  // İmzalı bağlantılar 1 saat geçerli; ekran gün boyu açık kalabildiği için
  // süresi dolmadan (45 dk) yenilenir, yoksa fotoğraflar kırık görünür.
  useEffect(() => {
    if (!isletme) return
    const zamanlayici = setInterval(() => { fotoUrlleriniTazele(urunListesi) }, 45 * 60 * 1000)
    return () => clearInterval(zamanlayici)
  }, [isletme, urunListesi])

  function aktifPersonelDegistir(id) { setAktifPersonelId(id); localStorage.setItem('aktifPersonelId', id) }

  // Bucket private olduğu için fotoğraflar doğrudan URL ile açılamaz; her yükleme
  // sonrası süreli (1 saat) imzalı bağlantı üretilir. Eski kayıtlarda foto_url tam
  // bir public adres, yenilerde sadece depolama yolu — ikisini de destekliyoruz.
  function fotoYolu(u) {
    const s = u && u.foto_url
    if (!s) return null
    if (s.includes('/urun-fotolari/')) return s.split('/urun-fotolari/')[1].split('?')[0]
    return s.replace(/^\/+/, '')
  }

  async function fotoUrlleriniTazele(urunler) {
    const yollar = [...new Set(urunler.map(fotoYolu).filter(Boolean))]
    if (yollar.length === 0) { setFotoUrlleri({}); return }
    const { data, error } = await supabase.storage.from('urun-fotolari').createSignedUrls(yollar, 3600)
    if (error) return
    const harita = {}
    for (const s of data || []) { if (s.signedUrl) harita[s.path] = s.signedUrl }
    setFotoUrlleri(harita)
  }

  // Not: Asıl güvenlik sınırı veritabanındaki RLS politikalarıdır — istemcideki
  // bu filtreler onun yerine geçmez. Yine de ikinci bir kilit olarak duruyorlar:
  // bir politika yanlışlıkla gevşetilirse arayüz başka işletmenin verisini
  // yanlışlıkla ekrana getirmesin diye.
  async function personelYukle() {
    const { data } = await supabase.from('personel').select('*').eq('isletme_id', session.user.id).order('ad')
    setPersonelListesi(data || [])
  }
  async function kategoriYukle() {
    const { data } = await supabase.from('kategori').select('*').eq('isletme_id', session.user.id).order('ad')
    setKategoriListesi(data || [])
  }
  async function urunYukle() {
    const { data } = await supabase.from('urun').select('*').eq('isletme_id', session.user.id).order('skt_tarihi')
    setUrunListesi(data || [])
    fotoUrlleriniTazele(data || [])
  }

  // Toplanan ürünler, toplanma tarihinden 7 gün sonra otomatik silinir (foto dahil)
  async function eskiToplananlariTemizle() {
    const sinir = new Date(Date.now() - 7 * 86400000).toISOString()
    const { data } = await supabase.from('urun').select('*')
      .eq('isletme_id', session.user.id).eq('toplandi', true).lt('toplanma_tarihi', sinir)
    if (!data || data.length === 0) return
    for (const u of data) {
      const yol = fotoYolu(u)
      if (yol) await supabase.storage.from('urun-fotolari').remove([yol])
      await supabase.from('urun').delete().eq('id', u.id).eq('isletme_id', session.user.id)
    }
    urunYukle()
  }

  async function kayitOl() {
    setMesaj('')
    if (!email.trim() || !sifre) { setMesaj('❌ Lütfen e-posta ve şifreyi gir.'); return }
    if (!sifreGecerli(sifre)) { setMesaj('❌ Şifre aşağıdaki kuralların hepsini karşılamalı.'); return }
    const { data, error } = await supabase.auth.signUp({ email, password: sifre })
    if (error) { setMesaj('❌ ' + error.message); return }
    // Supabase'de e-posta doğrulama açıksa oturum dönmez; kullanıcıyı doğru yönlendir
    const dogrulamaGerekli = !data.session
    await supabase.auth.signOut()
    setSifre(''); setAuthModu('giris')
    setMesaj(dogrulamaGerekli
      ? '✅ Kayıt alındı. E-postana gelen doğrulama bağlantısına tıkla, sonra giriş yap.'
      : '✅ Kayıt başarılı. Şimdi bu e-posta ve şifreyle giriş yap.')
  }
  async function sifreSifirlaGonder() {
    setMesaj('')
    if (!email.trim()) { setMesaj('❌ Şifreni sıfırlamak için e-postanı gir.'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin })
    if (error) { setMesaj('❌ ' + error.message); return }
    setMesaj('✅ Sıfırlama bağlantısı e-postana gönderildi. Gelen kutunu (ve spam klasörünü) kontrol et.')
  }
  async function yeniSifreKaydet() {
    setMesaj('')
    if (!sifreGecerli(yeniSifre)) { setMesaj('❌ Şifre aşağıdaki kuralların hepsini karşılamalı.'); return }
    const { error } = await supabase.auth.updateUser({ password: yeniSifre })
    if (error) { setMesaj('❌ ' + error.message); return }
    setYeniSifre(''); setSifreYenileme(false)
    setMesaj('✅ Şifren güncellendi.')
  }
  async function girisYap() {
    setMesaj('')
    if (!email.trim() || !sifre) { setMesaj('❌ Lütfen e-posta ve şifreyi gir.'); return }
    const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })
    if (error) setMesaj('❌ E-posta veya şifre hatalı.')
  }
  async function cikisYap() {
    await supabase.auth.signOut()
    setEmail(''); setSifre(''); setIsletmeAdi(''); setMesaj(''); setModalMesaj(''); setAyarMesaj('')
    setAyarlarAcik(false); setMenuAcik(false); setUrunEkleAcik(false); setSayfa('ana'); setToplaModal(null); setSecilenKategori(null)
  }

  async function isletmeKaydet() {
    setMesaj('')
    const { data, error } = await supabase.from('isletme')
      .insert({ id: session.user.id, ad: isletmeAdi }).select().single()
    if (error) setMesaj('❌ ' + error.message)
    else setIsletme(data)
  }

  function ayarlariAc() { setDuzenMarketAdi(isletme.ad); setAyarMesaj(''); setAyarlarAcik(true); setMenuAcik(false) }
  async function marketAdiKaydet() {
    const yeni = duzenMarketAdi.trim()
    if (!yeni) return
    const { data, error } = await supabase.from('isletme').update({ ad: yeni }).eq('id', session.user.id).select().single()
    if (error) { setAyarMesaj('❌ ' + error.message); return }
    setIsletme(data); setAyarMesaj('✅ Market adı güncellendi.')
  }

  async function personelEkle() {
    const ad = yeniPersonel.trim()
    if (!ad) return
    const { error } = await supabase.from('personel').insert({ isletme_id: session.user.id, ad })
    if (error) { setAyarMesaj('❌ ' + error.message); return }
    setYeniPersonel(''); setAyarMesaj(''); personelYukle()
  }
  async function personelSil(id) {
    const { error } = await supabase.from('personel').delete().eq('id', id).eq('isletme_id', session.user.id)
    if (error) { setAyarMesaj('❌ ' + error.message); return }
    if (String(id) === String(aktifPersonelId)) aktifPersonelDegistir('')
    personelYukle()
  }

  async function kategoriEkle() {
    const ad = yeniKategori.trim()
    if (!ad) return
    const { error } = await supabase.from('kategori').insert({ isletme_id: session.user.id, ad })
    if (error) { setSayfaMesaj('❌ ' + error.message); return }
    setYeniKategori(''); setSayfaMesaj(''); kategoriYukle()
  }
  async function kategoriSil(id) {
    const { error } = await supabase.from('kategori').delete().eq('id', id).eq('isletme_id', session.user.id)
    if (error) { setSayfaMesaj('❌ ' + error.message); return }
    if (String(id) === String(urunKategoriId)) setUrunKategoriId('')
    kategoriYukle(); urunYukle()
  }

  function fotoSec(dosya) {
    setFotoOnizleme(onceki => { if (onceki) URL.revokeObjectURL(onceki); return dosya ? URL.createObjectURL(dosya) : '' })
    setFoto(dosya)
  }
  function fotoTemizle() {
    fotoSec(null)
    for (const id of ['fotoKamera', 'fotoGaleri']) { const el = document.getElementById(id); if (el) el.value = '' }
  }

  async function urunEkle() {
    if (!aktifPersonelId) { setMesaj('❌ Formdaki "Personel" alanından adını seç.'); return }
    if (!urunAdi.trim() || !sktTarihi || !foto) { setMesaj('❌ Ad, tarih ve fotoğraf zorunlu.'); return }
    setKaydediliyor(true); setMesaj('')
    try {
      const kucuk = await imageCompression(foto, { maxSizeMB: 0.2, maxWidthOrHeight: 1000, useWebWorker: true })
      const yol = `${session.user.id}/${Date.now()}.jpg`
      const { error: upErr } = await supabase.storage.from('urun-fotolari').upload(yol, kucuk, { contentType: 'image/jpeg' })
      if (upErr) throw upErr
      // Public adres yerine sadece depolama yolu saklanır — bucket private
      const { error: insErr } = await supabase.from('urun').insert({
        isletme_id: session.user.id, ad: urunAdi.trim(), skt_tarihi: sktTarihi,
        foto_url: yol, ekleyen_id: aktifPersonelId,
        kategori_id: urunKategoriId || null
      })
      if (insErr) throw insErr
      setUrunAdi(''); setSktTarihi(''); setUrunKategoriId(''); fotoTemizle()
      urunYukle()
      setMesaj('✅ Ürün eklendi.')
    } catch (e) { setMesaj('❌ ' + e.message) } finally { setKaydediliyor(false) }
  }

  function toplaBaslat(urun) { setToplaPersonelId(aktifPersonelId || ''); setModalMesaj(''); setToplaModal(urun) }
  async function toplaOnayla() {
    if (!toplaPersonelId || !toplaModal) return
    const { error } = await supabase.from('urun').update({
      toplandi: true, toplayan_id: toplaPersonelId, toplanma_tarihi: new Date().toISOString()
    }).eq('id', toplaModal.id).eq('isletme_id', session.user.id)
    if (error) { setModalMesaj('❌ ' + error.message); return }
    aktifPersonelDegistir(toplaPersonelId)
    setToplaModal(null)
    urunYukle()
  }
  async function toplamaGeriAl(urun) {
    const { error } = await supabase.from('urun').update({ toplandi: false, toplayan_id: null, toplanma_tarihi: null }).eq('id', urun.id).eq('isletme_id', session.user.id)
    if (error) { setSayfaMesaj('❌ ' + error.message); return }
    setSayfaMesaj(''); urunYukle()
  }
  async function urunSil(urun) {
    if (!window.confirm(`"${urun.ad}" silinsin mi?`)) return
    const yol = fotoYolu(urun)
    if (yol) await supabase.storage.from('urun-fotolari').remove([yol])
    const { error } = await supabase.from('urun').delete().eq('id', urun.id).eq('isletme_id', session.user.id)
    if (error) { setSayfaMesaj('❌ ' + error.message); return }
    setSayfaMesaj(''); urunYukle()
  }

  if (yukleniyor) return <div style={{padding:24, color:'var(--muted)', fontFamily:'Inter,sans-serif'}}>Yükleniyor...</div>

  // Kurallar yazılırken canlı olarak işaretlenir — kullanıcı denemeden görür
  const sifreKurallari = (deger) => (
    <ul className="sifre-kurallar">
      {SIFRE_KURALLARI.map(k => {
        const tamam = k.sina(deger)
        return (
          <li key={k.ad} className={tamam ? 'tamam' : ''}>
            <span aria-hidden="true">{tamam ? '✓' : '○'}</span> {k.ad}
          </li>
        )
      })}
    </ul>
  )

  const gelistirici = (
    <div className="dev-credit">
      Developed by <a href="https://ademucar.com.tr/" target="_blank" rel="noopener noreferrer">Adem Uçar</a>
    </div>
  )

  if (sifreYenileme) {
    return (
      <div className="auth">
        <div className="auth-brand">SKT Takip</div>
        <h2 className="auth-title">Yeni şifreni belirle</h2>
        <label className="field">Yeni şifre</label>
        <input type="password" placeholder="Yeni şifre" value={yeniSifre} onChange={e=>setYeniSifre(e.target.value)} />
        {sifreKurallari(yeniSifre)}
        <button className="btn" onClick={yeniSifreKaydet} disabled={!sifreGecerli(yeniSifre)} style={{marginBottom:0}}>Şifreyi kaydet</button>
        {mesaj && <p className={'msg' + (mesaj.startsWith('✅') ? ' ok' : '')}>{mesaj}</p>}
        {gelistirici}
      </div>
    )
  }

  if (!session) {
    const girisMi = authModu === 'giris'
    const sifirlaMi = authModu === 'sifirla'

    if (sifirlaMi) {
      return (
        <div className="auth">
          <div className="auth-brand">SKT Takip</div>
          <h2 className="auth-title">Şifreni sıfırla</h2>
          <p className="auth-hint">Hesabının e-posta adresini gir; sana sıfırlama bağlantısı gönderelim.</p>
          <input type="email" placeholder="E-posta" value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="btn" onClick={sifreSifirlaGonder} disabled={!email.trim()} style={{marginBottom:0}}>Sıfırlama bağlantısı gönder</button>
          <p className="auth-switch">
            <button className="link-btn" onClick={()=>{ setAuthModu('giris'); setMesaj('') }}>← Girişe dön</button>
          </p>
          {mesaj && <p className={'msg' + (mesaj.startsWith('✅') ? ' ok' : '')}>{mesaj}</p>}
          {gelistirici}
        </div>
      )
    }

    return (
      <div className="auth">
        <div className="auth-brand">SKT Takip</div>
        <div className="auth-tabs">
          <button className={'auth-tab' + (girisMi ? ' active' : '')} onClick={()=>{ setAuthModu('giris'); setMesaj('') }}>Giriş Yap</button>
          <button className={'auth-tab' + (!girisMi ? ' active' : '')} onClick={()=>{ setAuthModu('kayit'); setMesaj('') }}>Kayıt Ol</button>
        </div>
        <h2 className="auth-title">{girisMi ? 'Hesabına giriş yap' : 'Yeni hesap oluştur'}</h2>
        <input type="email" placeholder="E-posta" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Şifre" value={sifre} onChange={e=>setSifre(e.target.value)}
          onKeyDown={e=>{ if (e.key === 'Enter') (girisMi ? girisYap : kayitOl)() }} />
        {/* Kurallar sadece kayıt olurken gösterilir; girişte gereksiz gürültü */}
        {!girisMi && sifreKurallari(sifre)}
        {girisMi && (
          <p className="auth-forgot">
            <button className="link-btn" onClick={()=>{ setAuthModu('sifirla'); setMesaj('') }}>Şifremi unuttum</button>
          </p>
        )}
        {/* Girişte asla kilitleme: eski şifreler yeni kurallara uymuyor olabilir,
            kullanıcı kendi hesabına giremez hale gelir. Sadece kayıtta kilitli. */}
        <button className="btn" onClick={girisMi ? girisYap : kayitOl}
          disabled={!girisMi && !sifreGecerli(sifre)} style={{marginBottom:0}}>
          {girisMi ? 'Giriş yap' : 'Kayıt ol'}
        </button>
        <p className="auth-switch">
          {girisMi ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
          <button className="link-btn" onClick={()=>{ setAuthModu(girisMi ? 'kayit' : 'giris'); setMesaj('') }}>
            {girisMi ? 'Kayıt ol' : 'Giriş yap'}
          </button>
        </p>
        {mesaj && <p className={'msg' + (mesaj.startsWith('✅') ? ' ok' : '')}>{mesaj}</p>}

        {gelistirici}
      </div>
    )
  }

  if (!isletme) {
    return (
      <div className="auth">
        <h1>İşletme bilgisi</h1>
        <p style={{color:'var(--muted)', textAlign:'center', marginBottom:16}}>Devam etmek için işletme adını gir.</p>
        <input placeholder="İşletme adı (ör. Uçar Market)" value={isletmeAdi} onChange={e=>setIsletmeAdi(e.target.value)} />
        <button className="btn" onClick={isletmeKaydet} disabled={!isletmeAdi.trim()} style={{marginBottom:10}}>Kaydet</button>
        <button className="btn ghost" onClick={cikisYap}>Çıkış yap</button>
        {mesaj && <p className="msg">{mesaj}</p>}
      </div>
    )
  }

  const personelAdlari = Object.fromEntries(personelListesi.map(p => [p.id, p.ad]))
  const kategoriAdlari = Object.fromEntries(kategoriListesi.map(k => [k.id, k.ad]))
  const aktifUrunler = urunListesi.filter(u => !u.toplandi)
  const say = { acil:0, yaklasan:0, rahat:0 }
  aktifUrunler.forEach(u => { const k = durumHesapla(u.skt_tarihi).key; if (say[k] !== undefined) say[k]++ })

  const gun = (u) => durumHesapla(u.skt_tarihi).gun
  let liste
  if (aktifSekme === 'toplandi') liste = urunListesi.filter(u => u.toplandi)
  else if (aktifSekme === 'gecenler') liste = urunListesi.filter(u => !u.toplandi && gun(u) < 0)
  else if (aktifSekme === 'yaklasanlar') liste = urunListesi.filter(u => !u.toplandi && gun(u) >= 0 && gun(u) <= 7)
  else liste = urunListesi.filter(u => !u.toplandi)
  if (arama.trim()) {
    const q = arama.trim().toLowerCase()
    liste = liste.filter(u => u.ad.toLowerCase().includes(q))
  }

  const bugunStr = new Date().toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric', weekday:'long' })
  const navGit = (s) => { setSayfa(s); setMenuAcik(false); setSecilenKategori(null) }

  const urunKarti = (u) => {
    const d = durumHesapla(u.skt_tarihi)
    const src = fotoUrlleri[fotoYolu(u)]
    return (
      <div key={u.id} className={'product ' + d.key}>
        {src
          ? <img className="thumb" src={src} alt={u.ad} loading="lazy" />
          : <div className="thumb thumb-bos" aria-hidden="true">📷</div>}
        <div className="info">
          <div className="name">{u.ad}</div>
          <div className="meta">SKT: {tarihTR(u.skt_tarihi)} · {gunMetni(d.gun)}</div>
          <div className="by">
            Ekleyen: {personelAdlari[u.ekleyen_id] || '—'}
            {u.kategori_id && kategoriAdlari[u.kategori_id] ? ` · ${kategoriAdlari[u.kategori_id]}` : ''}
          </div>
          {u.toplandi && <div className="picked">✓ Toplayan: {personelAdlari[u.toplayan_id] || '—'}</div>}
        </div>
        <div className="right">
          {u.toplandi
            ? <button className="btn-undo" onClick={()=>toplamaGeriAl(u)}>Geri al</button>
            : <button className="btn-collect" onClick={()=>toplaBaslat(u)}>Topla</button>}
          <button className="btn-del-urun" onClick={()=>urunSil(u)}>Sil</button>
        </div>
      </div>
    )
  }

  const toolbar = (
    <div className="toolbar">
      <div className="tabs">
        {[['yaklasanlar','Yaklaşanlar'],['tumu','Tümü'],['gecenler','Geçenler'],['toplandi','Toplandı']].map(([k,e]) => (
          <button key={k} className={'tab' + (aktifSekme===k ? ' active' : '')} onClick={()=>setAktifSekme(k)}>{e}</button>
        ))}
      </div>
      <input className="search" placeholder="Ürün ara..." value={arama} onChange={e=>setArama(e.target.value)} />
      <button className="btn add-btn" onClick={()=>{ setMesaj(''); setUrunEkleAcik(true) }}>+ Ürün Ekle</button>
    </div>
  )

  const urunFormu = (
    <>
      <h2 className="form-title">Yeni Ürün Ekle</h2>
      <label className="field">Ürün adı</label>
      <input placeholder="Ürün adı girin" value={urunAdi} onChange={e=>setUrunAdi(e.target.value)} />
      <label className="field">Personel (ekleyen)</label>
      <select value={aktifPersonelId} onChange={e=>aktifPersonelDegistir(e.target.value)}>
        <option value="">— Personel seç —</option>
        {personelListesi.map(p => <option key={p.id} value={p.id}>{p.ad}</option>)}
      </select>
      <label className="field">Kategori</label>
      <select value={urunKategoriId} onChange={e=>setUrunKategoriId(e.target.value)}>
        <option value="">— Kategori seç (isteğe bağlı) —</option>
        {kategoriListesi.map(k => <option key={k.id} value={k.id}>{k.ad}</option>)}
      </select>
      <label className="field">Son kullanma tarihi</label>
      <input type="date" value={sktTarihi} onChange={e=>setSktTarihi(e.target.value)} />
      <label className="field">Fotoğraf</label>
      {/* Kamera ve galeri ayrı girdiler: capture tek input'a konunca mobilde galeri seçilemiyor */}
      <input id="fotoKamera" className="gizli-dosya" type="file" accept="image/*" capture="environment"
        onChange={e=>fotoSec(e.target.files[0] || null)} />
      <input id="fotoGaleri" className="gizli-dosya" type="file" accept="image/*"
        onChange={e=>fotoSec(e.target.files[0] || null)} />
      <div className="foto-secim">
        <label className="foto-btn" htmlFor="fotoKamera">📷 Kamera</label>
        <label className="foto-btn" htmlFor="fotoGaleri">🖼️ Galeri</label>
      </div>
      {fotoOnizleme && (
        <div className="foto-onizleme">
          <img src={fotoOnizleme} alt="Seçilen fotoğraf" />
          <button type="button" className="foto-kaldir" onClick={fotoTemizle}>Fotoğrafı kaldır</button>
        </div>
      )}
      <button className="btn" onClick={urunEkle} disabled={kaydediliyor} style={{marginBottom:0}}>
        {kaydediliyor ? 'Kaydediliyor...' : '+ Ürünü Kaydet'}
      </button>
      {mesaj && <p className={'msg' + (mesaj.startsWith('✅') ? ' ok' : '')}>{mesaj}</p>}
    </>
  )

  return (
    <div className="layout">
      {menuAcik && <div className="menu-backdrop" onClick={()=>setMenuAcik(false)} />}
      <aside className={'sidebar' + (menuAcik ? ' open' : '')}>
        <div className="brand">
          <div className="brand-logo">📆</div>
          <div>
            <div className="brand-name">{isletme.ad}</div>
            <div className="brand-sub">SKT Takip Sistemi</div>
          </div>
        </div>
        <nav className="nav">
          <button className={'nav-item' + (sayfa==='ana' ? ' active' : '')} onClick={()=>navGit('ana')}>🏠 Ana Sayfa</button>
          <button className={'nav-item' + (sayfa==='urunler' ? ' active' : '')} onClick={()=>navGit('urunler')}>📦 Ürünler</button>
          <button className={'nav-item' + (sayfa==='kategoriler' ? ' active' : '')} onClick={()=>navGit('kategoriler')}>🗂️ Kategoriler</button>
          <button className="nav-item" onClick={ayarlariAc}>⚙️ Ayarlar</button>
        </nav>
        <button className="nav-item logout" onClick={cikisYap}>↩ Çıkış Yap</button>
      </aside>

      <main className="main">
        <div className="topbar">
          <button className="menu-btn" onClick={()=>setMenuAcik(true)}>☰</button>
          <div className="date-pill">📅 {bugunStr}</div>
        </div>

        {sayfaMesaj && (
          <div className={'sayfa-mesaj' + (sayfaMesaj.startsWith('✅') ? ' ok' : '')}>
            <span>{sayfaMesaj}</span>
            <button onClick={()=>setSayfaMesaj('')}>×</button>
          </div>
        )}

        {(sayfa === 'ana' || sayfa === 'urunler') && (
          <>
            {sayfa === 'ana' && (
              <div className="stats">
                <div className="stat acil"><div className="stat-top"><span className="stat-lbl">ACİL</span><span className="stat-ic">⏰</span></div><div className="stat-num">{say.acil}</div><div className="stat-unit">Ürün</div></div>
                <div className="stat yaklasan"><div className="stat-top"><span className="stat-lbl">YAKLAŞAN</span><span className="stat-ic">📅</span></div><div className="stat-num">{say.yaklasan}</div><div className="stat-unit">Ürün</div></div>
                <div className="stat rahat"><div className="stat-top"><span className="stat-lbl">RAHAT</span><span className="stat-ic">✅</span></div><div className="stat-num">{say.rahat}</div><div className="stat-unit">Ürün</div></div>
                <div className="stat toplam"><div className="stat-top"><span className="stat-lbl">AKTİF ÜRÜN</span><span className="stat-ic">📦</span></div><div className="stat-num">{aktifUrunler.length}</div><div className="stat-unit">Ürün</div></div>
              </div>
            )}

            {toolbar}

            <div className={'content-grid' + (sayfa === 'urunler' ? ' tek' : '')}>
              <div className="list-col">
                {liste.length === 0 && <div className="empty"><span className="emoji">📦</span>Bu listede ürün yok.</div>}
                {liste.map(urunKarti)}
              </div>
              {sayfa === 'ana' && <div className="form-col">{urunFormu}</div>}
            </div>
          </>
        )}

        {sayfa === 'kategoriler' && (
          <div className="page-panel">
            {!secilenKategori && (
              <>
                <h2 className="form-title">Kategoriler ({kategoriListesi.length})</h2>
                <p style={{color:'var(--muted)', fontSize:14, marginBottom:12}}>Bir markaya dokun; ürünleri en yakın SKT üstte olacak şekilde sıralı görürsün.</p>
                {kategoriListesi.length === 0 && <p style={{color:'var(--muted)'}}>Henüz kategori yok.</p>}
                {kategoriListesi.map(k => {
                  const sayi = aktifUrunler.filter(u => u.kategori_id === k.id).length
                  return (
                    <div key={k.id} className="kat-row2">
                      <button className="kat-tik" onClick={()=>setSecilenKategori(k.id)}>
                        <span className="kat-ad">{k.ad}</span>
                        <small>{sayi} ürün ›</small>
                      </button>
                      <button className="icon-del" onClick={()=>kategoriSil(k.id)}>×</button>
                    </div>
                  )
                })}
                <input placeholder="Kategori adı (ör. Süt Ürünleri)" value={yeniKategori} onChange={e=>setYeniKategori(e.target.value)} style={{marginTop:16}} />
                <button className="btn" onClick={kategoriEkle} disabled={!yeniKategori.trim()} style={{marginBottom:0}}>Kategori ekle</button>
              </>
            )}
            {secilenKategori && (() => {
              const kat = kategoriListesi.find(k => k.id === secilenKategori)
              const katUrunler = urunListesi
                .filter(u => u.kategori_id === secilenKategori)
                .sort((a,b) => a.skt_tarihi.localeCompare(b.skt_tarihi))
              return (
                <>
                  <button className="btn ghost" style={{width:'auto', padding:'8px 16px', marginBottom:16}} onClick={()=>setSecilenKategori(null)}>← Kategoriler</button>
                  <h2 className="form-title">{kat ? kat.ad : 'Kategori'} ({katUrunler.length})</h2>
                  {katUrunler.length === 0 && <div className="empty"><span className="emoji">📦</span>Bu markada ürün yok.</div>}
                  {katUrunler.map(urunKarti)}
                </>
              )
            })()}
          </div>
        )}
      </main>

      {toplaModal && (
        <div className="modal-overlay" onClick={()=>setToplaModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h2>Ürünü Topla</h2>
              <button className="modal-close" onClick={()=>setToplaModal(null)}>×</button>
            </div>
            <p style={{color:'var(--sub)', marginBottom:16, fontSize:15}}>"{toplaModal.ad}" ürününü kim topluyor?</p>
            <label className="field">Toplayan personel</label>
            <select value={toplaPersonelId} onChange={e=>setToplaPersonelId(e.target.value)}>
              <option value="">— Personel seç —</option>
              {personelListesi.map(p => <option key={p.id} value={p.id}>{p.ad}</option>)}
            </select>
            <button className="btn" onClick={toplaOnayla} disabled={!toplaPersonelId} style={{marginBottom:0}}>Topla</button>
            {modalMesaj && <p className={'msg' + (modalMesaj.startsWith('✅') ? ' ok' : '')}>{modalMesaj}</p>}
          </div>
        </div>
      )}

      {urunEkleAcik && (
        <div className="modal-overlay" onClick={()=>setUrunEkleAcik(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h2>Yeni Ürün</h2>
              <button className="modal-close" onClick={()=>setUrunEkleAcik(false)}>×</button>
            </div>
            {urunFormu}
          </div>
        </div>
      )}

      {ayarlarAcik && (
        <div className="modal-overlay" onClick={()=>setAyarlarAcik(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h2>Ayarlar</h2>
              <button className="modal-close" onClick={()=>setAyarlarAcik(false)}>×</button>
            </div>
            <div className="modal-section">
              <h3>Market Adı</h3>
              <input value={duzenMarketAdi} onChange={e=>setDuzenMarketAdi(e.target.value)} />
              <button className="btn" onClick={marketAdiKaydet} disabled={!duzenMarketAdi.trim()} style={{marginBottom:0}}>Kaydet</button>
            </div>
            <div className="modal-section">
              <h3>Tüm Personeller ({personelListesi.length})</h3>
              {personelListesi.length === 0 && <p style={{color:'var(--muted)', fontSize:14}}>Henüz personel yok.</p>}
              {personelListesi.map(p => (
                <div key={p.id} className="mini-row">
                  <span>{p.ad}</span>
                  <button className="icon-del" onClick={()=>personelSil(p.id)}>×</button>
                </div>
              ))}
              <input placeholder="Personel adı" value={yeniPersonel} onChange={e=>setYeniPersonel(e.target.value)} style={{marginTop:12}} />
              <button className="btn ghost" onClick={personelEkle} disabled={!yeniPersonel.trim()} style={{marginBottom:0}}>Personel ekle</button>
            </div>
            {ayarMesaj && <p className={'msg' + (ayarMesaj.startsWith('✅') ? ' ok' : '')}>{ayarMesaj}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
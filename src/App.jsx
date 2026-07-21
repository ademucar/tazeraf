import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { supabase } from './supabaseClient'

function durumHesapla(sktTarihi) {
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
  const [y,m,d] = s.split('-')
  return `${d}.${m}.${y}`
}

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
  const [urunAdi, setUrunAdi] = useState('')
  const [sktTarihi, setSktTarihi] = useState('')
  const [urunKategoriId, setUrunKategoriId] = useState('')
  const [foto, setFoto] = useState(null)
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
  const [authModu, setAuthModu] = useState('giris')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setIsletme(null); setYukleniyor(false); return }
    setYukleniyor(true)
    supabase.from('isletme').select('*').eq('id', session.user.id).maybeSingle()
      .then(({ data }) => { setIsletme(data); setYukleniyor(false) })
  }, [session])

  useEffect(() => { if (isletme) { personelYukle(); kategoriYukle(); urunYukle() } }, [isletme])

  useEffect(() => {
    if (!isletme) return
    const kanal = supabase
      .channel('urun-degisiklik')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'urun' }, () => { urunYukle() })
      .subscribe()
    return () => { supabase.removeChannel(kanal) }
  }, [isletme])

  function aktifPersonelDegistir(id) { setAktifPersonelId(id); localStorage.setItem('aktifPersonelId', id) }

  async function personelYukle() {
    const { data } = await supabase.from('personel').select('*').order('ad')
    setPersonelListesi(data || [])
  }
  async function kategoriYukle() {
    const { data } = await supabase.from('kategori').select('*').order('ad')
    setKategoriListesi(data || [])
  }
  async function urunYukle() {
    const { data } = await supabase.from('urun').select('*').order('skt_tarihi')
    setUrunListesi(data || [])
  }

  async function kayitOl() {
    setMesaj('')
    if (!email.trim() || !sifre) { setMesaj('❌ Lütfen e-posta ve şifreyi gir.'); return }
    if (sifre.length < 6) { setMesaj('❌ Şifre en az 6 karakter olmalı.'); return }
    const { error } = await supabase.auth.signUp({ email, password: sifre })
    if (error) { setMesaj('❌ ' + error.message); return }
    await supabase.auth.signOut()
    setSifre(''); setAuthModu('giris')
    setMesaj('✅ Kayıt başarılı.')
  }
  async function girisYap() {
    setMesaj('')
    if (!email.trim() || !sifre) { setMesaj('❌ Lütfen e-posta ve şifreyi gir.'); return }
    const { error } = await supabase.auth.signInWithPassword({ email, password: sifre })
    if (error) setMesaj('❌ E-posta veya şifre hatalı.')
  }



  async function cikisYap() {
    await supabase.auth.signOut()
    setEmail(''); setSifre(''); setIsletmeAdi(''); setMesaj('')
    setAyarlarAcik(false); setMenuAcik(false); setUrunEkleAcik(false); setSayfa('ana'); setToplaModal(null)
  }

  async function isletmeKaydet() {
    setMesaj('')
    const { data, error } = await supabase.from('isletme')
      .insert({ id: session.user.id, ad: isletmeAdi }).select().single()
    if (error) setMesaj('❌ ' + error.message)
    else setIsletme(data)
  }

  function ayarlariAc() { setDuzenMarketAdi(isletme.ad); setMesaj(''); setAyarlarAcik(true); setMenuAcik(false) }
  async function marketAdiKaydet() {
    const yeni = duzenMarketAdi.trim()
    if (!yeni) return
    const { data, error } = await supabase.from('isletme').update({ ad: yeni }).eq('id', session.user.id).select().single()
    if (error) { setMesaj('❌ ' + error.message); return }
    setIsletme(data); setMesaj('✅ Market adı güncellendi.')
  }

  async function personelEkle() {
    const ad = yeniPersonel.trim()
    if (!ad) return
    const { error } = await supabase.from('personel').insert({ isletme_id: session.user.id, ad })
    if (error) { setMesaj('❌ ' + error.message); return }
    setYeniPersonel(''); personelYukle()
  }
  async function personelSil(id) {
    await supabase.from('personel').delete().eq('id', id)
    if (id === aktifPersonelId) aktifPersonelDegistir('')
    personelYukle()
  }

  async function kategoriEkle() {
    const ad = yeniKategori.trim()
    if (!ad) return
    const { error } = await supabase.from('kategori').insert({ isletme_id: session.user.id, ad })
    if (error) { setMesaj('❌ ' + error.message); return }
    setYeniKategori(''); kategoriYukle()
  }
  async function kategoriSil(id) {
    await supabase.from('kategori').delete().eq('id', id)
    if (id === urunKategoriId) setUrunKategoriId('')
    kategoriYukle(); urunYukle()
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
      const { data: urlData } = supabase.storage.from('urun-fotolari').getPublicUrl(yol)
      const { error: insErr } = await supabase.from('urun').insert({
        isletme_id: session.user.id, ad: urunAdi.trim(), skt_tarihi: sktTarihi,
        foto_url: urlData.publicUrl, ekleyen_id: aktifPersonelId,
        kategori_id: urunKategoriId || null
      })
      if (insErr) throw insErr
      setUrunAdi(''); setSktTarihi(''); setFoto(null); setUrunKategoriId('')
      const inp = document.getElementById('fotoInput'); if (inp) inp.value = ''
      urunYukle()
      setMesaj('✅ Ürün eklendi.')
    } catch (e) { setMesaj('❌ ' + e.message) } finally { setKaydediliyor(false) }
  }

  function toplaBaslat(urun) { setToplaPersonelId(aktifPersonelId || ''); setMesaj(''); setToplaModal(urun) }
  async function toplaOnayla() {
    if (!toplaPersonelId || !toplaModal) return
    const { error } = await supabase.from('urun').update({
      toplandi: true, toplayan_id: toplaPersonelId, toplanma_tarihi: new Date().toISOString()
    }).eq('id', toplaModal.id)
    if (error) { setMesaj('❌ ' + error.message); return }
    aktifPersonelDegistir(toplaPersonelId)
    setToplaModal(null)
    urunYukle()
  }
  async function toplamaGeriAl(urun) {
    const { error } = await supabase.from('urun').update({ toplandi: false, toplayan_id: null, toplanma_tarihi: null }).eq('id', urun.id)
    if (error) { setMesaj('❌ ' + error.message); return }
    urunYukle()
  }
  async function urunSil(urun) {
    if (!window.confirm(`"${urun.ad}" silinsin mi?`)) return
    if (urun.foto_url && urun.foto_url.includes('/urun-fotolari/')) {
      const yol = urun.foto_url.split('/urun-fotolari/')[1]
      if (yol) await supabase.storage.from('urun-fotolari').remove([yol])
    }
    const { error } = await supabase.from('urun').delete().eq('id', urun.id)
    if (error) { setMesaj('❌ ' + error.message); return }
    urunYukle()
  }

  if (yukleniyor) return <div style={{padding:24, color:'var(--muted)', fontFamily:'Inter,sans-serif'}}>Yükleniyor...</div>

  
   if (!session) {
    const girisMi = authModu === 'giris'
    return (
      <div className="auth">
        <div className="auth-brand">SKT Takip</div>
        <div className="auth-tabs">
          <button className={'auth-tab' + (girisMi ? ' active' : '')} onClick={()=>{ setAuthModu('giris'); setMesaj('') }}>Giriş Yap</button>
          <button className={'auth-tab' + (!girisMi ? ' active' : '')} onClick={()=>{ setAuthModu('kayit'); setMesaj('') }}>Kayıt Ol</button>
        </div>
        <h2 className="auth-title">{girisMi ? 'Hesabına giriş yap' : 'Yeni hesap oluştur'}</h2>
        <input type="email" placeholder="E-posta" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" placeholder="Şifre (en az 6 karakter)" value={sifre} onChange={e=>setSifre(e.target.value)} />
        <button className="btn" onClick={girisMi ? girisYap : kayitOl} style={{marginBottom:0}}>
          {girisMi ? 'Giriş yap' : 'Kayıt ol'}
        </button>
        <p className="auth-switch">
          {girisMi ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
          <button className="link-btn" onClick={()=>{ setAuthModu(girisMi ? 'kayit' : 'giris'); setMesaj('') }}>
            {girisMi ? 'Kayıt ol' : 'Giriş yap'}
          </button>
        </p>
        {mesaj && <p className={'msg' + (mesaj.startsWith('✅') ? ' ok' : '')}>{mesaj}</p>}
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
  const navGit = (s) => { setSayfa(s); setMenuAcik(false) }

  const urunKarti = (u) => {
    const d = durumHesapla(u.skt_tarihi)
    return (
      <div key={u.id} className={'product ' + d.key}>
        <img className="thumb" src={u.foto_url} alt={u.ad} />
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
      <input id="fotoInput" type="file" accept="image/*" capture="environment" onChange={e=>setFoto(e.target.files[0] || null)} />
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

        {(sayfa === 'ana' || sayfa === 'urunler') && (
          <>
            {sayfa === 'ana' && (
              <div className="stats">
                <div className="stat acil"><div className="stat-top"><span className="stat-lbl">ACİL</span><span className="stat-ic">⏰</span></div><div className="stat-num">{say.acil}</div><div className="stat-unit">Ürün</div></div>
                <div className="stat yaklasan"><div className="stat-top"><span className="stat-lbl">YAKLAŞAN</span><span className="stat-ic">📅</span></div><div className="stat-num">{say.yaklasan}</div><div className="stat-unit">Ürün</div></div>
                <div className="stat rahat"><div className="stat-top"><span className="stat-lbl">RAHAT</span><span className="stat-ic">✅</span></div><div className="stat-num">{say.rahat}</div><div className="stat-unit">Ürün</div></div>
                <div className="stat toplam"><div className="stat-top"><span className="stat-lbl">TOPLAM ÜRÜN</span><span className="stat-ic">📦</span></div><div className="stat-num">{urunListesi.length}</div><div className="stat-unit">Ürün</div></div>
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
            <h2 className="form-title">Kategoriler ({kategoriListesi.length})</h2>
            {kategoriListesi.length === 0 && <p style={{color:'var(--muted)'}}>Henüz kategori yok.</p>}
            {kategoriListesi.map(k => {
              const kUrunler = urunListesi.filter(u => u.kategori_id === k.id)
              return (
                <div key={k.id} className="kat-row">
                  <div className="kat-head">
                    <span className="kat-ad">{k.ad} <small>({kUrunler.length} ürün)</small></span>
                    <button className="icon-del" onClick={()=>kategoriSil(k.id)}>×</button>
                  </div>
                  {kUrunler.length > 0
                    ? <div className="kat-urunler">{kUrunler.map(u => <span key={u.id} className="kat-chip">{u.ad}</span>)}</div>
                    : <div className="kat-bos">Bu kategoride ürün yok.</div>}
                </div>
              )
            })}
            <input placeholder="Kategori adı (ör. Süt Ürünleri)" value={yeniKategori} onChange={e=>setYeniKategori(e.target.value)} style={{marginTop:16}} />
            <button className="btn" onClick={kategoriEkle} disabled={!yeniKategori.trim()} style={{marginBottom:0}}>Kategori ekle</button>
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
            {mesaj && <p className={'msg' + (mesaj.startsWith('✅') ? ' ok' : '')}>{mesaj}</p>}
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
            {mesaj && <p className={'msg' + (mesaj.startsWith('✅') ? ' ok' : '')}>{mesaj}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
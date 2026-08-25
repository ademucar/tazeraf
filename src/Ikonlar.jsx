// Tüm ikonlar inline SVG. Harici ikon kütüphanesi kullanılmıyor: CSP dış kaynak
// yüklemeyi engelliyor ve paket boyutunu şişirmenin anlamı yok.
// currentColor kullanıldığı için renk CSS'ten kontrol edilir.

const ortak = {
  width: '1em', height: '1em', viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: 2,
  strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': 'true', focusable: 'false',
}

export const Ev = (p) => (
  <svg {...ortak} {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg>
)
export const Kutu = (p) => (
  <svg {...ortak} {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/></svg>
)
export const Klasor = (p) => (
  <svg {...ortak} {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
)
export const Ayar = (p) => (
  <svg {...ortak} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 2.6 7a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H7a1.7 1.7 0 0 0 1-1.5V1a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V7a1.7 1.7 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" transform="translate(0.5 0.5) scale(0.92)"/></svg>
)
export const Cikis = (p) => (
  <svg {...ortak} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
)
export const Zarf = (p) => (
  <svg {...ortak} {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
)
export const Kilit = (p) => (
  <svg {...ortak} {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
)
export const Goz = (p) => (
  <svg {...ortak} {...p}><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg>
)
export const GozKapali = (p) => (
  <svg {...ortak} {...p}><path d="M10.6 6.2A9.9 9.9 0 0 1 12 6c6.4 0 10 6 10 6a17 17 0 0 1-3 3.5"/><path d="M6.6 6.7A17 17 0 0 0 2 12s3.6 6 10 6a9.6 9.6 0 0 0 4.2-.9"/><path d="M3 3l18 18"/></svg>
)
export const Kisi = (p) => (
  <svg {...ortak} {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
)
export const KisiArti = (p) => (
  <svg {...ortak} {...p}><circle cx="10" cy="8" r="4"/><path d="M2 21a8 8 0 0 1 14.5-4.7"/><path d="M18 14v6"/><path d="M15 17h6"/></svg>
)
export const Ara = (p) => (
  <svg {...ortak} {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
)
export const Takvim = (p) => (
  <svg {...ortak} {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>
)
export const Kamera = (p) => (
  <svg {...ortak} {...p}><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.5"/></svg>
)
export const Resim = (p) => (
  <svg {...ortak} {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/></svg>
)
export const Ok = (p) => (
  <svg {...ortak} {...p}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
)
export const Magaza = (p) => (
  <svg {...ortak} {...p}><path d="M4 4h16l1 5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z"/><path d="M5 11v9h14v-9"/><path d="M10 20v-5h4v5"/></svg>
)
export const Alarm = (p) => (
  <svg {...ortak} {...p}><circle cx="12" cy="13" r="7"/><path d="M12 10v3.5l2.5 1.5"/><path d="m5 4 2.5-2M19 4l-2.5-2"/></svg>
)
export const Kalkan = (p) => (
  <svg {...ortak} {...p}><path d="M12 3 5 6v5.5c0 4.3 3 8.1 7 9.5 4-1.4 7-5.2 7-9.5V6Z"/><path d="m9 12 2 2 4-4"/></svg>
)
export const Paket = (p) => (
  <svg {...ortak} {...p}><path d="M21 8 12 3 3 8v8l9 5 9-5Z"/><path d="m3 8 9 5 9-5"/><path d="M7.5 5.5 16.5 10.5"/></svg>
)

// Marka işareti: raf etiketi + filiz. "Taze" + "raf" birleşimi.
// Gradyan yok, gölge yok — iki renkli, keskin köşeli baskı işareti.
export const Logo = ({ size = 48, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" {...p}>
    <path d="M4 9h26.5L43 24 30.5 39H4z" fill="var(--yesil)" stroke="var(--murekkep)"
      strokeWidth="2.6" strokeLinejoin="miter"/>
    <circle cx="12.5" cy="24" r="3" fill="var(--kagit)" stroke="var(--murekkep)" strokeWidth="2"/>
    <path d="M23 31c-.5-6 3-10 9.5-10.5C32 26.5 29 30.5 23 31z" fill="var(--kagit)"
      stroke="var(--murekkep)" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M23 31c1.5-3 4-5.5 7-7" stroke="var(--murekkep)" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

// Boş liste görseli: açık kasa, çizgi resim. Dolgu ve gradyan yok.
export const BosKutu = (p) => (
  <svg width="132" height="96" viewBox="0 0 132 96" fill="none" aria-hidden="true" focusable="false" {...p}>
    <path d="M30 40h72v40H30z" stroke="var(--murekkep)" strokeWidth="2.4" strokeLinejoin="miter"/>
    <path d="M30 40 20 26h38l10 14M102 40l10-14H74L64 40" stroke="var(--murekkep)" strokeWidth="2.4"
      strokeLinejoin="miter" strokeLinecap="square"/>
    <path d="M66 40v40" stroke="var(--cizgi)" strokeWidth="2" strokeDasharray="5 5"/>
    <path d="M44 58h14M74 58h14" stroke="var(--cizgi)" strokeWidth="2" strokeLinecap="round"/>
    <path d="M110 16l7-5-2 6 5 2-6 1.5" stroke="var(--yesil)" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="18" cy="14" r="2.4" fill="var(--yesil)"/>
    <path d="M12 62h6M15 59v6" stroke="var(--yesil)" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// ---------- MARKA LOGOSU ----------
// Orijinal logo 1299x1211 ve 1.2 MB idi; 44px'lik bir alan için ağırdı.
// Saydam kenarları kırpılmış, kareye oturtulmuş ve küçültülmüş sürümler
// kullanılıyor (96px = 15 KB). Retina ekranlar srcSet ile 192px'i alır.
// width/height öznitelikleri yerleşim kaymasını (CLS) önler; ölçü CSS'ten gelir.
export const Marka = ({ size = 44, className = '', ...p }) => (
  <img
    src="/logo-96.png"
    srcSet="/logo-96.png 1x, /logo-192.png 2x"
    width={size} height={size}
    alt="" aria-hidden="true"
    className={('marka-logo ' + className).trim()}
    {...p}
  />
)

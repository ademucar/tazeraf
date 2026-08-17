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

// Marka işareti: takvim + saat. Giriş ekranı ve kenar çubuğunda kullanılır.
export const Logo = ({ size = 48, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false" {...p}>
    <defs>
      <linearGradient id="tzr-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#3b82f6"/>
      </linearGradient>
    </defs>
    <rect x="4" y="8" width="32" height="30" rx="6" fill="url(#tzr-g)"/>
    <rect x="4" y="8" width="32" height="9" rx="6" fill="#0f172a" opacity=".25"/>
    <path d="M13 5v7M27 5v7" stroke="#e0f2fe" strokeWidth="3" strokeLinecap="round"/>
    <g fill="#0b1220" opacity=".35">
      <rect x="10" y="22" width="5" height="4" rx="1.2"/>
      <rect x="18" y="22" width="5" height="4" rx="1.2"/>
      <rect x="10" y="29" width="5" height="4" rx="1.2"/>
    </g>
    <circle cx="34" cy="33" r="11" fill="#0b1220"/>
    <circle cx="34" cy="33" r="9" fill="url(#tzr-g)"/>
    <path d="M34 28v5.4l3.4 2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Boş liste görseli — açık kutu
export const BosKutu = (p) => (
  <svg width="128" height="104" viewBox="0 0 128 104" fill="none" aria-hidden="true" focusable="false" {...p}>
    <ellipse cx="64" cy="90" rx="40" ry="7" fill="#3b82f6" opacity=".12"/>
    <path d="M28 44h72v40a4 4 0 0 1-4 4H32a4 4 0 0 1-4-4Z" fill="#1e3a8a" opacity=".55"/>
    <path d="M28 44 20 30h34l10 14Z" fill="#3b82f6" opacity=".8"/>
    <path d="M100 44l8-14H74L64 44Z" fill="#60a5fa" opacity=".8"/>
    <path d="M64 44v44" stroke="#93c5fd" strokeWidth="1.5" opacity=".5"/>
    <path d="M96 18l10-6-3 8 6 3-8 2" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="24" cy="20" r="2.5" fill="#38bdf8" opacity=".8"/>
    <circle cx="112" cy="52" r="2" fill="#a78bfa" opacity=".8"/>
    <path d="M18 56h5M20.5 53.5v5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" opacity=".7"/>
  </svg>
)

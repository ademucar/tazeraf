import * as Ikon from './Ikonlar'

// ---------------------------------------------------------------------------
// DÜZENLENMESİ GEREKEN ALANLAR
// Bu iki değer metnin içinde birden çok yerde geçiyor; tek yerden değiştir.
// İletişim adresi GERÇEKTEN çalışıyor olmalı — KVKK başvuruları buraya gelir.
// ---------------------------------------------------------------------------
const VERI_SORUMLUSU = 'Adem Uçar'
const ILETISIM = 'iletisim@tazeraf.com.tr'
const GUNCELLEME = '8 Eylül 2026'

export default function Gizlilik({ onGeri }) {
  return (
    <div className="belge-sayfa">
      <header className="belge-ust">
        <a className="belge-marka" href="/" onClick={(e) => { if (onGeri) { e.preventDefault(); onGeri() } }}>
          <Ikon.Marka size={36} />
          <span>Tazeraf</span>
        </a>
        <a className="link-btn" href="/" onClick={(e) => { if (onGeri) { e.preventDefault(); onGeri() } }}>
          ← Uygulamaya dön
        </a>
      </header>

      <article className="belge">
        <h1>Gizlilik Politikası</h1>
        <p className="belge-tarih">Son güncelleme: {GUNCELLEME}</p>

        <div className="belge-ozet">
          <strong>Kısaca:</strong> Tazeraf yalnızca son kullanma tarihi takibi için gereken
          verileri saklar. Reklam yok, izleme yok, üçüncü taraflara veri satışı yok.
          Her işletme yalnızca kendi verisini görür. Toplanan ürünler fotoğraflarıyla
          birlikte 7 gün sonra otomatik silinir.
        </div>

        <h2>1. Veri sorumlusu kim?</h2>
        <p>
          Tazeraf, {VERI_SORUMLUSU} tarafından işletilmektedir. Hesap bilgileri
          (e-posta adresi, işletme adı) bakımından veri sorumlusu {VERI_SORUMLUSU}'dır.
        </p>
        <p>
          <strong>Önemli ayrım:</strong> İşletmenin uygulamaya kendi girdiği veriler
          (personel adları, ürünler, fotoğraflar) bakımından <em>veri sorumlusu ilgili
          işletmenin kendisidir</em>; Tazeraf bu veriler için yalnızca <em>veri
          işleyen</em> sıfatıyla hareket eder. Yani personelinin verisinden birinci
          derecede işletme sorumludur.
        </p>

        <h2>2. Hangi veriler işleniyor?</h2>
        <table className="belge-tablo">
          <thead>
            <tr><th>Veri</th><th>Nereden geliyor</th></tr>
          </thead>
          <tbody>
            <tr><td>E-posta adresi</td><td>Kayıt sırasında siz girersiniz</td></tr>
            <tr><td>Şifre (şifrelenmiş özet halinde)</td><td>Kayıt sırasında siz belirlersiniz</td></tr>
            <tr><td>İşletme adı</td><td>İlk girişte siz girersiniz</td></tr>
            <tr><td>Personel adları</td><td>Ayarlar ekranından siz eklersiniz</td></tr>
            <tr><td>Ürün adı, son kullanma tarihi, kategori</td><td>Ürün eklerken siz girersiniz</td></tr>
            <tr><td>Ürün fotoğrafı</td><td>Kamera veya galeriden siz seçersiniz</td></tr>
            <tr><td>Kim ekledi / kim topladı bilgisi</td><td>Seçtiğiniz personele göre kaydedilir</td></tr>
          </tbody>
        </table>
        <p>
          Konum, kişi listesi, cihaz kimliği gibi veriler <strong>toplanmaz</strong>.
          Analiz veya reklam amaçlı takip aracı <strong>kullanılmaz</strong>.
        </p>

        <h2>3. Neden işleniyor?</h2>
        <p>
          Tek amaç uygulamanın çalışmasıdır: ürünlerin son kullanma tarihlerini takip
          etmek, kalan günü hesaplamak, hangi personelin hangi ürünü eklediğini veya
          topladığını göstermek ve hesabınıza güvenli giriş yapmanızı sağlamak.
        </p>
        <p>
          Hukuki sebep, KVKK m.5/2-c uyarınca <em>sözleşmenin kurulması ve ifası</em>
          ile m.5/2-f uyarınca <em>meşru menfaat</em>tir. Pazarlama amaçlı işleme yapılmaz.
        </p>

        <h2>4. Veriler nerede saklanıyor, kimlerle paylaşılıyor?</h2>
        <p>
          Veriler satılmaz, kiralanmaz, reklam amacıyla paylaşılmaz. Yalnızca
          uygulamanın çalışması için gereken altyapı sağlayıcıları kullanılır:
        </p>
        <table className="belge-tablo">
          <thead>
            <tr><th>Sağlayıcı</th><th>Ne için</th><th>Nerede</th></tr>
          </thead>
          <tbody>
            <tr><td>Supabase</td><td>Veritabanı, kimlik doğrulama, fotoğraf depolama</td><td>AB (Frankfurt)</td></tr>
            <tr><td>Vercel</td><td>Web sitesinin sunulması</td><td>Yurt dışı</td></tr>
            <tr><td>Brevo</td><td>Doğrulama ve şifre sıfırlama e-postaları</td><td>AB</td></tr>
          </tbody>
        </table>
        <p>
          <strong>Yurt dışına aktarım:</strong> Bu sağlayıcıların sunucuları Türkiye
          dışındadır. Hesap oluşturarak verilerinizin bu sağlayıcılar aracılığıyla
          yurt dışında işlenmesini kabul etmiş olursunuz (KVKK m.9).
        </p>

        <h2>5. Ne kadar süre saklanıyor?</h2>
        <ul>
          <li>
            <strong>Toplanan ürünler:</strong> Toplanma tarihinden <strong>7 gün</strong>
            sonra fotoğrafıyla birlikte otomatik ve kalıcı olarak silinir.
          </li>
          <li>
            <strong>Diğer veriler:</strong> Hesabınız açık kaldığı sürece saklanır.
          </li>
          <li>
            <strong>Hesap silinirse:</strong> İşletmeye ait tüm veriler silinir.
            Silme talebi için aşağıdaki adrese yazmanız yeterlidir.
          </li>
        </ul>

        <h2>6. Güvenlik</h2>
        <ul>
          <li>Tüm bağlantılar HTTPS ile şifrelenir.</li>
          <li>
            Veritabanında <strong>satır seviyesi güvenlik (RLS)</strong> etkindir:
            her işletme yalnızca kendi kayıtlarına erişebilir. Bu kontrol tarayıcıda
            değil veritabanının kendisinde uygulanır.
          </li>
          <li>
            Ürün fotoğrafları <strong>herkese kapalı</strong> bir alanda tutulur;
            yalnızca giriş yapmış kullanıcıya üretilen, süresi dolan bağlantılarla
            görüntülenir.
          </li>
          <li>Şifreler düz metin olarak saklanmaz, yalnızca şifrelenmiş özetleri tutulur.</li>
          <li>Şifreler en az 8 karakter olmalı; büyük harf, küçük harf ve rakam içermelidir.</li>
        </ul>

        <h2>7. Çerezler ve tarayıcı depolama</h2>
        <p>
          Reklam veya izleme çerezi kullanılmaz. Yalnızca uygulamanın çalışması için
          gereken bilgiler tarayıcınızda tutulur:
        </p>
        <ul>
          <li><strong>Oturum bilgisi</strong> — giriş yapmış kalmanız için.
            "Beni hatırla" işaretliyse tarayıcı kapansa da kalır, işaretli değilse
            sekmeyi kapatınca silinir.</li>
          <li><strong>Son seçilen personel</strong> — her ürün eklemede yeniden
            seçmek zorunda kalmayın diye.</li>
        </ul>
        <p>Bu veriler yalnızca sizin cihazınızda kalır, bize gönderilmez.</p>

        <h2>8. Haklarınız</h2>
        <p>KVKK m.11 kapsamında şu haklara sahipsiniz:</p>
        <ul>
          <li>Verilerinizin işlenip işlenmediğini öğrenme ve buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde veya dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
          <li>Silinmesini veya yok edilmesini isteme</li>
          <li>İşlemenin hukuka aykırılığı nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
        </ul>
        <p>
          Taleplerinizi <a href={'mailto:' + ILETISIM}>{ILETISIM}</a> adresine
          iletebilirsiniz. Başvurular en geç 30 gün içinde sonuçlandırılır.
        </p>

        <h2>9. Çocukların verileri</h2>
        <p>
          Tazeraf işletmelere yönelik bir araçtır ve 18 yaş altındaki kişilerin
          kullanımı için tasarlanmamıştır.
        </p>

        <h2>10. Değişiklikler</h2>
        <p>
          Bu metin güncellenebilir. Önemli bir değişiklik olduğunda yukarıdaki
          "son güncelleme" tarihi değişir; esaslı değişikliklerde kayıtlı
          e-posta adresinize bilgi verilir.
        </p>

        <h2>11. İletişim</h2>
        <p>
          Soru ve talepleriniz için: <a href={'mailto:' + ILETISIM}>{ILETISIM}</a>
        </p>
      </article>

      <footer className="belge-alt">
        <a className="link-btn" href="/" onClick={(e) => { if (onGeri) { e.preventDefault(); onGeri() } }}>
          ← Uygulamaya dön
        </a>
      </footer>
    </div>
  )
}

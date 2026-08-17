# Tazeraf e-posta şablonları

Supabase'in varsayılan mailleri İngilizce ve markasız. Bu şablonlar onların yerine geçer.

## Nereye yapıştırılır

**Supabase → Authentication → Emails → Templates**

| Dosya | Supabase'deki sekme | Subject (konu) alanına yaz |
|---|---|---|
| `01-kayit-dogrulama.html` | Confirm signup | `Tazeraf hesabını doğrula` |
| `02-sifre-sifirlama.html` | Reset Password | `Tazeraf şifreni sıfırla` |
| `03-eposta-degisikligi.html` | Change Email Address | `Tazeraf e-posta değişikliğini onayla` |

Dosyanın içeriğini olduğu gibi kopyalayıp **Message body** alanına yapıştır. En üstteki
`<!-- ... -->` yorum satırını silmene gerek yok, mailde görünmez.

## Dikkat

- `{{ .ConfirmationURL }}` ve `{{ .Email }}` gibi ifadeler Supabase'in değişkenleri —
  **değiştirme veya silme**, yoksa bağlantılar çalışmaz.
- Şablonlar tablo tabanlı ve satır içi stilli yazıldı. Outlook dahil eski mail
  istemcileri flexbox/grid ve harici CSS desteklemiyor; bu yüzden modern CSS kullanılmadı.
- Renkler uygulamayla aynı: `#3b82f6` / `#38bdf8`.

## Test

Şablonu kaydettikten sonra gerçek bir kayıt/sıfırlama yaparak maili kendine gönder.
Gmail, Outlook ve telefonda ayrı ayrı bak — mail istemcileri HTML'i farklı yorumlar.

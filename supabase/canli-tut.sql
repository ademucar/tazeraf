-- ============================================================================
-- Supabase ücretsiz planının "hareketsiz proje" duraklatmasına karşı
-- GitHub Actions görevi (supabase-uyanik-tut.yml) her gün bu fonksiyonu çağırır.
-- Bir kez, Supabase -> SQL Editor'de çalıştırılır. Tekrar çalıştırmak zararsızdır.
-- ============================================================================

-- Tek satırlık kalp atışı tablosu. id=1 dışında satır eklenemez.
create table if not exists public.canli_tut (
  id          smallint    primary key default 1 check (id = 1),
  son_ping    timestamptz not null default now(),
  ping_sayisi bigint      not null default 0
);
insert into public.canli_tut (id) values (1) on conflict (id) do nothing;

-- RLS açık ve HİÇ politika yok: tabloya doğrudan kimse okuyamaz/yazamaz.
-- Tek giriş kapısı aşağıdaki fonksiyon.
alter table public.canli_tut enable row level security;

-- security definer: fonksiyon sahibinin yetkisiyle çalışır, RLS'e takılmaz.
-- Sadece sabit tek bir satırın zaman damgasını günceller; başka hiçbir
-- tabloya dokunamaz, parametre almaz — kötüye kullanılacak bir yüzeyi yok.
create or replace function public.canli_tut_ping()
returns timestamptz
language sql
security definer
set search_path = public
as $$
  update public.canli_tut
     set son_ping = now(),
         ping_sayisi = ping_sayisi + 1
   where id = 1
  returning son_ping;
$$;

revoke all on function public.canli_tut_ping() from public;
grant execute on function public.canli_tut_ping() to anon;

-- Kontrol: son_ping ve ping_sayisi görünmeli
select * from public.canli_tut;

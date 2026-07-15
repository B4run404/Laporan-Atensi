-- ==============================================================================
-- SUPABASE SCHEMA MIGRATION SCRIPT — SIMAP LAPAS TANJUNG PATI
-- ==============================================================================
-- Cara Penggunaan:
-- 1. Buka dasbor Supabase proyek Anda di https://app.supabase.com
-- 2. Pilih menu "SQL Editor" di bilah navigasi kiri, lalu klik "New query"
-- 3. Salin dan tempel seluruh isi file ini ke dalam editor
-- 4. Klik tombol "Run" (atau tekan Ctrl+Enter / Cmd+Enter)
-- ==============================================================================

-- 1. TABEL DAFTAR PETUGAS & GELAR PER KATEGORI (officers)
CREATE TABLE IF NOT EXISTS public.officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_key VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_key, name)
);

-- 2. TABEL KAMUS SMART AUTO-CORRECTION (corrections)
CREATE TABLE IF NOT EXISTS public.corrections (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL KATEGORI PIKET KUSTOM (custom_categories)
CREATE TABLE IF NOT EXISTS public.custom_categories (
    key VARCHAR(50) PRIMARY KEY,
    label VARCHAR(150) NOT NULL,
    color VARCHAR(30) DEFAULT 'navy',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL RIWAYAT LAPORAN ATENSI & REMINDER PIKET (history_logs)
CREATE TABLE IF NOT EXISTS public.history_logs (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    timestamp_str VARCHAR(100),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- ==============================================================================
-- Karena aplikasi ini digunakan di internal Lapas tanpa harus membuat akun login
-- individual/password untuk tiap petugas piket, kita mengaktifkan RLS dan
-- membuka akses baca/tulis penuh (Public Access) untuk API key (Anon Key).
-- ==============================================================================

ALTER TABLE public.officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history_logs ENABLE ROW LEVEL SECURITY;

-- Hapus kebijakan lama jika sebelumnya pernah dijalankan
DROP POLICY IF EXISTS "Public Access Officers" ON public.officers;
DROP POLICY IF EXISTS "Public Access Corrections" ON public.corrections;
DROP POLICY IF EXISTS "Public Access Categories" ON public.custom_categories;
DROP POLICY IF EXISTS "Public Access History" ON public.history_logs;

-- Buat kebijakan akses publik untuk tabel officers
CREATE POLICY "Public Access Officers"
ON public.officers FOR ALL
USING (true)
WITH CHECK (true);

-- Buat kebijakan akses publik untuk tabel corrections
CREATE POLICY "Public Access Corrections"
ON public.corrections FOR ALL
USING (true)
WITH CHECK (true);

-- Buat kebijakan akses publik untuk tabel custom_categories
CREATE POLICY "Public Access Categories"
ON public.custom_categories FOR ALL
USING (true)
WITH CHECK (true);

-- Buat kebijakan akses publik untuk tabel history_logs
CREATE POLICY "Public Access History"
ON public.history_logs FOR ALL
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- SEED DATA AWAL (OPTIONAL — Akan disinkronkan otomatis dari aplikasi)
-- ==============================================================================
-- Anda tidak wajib menjalankan insert di bawah ini karena aplikasi yang
-- menyinkronkan data default awal secara otomatis saat pertama kali dihubungkan.

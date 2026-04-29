
# Steg 4A v2 — Fundament för dashboard

Bygger roll-system, försäljnings-tabeller, automatiska beräkningar och auth-skelett. **Inga skärmar** byggs nu — det görs i 4B. Befintliga tabeller (`qlasskassan_leads`, `profiles`, `startguide_leads`, e-post-infra) lämnas orörda.

## 1. Databas-migrering (en migration)

### 1.1 Roll-system
- Skapa enum `app_role` med värden `'admin'`, `'teacher'`.
- Skapa tabell `user_roles` (`id`, `user_id` → `auth.users`, `role`, `class_id` (uuid, valfri), `created_at`, unik på `(user_id, role, class_id)`).
- Index på `user_id`, `role`, `class_id`.
- Security-definer-funktioner:
  - `has_role(_user_id uuid, _role app_role) → boolean`
  - `get_user_class_id(_user_id uuid) → uuid` (returnerar teacher-klassen)
- RLS på `user_roles`:
  - Admins kan hantera allt (`has_role(auth.uid(), 'admin')`)
  - Användare kan se sina egna roller

### 1.2 Bygg ut `class_registrations`
- Nya kolumner: `goal_amount int`, `campaign_start date`, `campaign_end date`, `tracking_mode text default 'aggregate'` (check: `aggregate`/`per_student`), `total_sold_gold int default 0`, `total_sold_crema int default 0`, `total_to_class numeric(10,2) default 0`.
- Uppdatera status-check till `('pending','lead','active','completed','cancelled')`.
- Index på `status` och `created_at desc`.
- Säkra att `handle_updated_at`-trigger är kopplad.
- **Nya RLS-policies** (befintliga "Users …" behålls):
  - Admin: select/update/delete allt
  - Teacher (via `get_user_class_id`): select/update sin klass

### 1.3 Nya tabeller
**`students`** — `id`, `class_id` → `class_registrations` (cascade), `name`, `sold_gold int`, `sold_crema int`, `notes`, `created_at`, `updated_at`. RLS: admin all; teacher all på sin klass.

**`orders`** — `id`, `class_id` (cascade), `submitted_at`, `qty_gold`, `qty_crema`, beräknade `total_to_class`, `total_to_invoice`, `invoice_status` (`pending|sent|paid|overdue`), `invoice_number`, `invoice_sent_at`, `invoice_paid_at`, `invoice_due_date`, `delivery_status` (`pending|preparing|shipped|delivered`), `delivery_address`, `tracking_number`, `delivered_at`, `notes`. Index på class/invoice/delivery/created. RLS: admin all; teacher select+insert på sin klass; teacher update endast om `invoice_status='pending'`.

**`repurchases`** — `id`, `class_id` (cascade), `purchased_at`, `product` (`gold`/`crema`), `quantity > 0`, `bonus_to_class numeric(10,2)`, `source_order_id` → `orders` (set null), `customer_email`, `notes`. RLS: admin all; teacher select på sin klass.

### 1.4 Triggers / funktioner
- `calculate_order_totals()` (BEFORE INSERT/UPDATE på `orders`):
  - `total_to_class = qty_gold*50 + qty_crema*70`
  - `total_to_invoice = qty_gold*119 + qty_crema*179`
- `update_class_counters()` (AFTER INSERT/UPDATE/DELETE på `orders`): re-summerar `class_registrations.total_sold_gold/crema/total_to_class` för aktuell klass.
- `calculate_repurchase_bonus()` (BEFORE INSERT på `repurchases`): sätter `bonus_to_class = quantity*15` om saknas.
- `handle_updated_at`-triggers på `students` och `orders`.

> Status-checks behålls som CHECK-constraints — de är immutable (enkla strängjämförelser), inte tidsbaserade, så det är OK enligt projektets riktlinjer.

## 2. Auth-konfiguration
- Verifiera att Email/Password sign-in är aktiverat och **Confirm email = på** (ingen auto-confirm). Justera vid behov via auth-config-tool.
- Site URL-justering görs via Cloud-UI (instruerar dig om det behövs).

## 3. Frontend — auth-skelett (inga UI-sidor)

### 3.1 `src/lib/auth.ts`
Funktioner: `signIn`, `signOut`, `resetPassword` (redirect till `/aterstall-losenord`), `updatePassword`, `getCurrentUser`, `getUserRole`, `getUserClassId`. Typ `UserRole = 'admin' | 'teacher' | null`.

### 3.2 `src/lib/AuthContext.tsx`
Provider som håller `user`, `session`, `role`, `classId`, `loading`. Lyssnar på `onAuthStateChange` och laddar roll/klass från `user_roles` (admin-prio över teacher). Hook `useAuth()`.

> Implementeras med korrekt ordning för Supabase-auth: sätt `onAuthStateChange`-listener **innan** `getSession()` för att undvika missade event.

### 3.3 `src/App.tsx`
- Wrappa allt i `<AuthProvider>`.
- Lägg till `RequireAuth`-komponent (med valfri `requiredRole`) som redirectar:
  - ej inloggad → `/logga-in`
  - fel roll → `/`
- Nya routes (placeholder-komponenter, byggs i 4B):
  - `/logga-in` → `LoginPage`
  - `/aterstall-losenord` → `ResetPasswordPage`
  - `/dashboard/*` → `RequireAuth requiredRole="teacher"` → `TeacherDashboard`
  - `/admin/*` → `RequireAuth requiredRole="admin"` → `AdminDashboard`
- Behåll `/` (Index) och `*` (NotFound).

## 4. Typer
`src/integrations/supabase/types.ts` regenereras automatiskt efter migration — verifieras att `app_role`, `user_roles`, `students`, `orders`, `repurchases` och nya kolumner finns.

## 5. Verifiering efter körning
1. Migration kör utan fel.
2. Test-INSERT: `INSERT INTO orders (class_id, qty_gold, qty_crema) SELECT id,10,5 FROM class_registrations LIMIT 1;`
   - Förväntat: `total_to_class=850`, `total_to_invoice=2085`, och att moder-rad i `class_registrations` får `total_sold_gold=10, total_sold_crema=5, total_to_class=850`.
3. Linter-kontroll på Supabase efteråt.
4. App startar, `/dashboard` redirectar till `/logga-in` när utloggad.

## 6. Manuellt efter migrationen (du gör själv)
För att skapa första admin: använd Lovable Cloud-vyn för att skapa user, kopiera UUID, kör en `INSERT INTO user_roles (user_id, role) VALUES ('…','admin');`. Jag kan hjälpa till med SQL-snutten när vi kommer dit.

## 7. Frågor inför 4B (svara gärna nu eller senare)
- **Kopplingsflöde lärare↔klass:** rekommenderat alternativ B (lärare registrerar sig → admin granskar och aktiverar i admin-dashboard, då skapas `user_roles`-raden).
- **Innan aktivering:** lärare ser bara "Vi granskar din anmälan" — inte dashboarden.

Säg till om något ska ändras innan jag implementerar.

# BookandLab Security & Access Architecture

## Architecture Philosophy: Identity vs. Authority

BookandLab strictly separates the concern of "Identity" from "Authority" and data storage to maintain absolute control over multi-tenancy rules and progression state.

1.  **Identity (Stack Auth)**
    - **Purpose:** Prove _who_ the user is (Authentication) and _which_ tenant (Team) they belong to.
    - **Trust Bound:** Stack Auth is trusted only to provide the user's `id`, `email`, and `teamId`.
    - **Rule:** We _do not_ trust Stack Auth metadata for roles, permissions, or learning progress.

2.  **Authority (PostgreSQL / Supabase)**
    - **Purpose:** Determine _what_ the user can do (Authorization/RBAC) and record all state.
    - **Trust Bound:** The Postgres database is the sole source of truth for all structured data, skill scores, and role mapping (`user_roles`).

## 1. Zero Trust Frontend Database Access

**The frontend CANNOT talk to the database.**

- There is no active `@supabase/supabase-js` `createClient` with an anon key available in the frontend architecture.
- All data requests, queries, and mutations _must_ occur over HTTP via Next.js Server Actions or APIs.
- **Why:** Row Level Security (RLS) is notoriously easy to leak metadata through or accidentally misconfigure during rapid development. By severing the connection entirely, the attack surface for data breaches is minimized to just the Server Actions.

## 2. Server Action Enforcement

All database interactions flow through Server Actions utilizing the Supabase Service Role Key (`createAdminClient`).

- **Service Role bypasses Postgres RLS entirely.**
- Therefore, the burden of security (checking `team_id`, validating user roles, ensuring they own the data) is shifted exclusively to the Node.js domain (inside the Server Action).

### 3. Role-Based Access Control (RBAC)

Roles are strictly team-scoped to support multi-tenancy.
A User _does not_ have a global role (e.g., "I am an Admin").
A User has a role _within a specific team_ (e.g., "I am an Admin for Team A, and a Student for Team B").

- To enforce this, use `requireRole(["ADMIN"])` wrapped around secure endpoints.
- Under the hood, `requireRole` queries `user_roles` matching both the `user.id` and the `user.team_id` extracted from the active session.

## 4. Multi-Tenancy (Data Isolation)

The system is hard-partitioned by `team_id`.

- Every `users` record tracks its `team_id`.
- All role mappings exist in `user_roles(user_id, team_id, role_id)`.
- When fetching or mutating tenant-sensitive operational data _always_ apply a `WHERE team_id = activeTeamId` clause at the application level.

## 5. Defense-in-Depth RLS

While our application code relies entirely on the Service Role key (which ignores RLS), we still enable active `ROW LEVEL SECURITY` on our Postgres tables with default `false` policies (e.g., `FOR SELECT USING (false)`).

- This acts as a secondary structural lockdown. If, in the future, someone re-introduces a frontend Supabase client with an anon key, it will immediately fail safe (deny all) rather than accidentally exposing data globally.

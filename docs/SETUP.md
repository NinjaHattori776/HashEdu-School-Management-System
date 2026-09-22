# Dashboard UI Overhaul — Install Steps

This adds a real sidebar-and-content dashboard shell and restyles every existing
screen to match. No backend changes — this is frontend-only.

## Files to copy in

1. **New file:** `resources/js/layouts/DashboardLayout.jsx` — the sidebar + content shell.
2. **New file:** `resources/js/components/ui.jsx` — shared design-system pieces
   (PageHeader, Panel, StatCard, LedgerTable, Input, Select, Button). Every future
   screen should import from here rather than restyling ad hoc.
3. **Replace:** `resources/js/portals/super-admin/AcademicSetup.jsx`
4. **Replace:** `resources/js/portals/admin/StudentManagement.jsx`
5. **Replace:** `resources/js/portals/admin/TeacherManagement.jsx`
6. **Replace:** `resources/js/App.jsx` — now nests all three screens inside `DashboardLayout`
   using React Router's layout-route pattern (`<Route element={<DashboardLayout />}>`).
7. **Replace:** `resources/views/app.blade.php` — adds the Google Fonts link for
   Source Serif 4 + Inter.

## What changed

- A fixed navy sidebar on the left with role-aware navigation (a super admin sees
  both Academic Setup and People sections; an admin sees only People). Active link
  gets a brass left-bar highlight.
- User's name, role, and a Sign Out button pinned to the bottom of the sidebar.
- Every screen now opens with a page header (serif title + one-line description)
  and stat cards summarizing the data at a glance.
- Tables and panels use flat borders and hairline dividers — a ledger/register look
  — instead of rounded cards with drop shadows.
- Two Google Fonts load: Source Serif 4 for headings, Inter for everything else.

## After copying in

Nothing new to `npm install` — this only uses packages already installed
(`react-router-dom`, which you added in Phase 2). Reload the browser; you should
land on the new sidebar shell immediately after logging in.

## Extending this to future phases

When we build Phase 3 (Attendance) and beyond, new screens will:
- Import `PageHeader`, `Panel`, `StatCard`, `LedgerTable`, `Input`, `Select`, `Button`
  from `resources/js/components/ui.jsx` instead of writing new Tailwind classes from scratch.
- Get added to the `NAV_BY_ROLE` object in `DashboardLayout.jsx` (e.g. the "Coming soon"
  placeholder under Teacher → Classroom becomes a real "Attendance" link).
- Get nested inside the existing `<Route element={<DashboardLayout />}>` block in `App.jsx`.

This keeps every future screen visually consistent without re-deciding the design each time.

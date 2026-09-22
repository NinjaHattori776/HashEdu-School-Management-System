<h1>📐 Development Rules</h1>
<p>For any AI (Claude, Claude Code, or otherwise) working on this project.</p>

<table>
<tr>
<td style="background:#1B2A4A;color:#fff;padding:10px 16px;"><strong>①</strong> Libraries</td>
<td style="background:#1B2A4A;color:#fff;padding:10px 16px;"><strong>②</strong> Conventions</td>
<td style="background:#1B2A4A;color:#fff;padding:10px 16px;"><strong>③</strong> Casing Gotcha</td>
<td style="background:#1B2A4A;color:#fff;padding:10px 16px;"><strong>④</strong> File Discipline</td>
</tr>
</table>

## ① Libraries — use these, don't introduce alternatives without asking

<table>
<tr><th>Area</th><th>Use</th><th>Don't</th></tr>
<tr><td>Frontend routing</td><td>React Router v6</td><td>Next.js, Remix</td></tr>
<tr><td>HTTP client</td><td>Shared <code>api/client.js</code> Axios instance</td><td>Raw <code>fetch</code>, a second Axios instance</td></tr>
<tr><td>Styling</td><td>Tailwind utilities + inline design tokens</td><td>MUI, Chakra, Ant Design</td></tr>
<tr><td>PDF generation</td><td>barryvdh/laravel-dompdf</td><td>A second PDF library</td></tr>
<tr><td>Auth</td><td>Sanctum, token-based Bearer</td><td>Cookie/session SPA auth (changes CORS + every controller's assumptions)</td></tr>
</table>

## ② Conventions to follow

- ✅ **One controller per resource** in `app/Http/Controllers/Api/`, extending the base `Controller`. Inline validation via `$request->validate([...])`.
- ✅ **Every screen imports from `components/ui.jsx`** (`PageHeader`, `Panel`, `StatCard`, `LedgerTable`, `Input`, `Select`, `Button`) instead of new Tailwind classes.
- ✅ **Every form must catch and display errors.** Never let a `catch` silently swallow a validation failure.
- ✅ **Anything resubmittable uses `updateOrCreate`, not `create`.**
- ✅ **New screens get added to BOTH `NAV_BY_ROLE` in `DashboardLayout.jsx` AND the route list in `App.jsx`.**
- ✅ **New role-gated API routes go inside the existing `role:...` middleware group** that fits (`super-admin`, `admin`, `teacher`, `portal`) — check before creating a new one.

## ③ Casing Gotcha — verify, don't assume

<table>
<tr><td style="background:#B3452D;color:#fff;padding:12px;">
⚠️ <strong>This has caused a real bug (twice).</strong> Laravel serializes Eloquent
relations into JSON as <strong>snake_case</strong> in this project's actual
responses — even when the relation method itself is camelCase
(<code>examSubjects()</code> → <code>"exam_subjects"</code> in JSON).
<br/><br/>
<strong>Rule:</strong> before writing frontend code that reads a nested relation
key, check the actual Network tab JSON response. Don't assume casing matches the
PHP method name.
</td></tr>
</table>

## ④ File-Copying Discipline (for Claude Code specifically)

Always label each file as one of:

<table>
<tr><td style="background:#2F7D5C;color:#fff;padding:4px 12px;border-radius:10px;">CREATE</td><td>New file, doesn't exist yet</td></tr>
<tr><td style="background:#B8860B;color:#fff;padding:4px 12px;border-radius:10px;">REPLACE</td><td>Fully overwrite an existing file</td></tr>
<tr><td style="background:#1B2A4A;color:#fff;padding:4px 12px;border-radius:10px;">MERGE</td><td>Add/change only part of an existing file</td></tr>
</table>

**After applying, always run this checklist:**

- ☑️ Every import in `resources/js` resolves to a real file
- ☑️ Every class referenced in `routes/api.php` / `bootstrap/app.php` has a matching file under `app/`
- ☑️ `npm run build` completes without errors (not just `npm run dev`)

## ⚠️ Core scaffold files — verify before assuming they exist

`composer create-project` has, more than once, produced a project missing
`app/Providers/AppServiceProvider.php` and `app/Http/Controllers/Controller.php`.
If you see "Failed to open stream" or "Target class does not exist" mentioning
either, check whether the file is simply absent first.

## What NOT to do

<table>
<tr><td style="background:#B3452D;color:#fff;padding:6px 10px;">🚫</td><td>Add a second CSS framework or reset Tailwind's config</td></tr>
<tr><td style="background:#B3452D;color:#fff;padding:6px 10px;">🚫</td><td>Introduce a state management library (Redux, Zustand)</td></tr>
<tr><td style="background:#B3452D;color:#fff;padding:6px 10px;">🚫</td><td>Rename API routes / change response shape without checking every consumer</td></tr>
<tr><td style="background:#B3452D;color:#fff;padding:6px 10px;">🚫</td><td>Delete old phase zips/docs without being asked</td></tr>
</table>

<h1>📋 Product Requirements Document</h1>
<p><strong>School Management System</strong> — Laravel + React, multi-portal, classes 1–13</p>

<table>
<tr>
<td><strong>Version</strong></td><td>1.0</td>
<td><strong>Status</strong></td><td><span style="background:#2F7D5C;color:#fff;padding:3px 12px;border-radius:12px;font-size:12px;font-weight:600;">In Development</span></td>
</tr>
<tr>
<td><strong>Stack</strong></td><td>Laravel + React</td>
<td><strong>Target</strong></td><td>Single-school deployment</td>
</tr>
</table>

## 1. Product Overview

A centralized system replacing spreadsheets and paper registers for day-to-day
school operations — academics, attendance, marks, report cards, and (planned)
fees, notices, and analytics.

## 2. Problem Statement

Schools track students, attendance, marks, and communication across
disconnected tools. This system centralizes all of it behind one login-gated
system where each role sees only what's relevant to them.

## 3. Goals

- ✅ One login, five role-specific portals
- ✅ Real academic workflows: admission → attendance → exams → report cards
- ⬜ Fee tracking, notices, timetables, analytics, public site (see `tasks.md`)

## 4. Target Users

<table>
<tr>
<td style="background:#1B2A4A;color:#fff;padding:10px;text-align:center;"><strong>Super Admin</strong><br/><span style="font-size:11px;">Owns academic structure</span></td>
<td style="background:#1B2A4A;color:#fff;padding:10px;text-align:center;"><strong>Admin</strong><br/><span style="font-size:11px;">Manages people</span></td>
<td style="background:#1B2A4A;color:#fff;padding:10px;text-align:center;"><strong>Teacher</strong><br/><span style="font-size:11px;">Attendance & marks</span></td>
<td style="background:#1B2A4A;color:#fff;padding:10px;text-align:center;"><strong>Student</strong><br/><span style="font-size:11px;">Views own records</span></td>
<td style="background:#1B2A4A;color:#fff;padding:10px;text-align:center;"><strong>Parent</strong><br/><span style="font-size:11px;">Views children's records</span></td>
</tr>
</table>

## 5. Core Features

<table>
<tr><th>Feature</th><th>Status</th></tr>
<tr><td>Academic Setup (years, classes 1–13, sections, subjects)</td><td><span style="background:#2F7D5C;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">Done</span></td></tr>
<tr><td>People (students, teachers, parents, linking)</td><td><span style="background:#2F7D5C;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">Done</span></td></tr>
<tr><td>Attendance (bulk mark + history view)</td><td><span style="background:#2F7D5C;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">Done</span></td></tr>
<tr><td>Exams & Marks</td><td><span style="background:#2F7D5C;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">Done</span></td></tr>
<tr><td>Report Cards (PDF, auto-graded, ranked)</td><td><span style="background:#B8860B;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">In Progress</span></td></tr>
<tr><td>Fees</td><td><span style="background:#B3452D;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">Not Started</span></td></tr>
<tr><td>Notices & Timetable</td><td><span style="background:#B3452D;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">Not Started</span></td></tr>
<tr><td>Analytics</td><td><span style="background:#B3452D;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">Not Started</span></td></tr>
<tr><td>Public Landing Page</td><td><span style="background:#B3452D;color:#fff;padding:2px 10px;border-radius:10px;font-size:12px;">Not Started</span></td></tr>
</table>

See `tasks.md` for the full task-level breakdown.

## 6. Non-Goals

- Multi-school / multi-tenant support
- Native mobile app (web-responsive only)
- Real-time sync between open tabs/sessions

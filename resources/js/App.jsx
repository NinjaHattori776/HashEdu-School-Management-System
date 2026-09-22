import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import RequireRole from './auth/RequireRole';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AcademicSetup from './portals/super-admin/AcademicSetup';
import ExamSetup from './portals/super-admin/ExamSetup';
import ReportCards from './portals/super-admin/ReportCards';
import StudentManagement from './portals/admin/StudentManagement';
import TeacherManagement from './portals/admin/TeacherManagement';
import ParentManagement from './portals/admin/ParentManagement';
import FeeManagement from './portals/admin/FeeManagement';
import TeacherAttendance from './portals/teacher/TeacherAttendance';
import TeacherMarks from './portals/teacher/TeacherMarks';
import MyAttendance from './portals/student/MyAttendance';
import MyMarks from './portals/student/MyMarks';
import MyReportCards from './portals/student/MyReportCards';
import MyFees from './portals/student/MyFees';
import NoticeBoard from './portals/public/NoticeBoard';
import TimetableManagement from './portals/admin/TimetableManagement';
import MyTimetable from './portals/student/MyTimetable';
import Analytics from './portals/super-admin/Analytics';
import TeacherAnalytics from './portals/teacher/TeacherAnalytics';
import PublicLayout from './portals/public/PublicLayout';
import Home from './portals/public/Home';
import About from './portals/public/About';
import Features from './portals/public/Features';
import Contact from './portals/public/Contact';

// This REPLACES your existing resources/js/App.jsx.
export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/features" element={<Features />} />
                        <Route path="/contact" element={<Contact />} />
                    </Route>

                    <Route element={<DashboardLayout />}>
                        <Route
                            path="/super-admin/academic-setup"
                            element={<RequireRole roles={['super_admin']}><AcademicSetup /></RequireRole>}
                        />
                        <Route
                            path="/super-admin/exam-setup"
                            element={<RequireRole roles={['super_admin']}><ExamSetup /></RequireRole>}
                        />
                        <Route
                            path="/super-admin/report-cards"
                            element={<RequireRole roles={['super_admin']}><ReportCards /></RequireRole>}
                        />
                        <Route
                            path="/super-admin/analytics"
                            element={<RequireRole roles={['super_admin']}><Analytics endpoint="/super-admin/analytics" /></RequireRole>}
                        />
                        <Route
                            path="/admin/students"
                            element={<RequireRole roles={['admin', 'super_admin']}><StudentManagement /></RequireRole>}
                        />
                        <Route
                            path="/admin/teachers"
                            element={<RequireRole roles={['admin', 'super_admin']}><TeacherManagement /></RequireRole>}
                        />
                        <Route
                            path="/admin/parents"
                            element={<RequireRole roles={['admin', 'super_admin']}><ParentManagement /></RequireRole>}
                        />
                        <Route
                            path="/admin/fees"
                            element={<RequireRole roles={['admin', 'super_admin']}><FeeManagement /></RequireRole>}
                        />
                        <Route
                            path="/admin/analytics"
                            element={<RequireRole roles={['admin', 'super_admin']}><Analytics endpoint="/admin/analytics" /></RequireRole>}
                        />
                        <Route
                            path="/portal/notices"
                            element={<RequireRole roles={['teacher', 'student', 'parent', 'admin', 'super_admin']}><NoticeBoard /></RequireRole>}
                        />
                        <Route
                            path="/admin/notices"
                            element={<RequireRole roles={['admin', 'super_admin']}><NoticeBoard /></RequireRole>}
                        />
                        <Route
                            path="/admin/timetable"
                            element={<RequireRole roles={['admin', 'super_admin']}><TimetableManagement /></RequireRole>}
                        />
                        <Route
                            path="/teacher/attendance"
                            element={<RequireRole roles={['teacher', 'admin', 'super_admin']}><TeacherAttendance /></RequireRole>}
                        />
                        <Route
                            path="/teacher/marks"
                            element={<RequireRole roles={['teacher', 'admin', 'super_admin']}><TeacherMarks /></RequireRole>}
                        />
                        <Route
                            path="/teacher/analytics"
                            element={<RequireRole roles={['teacher', 'admin', 'super_admin']}><TeacherAnalytics /></RequireRole>}
                        />
                        <Route
                            path="/portal/attendance"
                            element={<RequireRole roles={['student', 'parent']}><MyAttendance /></RequireRole>}
                        />
                        <Route
                            path="/portal/marks"
                            element={<RequireRole roles={['student', 'parent']}><MyMarks /></RequireRole>}
                        />
                        <Route
                            path="/portal/report-cards"
                            element={<RequireRole roles={['student', 'parent']}><MyReportCards /></RequireRole>}
                        />
                        <Route
                            path="/portal/fees"
                            element={<RequireRole roles={['student', 'parent']}><MyFees /></RequireRole>}
                        />
                        <Route
                            path="/portal/timetable"
                            element={<RequireRole roles={['teacher', 'student', 'parent']}><MyTimetable /></RequireRole>}
                        />
                    </Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

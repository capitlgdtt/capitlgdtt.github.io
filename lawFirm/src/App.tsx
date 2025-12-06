import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import TeamPage from './pages/TeamPage';
import BlogPage from './pages/BlogPage';
import './i18n';
import BlogPostPage from "./components/sections/PageSections/BlogPostPage.tsx";
import AdminLogin from "./components/admin/pages/AdminLogin.tsx";
import AdminDashboard from "./components/admin/pages/AdminDashboard.tsx";
import PostsManager from "./components/admin/pages/PostsManager.tsx";
import TeamManager from "./components/admin/pages/TeamManager.tsx";
import ServicesManager from "./components/admin/pages/ServicesManager.tsx";
import ApplicationsManager from "./components/admin/pages/ApplicationsManager.tsx";
import AdminsManager from "./components/admin/pages/AdminsManager.tsx";
import StatsManager from "./components/admin/pages/StatsManager.tsx";
import AdminPage from "./components/admin/layout/AdminPage.tsx";
import PostEditor from "./components/admin/pages/Editors/PostEditor.tsx";
import TeamEditor from "./components/admin/pages/Editors/TeamEditor.tsx";
import ServiceEditor from "./components/admin/pages/Editors/ServiceEditor.tsx";
import AdminEditor from "./components/admin/pages/Editors/AdminEditor.tsx";
import PrivacyPage from "./pages/PrivacyPage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <AppShell>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/privacy" element={<AppShell><PrivacyPage /></AppShell>} />

                    {/* Админка */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminPage><AdminDashboard /></AdminPage>} />
                    <Route path="/admin/posts" element={<AdminPage><PostsManager /></AdminPage>} />
                    <Route path="/admin/team" element={<AdminPage><TeamManager /></AdminPage>} />
                    <Route path="/admin/services" element={<AdminPage><ServicesManager /></AdminPage>} />
                    <Route path="/admin/applications" element={<AdminPage><ApplicationsManager /></AdminPage>} />
                    <Route path="/admin/admins" element={<AdminPage><AdminsManager /></AdminPage>} />
                    <Route path="/admin/stats" element={<AdminPage><StatsManager /></AdminPage>} />

                    <Route path="/admin/posts/create" element={<AdminPage><PostEditor /></AdminPage>} />
                    <Route path="/admin/posts/edit/:id" element={<AdminPage><PostEditor /></AdminPage>} />
                    <Route path="/admin/team/create" element={<AdminPage><TeamEditor /></AdminPage>} />
                    <Route path="/admin/team/edit/:id" element={<AdminPage><TeamEditor /></AdminPage>} />
                    <Route path="/admin/services/create" element={<AdminPage><ServiceEditor /></AdminPage>} />
                    <Route path="/admin/services/edit/:id" element={<AdminPage><ServiceEditor /></AdminPage>} />
                    <Route path="admin/admins/create" element={<AdminPage><AdminEditor /></AdminPage>} />
                    <Route path="admin/admins/edit/:id" element={<AdminPage><AdminEditor /></AdminPage>} />
                </Routes>
            </AppShell>
        </Router>
    );
};

export default App;
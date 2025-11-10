import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import TeamPage from './pages/TeamPage';
import BlogPage from './pages/BlogPage';
import './i18n';

const App: React.FC = () => {
    return (
        <Router>
            <AppShell>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                </Routes>
            </AppShell>
        </Router>
    );
};

export default App;
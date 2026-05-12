import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import RankingPage from '../pages/RankingPage';
import GroupsPage from '../pages/GroupPages';
import GroupDetailsPage from '../pages/GroupDetailsPage';
import AdminPage from '../pages/adminPage';
import RegisterPage from '../pages/RegisterPage';
import HistoryPage from '../pages/HistoryPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas Públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                {/* Rutas Privadas */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/ranking" element={<RankingPage />} />
                        <Route path="/groups" element={<GroupsPage />} />
                        <Route path="/groups/:id" element={<GroupDetailsPage />} />
                        <Route path="/admin" element={<AdminPage />} />
                        <Route path="/history" element={<HistoryPage />} />
                        {/* Aquí irán el ranking, mis grupos, etc. */}
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
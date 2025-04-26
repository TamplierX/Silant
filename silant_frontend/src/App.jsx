import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router';
import { useUserContext } from './context/userContext.js';
import Header from './components/Header/Header.jsx';
import MainPage from './components/Main/MainPage/MainPage.jsx';
import LoginPage from './components/Main/LoginPage/LoginPage.jsx';
import MachineDetailsPage from './components/Main/MachineDetailsPage/MachineDetailsPage.jsx';
import ServiceDetailsPage from './components/Main/ServiceDetailsPage/ServiceDetailsPage.jsx';
import ClaimDetailsPage from './components/Main/ClaimDetailsPage/ClaimDetailsPage.jsx';
import ReferenceDetailsPage from './components/Main/ReferenceDetailsPage/ReferenceDetailsPage.jsx';
import ClientDetailsPage from './components/Main/ClientDetailsPage/ClientDetailsPage.jsx';
import ServiceCompanyDetailsPage from './components/Main/ServiceCompanyDetailsPage/ServiceCompanyDetailsPage.jsx';
import Footer from './components/Footer/Footer.jsx';
import './App.css';

function App() {
    const { checkLoginStatus } = useUserContext();

    useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    const NotAuthRoute = () => {
        const isAuth = !!localStorage.getItem('access_token');
        return isAuth ? <Navigate to="/" replace /> : <Outlet />;
    };

    const ProtectedRoute = () => {
        const isAuth = !!localStorage.getItem('access_token');
        return isAuth ? <Outlet /> : <Navigate to="/" replace />;
    };

    const ManagerRoute = () => {
        const isManager = localStorage.getItem('user_role') === 'manager';
        return isManager ? <Outlet /> : <Navigate to="/" replace />;
    };

    return (
        <Router>
            <div className="app-container">
                <Header />
                <Routes>
                    <Route element={<NotAuthRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                    </Route>
                    <Route path="*" element={<MainPage />} />
                    <Route path="/machine/:id" element={<MachineDetailsPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/service/:id" element={<ServiceDetailsPage />} />
                        <Route path="/claim/:id" element={<ClaimDetailsPage />} />
                    </Route>
                    <Route element={<ManagerRoute />}>
                        <Route path="/reference/:id" element={<ReferenceDetailsPage />} />
                        <Route path="/client/:id" element={<ClientDetailsPage />} />
                        <Route
                            path="/service_company/:id"
                            element={<ServiceCompanyDetailsPage />}
                        />
                    </Route>
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;

import React from 'react';
import NotAuthMainPage from './NotAuthMainPage/NotAuthMainPage.jsx';
import AuthUserMainPage from './AuthUserMainPage/AuthUserMainPage.jsx';
import { useUserContext } from '../../../context/userContext.js';

const MainPage = () => {
    const { isAuthenticated } = useUserContext();

    return (
        <main className="main main__main-page">
            <div className="container">
                {isAuthenticated ? <AuthUserMainPage /> : <NotAuthMainPage />}
            </div>
        </main>
    );
};

export default MainPage;

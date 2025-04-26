import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginService } from '../services/loginService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const checkLoginStatus = () => {
        setIsAuthenticated(!!localStorage.getItem('access_token'));
    };

    const getUserInfo = async () => {
        try {
            setIsLoading(true);
            const response = await loginService.info();
            const getUserRole = response.profile_type;
            localStorage.setItem('user_role', getUserRole);

            if (getUserRole === 'client') {
                localStorage.setItem('user_name', response.client.name);
                setUserRole({
                    en: 'client',
                    ru: 'Клиент',
                });
            } else if (getUserRole === 'service_company') {
                localStorage.setItem('user_name', response.service_company.name);
                setUserRole({
                    en: 'service_company',
                    ru: 'Сервисная организация',
                });
            } else if (getUserRole === 'manager') {
                localStorage.setItem('user_name', response.manager.name);
                setUserRole({
                    en: 'manager',
                    ru: 'Менеджер',
                });
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const contextValue = {
        isAuthenticated,
        setIsAuthenticated,
        checkLoginStatus,
        userRole,
        isLoading,
        getUserInfo,
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { loginService } from '../../../../services/loginService';
import { useUserContext } from '../../../../context/userContext';
import './LoginForm.css';

const LoginForm = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [authError, setAuthError] = useState(false);
    const [loginInProgress, setLoginInProgress] = useState(false);

    const { setIsAuthenticated } = useUserContext();
    const navigate = useNavigate();

    const handleLoginChange = (e) => {
        const value = e.target.value;
        setLogin(e.target.value);
        setAuthError(false);
        setLoginError(false);

        if (value === '') {
            setLoginError(true);
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            setLoginError(true);
        }
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(e.target.value);
        setAuthError(false);
        setPasswordError(false);

        if (value.length < 5) {
            setPasswordError(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAuthError(false);
        setLoginInProgress(true);

        try {
            const response = await loginService.login(login, password);
            localStorage.setItem('access_token', response.access);
            localStorage.setItem('refresh_token', response.refresh);
            setIsAuthenticated(true);
            navigate('/');
        } catch {
            setAuthError(true);
        } finally {
            setLoginInProgress(false);
        }
    };

    return (
        <div className="login__form-container">
            <form className="login__form" onSubmit={handleSubmit}>
                <div className="login__form-item">
                    <label className="login__form-label" htmlFor="login">
                        Логин:
                    </label>
                    <div className="login__form-input">
                        <input
                            className="login__form-field-input"
                            id="login"
                            name="login"
                            type="text"
                            value={login}
                            onChange={handleLoginChange}
                        />
                        {loginError && (
                            <div className="login__form-error">Введите корректные данные</div>
                        )}
                    </div>
                </div>
                <div className="login__form-item">
                    <label className="login__form-label" htmlFor="password">
                        Пароль:
                    </label>
                    <div className="login__form-input">
                        <input
                            className="login__form-field-input"
                            id="password"
                            name="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        {authError && (
                            <div className="login__form-error">Неверные учетные данные</div>
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="login__form-submit-button"
                    disabled={loginInProgress || !login || !password || loginError || passwordError}
                >
                    {loginInProgress ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;

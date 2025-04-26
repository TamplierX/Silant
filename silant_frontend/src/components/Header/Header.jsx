import React from 'react';
import { useNavigate, Link } from 'react-router';
import { useUserContext } from '../../context/userContext';
import header_logo from '../../assets/images/logo.svg';
import phone_icon from '../../assets/images/icon-phone.svg';
import telegram_icon from '../../assets/images/icon-telegram.svg';
import './Header.css';

const Header = () => {
    let navigate = useNavigate();
    const { isAuthenticated, setIsAuthenticated } = useUserContext();

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header__container">
                    <div className="header__content-top">
                        <Link className="home-link" to="/">
                            <div className="header__logo">
                                <img className="header__logo-img" src={header_logo} alt="Логотип" />
                            </div>
                        </Link>
                        <div className="header__contacts">
                            <div className="header__contacts-item">
                                <img
                                    src={phone_icon}
                                    alt="Иконка телефона"
                                    className="header__phone-icon"
                                />
                                <div className="header__contacts-text">+7-8352-20-12-09</div>
                            </div>
                            <div className="header__contacts-item">
                                <img
                                    src={telegram_icon}
                                    alt="Иконка телеграм"
                                    className="header__telegram-icon"
                                />
                                <Link
                                    className="header__contacts-text"
                                    to="https://t.me/Silant_chzsa"
                                >
                                    Telegram
                                </Link>
                            </div>
                        </div>
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="header__logout-button">
                                Выйти
                            </button>
                        ) : (
                            <button onClick={handleLogin} className="header__login-button">
                                Войти
                            </button>
                        )}
                    </div>
                    <div className="header__content-bottom">
                        <div className="header__title">
                            <h1 className="header__title-text">
                                Электронная сервисная книжка "Мой Силант"
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

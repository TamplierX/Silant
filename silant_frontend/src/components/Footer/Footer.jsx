import React from 'react';
import { Link } from 'react-router';

import footer_logo from '../../assets/images/logo_transparent.svg';
import phone_icon from '../../assets/images/icon-phone-white.svg';
import telegram_icon from '../../assets/images/icon-telegram-white.svg';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__container">
                    <div className="footer__logo">
                        <img className="footer__logo-img" src={footer_logo} alt="Логотип" />
                    </div>
                    <div className="footer__contacts">
                        <div className="footer__contacts-item">
                            <img
                                src={phone_icon}
                                alt="Иконка телефона"
                                className="footer__phone-icon"
                            />
                            <div className="footer__contacts-text">+7-8352-20-12-09</div>
                        </div>
                        <div className="footer__contacts-item">
                            <img
                                src={telegram_icon}
                                alt="Иконка телеграм"
                                className="footer__telegram-icon"
                            />
                            <Link className="footer__contacts-text" to="https://t.me/Silant_chzsa">
                                Telegram
                            </Link>
                        </div>
                    </div>
                    <div className="footer__company-info">
                        <div className="footer__info">
                            <p>ООО “ЧЕБОКСАРСКИЙ ЗАВОД</p>
                            <p>СИЛОВЫХ АГРЕГАТОВ”</p>
                            <p>Сокращенно: ООО "ЧЗСА"</p>
                        </div>
                        <div className="footer__copyright">
                            <p>Мой Силант. 2022</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

import React from 'react';

import LoginForm from './LoginForm/LoginForm.jsx';
import login_img from '../../../assets/images/background_login.svg';
import './LoginPage.css';

const LoginPage = () => {
    return (
        <main className="main main__login-page">
            <div className="container">
                <section className="login">
                    <div className="login__container">
                        <div className="login__header">
                            <img
                                className="login__image"
                                src={login_img}
                                alt="Изображение базы знаний"
                            />
                            <h1 className="login__title">
                                Информация о вашей <br />
                                технике и история её <br />
                                обслуживания в одном <br />
                                месте
                            </h1>
                        </div>
                        <LoginForm />
                    </div>
                </section>
            </div>
        </main>
    );
};

export default LoginPage;

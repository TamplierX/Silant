import React, { useState, useEffect } from 'react';
import { searchService } from '../../../../../services/searchService.js';

const CreateServiceCompany = ({ setIsServiceCompanyActive, setIsCreateServiceCompany }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [usersData, setUsersData] = useState([]);
    const [submitError, setSubmitError] = useState('');

    const [serviceCompany, setServiceCompany] = useState({
        user: '',
        name: '',
        description: '',
    });

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setUsersData([]);

            try {
                const response = await searchService.getUsers();
                setUsersData(response);
            } catch (error) {
                setError(
                    error.referencesResponse?.status === 404
                        ? 'Данные не найдены'
                        : 'Ошибка сервера',
                );
            } finally {
                setLoading(false);
            }
        };
        getResult();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceCompany((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setIsCreateServiceCompany(false);
        setIsServiceCompanyActive(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitError('');

        try {
            const dataToSend = {
                ...serviceCompany,
                description: serviceCompany.description || null,
            };

            await searchService.createServiceCompany(dataToSend);
            setIsCreateServiceCompany(false);
            setIsServiceCompanyActive(true);
        } catch (err) {
            setSubmitError('Ошибка обновления данных');
        }
    };

    return (
        <div className="sb__container">
            {loading && <h1 className="sb__text">Загрузка...</h1>}
            {error && (
                <>
                    <div className="sb__header-navbar">
                        <button className="sb__header-navbar-btn" onClick={handleCancel}>
                            🠔 Главная страница
                        </button>
                    </div>
                    <h1 className="sb__text">{error}</h1>
                </>
            )}
            {!loading && !error && usersData?.length == 0 ? (
                <>
                    <div className="sb__header-navbar">
                        <button className="sb__header-navbar-btn" onClick={handleCancel}>
                            🠔 Главная страница
                        </button>
                    </div>
                    <h1 className="sb__text">
                        Нет доступных аккаунтов для создания Сервисной компании! <br />
                        Обратитесь к администратору!
                    </h1>
                </>
            ) : null}
            {usersData?.length !== 0 ? (
                <>
                    <section className="sb__navbar-section">
                        <div className="sb__container">
                            <h1 className="sb__text">Создание Сервисной компании</h1>
                        </div>
                        <hr />
                    </section>

                    <section className="edit-section">
                        <div className="edit__container">
                            <form className="edit__form" onSubmit={handleSubmit}>
                                <div className="edit-form-grid-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Пользователь:</label>
                                        <select
                                            className="edit__form-input"
                                            name="user"
                                            value={serviceCompany.user || ''}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите пользователя</option>
                                            {usersData.map((ref) => (
                                                <option key={ref.id} value={ref.id}>
                                                    {ref.username}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Название:</label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="name"
                                            value={serviceCompany.name || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="edit__form-flex-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Описание:</label>
                                        <textarea
                                            className="edit__form-textarea"
                                            name="description"
                                            value={serviceCompany.description || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {submitError && (
                                    <div className="edit__form-error">
                                        <h3 className="edit__form-error-text">{submitError}</h3>
                                    </div>
                                )}

                                <div className="edit__form-buttons">
                                    <button
                                        className="edit__form-btn edit__form-cancel-btn"
                                        type="button"
                                        onClick={handleCancel}
                                    >
                                        Отмена
                                    </button>
                                    <button className="edit__form-btn" type="submit">
                                        Создать
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </>
            ) : null}
        </div>
    );
};

export default CreateServiceCompany;

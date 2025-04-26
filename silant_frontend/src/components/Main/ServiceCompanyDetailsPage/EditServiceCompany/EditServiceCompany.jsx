import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { searchService } from '../../../../services/searchService.js';

const EditServiceCompany = ({ setIsViewMode, setIsEditMode }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [serviceCompanyData, setServiceCompanyData] = useState([]);
    const [submitError, setSubmitError] = useState('');
    const { id } = useParams();

    const [serviceCompany, setServiceCompany] = useState({
        user: '',
        name: '',
        description: '',
    });

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setServiceCompanyData([]);

            try {
                const referenceResponse = await searchService.getServiceCompany(id);
                setServiceCompanyData(referenceResponse);
                setServiceCompany(referenceResponse);
            } catch (error) {
                setError(
                    error.referenceResponse?.status === 404
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
        setIsEditMode(false);
        setIsViewMode(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitError('');

        try {
            const dataToSend = {
                ...serviceCompany,
                description: serviceCompany.description || null,
            };

            await searchService.putServiceCompany(serviceCompany.id, dataToSend);
            setIsEditMode(false);
            setIsViewMode(true);
            location.reload();
        } catch (err) {
            console.log(err);
            setSubmitError('Ошибка обновления данных');
        }
    };

    return (
        <>
            {loading && <h1 className="sb__text">Загрузка...</h1>}
            {error && <h1 className="sb__text">{error}</h1>}
            {!loading && !error && serviceCompanyData?.length == 0 && (
                <h1 className="sb__text">Нет данных</h1>
            )}

            {serviceCompanyData?.length !== 0 ? (
                <>
                    <section className="sb__navbar-section">
                        <div className="sb__container">
                            <h1 className="sb__text">Редактирование данных Сервисной компании</h1>
                        </div>
                        <hr />
                    </section>

                    <section className="edit-section">
                        <div className="edit__container">
                            <form className="edit__form" onSubmit={handleSubmit}>
                                <div className="edit-form-grid-container">
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
                                        Сохранить
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </>
            ) : null}
        </>
    );
};

export default EditServiceCompany;

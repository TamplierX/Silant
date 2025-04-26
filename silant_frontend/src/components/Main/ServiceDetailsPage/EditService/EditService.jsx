import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { searchService } from '../../../../services/searchService.js';

const EditService = ({ setIsViewMode, setIsEditMode }) => {
    const [loading, setLoading] = useState(false);
    const [serviceData, setServiceData] = useState([]);
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const { id } = useParams();

    const [service, setService] = useState({
        type_of_service: '',
        service_date: '',
        mileage: '',
        work_order_number: '',
        work_order_date: '',
        organization: '',
        machine: '',
        service_company: '',
    });

    const [references, setReferences] = useState({
        machine: [],
        type_of_service: [],
        organization: [],
        service_company: [],
    });

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setServiceData([]);

            try {
                const serviceResponse = await searchService.getService(id);
                setServiceData(serviceResponse);
                setService(serviceResponse);
                const referencesResponse = await searchService.getReferencesForService();
                setReferences(referencesResponse);
            } catch (error) {
                setError(
                    error.serviceResponse?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера',
                );
            } finally {
                setLoading(false);
            }
        };
        getResult();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setService((prev) => ({
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
            await searchService.putService(serviceData.id, service);
            setIsEditMode(false);
            setIsViewMode(true);
            location.reload();
        } catch (err) {
            setSubmitError('Ошибка обновления данных');
        }
    };

    return (
        <>
            {loading && <h1 className="sb__text">Загрузка...</h1>}
            {error && <h1 className="sb__text">{error}</h1>}
            {!loading && !error && serviceData?.length == 0 && (
                <h1 className="sb__text">Нет данных</h1>
            )}
            {serviceData?.length !== 0 ? (
                <>
                    <section className="sb__navbar-section">
                        <div className="sb__container">
                            <h1 className="sb__text">
                                Редактирование проведенного ТО Вашей техники
                            </h1>
                        </div>
                        <hr />
                    </section>

                    <section className="edit-section">
                        <div className="edit__container">
                            <form className="edit__form" onSubmit={handleSubmit}>
                                <div className="edit-form-grid-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Вид ТО:</label>
                                        <select
                                            className="edit__form-input"
                                            name="type_of_service"
                                            value={service.type_of_service || ''}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите вид ТО</option>
                                            {references.type_of_service.map((service) => (
                                                <option key={service.id} value={service.id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Дата проведения ТО:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="date"
                                            name="service_date"
                                            value={service.service_date || ''}
                                            onChange={(e) => handleChange(e)}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Наработка, м/час:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="number"
                                            name="mileage"
                                            value={Math.trunc(service.mileage) || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Номер заказ-наряда:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="work_order_number"
                                            value={service.work_order_number || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Дата заказ-наряда:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="date"
                                            name="work_order_date"
                                            value={service.work_order_date || ''}
                                            onChange={(e) => handleChange(e)}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Организация, проводившая ТО:
                                        </label>
                                        <select
                                            className="edit__form-input"
                                            name="organization"
                                            value={service.organization || ''}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите организацию</option>
                                            {references.organization.map((org) => (
                                                <option key={org.id} value={org.id}>
                                                    {org.name}
                                                </option>
                                            ))}
                                        </select>
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

export default EditService;

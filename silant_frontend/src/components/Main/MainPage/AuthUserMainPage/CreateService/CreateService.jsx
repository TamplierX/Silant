import React, { useState, useEffect } from 'react';
import { searchService } from '../../../../../services/searchService.js';

const CreateService = ({ setIsTechInspectActive, setIsCreateService }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [referenceData, setReferenceData] = useState([]);
    const [submitError, setSubmitError] = useState('');

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
            setReferenceData([]);

            try {
                const referencesResponse = await searchService.getReferencesForService();
                setReferenceData(referencesResponse);
                setReferences(referencesResponse);
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
        setService((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setIsCreateService(false);
        setIsTechInspectActive(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitError('');

        try {
            const selectedMachine = references.machine.find(
                (machine) => machine.serial_number === service.machine,
            );
            const dataToSend = {
                ...service,
                service_company: selectedMachine.service_company,
            };

            await searchService.createService(dataToSend);
            setIsCreateService(false);
            setIsTechInspectActive(true);
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
            {!loading && !error && referenceData?.length == 0 ? (
                <>
                    <div className="sb__header-navbar">
                        <button className="sb__header-navbar-btn" onClick={handleCancel}>
                            🠔 Главная страница
                        </button>
                    </div>
                    <h1 className="sb__text">Ошибка!</h1>
                </>
            ) : null}
            {referenceData?.length !== 0 ? (
                <>
                    <section className="sb__navbar-section">
                        <div className="sb__container">
                            <h1 className="sb__text">Создание проведенного ТО Вашей техники</h1>
                        </div>
                        <hr />
                    </section>

                    <section className="edit-section">
                        <div className="edit__container">
                            <form className="edit__form" onSubmit={handleSubmit}>
                                <div className="edit-form-grid-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Зав. № машины:</label>
                                        <select
                                            className="edit__form-input"
                                            name="machine"
                                            value={service.machine || ''}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите машину</option>
                                            {references.machine.map((service) => (
                                                <option
                                                    key={service.serial_number}
                                                    value={service.serial_number}
                                                >
                                                    {service.serial_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
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
        </div>
    );
};

export default CreateService;

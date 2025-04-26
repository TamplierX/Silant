import React, { useState, useEffect } from 'react';
import { searchService } from '../../../../../services/searchService.js';

const CreateClaim = ({ setIsClaimActive, setIsCreateClaim }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [referenceData, setReferenceData] = useState([]);
    const [submitError, setSubmitError] = useState('');

    const [claim, setClaim] = useState({
        failure_date: '',
        mileage: '',
        fault_node: '',
        failure_description: '',
        restoration_method: '',
        spare_parts_used: null,
        restoration_date: '',
        machine: '',
        service_company: '',
    });

    const [references, setReferences] = useState({
        fault_node: [],
        restoration_method: [],
        machine: [],
        service_company: [],
    });

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setReferenceData([]);

            try {
                const referencesResponse = await searchService.getReferencesForClaim();
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
        setClaim((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setIsCreateClaim(false);
        setIsClaimActive(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitError('');

        try {
            const selectedMachine = references.machine.find(
                (machine) => machine.serial_number === claim.machine,
            );
            const dataToSend = {
                ...claim,
                spare_parts_used: claim.spare_parts_used || null,
                service_company: selectedMachine.service_company,
            };

            await searchService.createClaim(dataToSend);
            setIsCreateClaim(false);
            setIsClaimActive(true);
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
                            <h1 className="sb__text">Создание рекламации по Вашей технике</h1>
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
                                            value={claim.machine || ''}
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
                                        <label className="edit__form-label">Дата отказа:</label>
                                        <input
                                            className="edit__form-input"
                                            type="date"
                                            name="failure_date"
                                            value={claim.failure_date || ''}
                                            onChange={handleChange}
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
                                            step="0.01"
                                            name="mileage"
                                            value={Math.trunc(claim.mileage) || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="edit__form-flex-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Описание отказа:</label>
                                        <textarea
                                            className="edit__form-textarea"
                                            name="failure_description"
                                            value={claim.failure_description || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="edit-form-grid-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Узел отказа:</label>
                                        <select
                                            className="edit__form-input"
                                            name="fault_node"
                                            value={claim.fault_node || ''}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите узел отказа</option>
                                            {references.fault_node.map((node) => (
                                                <option key={node.id} value={node.id}>
                                                    {node.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Способ восстановления:
                                        </label>
                                        <select
                                            className="edit__form-input"
                                            name="restoration_method"
                                            value={claim.restoration_method || ''}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите способ восстановления</option>
                                            {references.restoration_method.map((method) => (
                                                <option key={method.id} value={method.id}>
                                                    {method.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="edit__form-flex-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Используемые запасные части:
                                        </label>
                                        <textarea
                                            className="edit__form-textarea"
                                            name="spare_parts_used"
                                            value={claim.spare_parts_used || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="edit-form-grid-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Дата восстановления:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="date"
                                            name="restoration_date"
                                            value={claim.restoration_date || ''}
                                            onChange={handleChange}
                                            required
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
        </div>
    );
};

export default CreateClaim;

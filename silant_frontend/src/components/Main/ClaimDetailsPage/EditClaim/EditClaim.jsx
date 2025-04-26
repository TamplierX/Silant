import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { searchService } from '../../../../services/searchService.js';

const EditClaim = ({ setIsViewMode, setIsEditMode }) => {
    const [loading, setLoading] = useState(false);
    const [claimData, setClaimData] = useState([]);
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const { id } = useParams();

    const [claim, setClaim] = useState({
        failure_date: '',
        mileage: '',
        fault_node: '',
        failure_description: '',
        restoration_method: '',
        spare_parts_used: '',
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
            setClaimData([]);

            try {
                const claimResponse = await searchService.getClaim(id);
                setClaimData(claimResponse);
                setClaim(claimResponse);
                const referencesResponse = await searchService.getReferencesForClaim();
                setReferences(referencesResponse);
            } catch (error) {
                setError(
                    error.claimResponse?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера',
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
        setIsEditMode(false);
        setIsViewMode(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitError('');

        try {
            await searchService.putClaim(claimData.id, claim);
            setIsEditMode(false);
            setIsViewMode(true);
            location.reload();
        } catch (err) {
            setSubmitError('Ошибка обновленния данных');
        }
    };

    return (
        <>
            {loading && <h1 className="sb__text">Загрузка...</h1>}
            {error && <h1 className="sb__text">{error}</h1>}
            {!loading && !error && claimData?.length == 0 && (
                <h1 className="sb__text">Нет данных</h1>
            )}
            {claimData?.length !== 0 ? (
                <>
                    <section className="sb__navbar-section">
                        <div className="sb__container">
                            <h1 className="sb__text">Редактирование рекламации по Вашей технике</h1>
                        </div>
                        <hr />
                    </section>

                    <section className="edit-section">
                        <div className="edit__container">
                            <form className="edit__form" onSubmit={handleSubmit}>
                                <div className="edit-form-grid-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-lable">Дата отказа:</label>
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
                                        <label className="edit__form-lable">
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
                                        <label className="edit__form-lable">Описание отказа:</label>
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
                                        <label className="edit__form-lable">Узел отказа:</label>
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
                                        <label className="edit__form-lable">
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
                                        <label className="edit__form-lable">
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
                                        <label className="edit__form-lable">
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
        </>
    );
};

export default EditClaim;

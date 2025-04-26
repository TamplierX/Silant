import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { searchService } from '../../../../services/searchService.js';

const EditReference = ({ setIsViewMode, setIsEditMode }) => {
    const [loading, setLoading] = useState(false);
    const [referenceData, setReferenceData] = useState([]);
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const { id } = useParams();

    const [reference, setReference] = useState({
        entity_name: '',
        name: '',
        description: '',
    });

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setReferenceData([]);

            try {
                const referenceResponse = await searchService.getReference(id);
                setReferenceData(referenceResponse);
                setReference(referenceResponse);
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
        setReference((prev) => ({
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
            await searchService.putReference(reference.id, reference);
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
            {!loading && !error && referenceData?.length == 0 && (
                <h1 className="sb__text">Нет данных</h1>
            )}
            {referenceData?.length !== 0 ? (
                <>
                    <section className="sb__navbar-section">
                        <div className="sb__container">
                            <h1 className="sb__text">Редактирование элемента справочника</h1>
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
                                            value={reference.name || ''}
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
                                            value={reference.description || ''}
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

export default EditReference;

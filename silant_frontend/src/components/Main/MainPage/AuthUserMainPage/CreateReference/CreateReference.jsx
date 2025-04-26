import React, { useState } from 'react';
import { searchService } from '../../../../../services/searchService.js';

const CreateReference = ({ setIsReferenceActive, setIsCreateReference }) => {
    const [submitError, setSubmitError] = useState('');

    const [reference, setReference] = useState({
        entity_name: '',
        name: '',
        description: '',
    });

    const ENTITY_CHOICES = [
        { value: 'model_technique', label: 'Модель техники' },
        { value: 'engine_model', label: 'Модель двигателя' },
        { value: 'transmission_model', label: 'Модель трансмиссии' },
        { value: 'driving_bridge_model', label: 'Модель ведущего моста' },
        { value: 'controlled_bridge_model', label: 'Модель управляемого моста' },
        { value: 'type_of_service', label: 'Вид ТО' },
        { value: 'fault_node', label: 'Узел отказа' },
        { value: 'restoration_method', label: 'Способ восстановления' },
        { value: 'organization', label: 'Организация, проводившая ТО' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReference((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCancel = () => {
        setIsCreateReference(false);
        setIsReferenceActive(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSubmitError('');

        try {
            await searchService.createReference(reference);
            setIsCreateReference(false);
            setIsReferenceActive(true);
        } catch (err) {
            setSubmitError('Ошибка обновления данных');
        }
    };

    return (
        <div className="sb__container">
            <section className="sb__navbar-section">
                <div className="sb__container">
                    <h1 className="sb__text">Создание элемента справочника</h1>
                </div>
                <hr />
            </section>

            <section className="edit-section">
                <div className="edit__container">
                    <form className="edit__form" onSubmit={handleSubmit}>
                        <div className="edit-form-grid-container">
                            <div className="edit__form-group">
                                <label className="edit__form-label">Название справочника:</label>
                                <select
                                    className="edit__form-input"
                                    name="entity_name"
                                    value={reference.entity_name || ''}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Выберите справочник</option>
                                    {ENTITY_CHOICES.map((choice) => (
                                        <option key={choice.value} value={choice.value}>
                                            {choice.label}
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
        </div>
    );
};

export default CreateReference;

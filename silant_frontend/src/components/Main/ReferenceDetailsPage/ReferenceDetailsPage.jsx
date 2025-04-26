import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import EditReference from './EditReference/EditReference.jsx';
import { searchService } from '../../../services/searchService.js';

const ReferenceDetailsPage = () => {
    const [loading, setLoading] = useState(false);
    const [referenceData, setReferenceData] = useState([]);
    const [error, setError] = useState('');
    const [isViewMode, setIsViewMode] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setReferenceData([]);

            try {
                const response = await searchService.getReference(id);
                setReferenceData(response);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getResult();
    }, []);

    const getEntityDisplayName = (entityName) => {
        const choices = {
            model_technique: 'Модель техники',
            engine_model: 'Модель двигателя',
            transmission_model: 'Модель трансмиссии',
            driving_bridge_model: 'Модель ведущего моста',
            controlled_bridge_model: 'Модель управляемого моста',
            type_of_service: 'Вид ТО',
            fault_node: 'Узел отказа',
            restoration_method: 'Способ восстановления',
            organization: 'Организация, проводившая ТО',
        };
        return choices[entityName] || entityName;
    };

    const handleEdit = () => {
        setIsViewMode(false);
        setIsEditMode(true);
    };

    return (
        <main className="main main__reference-details-page">
            <div className="container">
                <div className="page__container">
                    <div className="sb__container">
                        {loading && <h1 className="sb__text">Загрузка...</h1>}
                        {error && <h1 className="sb__text">{error}</h1>}
                        {!loading && !error && referenceData?.length == 0 && (
                            <h1 className="sb__text">Нет данных</h1>
                        )}
                        {referenceData?.length !== 0 ? (
                            <>
                                <section className="sb__header-section">
                                    <div className="sb__header-navbar">
                                        <button
                                            className="sb__header-navbar-btn"
                                            onClick={() => {
                                                navigate('/');
                                            }}
                                        >
                                            🠔 Главная страница
                                        </button>
                                    </div>
                                    <div className="sb__header-container">
                                        <div className="sb__header-item">
                                            <div className="sb__header-text">Справочник: </div>
                                            <div className="sb__header-value">
                                                {getEntityDisplayName(referenceData.entity_name)}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {isViewMode && (
                                    <>
                                        <section className="sb__navbar-section">
                                            <div className="sb__container">
                                                <h1 className="sb__text">
                                                    Информация о элементе справочника
                                                </h1>
                                            </div>
                                            <hr />
                                        </section>

                                        <section className="details-section">
                                            <div className="sb__header-navbar">
                                                <button
                                                    className="sb__header-navbar-btn"
                                                    onClick={handleEdit}
                                                >
                                                    Редактировать
                                                </button>
                                            </div>
                                            <div className="details__container">
                                                <div className="details__private-container">
                                                    <div className="details__private-item">
                                                        <div className="details__private-title">
                                                            Название:{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {referenceData.name}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="details__public-container">
                                                    <div className="details__public-item">
                                                        <div className="details__public-item-header">
                                                            <div className="details__public-item-header-text">
                                                                <div className="details__public-item-title">
                                                                    Описание
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="details__public-item-body">
                                                            {referenceData.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                )}
                                {isEditMode && (
                                    <EditReference
                                        setIsViewMode={setIsViewMode}
                                        setIsEditMode={setIsEditMode}
                                    />
                                )}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ReferenceDetailsPage;

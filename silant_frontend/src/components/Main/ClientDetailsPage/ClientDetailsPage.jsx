import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import EditClient from './EditClient/EditClient.jsx';
import { searchService } from '../../../services/searchService.js';

const ClientDetailsPage = () => {
    const [loading, setLoading] = useState(false);
    const [clientData, setClientData] = useState([]);
    const [error, setError] = useState('');
    const [isViewMode, setIsViewMode] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setClientData([]);

            try {
                const response = await searchService.getClient(id);
                setClientData(response);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getResult();
    }, []);

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
                        {!loading && !error && clientData?.length == 0 && (
                            <h1 className="sb__text">Нет данных</h1>
                        )}
                        {clientData?.length !== 0 ? (
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
                                            <div className="sb__header-text">Клиент: </div>
                                            <div className="sb__header-value">
                                                {clientData.name}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {isViewMode && (
                                    <>
                                        <section className="sb__navbar-section">
                                            <div className="sb__container">
                                                <h1 className="sb__text">Информация о Клиенте</h1>
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
                                                        <div
                                                            className="details__public-item-body"
                                                            style={{
                                                                whiteSpace: 'pre-line',
                                                                textAlign: 'left',
                                                            }}
                                                        >
                                                            {clientData.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                )}
                                {isEditMode && (
                                    <EditClient
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

export default ClientDetailsPage;

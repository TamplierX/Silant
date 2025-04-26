import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import EditClaim from './EditClaim/EditClaim.jsx';
import { searchService } from '../../../services/searchService.js';
import faultNodeImg from '../../../assets/images/img_tech_insp.svg';
import restMethodImg from '../../../assets/images/img_service_company.svg';
import sparePartsImg from '../../../assets/images/img_spare_parts.svg';
import faultDescriptionImg from '../../../assets/images/background_login.svg';

const ClaimDetailsPage = () => {
    const [loading, setLoading] = useState(false);
    const [claimData, setClaimData] = useState([]);
    const [error, setError] = useState('');
    const [isViewMode, setIsViewMode] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const isManager = localStorage.getItem('user_role') === 'manager';
    const isServiceCompany = localStorage.getItem('user_role') === 'service_company';

    const navigate = useNavigate();

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setClaimData([]);

            try {
                const response = await searchService.getClaim(id);
                setClaimData(response);
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
        <main className="main main__service-details-page">
            <div className="container">
                <div className="page__container">
                    <div className="sb__container">
                        {loading && <h1 className="sb__text">Загрузка...</h1>}
                        {error && <h1 className="sb__text">{error}</h1>}
                        {!loading && !error && claimData?.length == 0 && (
                            <h1 className="sb__text">Нет данных</h1>
                        )}
                        {claimData?.length !== 0 ? (
                            <>
                                <section className="sb__header-section">
                                    <div className="sb__header-navbar">
                                        <button
                                            className="sb__header-navbar-btn"
                                            onClick={() => {
                                                navigate(`/machine/${claimData.machine}`);
                                            }}
                                        >
                                            🠔 К технике
                                        </button>
                                        <button
                                            className="sb__header-navbar-btn"
                                            onClick={() => {
                                                navigate('/');
                                            }}
                                        >
                                            Главная страница
                                        </button>
                                    </div>
                                    <div className="sb__header-container">
                                        <div className="sb__header-item">
                                            <div className="sb__header-text">Модель: </div>
                                            <div className="sb__header-value">
                                                {claimData.machine_model_technique_name}
                                            </div>
                                        </div>
                                        <div className="sb__header-item">
                                            <div className="sb__header-text">Серийный №: </div>
                                            <div className="sb__header-value">
                                                {claimData.machine_serial_number}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {isViewMode && (
                                    <>
                                        <section className="sb__navbar-section">
                                            <div className="sb__container">
                                                <h1 className="sb__text">
                                                    Информация о рекламации по Вашей технике
                                                </h1>
                                            </div>
                                            <hr />
                                        </section>

                                        <section className="details-section">
                                            {isManager || isServiceCompany ? (
                                                <div className="sb__header-navbar">
                                                    <button
                                                        className="sb__header-navbar-btn"
                                                        onClick={handleEdit}
                                                    >
                                                        Редактировать
                                                    </button>
                                                </div>
                                            ) : null}
                                            <div className="details__container">
                                                <div className="details__private-container">
                                                    <div className="details__private-item">
                                                        <div className="details__private-title">
                                                            Дата отказа:{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {claimData.failure_date}
                                                        </div>
                                                    </div>

                                                    <div className="details__private-item">
                                                        <div className="details__private-title">
                                                            Наработка, м/час:{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {Math.trunc(claimData.mileage)}
                                                        </div>
                                                    </div>

                                                    <div className="details__private-item">
                                                        <div className="details__private-title">
                                                            Дата восстановления:{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {claimData.restoration_date}
                                                        </div>
                                                    </div>

                                                    <div className="details__private-item">
                                                        <div className="details__private-title">
                                                            Время простоя техники (дней):{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {claimData.downtime}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="details__public-container">
                                                    <div className="details__public-item">
                                                        <div className="details__public-item-header">
                                                            <div className="details__public-item-header-text">
                                                                <div className="details__public-item-title">
                                                                    Узел отказа
                                                                </div>
                                                                <div className="details__public-item-name">
                                                                    {claimData.fault_node_name}
                                                                </div>
                                                            </div>
                                                            <div className="details__public-item-image">
                                                                <img
                                                                    className="details__public-item-img"
                                                                    src={faultNodeImg}
                                                                    alt="Изображение узла отказа"
                                                                />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="details__public-item-body">
                                                            {claimData.fault_node_description}
                                                        </div>
                                                    </div>

                                                    <div className="details__public-item">
                                                        <div className="details__public-item-header">
                                                            <div className="details__public-item-header-text">
                                                                <div className="details__public-item-title">
                                                                    Описание отказа
                                                                </div>
                                                            </div>
                                                            <div className="details__public-item-image">
                                                                <img
                                                                    className="details__public-item-img"
                                                                    src={faultDescriptionImg}
                                                                    alt="Изображение описания отказа"
                                                                />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="details__public-item-body">
                                                            {claimData.failure_description}
                                                        </div>
                                                    </div>

                                                    <div className="details__public-item">
                                                        <div className="details__public-item-header">
                                                            <div className="details__public-item-header-text">
                                                                <div className="details__public-item-title">
                                                                    Способ восстановления
                                                                </div>
                                                                <div className="details__public-item-name">
                                                                    {
                                                                        claimData.restoration_method_name
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="details__public-item-image">
                                                                <img
                                                                    className="details__public-item-img"
                                                                    src={restMethodImg}
                                                                    alt="Изображение способа восстановления"
                                                                />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="details__public-item-body">
                                                            {
                                                                claimData.restoration_method_description
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="details__public-item">
                                                        <div className="details__public-item-header">
                                                            <div className="details__public-item-header-text">
                                                                <div className="details__public-item-title">
                                                                    Используемые запасные части
                                                                </div>
                                                            </div>
                                                            <div className="details__public-item-image">
                                                                <img
                                                                    className="details__public-item-img"
                                                                    src={sparePartsImg}
                                                                    alt="Изображение запасных частей"
                                                                />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="details__public-item-body">
                                                            {claimData.spare_parts_used}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                )}
                                {isEditMode && (
                                    <EditClaim
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

export default ClaimDetailsPage;

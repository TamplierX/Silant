import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import EditService from './EditService/EditService.jsx';
import { searchService } from '../../../services/searchService.js';
import techInspImg from '../../../assets/images/img_tech_insp.svg';
import techInspOrgImg from '../../../assets/images/img_tech_insp_org.svg';

const ServiceDetailsPage = () => {
    const [loading, setLoading] = useState(false);
    const [serviceData, setServiceData] = useState([]);
    const [error, setError] = useState('');
    const [isViewMode, setIsViewMode] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const isManager = localStorage.getItem('user_role') === 'manager';
    const isServiceCompany = localStorage.getItem('user_role') === 'service_company';
    const isClient = localStorage.getItem('user_role') === 'client';

    const navigate = useNavigate();

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setServiceData([]);

            try {
                const response = await searchService.getService(id);
                setServiceData(response);
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
                        {!loading && !error && serviceData?.length == 0 && (
                            <h1 className="sb__text">Нет данных</h1>
                        )}
                        {serviceData?.length !== 0 ? (
                            <>
                                <section className="sb__header-section">
                                    <div className="sb__header-navbar">
                                        <button
                                            className="sb__header-navbar-btn"
                                            onClick={() => {
                                                navigate(`/machine/${serviceData.machine}`);
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
                                                {serviceData.machine_model_technique_name}
                                            </div>
                                        </div>
                                        <div className="sb__header-item">
                                            <div className="sb__header-text">Серийный №: </div>
                                            <div className="sb__header-value">
                                                {serviceData.machine_serial_number}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {isViewMode && (
                                    <>
                                        <section className="sb__navbar-section">
                                            <div className="sb__container">
                                                <h1 className="sb__text">
                                                    Информация о проведенном ТО Вашей техники
                                                </h1>
                                            </div>
                                            <hr />
                                        </section>

                                        <section className="details-section">
                                            {isManager || isServiceCompany || isClient ? (
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
                                                            Дата проведения ТО:{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {serviceData.service_date}
                                                        </div>
                                                    </div>

                                                    <div className="details__private-item">
                                                        <div className="details__private-title">
                                                            Наработка, м/час:{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {Math.trunc(serviceData.mileage)}
                                                        </div>
                                                    </div>

                                                    <div className="details__private-item">
                                                        <div className="details__private-title">
                                                            № заказ-наряда:{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {serviceData.work_order_number}
                                                        </div>
                                                    </div>

                                                    <div className="details__private-item">
                                                        <div className="details__private-title">
                                                            Дата заказ-наряда:{' '}
                                                        </div>
                                                        <div className="details__private-value">
                                                            {serviceData.work_order_date}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="details__public-container">
                                                    <div className="details__public-item">
                                                        <div className="details__public-item-header">
                                                            <div className="details__public-item-header-text">
                                                                <div className="details__public-item-title">
                                                                    Вид ТО
                                                                </div>
                                                                <div className="details__public-item-name">
                                                                    {
                                                                        serviceData.type_of_service_name
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="details__public-item-image">
                                                                <img
                                                                    className="details__public-item-img"
                                                                    src={techInspImg}
                                                                    alt="Изображение вида ТО"
                                                                />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="details__public-item-body">
                                                            {
                                                                serviceData.type_of_service_description
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className="details__public-item">
                                                        <div className="details__public-item-header">
                                                            <div className="details__public-item-header-text">
                                                                <div className="details__public-item-title">
                                                                    Организация, проводившая ТО
                                                                </div>
                                                                <div className="details__public-item-name">
                                                                    {serviceData.organization_name}
                                                                </div>
                                                            </div>
                                                            <div className="details__public-item-image">
                                                                <img
                                                                    className="details__public-item-img"
                                                                    src={techInspOrgImg}
                                                                    alt="Изображение организации по ТО"
                                                                />
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className="details__public-item-body">
                                                            {serviceData.organization_description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                )}
                                {isEditMode && (
                                    <EditService
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

export default ServiceDetailsPage;

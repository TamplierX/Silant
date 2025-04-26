import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { searchService } from '../../../services/searchService.js';
import { useUserContext } from '../../../context/userContext.js';
import MachineInfo from './MachineInfo/MachineInfo.jsx';
import MachineServices from './MachineServices/MachineServices.jsx';
import MachineClaims from './MachineClaims/MachineClaims.jsx';

const MachineDetailsPage = () => {
    const [loading, setLoading] = useState(false);
    const [machineData, setMachineData] = useState([]);
    const [error, setError] = useState('');
    const [isGenInfoActive, setIsGenInfoActive] = useState(true);
    const [isTechInspectActive, setIsTechInspectActive] = useState(false);
    const [isClaimActive, setIsClaimActive] = useState(false);
    const [isViewMode, setIsViewMode] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const { isAuthenticated } = useUserContext();
    const isManager = localStorage.getItem('user_role') === 'manager';
    const getUserName = localStorage.getItem('user_name');
    const { id } = useParams();
    const navigate = useNavigate();

    const handleGenInfo = () => {
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsGenInfoActive(true);
    };

    const handleTechInspect = () => {
        setIsGenInfoActive(false);
        setIsClaimActive(false);
        setIsTechInspectActive(true);
    };

    const handleClaim = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(true);
    };

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setMachineData([]);

            try {
                const response = await searchService.getMachine(id);
                setMachineData(response);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getResult();
    }, []);

    return (
        <main className="main main__machine-details-page">
            <div className="container">
                <div className="page__container">
                    <div className="sb__container">
                        {loading && <h1 className="sb__text">Загрузка...</h1>}
                        {error && <h1 className="sb__text">{error}</h1>}
                        {!loading && !error && machineData?.length == 0 && (
                            <h1 className="sb__text">Нет данных</h1>
                        )}
                        {machineData?.length !== 0 ? (
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
                                            <div className="sb__header-text">Модель: </div>
                                            <div className="sb__header-value">
                                                {machineData.model_technique_name}
                                            </div>
                                        </div>
                                        <div className="sb__header-item">
                                            <div className="sb__header-text">Серийный №: </div>
                                            <div className="sb__header-value">
                                                {machineData.serial_number}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {isViewMode && (
                                    <section className="sb__navbar-section">
                                        <div className="sb__container">
                                            <h1 className="sb__text">
                                                {isGenInfoActive
                                                    ? 'Информация о комплектации и технических характеристиках Вашей техники'
                                                    : isTechInspectActive
                                                      ? 'Информация о проведенных ТО Вашей техники'
                                                      : 'Информация о рекламациях по Вашей технике'}
                                            </h1>
                                        </div>
                                        <hr />
                                        <div className="sb__navbar-container">
                                            <button
                                                className={`sb__navbar-btn ${
                                                    isGenInfoActive ? 'sb__navbar-current-btn' : ''
                                                }`}
                                                disabled={isGenInfoActive}
                                                onClick={handleGenInfo}
                                            >
                                                Общая информация
                                            </button>
                                            {machineData.client_name === getUserName ||
                                            machineData.service_company_name === getUserName ||
                                            isManager ? (
                                                <button
                                                    className={`sb__navbar-btn sb__navbar-custom-btn ${
                                                        isTechInspectActive
                                                            ? 'sb__navbar-current-btn'
                                                            : ''
                                                    }`}
                                                    disabled={isTechInspectActive}
                                                    onClick={handleTechInspect}
                                                >
                                                    ТО
                                                </button>
                                            ) : null}
                                            {machineData.client_name === getUserName ||
                                            machineData.service_company_name === getUserName ||
                                            isManager ? (
                                                <button
                                                    className={`sb__navbar-btn ${
                                                        isClaimActive
                                                            ? 'sb__navbar-current-btn'
                                                            : ''
                                                    }`}
                                                    disabled={isClaimActive}
                                                    onClick={handleClaim}
                                                >
                                                    Рекламации
                                                </button>
                                            ) : null}
                                        </div>
                                        <hr />
                                    </section>
                                )}

                                {isGenInfoActive && (
                                    <MachineInfo
                                        machineData={machineData}
                                        isViewMode={isViewMode}
                                        setIsViewMode={setIsViewMode}
                                        isEditMode={isEditMode}
                                        setIsEditMode={setIsEditMode}
                                    />
                                )}
                                {isAuthenticated && isTechInspectActive && <MachineServices />}
                                {isAuthenticated && isClaimActive && <MachineClaims />}
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MachineDetailsPage;

import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../../../context/userContext';
import GeneralInfo from './GeneralInfo/GeneralInfo.jsx';
import TechInspect from './TechInspect/TechInspect.jsx';
import Claim from './Claim/Claim.jsx';
import Reference from './Reference/Reference.jsx';
import Clients from './Clients/Clients.jsx';
import ServiceCompanies from './ServiceCompanies/ServiceCompanies.jsx';
import CreateMachine from './CreateMachine/CreateMachine.jsx';
import CreateService from './CreateService/CreateService.jsx';
import CreateClaim from './CreateClaim/CreateClaim.jsx';
import CreateReference from './CreateReference/CreateReference.jsx';
import CreateClient from './CreateClient/CreateClient.jsx';
import CreateServiceCompany from './CreateServiceCompany/CreateServiceCompany.jsx';

const AuthUserMainPage = () => {
    const { userRole, getUserInfo } = useUserContext();
    const [isGenInfoActive, setIsGenInfoActive] = useState(true);
    const [isTechInspectActive, setIsTechInspectActive] = useState(false);
    const [isClaimActive, setIsClaimActive] = useState(false);
    const [isReferenceActive, setIsReferenceActive] = useState(false);
    const [isClientActive, setIsClientActive] = useState(false);
    const [isServiceCompanyActive, setIsServiceCompanyActive] = useState(false);
    const [isCreateMachine, setIsCreateMachine] = useState(false);
    const [isCreateService, setIsCreateService] = useState(false);
    const [isCreateClaim, setIsCreateClaim] = useState(false);
    const [isCreateReference, setIsCreateReference] = useState(false);
    const [isCreateClient, setIsCreateClient] = useState(false);
    const [isCreateServiceCompany, setIsCreateServiceCompany] = useState(false);
    const getUserName = localStorage.getItem('user_name');
    const isServiceCompany = localStorage.getItem('user_role') === 'service_company';
    const isManager = localStorage.getItem('user_role') === 'manager';

    useEffect(() => {
        getUserInfo();
    }, []);

    const handleGenInfo = () => {
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsGenInfoActive(true);
    };

    const handleTechInspect = () => {
        setIsGenInfoActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsTechInspectActive(true);
    };

    const handleClaim = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsClaimActive(true);
    };

    const handleReference = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsReferenceActive(true);
    };

    const handleClient = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsServiceCompanyActive(false);
        setIsClientActive(true);
    };

    const handleServiceCompany = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(true);
    };

    const handleCreateMachine = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsCreateMachine(true);
    };

    const handleCreateService = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsCreateService(true);
    };

    const handleCreateClaim = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsCreateClaim(true);
    };

    const handleCreateReference = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsCreateReference(true);
    };

    const handleCreateClient = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsCreateClient(true);
    };

    const handleCreateServiceCompany = () => {
        setIsGenInfoActive(false);
        setIsTechInspectActive(false);
        setIsClaimActive(false);
        setIsReferenceActive(false);
        setIsClientActive(false);
        setIsServiceCompanyActive(false);
        setIsCreateServiceCompany(true);
    };

    return (
        <div className="page__container">
            <section className="sb__header-section">
                {getUserName && userRole && (
                    <>
                        <div className="sb__header-container">
                            <div className="sb__header-text">{userRole.ru}: </div>
                            <div className="sb__header-value">{getUserName}</div>
                        </div>
                        {!isCreateMachine &&
                            !isCreateService &&
                            !isCreateClaim &&
                            !isCreateReference &&
                            !isCreateClient &&
                            !isCreateServiceCompany && (
                                <>
                                    <div className="sb__navbar-container">
                                        <button
                                            className="sb__navbar-btn"
                                            onClick={handleCreateService}
                                        >
                                            Создать ТО
                                        </button>

                                        {isManager || isServiceCompany ? (
                                            <button
                                                className="sb__navbar-btn"
                                                onClick={handleCreateClaim}
                                            >
                                                Создать рекламацию
                                            </button>
                                        ) : null}

                                        {isManager && (
                                            <button
                                                className="sb__navbar-btn"
                                                onClick={handleCreateMachine}
                                            >
                                                Создать технику
                                            </button>
                                        )}

                                        {isManager && (
                                            <button
                                                className="sb__navbar-btn"
                                                onClick={handleCreateReference}
                                            >
                                                Создать справочник
                                            </button>
                                        )}

                                        {isManager && (
                                            <button
                                                className="sb__navbar-btn"
                                                onClick={handleCreateClient}
                                            >
                                                Создать клиента
                                            </button>
                                        )}

                                        {isManager && (
                                            <button
                                                className="sb__navbar-btn"
                                                onClick={handleCreateServiceCompany}
                                            >
                                                Создать сервисную компанию
                                            </button>
                                        )}
                                    </div>
                                    <hr />
                                </>
                            )}
                    </>
                )}
            </section>

            {!isCreateMachine &&
                !isCreateService &&
                !isCreateClaim &&
                !isCreateReference &&
                !isCreateClient &&
                !isCreateServiceCompany && (
                    <section className="sb__navbar-section">
                        <div className="sb__container">
                            {isGenInfoActive && (
                                <h1 className="sb__text">
                                    Информация о комплектации и технических характеристиках Вашей
                                    техники
                                </h1>
                            )}

                            {isTechInspectActive && (
                                <h1 className="sb__text">
                                    Информация о проведенных ТО Вашей техники
                                </h1>
                            )}

                            {isClaimActive && (
                                <h1 className="sb__text">
                                    Информация о рекламациях по Вашей технике
                                </h1>
                            )}

                            {isReferenceActive && (
                                <h1 className="sb__text">Информация о справочниках</h1>
                            )}

                            {isClientActive && <h1 className="sb__text">Информация о клиентах</h1>}

                            {isServiceCompanyActive && (
                                <h1 className="sb__text">Информация о сервисных компаниях</h1>
                            )}
                        </div>

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

                            <button
                                className={`sb__navbar-btn sb__navbar-custom-btn ${
                                    isTechInspectActive ? 'sb__navbar-current-btn' : ''
                                }`}
                                disabled={isTechInspectActive}
                                onClick={handleTechInspect}
                            >
                                ТО
                            </button>

                            <button
                                className={`sb__navbar-btn ${
                                    isClaimActive ? 'sb__navbar-current-btn' : ''
                                }`}
                                disabled={isClaimActive}
                                onClick={handleClaim}
                            >
                                Рекламации
                            </button>

                            {isManager && (
                                <button
                                    className={`sb__navbar-btn ${
                                        isReferenceActive ? 'sb__navbar-current-btn' : ''
                                    }`}
                                    disabled={isReferenceActive}
                                    onClick={handleReference}
                                >
                                    Справочники
                                </button>
                            )}

                            {isManager && (
                                <button
                                    className={`sb__navbar-btn ${
                                        isClientActive ? 'sb__navbar-current-btn' : ''
                                    }`}
                                    disabled={isClientActive}
                                    onClick={handleClient}
                                >
                                    Клиенты
                                </button>
                            )}

                            {isManager && (
                                <button
                                    className={`sb__navbar-btn ${
                                        isServiceCompanyActive ? 'sb__navbar-current-btn' : ''
                                    }`}
                                    disabled={isServiceCompanyActive}
                                    onClick={handleServiceCompany}
                                >
                                    Сервисные компании
                                </button>
                            )}
                        </div>
                        <hr />
                    </section>
                )}

            {isCreateMachine && (
                <CreateMachine
                    setIsGenInfoActive={setIsGenInfoActive}
                    setIsCreateMachine={setIsCreateMachine}
                />
            )}
            {isCreateService && (
                <CreateService
                    setIsTechInspectActive={setIsTechInspectActive}
                    setIsCreateService={setIsCreateService}
                />
            )}
            {isCreateClaim && (
                <CreateClaim
                    setIsClaimActive={setIsClaimActive}
                    setIsCreateClaim={setIsCreateClaim}
                />
            )}
            {isCreateReference && (
                <CreateReference
                    setIsReferenceActive={setIsReferenceActive}
                    setIsCreateReference={setIsCreateReference}
                />
            )}

            {isCreateClient && (
                <CreateClient
                    setIsClientActive={setIsClientActive}
                    setIsCreateClient={setIsCreateClient}
                />
            )}

            {isCreateServiceCompany && (
                <CreateServiceCompany
                    setIsServiceCompanyActive={setIsServiceCompanyActive}
                    setIsCreateServiceCompany={setIsCreateServiceCompany}
                />
            )}

            {isGenInfoActive && <GeneralInfo />}
            {isTechInspectActive && <TechInspect />}
            {isClaimActive && <Claim />}
            {isReferenceActive && <Reference />}
            {isClientActive && <Clients />}
            {isServiceCompanyActive && <ServiceCompanies />}
        </div>
    );
};

export default AuthUserMainPage;

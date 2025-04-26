import React from 'react';
import { useUserContext } from '../../../../context/userContext.js';
import EditMachine from './EditMachine/EditMachine.jsx';
import machineImg from '../../../../assets/images/img_machine.svg';
import enginImg from '../../../../assets/images/img_engin.svg';
import transmissionImg from '../../../../assets/images/img_transmission.svg';
import leadingBridgeImg from '../../../../assets/images/img_leading_bridge.svg';
import controlledBridgeImg from '../../../../assets/images/img_controlled_bridge.svg';
import serviceCompanyImg from '../../../../assets/images/img_service_company.svg';

const MachineInfo = ({ machineData, isViewMode, setIsViewMode, isEditMode, setIsEditMode }) => {
    const { isAuthenticated } = useUserContext();
    const isManager = localStorage.getItem('user_role') === 'manager';

    const handleEdit = () => {
        setIsViewMode(false);
        setIsEditMode(true);
    };

    return (
        <>
            {isViewMode && (
                <section className="details-section">
                    {isManager && (
                        <div className="sb__header-navbar">
                            <button className="sb__header-navbar-btn" onClick={handleEdit}>
                                Редактировать
                            </button>
                        </div>
                    )}
                    <div className="details__container">
                        {isAuthenticated && (
                            <>
                                {machineData.shipment_date ||
                                machineData.equipment ||
                                machineData.client_name ||
                                machineData.recipient ||
                                machineData.delivery_address ? (
                                    <div className="details__private-container">
                                        {machineData.shipment_date && (
                                            <div className="details__private-item">
                                                <div className="details__private-title">
                                                    Дата отгрузки с завода:{' '}
                                                </div>
                                                <div className="details__private-value">
                                                    {machineData.shipment_date}
                                                </div>
                                            </div>
                                        )}

                                        {machineData.equipment && (
                                            <div className="details__private-item">
                                                <div className="details__private-title">
                                                    Комплектация (доп. опции):{' '}
                                                </div>
                                                <div
                                                    className="details__private-value"
                                                    style={{
                                                        whiteSpace: 'pre-line',
                                                        textAlign: 'left',
                                                    }}
                                                >
                                                    {machineData.equipment}
                                                </div>
                                            </div>
                                        )}

                                        {machineData.client_name && (
                                            <div className="details__private-item">
                                                <div className="details__private-title">
                                                    Покупатель:{' '}
                                                </div>
                                                <div className="details__private-value">
                                                    {machineData.client_name}
                                                </div>
                                            </div>
                                        )}

                                        {machineData.recipient && (
                                            <div className="details__private-item">
                                                <div className="details__private-title">
                                                    Грузополучатель (конечный потребитель):{' '}
                                                </div>
                                                <div className="details__private-value">
                                                    {machineData.recipient}
                                                </div>
                                            </div>
                                        )}

                                        {machineData.delivery_address && (
                                            <div className="details__private-item">
                                                <div className="details__private-title">
                                                    Адрес поставки (эксплуатации):{' '}
                                                </div>
                                                <div className="details__private-value">
                                                    {machineData.delivery_address}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </>
                        )}
                        <div className="details__public-container">
                            <div className="details__public-item">
                                <div className="details__public-item-header">
                                    <div className="details__public-item-header-text">
                                        <div className="details__public-item-title">Техника</div>
                                        <div className="details__public-item-name">
                                            {machineData.model_technique_name}
                                        </div>
                                        <div className="details__public-item-serial-number">
                                            № {machineData.serial_number}
                                        </div>
                                    </div>
                                    <div className="details__public-item-image">
                                        <img
                                            className="details__public-item-img"
                                            src={machineImg}
                                            alt="Изображение машины"
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="details__public-item-body">
                                    {machineData.model_technique_description}
                                </div>
                            </div>

                            <div className="details__public-item">
                                <div className="details__public-item-header">
                                    <div className="details__public-item-header-text">
                                        <div className="details__public-item-title">Двигатель</div>
                                        <div className="details__public-item-name">
                                            {machineData.engine_model_name}
                                        </div>
                                        <div className="details__public-item-serial-number">
                                            № {machineData.engine_serial_number}
                                        </div>
                                    </div>
                                    <div className="details__public-item-image">
                                        <img
                                            className="details__public-item-img"
                                            src={enginImg}
                                            alt="Изображение двигателя"
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="details__public-item-body">
                                    {machineData.engine_model_description}
                                </div>
                            </div>

                            <div className="details__public-item">
                                <div className="details__public-item-header">
                                    <div className="details__public-item-header-text">
                                        <div className="details__public-item-title">
                                            Трансмиссия
                                        </div>
                                        <div className="details__public-item-name">
                                            {machineData.transmission_model_name}
                                        </div>
                                        <div className="details__public-item-serial-number">
                                            № {machineData.transmission_serial_number}
                                        </div>
                                    </div>
                                    <div className="details__public-item-image">
                                        <img
                                            className="details__public-item-img"
                                            src={transmissionImg}
                                            alt="Изображение трансмиссии"
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="details__public-item-body">
                                    {machineData.transmission_model_description}
                                </div>
                            </div>

                            <div className="details__public-item">
                                <div className="details__public-item-header">
                                    <div className="details__public-item-header-text">
                                        <div className="details__public-item-title">
                                            Ведущий мост
                                        </div>
                                        <div className="details__public-item-name">
                                            {machineData.driving_bridge_model_name}
                                        </div>
                                        <div className="details__public-item-serial-number">
                                            № {machineData.driving_bridge_serial_number}
                                        </div>
                                    </div>
                                    <div className="details__public-item-image">
                                        <img
                                            className="details__public-item-img"
                                            src={leadingBridgeImg}
                                            alt="Изображение ведущего моста"
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="details__public-item-body">
                                    {machineData.driving_bridge_model_description}
                                </div>
                            </div>

                            <div className="details__public-item">
                                <div className="details__public-item-header">
                                    <div className="details__public-item-header-text">
                                        <div className="details__public-item-title">
                                            Управляемый мост
                                        </div>
                                        <div className="details__public-item-name">
                                            {machineData.controlled_bridge_model_name}
                                        </div>
                                        <div className="details__public-item-serial-number">
                                            № {machineData.controlled_bridge_serial_number}
                                        </div>
                                    </div>
                                    <div className="details__public-item-image">
                                        <img
                                            className="details__public-item-img"
                                            src={controlledBridgeImg}
                                            alt="Изображение управляемого моста"
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="details__public-item-body">
                                    {machineData.controlled_bridge_model_description}
                                </div>
                            </div>

                            {isAuthenticated && (
                                <>
                                    {machineData.service_company_name && (
                                        <div className="details__public-item">
                                            <div className="details__public-item-header">
                                                <div className="details__public-item-header-text">
                                                    <div className="details__public-item-title">
                                                        Сервисная компания
                                                    </div>
                                                    <div className="details__public-item-name">
                                                        {machineData.service_company_name}
                                                    </div>
                                                </div>
                                                <div className="details__public-item-image">
                                                    <img
                                                        className="details__public-item-img"
                                                        src={serviceCompanyImg}
                                                        alt="Изображение сервисной компании"
                                                    />
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
                                                {machineData.service_company_description}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}
            {isEditMode && (
                <EditMachine setIsViewMode={setIsViewMode} setIsEditMode={setIsEditMode} />
            )}
        </>
    );
};

export default MachineInfo;

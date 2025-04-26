import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { searchService } from '../../../../../services/searchService.js';

const EditMachine = ({ setIsViewMode, setIsEditMode }) => {
    const [loading, setLoading] = useState(false);
    const [machineData, setMachineData] = useState([]);
    const [error, setError] = useState('');
    const [submitError, setSubmitError] = useState('');
    const { id } = useParams();

    const [machine, setMachine] = useState({
        serial_number: '',
        model_technique: '',
        engine_model: '',
        engine_serial_number: '',
        transmission_model: '',
        transmission_serial_number: '',
        driving_bridge_model: '',
        driving_bridge_serial_number: '',
        controlled_bridge_model: '',
        controlled_bridge_serial_number: '',
        supply_contract: null,
        shipment_date: '',
        recipient: null,
        delivery_address: null,
        equipment: '',
        client: null,
        service_company: null,
    });

    const [references, setReferences] = useState({
        model_technique: [],
        engine_model: [],
        transmission_model: [],
        driving_bridge_model: [],
        controlled_bridge_model: [],
        client: [],
        service_company: [],
    });

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setMachineData([]);

            try {
                const machineResponse = await searchService.getMachine(id);
                setMachineData(machineResponse);
                setMachine(machineResponse);
                const referencesResponse = await searchService.getReferencesForMachine();
                setReferences(referencesResponse);
            } catch (error) {
                setError(
                    error.machineResponse?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера',
                );
            } finally {
                setLoading(false);
            }
        };
        getResult();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMachine((prev) => ({
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
            const dataToSend = {
                ...machine,
                supply_contract: machine.supply_contract || null,
                recipient: machine.recipient || null,
                delivery_address: machine.delivery_address || null,
                client: machine.client || null,
                service_company: machine.service_company || null,
            };

            await searchService.putMachine(machineData.serial_number, dataToSend);
            setIsEditMode(false);
            setIsViewMode(true);
            location.reload();
        } catch (err) {
            setSubmitError('Ошибка обновления данных');
        }
    };

    return (
        <div className="sb__container">
            {loading && <h1 className="sb__text">Загрузка...</h1>}
            {error && <h1 className="sb__text">{error}</h1>}
            {!loading && !error && machineData?.length == 0 && (
                <h1 className="sb__text">Нет данных</h1>
            )}
            {machineData?.length !== 0 ? (
                <>
                    <section className="sb__navbar-section">
                        <div className="sb__container">
                            <h1 className="sb__text">
                                Редактирование комплектации и технических характеристиках Вашей
                                техники
                            </h1>
                        </div>
                        <hr />
                    </section>

                    <section className="edit-section">
                        <div className="edit__container">
                            <form className="edit__form" onSubmit={handleSubmit}>
                                <div className="edit-form-grid-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Модель двигателя:
                                        </label>
                                        <select
                                            className="edit__form-input"
                                            name="engine_model"
                                            value={machine.engine_model}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите модель</option>
                                            {references.engine_model.map((ref) => (
                                                <option key={ref.id} value={ref.id}>
                                                    {ref.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Зав. № двигателя:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="engine_serial_number"
                                            value={machine.engine_serial_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Модель трансмиссии:
                                        </label>
                                        <select
                                            className="edit__form-input"
                                            name="transmission_model"
                                            value={machine.transmission_model}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите модель</option>
                                            {references.transmission_model.map((ref) => (
                                                <option key={ref.id} value={ref.id}>
                                                    {ref.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Зав. № трансмиссии:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="transmission_serial_number"
                                            value={machine.transmission_serial_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Модель ведущего моста:
                                        </label>
                                        <select
                                            className="edit__form-input"
                                            name="driving_bridge_model"
                                            value={machine.driving_bridge_model}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите модель</option>
                                            {references.driving_bridge_model.map((ref) => (
                                                <option key={ref.id} value={ref.id}>
                                                    {ref.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Зав. № ведущего моста:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="driving_bridge_serial_number"
                                            value={machine.driving_bridge_serial_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Модель управляемого моста:
                                        </label>
                                        <select
                                            className="edit__form-input"
                                            name="controlled_bridge_model"
                                            value={machine.controlled_bridge_model}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Выберите модель</option>
                                            {references.controlled_bridge_model.map((ref) => (
                                                <option key={ref.id} value={ref.id}>
                                                    {ref.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Зав. № управляемого моста:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="controlled_bridge_serial_number"
                                            value={machine.controlled_bridge_serial_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Договор поставки №, дата:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="supply_contract"
                                            value={machine.supply_contract || ''}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Дата отгрузки с завода:
                                        </label>
                                        <input
                                            className="edit__form-input"
                                            type="date"
                                            name="shipment_date"
                                            value={machine.shipment_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Грузополучатель:</label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="recipient"
                                            value={machine.recipient || ''}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Адрес поставки:</label>
                                        <input
                                            className="edit__form-input"
                                            type="text"
                                            name="delivery_address"
                                            value={machine.delivery_address || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="edit__form-flex-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Комплектация:</label>
                                        <textarea
                                            className="edit__form-textarea"
                                            name="equipment"
                                            value={machine.equipment}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="edit-form-grid-container">
                                    <div className="edit__form-group">
                                        <label className="edit__form-label">Клиент:</label>
                                        <select
                                            className="edit__form-input"
                                            name="client"
                                            value={machine.client || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">Не указан</option>
                                            {references.client.map((ref) => (
                                                <option key={ref.id} value={ref.id}>
                                                    {ref.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="edit__form-group">
                                        <label className="edit__form-label">
                                            Сервисная компания:
                                        </label>
                                        <select
                                            className="edit__form-input"
                                            name="service_company"
                                            value={machine.service_company || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">Не указан</option>
                                            {references.service_company.map((ref) => (
                                                <option key={ref.id} value={ref.id}>
                                                    {ref.name}
                                                </option>
                                            ))}
                                        </select>
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
        </div>
    );
};

export default EditMachine;

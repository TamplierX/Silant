import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataService } from '../../../../../services/dataService.js';
import { searchService } from '../../../../../services/searchService.js';

const GeneralInfo = () => {
    const [loading, setLoading] = useState(false);
    const [originalMachinesData, setOriginalMachinesData] = useState([]);
    const [filteredMachinesData, setFilteredMachinesData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        modelTechnique: '',
        engineModel: '',
        transmissionModel: '',
        drivingBridgeModel: '',
        controlledBridgeModel: '',
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

    const [sortConfig, setSortConfig] = useState({
        key: 'shipment_date',
        direction: 'desc',
    });

    useEffect(() => {
        const getMachines = async () => {
            setLoading(true);
            setError('');
            setOriginalMachinesData([]);
            setFilteredMachinesData([]);

            try {
                const response = await dataService.getMachines();
                setOriginalMachinesData(response);
                setFilteredMachinesData(response);

                const referencesResponse = await searchService.getReferencesForMachine();
                setReferences(referencesResponse);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getMachines();
    }, []);

    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        setFilteredMachinesData((prevData) => {
            const sortedData = [...prevData].sort((a, b) => {
                if (key === 'shipment_date') {
                    const dateA = a[key] ? new Date(a[key]) : new Date(0);
                    const dateB = b[key] ? new Date(b[key]) : new Date(0);
                    return direction === 'asc' ? dateA - dateB : dateB - dateA;
                }

                if (a[key] < b[key]) {
                    return direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
            return sortedData;
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return '↕';
        return sortConfig.direction === 'asc' ? '↑' : '↓';
    };

    useEffect(() => {
        if (originalMachinesData.length > 0) {
            let filteredData = [...originalMachinesData];

            if (filters.modelTechnique) {
                filteredData = filteredData.filter((item) =>
                    item.model_technique_name
                        ?.toLowerCase()
                        .includes(filters.modelTechnique.toLowerCase()),
                );
            }

            if (filters.engineModel) {
                filteredData = filteredData.filter((item) =>
                    item.engine_model_name
                        ?.toLowerCase()
                        .includes(filters.engineModel.toLowerCase()),
                );
            }

            if (filters.transmissionModel) {
                filteredData = filteredData.filter((item) =>
                    item.transmission_model_name
                        ?.toLowerCase()
                        .includes(filters.transmissionModel.toLowerCase()),
                );
            }

            if (filters.drivingBridgeModel) {
                filteredData = filteredData.filter((item) =>
                    item.driving_bridge_model_name
                        ?.toLowerCase()
                        .includes(filters.drivingBridgeModel.toLowerCase()),
                );
            }

            if (filters.controlledBridgeModel) {
                filteredData = filteredData.filter((item) =>
                    item.controlled_bridge_model_name
                        ?.toLowerCase()
                        .includes(filters.controlledBridgeModel.toLowerCase()),
                );
            }

            setFilteredMachinesData(filteredData);
            sortData(sortConfig.key);
        }
    }, [filters, originalMachinesData]);

    const handleRowClick = (value) => {
        navigate(`/machine/${value}`);
    };

    return (
        <section className="sb__result-section">
            <div className="sb__container">
                {loading && <h3 className="sb__text">Загрузка...</h3>}
                {error && <h3 className="sb__text">{error}</h3>}
                {!loading && !error && originalMachinesData?.length == 0 && (
                    <h3 className="sb__text">Нет данных</h3>
                )}

                {originalMachinesData?.length !== 0 ? (
                    <div className="sb__filters">
                        <div className="edit__form-group">
                            <h3 className="sb__filters_label">Фильтрация:</h3>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Модель техники:</label>
                            <select
                                name="modelTechnique"
                                value={filters.modelTechnique}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.model_technique.map((ref) => (
                                    <option key={ref.id} value={ref.name}>
                                        {ref.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Модель двигателя:</label>
                            <select
                                name="engineModel"
                                value={filters.engineModel}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.engine_model.map((ref) => (
                                    <option key={ref.id} value={ref.name}>
                                        {ref.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Модель трансмиссии:</label>
                            <select
                                name="transmissionModel"
                                value={filters.transmissionModel}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.transmission_model.map((ref) => (
                                    <option key={ref.id} value={ref.name}>
                                        {ref.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Модель ведущего моста:</label>
                            <select
                                name="drivingBridgeModel"
                                value={filters.drivingBridgeModel}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.driving_bridge_model.map((ref) => (
                                    <option key={ref.id} value={ref.name}>
                                        {ref.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Модель управляемого моста:</label>
                            <select
                                name="controlledBridgeModel"
                                value={filters.controlledBridgeModel}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.controlled_bridge_model.map((ref) => (
                                    <option key={ref.id} value={ref.name}>
                                        {ref.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : null}

                {filteredMachinesData?.length !== 0 ? (
                    <div className="sb__table-wrapper">
                        <div className="sb__table-container">
                            <table className="sb__table">
                                <thead>
                                    <tr>
                                        <th>
                                            № <br /> п/п
                                        </th>
                                        <th>
                                            Модель <br /> техники
                                        </th>
                                        <th>
                                            Зав. №<br /> машины
                                        </th>
                                        <th>
                                            Модель <br /> двигателя
                                        </th>
                                        <th>
                                            Зав. № <br /> двигателя
                                        </th>
                                        <th>
                                            Модель <br /> трансмиссии <br /> (производитель, <br />{' '}
                                            артикул)
                                        </th>
                                        <th>
                                            Зав. № <br /> трансмиссии
                                        </th>
                                        <th>
                                            Модель <br /> ведущего моста
                                        </th>
                                        <th>
                                            Зав. № <br /> ведущего <br /> моста
                                        </th>
                                        <th>
                                            Модель <br /> управляемого <br /> моста
                                        </th>
                                        <th>
                                            Зав. № <br /> управляемого <br /> моста
                                        </th>
                                        <th
                                            onClick={() => sortData('shipment_date')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Дата <br /> отгрузки <br /> с завода{' '}
                                            {getSortIcon('shipment_date')}
                                        </th>
                                        <th>Покупатель</th>
                                        <th>
                                            Грузополучатель <br /> (конечный потребитель)
                                        </th>
                                        <th>
                                            Адрес поставки <br /> (эксплуатации)
                                        </th>
                                        <th>
                                            Комплектация <br /> (доп. опции)
                                        </th>
                                        <th>Сервисная компания</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMachinesData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="sb__link-row"
                                            onClick={() => handleRowClick(item.serial_number)}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{item.model_technique_name}</td>
                                            <td>{item.serial_number}</td>
                                            <td>{item.engine_model_name}</td>
                                            <td>{item.engine_serial_number}</td>
                                            <td>{item.transmission_model_name}</td>
                                            <td>{item.transmission_serial_number}</td>
                                            <td>{item.driving_bridge_model_name}</td>
                                            <td>{item.driving_bridge_serial_number}</td>
                                            <td>{item.controlled_bridge_model_name}</td>
                                            <td>{item.controlled_bridge_serial_number}</td>
                                            <td>{item.shipment_date}</td>
                                            <td>{item.client_name}</td>
                                            <td>{item.recipient}</td>
                                            <td>{item.delivery_address}</td>
                                            <td
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                {item.equipment}
                                            </td>
                                            <td>{item.service_company_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="sb__container">
                        {!loading && !error && originalMachinesData?.length !== 0 ? (
                            <h3 className="sb__text">Нет данных, соответствующих фильтрам</h3>
                        ) : null}
                    </div>
                )}
            </div>
        </section>
    );
};

export default GeneralInfo;

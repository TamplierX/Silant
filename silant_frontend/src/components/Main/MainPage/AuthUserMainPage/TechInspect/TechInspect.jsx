import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataService } from '../../../../../services/dataService.js';
import { searchService } from '../../../../../services/searchService.js';

const TechInspect = () => {
    const [loading, setLoading] = useState(false);
    const [originalServicesData, setOriginalServicesData] = useState([]);
    const [filteredServicesData, setFilteredServicesData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        typeOfService: '',
        serialNumber: '',
        serviceCompany: '',
    });

    const [references, setReferences] = useState({
        machine: [],
        type_of_service: [],
        organization: [],
        service_company: [],
    });

    const [sortConfig, setSortConfig] = useState({
        key: 'service_date',
        direction: 'desc',
    });

    useEffect(() => {
        const getServices = async () => {
            setLoading(true);
            setError('');
            setOriginalServicesData([]);
            setFilteredServicesData([]);

            try {
                const response = await dataService.getServices();
                setOriginalServicesData(response);
                setFilteredServicesData(response);

                const referencesResponse = await searchService.getReferencesForService();
                setReferences(referencesResponse);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getServices();
    }, []);

    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        setFilteredServicesData((prevData) => {
            const sortedData = [...prevData].sort((a, b) => {
                if (key === 'service_date') {
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
        if (originalServicesData.length > 0) {
            let filteredData = [...originalServicesData];

            if (filters.typeOfService) {
                filteredData = filteredData.filter((item) =>
                    item.type_of_service_name
                        ?.toLowerCase()
                        .includes(filters.typeOfService.toLowerCase()),
                );
            }

            if (filters.serialNumber) {
                filteredData = filteredData.filter((item) =>
                    item.machine_serial_number
                        ?.toLowerCase()
                        .includes(filters.serialNumber.toLowerCase()),
                );
            }

            if (filters.serviceCompany) {
                filteredData = filteredData.filter((item) =>
                    item.service_company_name
                        ?.toLowerCase()
                        .includes(filters.serviceCompany.toLowerCase()),
                );
            }

            setFilteredServicesData(filteredData);
            sortData(sortConfig.key);
        }
    }, [filters, originalServicesData]);

    const handleRowClick = (value) => {
        navigate(`/service/${value}`);
    };

    return (
        <section className="sb__result-section">
            <div className="sb__container">
                {loading && <h3 className="sb__text">Загрузка...</h3>}
                {error && <h3 className="sb__text">{error}</h3>}
                {!loading && !error && originalServicesData?.length == 0 && (
                    <h3 className="sb__text">Нет данных</h3>
                )}

                {originalServicesData?.length !== 0 ? (
                    <div className="sb__filters">
                        <div className="edit__form-group">
                            <h3 className="sb__filters_label">Фильтрация:</h3>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Зав. № машины:</label>
                            <input
                                type="text"
                                name="serialNumber"
                                value={filters.serialNumber}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Вид ТО:</label>
                            <select
                                name="typeOfService"
                                value={filters.typeOfService}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.type_of_service.map((ref) => (
                                    <option key={ref.id} value={ref.name}>
                                        {ref.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Сервисная компания:</label>
                            <select
                                name="serviceCompany"
                                value={filters.serviceCompany}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.service_company.map((ref) => (
                                    <option key={ref.id} value={ref.name}>
                                        {ref.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : null}

                {filteredServicesData?.length !== 0 ? (
                    <div className="sb__table-wrapper">
                        <div className="sb__table-container">
                            <table className="sb__table">
                                <thead>
                                    <tr>
                                        <th>
                                            Зав. №<br /> машины
                                        </th>
                                        <th>Вид ТО</th>
                                        <th
                                            onClick={() => sortData('service_date')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Дата <br /> проведения ТО {getSortIcon('service_date')}
                                        </th>
                                        <th>
                                            Наработка, <br /> м/час
                                        </th>
                                        <th>
                                            № <br /> заказ-наряда
                                        </th>
                                        <th>
                                            Дата <br /> заказ-наряда
                                        </th>
                                        <th>
                                            Организация, <br /> проводившая ТО
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredServicesData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="sb__link-row"
                                            onClick={() => handleRowClick(item.id)}
                                        >
                                            <td>{item.machine_serial_number}</td>
                                            <td>{item.type_of_service_name}</td>
                                            <td>{item.service_date}</td>
                                            <td>{Math.trunc(item.mileage)}</td>
                                            <td>{item.work_order_number}</td>
                                            <td>{item.work_order_date}</td>
                                            <td>{item.organization_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="sb__container">
                        {!loading && !error && originalServicesData?.length !== 0 ? (
                            <h3 className="sb__text">Нет данных, соответствующих фильтрам</h3>
                        ) : null}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TechInspect;

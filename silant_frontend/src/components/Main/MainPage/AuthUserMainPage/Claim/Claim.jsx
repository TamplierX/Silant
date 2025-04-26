import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataService } from '../../../../../services/dataService.js';
import { searchService } from '../../../../../services/searchService.js';

const Claim = () => {
    const [loading, setLoading] = useState(false);
    const [originalClaimsData, setOriginalClaimsData] = useState([]);
    const [filteredClaimsData, setFilteredClaimsData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        faultNode: '',
        restorationMethod: '',
        serviceCompany: '',
    });

    const [references, setReferences] = useState({
        fault_node: [],
        restoration_method: [],
        machine: [],
        service_company: [],
    });

    const [sortConfig, setSortConfig] = useState({
        key: 'failure_date',
        direction: 'desc',
    });

    useEffect(() => {
        const getClaims = async () => {
            setLoading(true);
            setError('');
            setOriginalClaimsData([]);
            setFilteredClaimsData([]);

            try {
                const response = await dataService.getClaims();
                setOriginalClaimsData(response);
                setFilteredClaimsData(response);

                const referencesResponse = await searchService.getReferencesForClaim();
                setReferences(referencesResponse);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getClaims();
    }, []);

    const sortData = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        setFilteredClaimsData((prevData) => {
            const sortedData = [...prevData].sort((a, b) => {
                if (key === 'failure_date') {
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
        if (originalClaimsData.length > 0) {
            let filteredData = [...originalClaimsData];

            if (filters.faultNode) {
                filteredData = filteredData.filter((item) =>
                    item.fault_node_name?.toLowerCase().includes(filters.faultNode.toLowerCase()),
                );
            }

            if (filters.restorationMethod) {
                filteredData = filteredData.filter((item) =>
                    item.restoration_method_name
                        ?.toLowerCase()
                        .includes(filters.restorationMethod.toLowerCase()),
                );
            }

            if (filters.serviceCompany) {
                filteredData = filteredData.filter((item) =>
                    item.service_company_name
                        ?.toLowerCase()
                        .includes(filters.serviceCompany.toLowerCase()),
                );
            }

            setFilteredClaimsData(filteredData);
            sortData(sortConfig.key);
        }
    }, [filters, originalClaimsData]);

    const handleRowClick = (value) => {
        navigate(`/claim/${value}`);
    };

    return (
        <section className="sb__result-section">
            <div className="sb__container">
                {loading && <h3 className="sb__text">Загрузка...</h3>}
                {error && <h3 className="sb__text">{error}</h3>}
                {!loading && !error && originalClaimsData?.length == 0 && (
                    <h3 className="sb__text">Нет данных</h3>
                )}

                {originalClaimsData?.length !== 0 ? (
                    <div className="sb__filters">
                        <div className="edit__form-group">
                            <h3 className="sb__filters_label">Фильтрация:</h3>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Узел отказа:</label>
                            <select
                                name="faultNode"
                                value={filters.faultNode}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.fault_node.map((ref) => (
                                    <option key={ref.id} value={ref.name}>
                                        {ref.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="edit__form-group">
                            <label className="edit__form-label">Способ восстановления:</label>
                            <select
                                name="restorationMethod"
                                value={filters.restorationMethod}
                                onChange={handleFilterChange}
                            >
                                <option value="">---</option>
                                {references.restoration_method.map((ref) => (
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

                {filteredClaimsData?.length !== 0 ? (
                    <div className="sb__table-wrapper">
                        <div className="sb__table-container">
                            <table className="sb__table">
                                <thead>
                                    <tr>
                                        <th>
                                            Зав. №<br /> машины
                                        </th>
                                        <th
                                            onClick={() => sortData('failure_date')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Дата отказа {getSortIcon('failure_date')}
                                        </th>
                                        <th>
                                            Наработка, <br /> м/час
                                        </th>
                                        <th>Узел отказа</th>
                                        <th>Описание отказа</th>
                                        <th>
                                            Способ <br /> восстановления
                                        </th>
                                        <th>
                                            Используемые <br /> запасные части
                                        </th>
                                        <th>
                                            Дата <br /> восстановления
                                        </th>
                                        <th>
                                            Время <br /> простоя <br /> техники
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClaimsData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="sb__link-row"
                                            onClick={() => handleRowClick(item.id)}
                                        >
                                            <td>{item.machine_serial_number}</td>
                                            <td>{item.failure_date}</td>
                                            <td>{Math.trunc(item.mileage)}</td>
                                            <td>{item.fault_node_name}</td>
                                            <td>{item.failure_description}</td>
                                            <td>{item.restoration_method_name}</td>
                                            <td>{item.spare_parts_used}</td>
                                            <td>{item.restoration_date}</td>
                                            <td>{item.downtime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="sb__container">
                        {!loading && !error && originalClaimsData?.length !== 0 ? (
                            <h3 className="sb__text">Нет данных, соответствующих фильтрам</h3>
                        ) : null}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Claim;

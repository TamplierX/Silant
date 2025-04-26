import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { searchService } from '../../../../services/searchService';

const MachineClaims = () => {
    const [loading, setLoading] = useState(false);
    const [machineClaimsData, setMachineClaimsData] = useState([]);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setMachineClaimsData([]);

            try {
                const response = await searchService.getClaimsForMachine(id);
                setMachineClaimsData(response);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getResult();
    }, []);

    const handleRowClick = (value) => {
        navigate(`/claim/${value}`);
    };

    return (
        <section className="sb__result-section">
            <div className="sb__container">
                {loading && <h3 className="sb__text">Загрузка...</h3>}
                {error && <h3 className="sb__text">{error}</h3>}
                {!loading && !error && machineClaimsData?.length == 0 && (
                    <h3 className="sb__text">Нет данных</h3>
                )}
                {machineClaimsData?.length !== 0 ? (
                    <div className="sb__table-wrapper">
                        <div className="sb__table-container">
                            <table className="sb__table">
                                <thead>
                                    <tr>
                                        <th>
                                            Зав. №<br /> машины
                                        </th>
                                        <th>Дата отказа</th>
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
                                    {machineClaimsData.map((item, index) => (
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
                ) : null}
            </div>
        </section>
    );
};

export default MachineClaims;

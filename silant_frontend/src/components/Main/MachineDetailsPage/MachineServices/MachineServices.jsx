import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { searchService } from '../../../../services/searchService';

const MachineServices = () => {
    const [loading, setLoading] = useState(false);
    const [machineServicesData, setMachineServicesData] = useState([]);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getResult = async () => {
            setLoading(true);
            setError('');
            setMachineServicesData([]);

            try {
                const response = await searchService.getServicesForMachine(id);
                setMachineServicesData(response);
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
        navigate(`/service/${value}`);
    };

    return (
        <section className="sb__result-section">
            <div className="sb__container">
                {loading && <h3 className="sb__text">Загрузка...</h3>}
                {error && <h3 className="sb__text">{error}</h3>}
                {!loading && !error && machineServicesData?.length == 0 && (
                    <h3 className="sb__text">Нет данных</h3>
                )}
                {machineServicesData?.length !== 0 ? (
                    <div className="sb__table-wrapper">
                        <div className="sb__table-container">
                            <table className="sb__table">
                                <thead>
                                    <tr>
                                        <th>
                                            Зав. №<br /> машины
                                        </th>
                                        <th>Вид ТО</th>
                                        <th>
                                            Дата <br /> проведения ТО
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
                                    {machineServicesData.map((item, index) => (
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
                ) : null}
            </div>
        </section>
    );
};

export default MachineServices;

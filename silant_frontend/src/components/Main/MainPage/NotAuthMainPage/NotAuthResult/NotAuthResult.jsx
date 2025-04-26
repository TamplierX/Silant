import React from 'react';
import { useNavigate } from 'react-router';

const NotAuthResult = ({ machineData, executeRequest, loading, error }) => {
    const navigate = useNavigate();

    const handleRowClick = (value) => {
        navigate(`/machine/${value}`);
    };

    return (
        <section className="search__result-section">
            {executeRequest && (
                <div className="sb__container">
                    <h3 className="sb__title">Результат поиска:</h3>
                    {loading && <h3 className="sb__text">Загрузка...</h3>}
                    {error && <h3 className="sb__text">{error}</h3>}
                    {machineData?.length !== 0 ? (
                        <div className="sb__container">
                            <h3 className="sb__text">
                                Информация о комплектации и технических характеристиках Вашей
                                техники
                            </h3>
                            <div className="sb__table-wrapper">
                                <div className="sb__table-container">
                                    <table className="sb__table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    Модель <br /> техники
                                                </th>
                                                <th>
                                                    Зав. № <br /> машины
                                                </th>
                                                <th>
                                                    Модель <br /> двигателя
                                                </th>
                                                <th>
                                                    Зав. № <br /> двигателя
                                                </th>
                                                <th>
                                                    Модель <br /> трансмиссии <br /> (производитель,{' '}
                                                    <br /> артикул)
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                className="sb__link-row"
                                                onClick={() =>
                                                    handleRowClick(machineData.serial_number)
                                                }
                                            >
                                                <td>{machineData.model_technique_name}</td>
                                                <td>{machineData.serial_number}</td>
                                                <td>{machineData.engine_model_name}</td>
                                                <td>{machineData.engine_serial_number}</td>
                                                <td>{machineData.transmission_model_name}</td>
                                                <td>{machineData.transmission_serial_number}</td>
                                                <td>{machineData.driving_bridge_model_name}</td>
                                                <td>{machineData.driving_bridge_serial_number}</td>
                                                <td>{machineData.controlled_bridge_model_name}</td>
                                                <td>
                                                    {machineData.controlled_bridge_serial_number}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            )}
        </section>
    );
};

export default NotAuthResult;

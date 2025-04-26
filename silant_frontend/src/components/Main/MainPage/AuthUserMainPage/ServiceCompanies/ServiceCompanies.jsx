import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataService } from '../../../../../services/dataService.js';

const ServiceCompanies = () => {
    const [loading, setLoading] = useState(false);
    const [serviceCompaniesData, setServiceCompaniesData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getServiceCompanies = async () => {
            setLoading(true);
            setError('');
            setServiceCompaniesData([]);

            try {
                const response = await dataService.getServiceCompanies();
                setServiceCompaniesData(response);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getServiceCompanies();
    }, []);

    const handleRowClick = (value) => {
        navigate(`/service_company/${value}`);
    };

    return (
        <section className="sb__result-section">
            <div className="sb__container">
                {loading && <h3 className="sb__text">Загрузка...</h3>}
                {error && <h3 className="sb__text">{error}</h3>}
                {!loading && !error && serviceCompaniesData?.length == 0 && (
                    <h3 className="sb__text">Нет данных</h3>
                )}
                {serviceCompaniesData?.length !== 0 ? (
                    <div className="sb__table-wrapper">
                        <div className="sb__table-container">
                            <table className="sb__table">
                                <thead>
                                    <tr>
                                        <th>Название</th>
                                        <th>Описание</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceCompaniesData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="sb__link-row"
                                            onClick={() => handleRowClick(item.id)}
                                        >
                                            <td>{item.name}</td>
                                            <td
                                                style={{
                                                    whiteSpace: 'pre-line',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                {item.description}
                                            </td>
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

export default ServiceCompanies;

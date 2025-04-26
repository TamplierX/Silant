import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataService } from '../../../../../services/dataService.js';

const Clients = () => {
    const [loading, setLoading] = useState(false);
    const [clientsData, setClientsData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getClients = async () => {
            setLoading(true);
            setError('');
            setClientsData([]);

            try {
                const response = await dataService.getClients();
                setClientsData(response);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getClients();
    }, []);

    const handleRowClick = (value) => {
        navigate(`/client/${value}`);
    };

    return (
        <section className="sb__result-section">
            <div className="sb__container">
                {loading && <h3 className="sb__text">Загрузка...</h3>}
                {error && <h3 className="sb__text">{error}</h3>}
                {!loading && !error && clientsData?.length == 0 && (
                    <h3 className="sb__text">Нет данных</h3>
                )}
                {clientsData?.length !== 0 ? (
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
                                    {clientsData.map((item, index) => (
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

export default Clients;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { dataService } from '../../../../../services/dataService.js';

const Reference = () => {
    const [loading, setLoading] = useState(false);
    const [referencesData, setReferencesData] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getMachines = async () => {
            setLoading(true);
            setError('');
            setReferencesData([]);

            try {
                const response = await dataService.getReferences();
                setReferencesData(response);
            } catch (error) {
                console.log(error.message);
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        getMachines();
    }, []);

    const getEntityDisplayName = (entityName) => {
        const choices = {
            model_technique: 'Модель техники',
            engine_model: 'Модель двигателя',
            transmission_model: 'Модель трансмиссии',
            driving_bridge_model: 'Модель ведущего моста',
            controlled_bridge_model: 'Модель управляемого моста',
            type_of_service: 'Вид ТО',
            fault_node: 'Узел отказа',
            restoration_method: 'Способ восстановления',
            organization: 'Организация, проводившая ТО',
        };
        return choices[entityName] || entityName;
    };

    const truncateDescription = (description) => {
        if (!description) return '';
        return description.length > 50 ? `${description.substring(0, 50)}...` : description;
    };

    const handleRowClick = (value) => {
        navigate(`/reference/${value}`);
    };

    return (
        <section className="sb__result-section">
            <div className="sb__container">
                {loading && <h3 className="sb__text">Загрузка...</h3>}
                {error && <h3 className="sb__text">{error}</h3>}
                {!loading && !error && referencesData?.length == 0 && (
                    <h3 className="sb__text">Нет данных</h3>
                )}
                {referencesData?.length !== 0 ? (
                    <div className="sb__table-wrapper">
                        <div className="sb__table-container">
                            <table className="sb__table">
                                <thead>
                                    <tr>
                                        <th>Название словаря</th>
                                        <th>Название</th>
                                        <th>Описание</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {referencesData.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="sb__link-row"
                                            onClick={() => handleRowClick(item.id)}
                                        >
                                            <td>{getEntityDisplayName(item.entity_name)}</td>
                                            <td>{item.name}</td>
                                            <td>{truncateDescription(item.description)}</td>
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

export default Reference;

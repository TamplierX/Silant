import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm/SearchForm.jsx';
import NotAuthResult from './NotAuthResult/NotAuthResult.jsx';
import { searchService } from '../../../../services/searchService.js';
import './NotAuthMainPage.css';

const NotAuthMainPage = () => {
    const [searchValue, setSearchValue] = useState('');
    const [machineData, setMachineData] = useState([]);
    const [executeRequest, setExecuteRequest] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const searchResult = async () => {
            if (!searchValue.trim()) return;

            setLoading(true);
            setError('');
            setMachineData([]);

            try {
                const response = await searchService.getMachine(searchValue);
                setMachineData(response);
            } catch (error) {
                setError(error.response?.status === 404 ? 'Данные не найдены' : 'Ошибка сервера');
            } finally {
                setLoading(false);
            }
        };
        searchResult();
    }, [searchValue]);

    return (
        <div className="page__container">
            <section className="search__title-section">
                <div className="search__title">
                    <h1 className="search__title-text">
                        Проверьте комплектацию и технические характеристики техники Силант
                    </h1>
                </div>
            </section>
            <SearchForm setExecuteRequest={setExecuteRequest} setSearchValue={setSearchValue} />
            <NotAuthResult
                machineData={machineData}
                executeRequest={executeRequest}
                loading={loading}
                error={error}
            />
        </div>
    );
};

export default NotAuthMainPage;

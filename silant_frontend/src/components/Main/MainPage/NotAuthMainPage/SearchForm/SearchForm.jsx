import React, { useState } from 'react';
import './SearchForm.css';

const SearchForm = ({ setSearchValue, setExecuteRequest }) => {
    const [serialNumber, setSerialNumber] = useState('');
    const [errorText, setErrorText] = useState('');
    const [isValidForm, setIsValidForm] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        setSerialNumber(value);

        if (value === '') {
            setIsValidForm(false);
            setErrorText('Заполните поле');
        } else if (!/^[A-Za-z0-9]+$/.test(value)) {
            setIsValidForm(false);
            setErrorText('Заводской номер должен содержать только латинские буквы и цифры.');
        } else {
            setIsValidForm(true);
            setErrorText('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSearchValue(serialNumber);
        setExecuteRequest(true);
    };

    return (
        <section className="search__form-section">
            <div className="search__form-container">
                <form className="search__form" onSubmit={handleSubmit}>
                    <div className="search__form-input">
                        <input
                            className="search__form-field-input"
                            id="serialNumber"
                            type="text"
                            placeholder="Введите заводской номер техники"
                            value={serialNumber}
                            onChange={handleChange}
                        />
                        {!isValidForm && <div className="search__form-error">{errorText}</div>}
                    </div>
                    <div className="search__form-submit">
                        <button
                            type="submit"
                            className="search__form-submit-button"
                            disabled={!isValidForm}
                        >
                            Поиск
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default SearchForm;

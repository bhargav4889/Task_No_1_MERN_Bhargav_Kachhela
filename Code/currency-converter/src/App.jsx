import React, { useEffect, useState, useRef } from 'react';
import './App.css';

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  // Search inputs for both dropdowns
  const [fromSearch, setFromSearch] = useState('');
  const [toSearch, setToSearch] = useState('');

  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);

  const fromRef = useRef();
  const toRef = useRef();

  // API details
  const apiKey = '7910937fb9064a6434ccec29';
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest`;

  // Fetch available currencies and exchange rates
  useEffect(() => {
    fetch(apiUrl + '/USD')
      .then((response) => response.json())
      .then((data) => {
        if (data.result === 'success') {
          const conversionRates = data.conversion_rates;
          setCurrencies(Object.keys(conversionRates));
          setExchangeRate(conversionRates[toCurrency]);
        }
      })
      .catch((error) => console.error('Error fetching exchange rates:', error));
  }, [apiUrl]);

  // Fetch exchange rate whenever currency changes
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(apiUrl + `/${fromCurrency}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.result === 'success') {
            setExchangeRate(data.conversion_rates[toCurrency]);
          }
        })
        .catch((error) => console.error('Error fetching exchange rate:', error));
    }
  }, [fromCurrency, toCurrency, apiUrl]);

  // Calculate converted amount whenever exchange rate or amount changes
  useEffect(() => {
    if (exchangeRate) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  }, [exchangeRate, amount]);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(event.target)) {
        setToDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter currencies based on search input
  const filteredFromCurrencies = currencies.filter((currency) =>
    currency.toLowerCase().includes(fromSearch.toLowerCase())
  );

  const filteredToCurrencies = currencies.filter((currency) =>
    currency.toLowerCase().includes(toSearch.toLowerCase())
  );

  return (
    <div className="app">
      <h1>Currency Converter</h1>
      <div className="converter">
        {/* From Currency Dropdown */}
        <div className="dropdown" ref={fromRef}>
          <label>From:</label>
          <div
            className="dropdown-input"
            onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
          >
            {fromCurrency}
          </div>
          {fromDropdownOpen && (
            <div className="dropdown-menu">
              <input
                type="text"
                value={fromSearch}
                onChange={(e) => setFromSearch(e.target.value)}
                placeholder="Search currency..."
                autoFocus
              />
              <div className="dropdown-options">
                {filteredFromCurrencies.map((currency) => (
                  <div
                    key={currency}
                    onClick={() => {
                      setFromCurrency(currency);
                      setFromDropdownOpen(false);
                    }}
                    className="dropdown-option"
                  >
                    {currency}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* To Currency Dropdown */}
        <div className="dropdown" ref={toRef}>
          <label>To:</label>
          <div
            className="dropdown-input"
            onClick={() => setToDropdownOpen(!toDropdownOpen)}
          >
            {toCurrency}
          </div>
          {toDropdownOpen && (
            <div className="dropdown-menu">
              <input
                type="text"
                value={toSearch}
                onChange={(e) => setToSearch(e.target.value)}
                placeholder="Search currency..."
                autoFocus
              />
              <div className="dropdown-options">
                {filteredToCurrencies.map((currency) => (
                  <div
                    key={currency}
                    onClick={() => {
                      setToCurrency(currency);
                      setToDropdownOpen(false);
                    }}
                    className="dropdown-option"
                  >
                    {currency}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '50px' }}
          />
        </div>
      </div>

      <div className="result">
        {convertedAmount ? (
          <p>
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default App;

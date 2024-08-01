import axios from 'axios';
import { useState, useEffect } from 'react';



function App() {
  const [value, setValue] = useState('');          //from input field
  const [countries, setCountries] = useState([]);  //stores API response
  const [filteredCountries, setFilteredCountries] = useState([])
  const [capitalInfo, setCapitalInfo] = useState({});
  const [weather, setWeather] = useState({});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data);  // If the response is an array, set it
      })
      .catch(error => {
        console.error('Error fetching data from API', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedCountry.capitalInfo) {
      const [lat, lon] = selectedCountry.capitalInfo.latlng;
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
        .then(response => {
          setWeather(response.data);
        })
        .catch(error => {
          console.error('Error fetching weather data from API', error);
        })
    }
  }, [selectedCountry])
  

  useEffect(() => {
    if (value.length > 1) {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCountries(filtered);

      if (filtered.length === 1 && filtered[0].capitalInfo) {
        setCapitalInfo(filtered[0].capitalInfo);
        setSelectedCountry(filtered[0])
      } else {
        setCapitalInfo({})
        setSelectedCountry(null)
        
      }
    } else {
      setFilteredCountries([]);
      setCapitalInfo({});
      setSelectedCountry(null);
    }
  }, [value, countries])


  const handleChange = (event) => {
    setValue(event.target.value)
  }

  const handleShow = (country) => {
    setFilteredCountries([country])
    setCapitalInfo(country.capitalInfo);
    setSelectedCountry(country);
  }
  return (
    <div>
      <div>
        find countries: <input value={value} onChange={handleChange} />
      </div>

      <div>
        {filteredCountries.length > 1 ? (
          <ul>
            {filteredCountries.map(country => (
              <li key={country.name.common}>
                {country.name.common}
                <button onClick={() => handleShow(country)} >show</button>
              </li>
            ))}
          </ul>
        ) : filteredCountries.length === 1 ? (
          <div>
            <h3>{filteredCountries[0].name.common}</h3>
            <p>capital {filteredCountries[0].capital} </p>
            <p>area {filteredCountries[0].area} </p>
            <h4>languages </h4>
            <ul>
              {Object.values(filteredCountries[0].languages).map(language => (
                <li key={language}>{language}</li>
              ))}
            </ul>
            <img src={filteredCountries[0].flags.png} alt={`Flag of ${filteredCountries[0].name.common}`} width="250" />
            {weather && weather.main && (
              <div>
                <h4>Weather in {filteredCountries[0].capital}:</h4>
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Weather: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
              </div>
            )}
          </div>
        ) : (
          value.length > 1 && <p>No countries found</p>
        )}
      </div>
    </div>
  )
}

export default App;

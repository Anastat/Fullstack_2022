import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({country}) => {
  const [weather, setWeather] = useState(null) 
  const api_key = process.env.REACT_APP_API_KEY
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`
  const imageUrl = weather !== null ? `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` : ''

  useEffect(() => {
    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
      })
  }, [])

  if(weather === null)
    return null

  return (
    <>
      <h1>Weather in {country.capital}</h1>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={imageUrl} alt="weatherIcon"/>
      <p>wind {weather.wind.speed} m/s</p>
    </> 
  )
}

export default Weather
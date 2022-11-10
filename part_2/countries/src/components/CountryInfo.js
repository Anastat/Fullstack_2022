import Weather from './Weather'

const CountryInfo = ({country}) => {
	return (
		<>
			<p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <div>languages: 
        <ul>
          {Object.entries(country.languages).map(([key, value]) => 
            <li key={key}> {value}</li>
            )
          }
        </ul> 
      </div>
      <img src={country.flags.png} alt="flag"/>
      <Weather country={country}/>
		</>
		
	)
}

export default CountryInfo
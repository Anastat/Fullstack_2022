const CountryInfo = ({country}) => {
  console.log(country)
	return (
		<>
			<p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <p>languages: 
        <ul>
          {Object.entries(country.languages).map(([key, value]) => 
            <li key={key}> {value}</li>
            )
          }
        </ul> 
      </p>
      <img src={country.flags.png} alt="flag"/>
		</>
		
	)
}

export default CountryInfo
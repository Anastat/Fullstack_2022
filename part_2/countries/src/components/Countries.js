import CountryInfo from './CountryInfo'
import CountryView from './CountryView'

const Countries = (props) => {
  const {countries} = props


  if (countries.length > 10) {
    return (
      <div>
        To many matches, specify another filter
      </div>
    )
  }
  else if(countries.length > 1) {
    return (
      <div>
        {countries.map(country => {
          return (
            <div key={country.name.official}> {country.name.common}
              <CountryView country={country}/>
            </div>
            )
          } 
        )}
      </div>
    )
  }
  else if(countries.length === 1) {
    return (
      <CountryInfo country={countries[0]} />
    )
  }
}

export default Countries
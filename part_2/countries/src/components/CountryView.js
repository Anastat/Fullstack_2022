import CountryInfo from "./CountryInfo"
import { useState } from 'react' 

const CountryView = ({country}) => {
  const [isShow, setShow] = useState(false)
  console.log(country)
  if(!isShow)
    return (
      <button onClick={() => setShow(true)}> Show </button>
    )
  else 
    return <CountryInfo country={country}/>
}

export default CountryView
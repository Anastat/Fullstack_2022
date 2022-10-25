import { useState } from 'react'

const Button = ({handleClick, label}) => {
  return (
    <button onClick={handleClick}>
      {label}
    </button>
  )
}

const DisplayStat = ({name, number}) => {
  return (
    <tr>
      <td>{name}</td> 
      <td>{number}</td>
    </tr>
  ) 
}

const Statistics = ({statistics}) => {
  if(statistics.totalStat.number < 1) {
    return (
      <div> No feedback given </div>  
    )
  }
  return (
    <table>
      <tbody>
        <DisplayStat name={statistics.goodStat.name} number={statistics.goodStat.number}/>
        <DisplayStat name={statistics.neutralStat.name} number={statistics.neutralStat.number}/>
        <DisplayStat name={statistics.badStat.name} number={statistics.badStat.number}/>
        <DisplayStat name={statistics.totalStat.name} number={statistics.totalStat.number}/>
        <DisplayStat name={statistics.averageStat.name} number={statistics.averageStat.number}/>
        <DisplayStat name={statistics.positiveStat.name} number={statistics.positiveStat.number}/>
      </tbody>
    </table>   
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)

  const average = (good*1 + neutral*0 + bad*-1)/total
  const positive = (good/total * 100).toFixed(1) + ' %'

  const handleGoodClick = () => {
    setGood(good + 1)
    setTotal(total + 1)
  }
  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
  }
  const handleBadClick = () => {
    setBad(bad + 1)
    setTotal(total + 1)
  }

  const statistics = {
    goodStat: {
      name: "good",
      number: good
    },
    badStat: {
      name: "bad",
      number: bad
    },
    neutralStat: {
      name: "neutral",
      number: neutral
    },
    totalStat: {
      name: "all",
      number: total
    },
    averageStat: {
      name: "average",
      number: average
    },
    positiveStat: {
      name: "positive",
      number: positive
    }
  }

  return (
    <div>
      <h1>Give feedback</h1>
      <p>
        <Button handleClick={handleGoodClick} label="good" />
        <Button handleClick={handleNeutralClick} label="neutral" />
        <Button handleClick={handleBadClick} label="bad" />
      </p>
      <h1>Statistics</h1>
      <Statistics statistics={statistics} />
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange =(event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange =(event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()
    const isExist = persons.some(person => person.name === newName)
    if(isExist)
      window.alert(`${newName} is already added to phonebook`)
    else {
      const nameObj = {
        name: newName,
        number: newNumber,
        id: persons.length+1
      }
      setPersons(persons.concat(nameObj))
    }
    
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter(person => {
      const nameToLowCase = person.name.toLowerCase()
      
      return nameToLowCase.includes(filter.toLowerCase())
    }
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange}/>
      <PersonForm 
        addName={addName}  
        handleNumberChange={handleNumberChange}
        handleNameChange={handleNameChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow}/>
    </div>
  )
}

export default App

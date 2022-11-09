import { useState, useEffect } from 'react'

import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
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

  const handleDelete = ( id, personName )  => {
    if (window.confirm(`Delete ${personName}?`)) {
      personService
        .deletePerson(id)
        .then(() => 
          setPersons(persons.filter(person => person.id !== id))
        )
        .catch(error => {
          alert('the person was already deleted')
        })
    }
  }

  const updatePerson = (newObject) => {
    const person = persons.find(person => person.name === newObject.name)
    const personToUpdate = {...person, number: newObject.number}

    personService
      .update(person.id, newObject)
      .then(resp => setPersons(persons.map(person => person.id === resp.id ? personToUpdate : person)))
      .catch(error => {
        alert(
          `${person.name}' was already deleted from server`
        )
        setPersons(persons.filter(p => p.id !== person.id))
      })
  }

  const addName = (event) => {
    event.preventDefault()
    const nameObj = {
      name: newName,
      number: newNumber,
    }
    const isExist = persons.some(person => person.name === newName)
    if(isExist) {
      const message = `${newName} is already added to phonebook, replace the old number with a new one?`
      if(window.confirm(message))
        updatePerson(nameObj)
    }
    else {
      personService
        .create(nameObj)
        .then(response => 
          setPersons(persons.concat(response))
        )
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
      <div>
        {personsToShow.map(person => 
          <div  key={person.id}>
            <Person 
              person={person}
            />
            <button onClick={() => handleDelete(person.id, person.name)}> delete </button> 
          </div>
         
        )}
      </div>
      
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'

import personService from './services/persons'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Person from './components/Person'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState('')

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
          setMessage(`${personName} has already been deleted from server`)
          setNotificationClass('error')
            setTimeout(() => {
              setMessage(null)
              setNotificationClass('')
            }, 5000)
        })
    }
  }

  const updatePerson = (newObject) => {
    const person = persons.find(person => person.name === newObject.name)
    const personToUpdate = {...person, number: newObject.number}

    personService
      .update(person.id, newObject)
      .then(resp => {
        setMessage(`${resp.name}'s phonenumber is changed`)
        setNotificationClass('success')
          setTimeout(() => {
            setMessage(null)
            setNotificationClass('')
          }, 5000)

        setPersons(persons.map(person => person.id === resp.id ? personToUpdate : person))
      })
      .catch(error => {
        setMessage(`Information of ${person.name} has already been removed from server`)
        setNotificationClass('error')
          setTimeout(() => {
            setMessage(null)
            setNotificationClass('')
          }, 5000)
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
        .then(response => {
          setMessage(`Added ${response.name}`)
          setNotificationClass('success')
          setTimeout(() => {
            setMessage(null)
            setNotificationClass('')
          }, 5000)

          setPersons(persons.concat(response))
        })
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
      <Notification message={message} notificationClass={notificationClass}/>
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

require('dotenv').config()
const express = require('express')
//const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

/*morgan.token('response-body', function getBody (res) { 
  return JSON.stringify(res.body)
})*/

app.use(express.static('build'))
app.use(express.json())
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :response-body'))
app.use(requestLogger)
app.use(cors())

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(result => {
    const info = `<p>Phonebook has info for ${result.length} people</p><p>${date}</p>`

    response.send(info)
  })
  
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body.name)
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  Person.findOne({'name': body.name})
    .then(result => {
      if(result) {
        return response.status(400).json({ 
          error: 'Name has already been added to phonebook' 
        })
      }
      else {
        const person = new Person ({
          name: body.name,
          number: body.number
        })
      
        person.save().then(person => {
          response.json(person)
        })
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(
    request.params.id, 
    person, 
    {new: true, runValidators: true, context: 'query'}
  )
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
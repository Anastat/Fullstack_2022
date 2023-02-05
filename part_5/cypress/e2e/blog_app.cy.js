describe('Blog app', () => {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'John Smith',
      username: 'smith',
      password: 'qwerty'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in ')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('smith')
      cy.get('#password').type('qwerty')
      cy.get('#login-btn').click()

      cy.contains('John Smith logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('john')
      cy.get('#password').type('1234')
      cy.get('#login-btn').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password!')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })
  
  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST',  `${Cypress.env('BACKEND')}/login`, {
        username: 'smith', password: 'qwerty'
      }).then(response => {
        localStorage.setItem('loggedUser', JSON.stringify(response.body))
        cy.visit('')
      })
    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#title-input').type('React patterns')
      cy.get('#author-input').type('Michael Chan')
      cy.get('#url-input').type('https://reactpatterns.com/')
      cy.get('#create-blog-btn').click()

      cy.contains("A new blog 'React patterns' by Michael Chan added")
      cy.get('#blog-list').contains('React patterns')
    })

    describe(' and one blog created', function() {
      beforeEach(function() {
        cy.contains('New blog').click()
        cy.get('#title-input').type('Canonical string reduction')
        cy.get('#author-input').type('Edsger W. Dijkstra')
        cy.get('#url-input').type('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
        cy.get('#create-blog-btn').click()
      })

      it('a user can like a blog', function() {
        cy.contains('Canonical string reduction').parent().find('.btn-visibility').click()
        cy.contains('Canonical string reduction').parent().find('#add-like-btn').click()

        cy.contains('Canonical string reduction').parent().find('.blog-likes').contains('1')
      })

      it('a user who created a blog can delete it', function() {
        cy.contains('Canonical string reduction').parent().find('.btn-visibility').click()
        cy.contains('Canonical string reduction').parent().find('#delete-blog-btn').click()

        cy.get('#blog-list').should('not.contain', 'Canonical string reduction')
      })

      it('other users do not see the delete button ', function() {
        cy.get('#logout-btn').click()
        cy.request('POST', `${Cypress.env('BACKEND')}/users/`, 
          {name: 'cypress', username: 'test', password: 'qwerty'})
        .then(() => {
          cy.request('POST',  `${Cypress.env('BACKEND')}/login`, {
            username: 'test', password: 'qwerty'
          })
          .then(response => {
            localStorage.setItem('loggedUser', JSON.stringify(response.body))
            cy.visit('')
            cy.contains('Canonical string reduction').parent().find('.btn-visibility').click()
            cy.contains('Canonical string reduction').parent().should('not.contain', 'Delete')
          })
        })
      })
    })

    describe('and there is a list of blogs', function() {
      beforeEach(function() {
        let loggedUser = window.localStorage.getItem('loggedUser')
        const user = JSON.parse(loggedUser)
        cy.request({
          method: 'POST',
          url: `${Cypress.env('BACKEND')}/blogs`, 
          body: {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 22
          }, 
          headers: { Authorization: `bearer ${user.token}`}
        })
        cy.request({
          method: 'POST',
          url: `${Cypress.env('BACKEND')}/blogs`, 
          body: {
            title: 'Type wars',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
            likes: 0
          }, 
          headers: { Authorization: `bearer ${user.token}`}
        })
        cy.request({
          method: 'POST',
          url: `${Cypress.env('BACKEND')}/blogs`, 
          body: {
            title: 'TDD harms architecture',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
            likes: 11
          }, 
          headers: { Authorization: `bearer ${user.token}`}
        })
      })

      it('the blogs are ordered according to likes', function() {
        cy.visit('')

        cy.get('.blog').eq(0).should('contain', 'Canonical string reduction')
        cy.get('.blog').eq(1).should('contain', 'TDD harms architecture')
        cy.get('.blog').eq(2).should('contain', 'Type wars')
      })
    })
  })
})
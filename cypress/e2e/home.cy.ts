/// <reference types="cypress" />

import { getRandomUser, User } from "../util/userProvider"

describe('Home page tests', () => {

    let user: User
    let token: string

    beforeEach(() => {
        user = getRandomUser()
        cy.register(user)
        cy.login(user.username, user.password).then(returnedToken => token = returnedToken)
        cy.visit('http://localhost:8081')
    })

    afterEach(() => {
        cy.request({
            method: 'DELETE',
            url: `http://localhost:4001/users/${user.username}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(resp => {
            expect(resp.status).to.eq(204)
        })
    })

    it('should display at least one user', () => {
        cy.get('li').should('have.length.at.least', 1)
        cy.get('li').contains(`${user.firstName} ${user.lastName}`).should('be.visible')
    })

    it('should have logged out', () => {
        cy.get('#logout').click()
        cy.get('h2').should('have.text', 'Login')
        cy.url().should('contain', 'login')
    })

    it('should open register page', () => {
        cy.get('#addmore').click()
        cy.url().should('contain', 'add-user')
    })

    it('should delete all users except me', () => {
        cy.get('li').each($el => {
            if (!$el.text().includes(`${user.firstName} ${user.lastName}`)) {
                cy.wrap($el).find('.delete').click()
            }
        })
    })
})
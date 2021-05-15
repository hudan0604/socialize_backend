const request = require('supertest')
const app = require('../src/app.config')
const User = require('../src/mongoDB/models/user')

const userOne = {
    firstName: 'ratata',
    lastName: 'Blabla',
    username: 'jacky',
    password: 'jjKkll!7'
}

/**
 * Delete existing users before creating the first one
 * Otherwise the tests will fail because the user we're trying to create already exists
 */
beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should sign up a new user', async () => {
    await request(app).post('/create-user').send({
        firstName: 'jbed',
        lastName: 'dzedzef',
        username: 'jejeje',
        password: 'sdljsdlfb'
    }).expect(200)
}) 

test('Should login existing user', async () => {
    await request(app).post('/users/log-in').send({
        username: userOne.username,
        password: userOne.password
    }).expect(200)
}) 

test('Should not login non existing user', async () => {
    await request(app).post('/users/log-in').send({
        username: 'fake',
        password: 'fakePassword!'
    }).expect(400)
})


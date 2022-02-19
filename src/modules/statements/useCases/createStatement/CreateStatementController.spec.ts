import request  from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection:Connection
describe('Create Statement Controller integration test', () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
        await request(app).post('/api/v1/users').send({
            "name": "Eduardo",
            "email": "bls.dudu@mail.com",
            "password": "1234"
        })

    })
    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })
    it('Should be able to make a deposit', async () => {
      const authenticationResponse = await request(app).post('/api/v1/sessions').send({
        "email": "bls.dudu@mail.com",
        "password": "1234"
    })
      const { token } = authenticationResponse.body
        const response = await request(app).post('/api/v1/statements/deposit').send({
          amount: 500,
          description: 'Salario pra muié gasta'
        }).set({
          Authorization: `Bearer ${token}`
        })
        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('id')
    })
    it('Should be able to withdraw money', async () => {
      const authenticationResponse = await request(app).post('/api/v1/sessions').send({
        "email": "bls.dudu@mail.com",
        "password": "1234"
    })
      const { token } = authenticationResponse.body
        const response = await request(app).post('/api/v1/statements/withdraw').send({
          amount: 450,
          description: 'Salario que entra'
        }).set({
          Authorization: `Bearer ${token}`
        })
        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('id')
    })
    it('Should not be able to withdraw money if trying to withdraw more than have in the account', async () => {
      const authenticationResponse = await request(app).post('/api/v1/sessions').send({
        "email": "bls.dudu@mail.com",
        "password": "1234"
    })
      const { token } = authenticationResponse.body
        const response = await request(app).post('/api/v1/statements/withdraw').send({
          amount: 800,
          description: 'Salario que a muié gostaria de gastar'
        }).set({
          Authorization: `Bearer ${token}`
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.message).toBe('Insufficient funds')
    })
  

})
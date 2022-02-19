import request  from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection:Connection
describe('Get Balance controller integration test', () => {
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
    it('Should be able to get the correct balance', async () => {
      const authenticationResponse = await request(app).post('/api/v1/sessions').send({
        "email": "bls.dudu@mail.com",
        "password": "1234"
    })
      const { token } = authenticationResponse.body
      await request(app).post('/api/v1/statements/deposit').send({
        amount: 500,
        description: 'Salario pra muié gasta'
      }).set({
        Authorization: `Bearer ${token}`
      })
      await request(app).post('/api/v1/statements/withdraw').send({
        amount: 450,
        description: 'Salario que entra'
      }).set({
        Authorization: `Bearer ${token}`
      })
        const response = await request(app).get('/api/v1/statements/balance').send().set({
          Authorization: `Bearer ${token}`
        })
        expect(response.body.statement.length).toBe(2)
        expect(response.body).toHaveProperty('balance')
        expect(response.body.balance).toBe(50)
    })
  

})
import request  from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database'
let connection:Connection

describe('GetStatementOperations controller integration test', () => {
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
    it('Should be able to get the opetarions by statements id', async () => {
      const authenticationResponse = await request(app).post('/api/v1/sessions').send({
        "email": "bls.dudu@mail.com",
        "password": "1234"
    })
      const { token } = authenticationResponse.body
      const depositResponse = await request(app).post('/api/v1/statements/deposit').send({
        amount: 500,
        description: 'Salario pra muié gasta'
      }).set({
        Authorization: `Bearer ${token}`
      })
      const withdrawResponse = await request(app).post('/api/v1/statements/withdraw').send({
        amount: 450,
        description: 'Salario que entra'
      }).set({
        Authorization: `Bearer ${token}`
      })
        const getDepositResponse = await request(app).get(`/api/v1/statements/${depositResponse.body.id}`).send().set({
          Authorization: `Bearer ${token}`
        })
        expect(getDepositResponse.body).toHaveProperty('amount')
        expect(getDepositResponse.body.type).toBe('deposit')
        const getWithdrawResponse = await request(app).get(`/api/v1/statements/${withdrawResponse.body.id}`).send().set({
          Authorization: `Bearer ${token}`
        })
        expect(getWithdrawResponse.body).toHaveProperty('amount')
        expect(getWithdrawResponse.body.type).toBe('withdraw')
    })
  

})
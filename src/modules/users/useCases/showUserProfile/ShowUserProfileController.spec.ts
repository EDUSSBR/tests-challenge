import request  from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database'
let connection:Connection

describe('Show User Profile controller integration test', () => {
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
    it('Should get user profile info', async () => {
      const authenticationResponse = await request(app).post('/api/v1/sessions').send({
        "email": "bls.dudu@mail.com",
        "password": "1234"
    })
      const { token } = authenticationResponse.body
        const response = await request(app).get('/api/v1/profile').send().set({
          Authorization: `Bearer ${token}`
        })
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
    })
  

})
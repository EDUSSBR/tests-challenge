import request  from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection:Connection
describe('Authenticate User controller integration test', () => {
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
    it('Should return a token if user exists and password is correct', async () => {
        const response = await request(app).post('/api/v1/sessions').send({
            "email": "bls.dudu@mail.com",
            "password": "1234"
        })
        expect(response.body).toHaveProperty('token')
    })
    it('Should return a statusCode 401 when user not found', async () => {
        const response = await request(app).post('/api/v1/sessions').send({
            "email": "bls.dudu1111@mail.com",
            "password": "1234"
        })
        expect(response.statusCode).toBe(401)
    })
  

})
import request  from 'supertest'
import { Connection } from 'typeorm'
import { app } from '../../../../app'
import createConnection from '../../../../database'

let connection:Connection
describe('Create User controller integration test', () => {
    beforeAll(async () => {
        connection = await createConnection()
        await connection.runMigrations()
    })
    afterAll(async () => {
        await connection.dropDatabase()
        await connection.close()
    })
    it('Should create a new user', async () => {
        const response = await request(app).post('/api/v1/users').send({
            "name": "Eduardo",
            "email": "bls.dudu@mail.com",
            "password": "1234"
        })
        expect(response.statusCode).toBe(201)
    })
    it('Should not be able to create a user if already exists', async () => {
        await request(app).post('/api/v1/users').send({
            "name": "Eduardo",
            "email": "bls.dudu@mail.com",
            "password": "1234"
        })
        const response = await request(app).post('/api/v1/users').send({
            "name": "Eduardo",
            "email": "bls.dudu@mail.com",
            "password": "1234"
        })
        expect(response.statusCode).toBe(400)
    })

})
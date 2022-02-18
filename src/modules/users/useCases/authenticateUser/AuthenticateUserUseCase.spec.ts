import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository' 
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase 
let createUserUsecase: CreateUserUseCase


describe('AuthenticateUserUseCase', () => {
    beforeEach(async () => {
         inMemoryUsersRepository = new InMemoryUsersRepository()
         authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
         createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository)
         await createUserUsecase.execute({
            name: 'Eduardo',
            email: 'bls.dudu@gmail.com',
            password: '123456' })
        })
    it('Should return a token when everything is correct', async () => {
        const userInformation = {
            email: 'bls.dudu@gmail.com',
            password: '123456' 
        }
        const returnedObject = await authenticateUserUseCase.execute(userInformation)
        expect(returnedObject).toHaveProperty('token')
    })
    it('Should not be able to authenticate a non existent user', () => {
        expect(async () => {
            await authenticateUserUseCase.execute({email: 'ok', password: '123456'})
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
    
    it('Should not be able to authenticate an user with incorrect password', () => {
        expect(async () => {
            await authenticateUserUseCase.execute({email: 'bls.dudu@gmail.com', password: '12345'})
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository' 
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { User } from '../../entities/User'
import { AuthenticateUserUseCase } from '../authenticateUser/AuthenticateUserUseCase'
import { ShowUserProfileError } from './ShowUserProfileError'

let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase: ShowUserProfileUseCase 
let createUserUsecase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let user_id: string

describe('AuthenticateUserUseCase', () => {
    beforeEach(async () => {
         inMemoryUsersRepository = new InMemoryUsersRepository()
         authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
         showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
         createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository)
         await createUserUsecase.execute({
            name: 'Eduardo',
            email: 'bls.dudu@gmail.com',
            password: '123456' })      
            const received_auth= await authenticateUserUseCase.execute({
              email: 'bls.dudu@gmail.com',
              password: '123456' })
            if (typeof(received_auth.user.id) == 'string'){
            user_id = received_auth.user.id
            }
          })
    it('Should show user profile when it exists', async () => {
        const returnedObject = await showUserProfileUseCase.execute(user_id)
        expect(returnedObject).toBeInstanceOf(User)
    })
    it('Should not show user profile if not exists', async () => {
        expect(async () => {
          await showUserProfileUseCase.execute('1234')
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})
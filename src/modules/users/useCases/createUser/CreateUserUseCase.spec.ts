import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase'
import { ICreateUserDTO } from './ICreateUserDTO';
import { hash } from 'bcryptjs'

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let user:ICreateUserDTO

describe('Create User Unit tests', () =>{
    function createUser(
        name= 'Eduardo',
        email= 'bls.dudu@gmail.com',
        password= '123456'
      ) {
        return { name, email, password }
    }

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        user = createUser()
    })

    it('Should be able to create a new user', async () =>{ 
        const userReturned = await createUserUseCase.execute(user)
        expect(userReturned).toBeTruthy()
    })
    it('Should not be able o create another user with the same e-mail', async () => {
        expect(async  () => {
            const firstUserReturned = await createUserUseCase.execute(user)
            const secondUserReturned = await createUserUseCase.execute(user)
        }).rejects.toBeInstanceOf(CreateUserError)
    })
})
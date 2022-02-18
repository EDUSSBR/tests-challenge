import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { OperationType, Statement } from '../../entities/Statement'
import { GetBalanceUseCase } from "./GetBalanceUseCase"
import { GetBalanceError } from "./GetBalanceError"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUsecase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let user_id: string
let statementDTO: ICreateStatementDTO
let statementDTO1: ICreateStatementDTO
let getBalanceUseCase: GetBalanceUseCase

interface IResponse {
  statement: Statement[];
  balance: number;
}

function createDepositStatement(amount: number){
  return { user_id, type: OperationType.DEPOSIT, amount, description:'test2' }
}

function createWithdrawStatement(amount: number){
  return { user_id, type: OperationType.WITHDRAW, amount, description:'test2' }
}

describe('AuthenticateUserUseCase', () => {
    beforeEach(async () => {
         inMemoryStatementsRepository = new InMemoryStatementsRepository()
         inMemoryUsersRepository = new InMemoryUsersRepository()
         authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
         createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository)
         createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
         getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
         await createUserUsecase.execute({
            name: 'Eduardo',
            email: 'bls.dudu@gmail.com',
            password: '123456' })      
            const received_auth= await authenticateUserUseCase.execute({
              email: 'bls.dudu@gmail.com',
              password: '123456' })
            if (typeof(received_auth.user.id) == 'string'){
            user_id = received_auth.user.id
              statementDTO = createDepositStatement(100)
              statementDTO1 = createWithdrawStatement(49)
          }
          await createStatementUseCase.execute(statementDTO)
          await createStatementUseCase.execute(statementDTO1)
          })
        it('Should be able to get the correct balance', async () => {
            const returnedObject = await getBalanceUseCase.execute({user_id})
            expect(returnedObject).toHaveProperty('statement')
            expect(returnedObject).toHaveProperty('balance')
            expect(returnedObject.balance).toBe(51)
        })
        it('Should reject if user doesnt exists', async () => {
          expect(async () => {
            await getBalanceUseCase.execute({user_id: '123'})
          }).rejects.toBeInstanceOf(GetBalanceError)
      })
      })
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO"
import { OperationType, Statement } from '../../entities/Statement'
import { CreateStatementError } from "./CreateStatementError"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUsecase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let user_id: string
let statementDTO: ICreateStatementDTO
let statementDTO1: ICreateStatementDTO
let statementDTO2: ICreateStatementDTO

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
              statementDTO1 = createWithdrawStatement(50)
              statementDTO2 = createWithdrawStatement(200)
          }
          })
        it('Should be able to create a new statement', async () => {
            const returnedObject = await createStatementUseCase.execute(statementDTO)
            expect(returnedObject).toBeInstanceOf(Statement)
        })
        it('Should reject if the user id is incorrect', async () => {
          expect(async () => {
            Object.assign(statementDTO, {user_id: '1234'})
            await createStatementUseCase.execute(statementDTO)
          }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
        })
        it('Should be able to make deposit', async () => {
          const returnedStatement = await createStatementUseCase.execute(statementDTO)
          expect(returnedStatement.amount).toBeTruthy()
        })
        it('Should be able to withdraw when the balance is bigger than the amount in the account', async () => {
          await createStatementUseCase.execute(statementDTO)
          const returnedStatement = await createStatementUseCase.execute(statementDTO1)
          expect(returnedStatement.amount).toBeTruthy()
        })
        it('Should not be able to withdraw when the balance is smaller than the amount in the account', async () => {
          expect(async () => {await createStatementUseCase.execute(statementDTO)
          const returnedStatement = await createStatementUseCase.execute(statementDTO2)
          }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
        })
      })
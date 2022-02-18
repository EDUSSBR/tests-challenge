import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { OperationType, Statement } from '../../entities/Statement'
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase"
import { GetBalanceError } from "../getBalance/GetBalanceError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUsecase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let user_id: string
let statementDTO: ICreateStatementDTO
let statementDTO1: ICreateStatementDTO
let getStatementOperationUseCase: GetStatementOperationUseCase
let statement_id: string

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
         getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
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
          const returnedStatement = await createStatementUseCase.execute(statementDTO)
          if (typeof(returnedStatement.id) == 'string'){
          statement_id = returnedStatement.id
          }

          })
        it('Should be able to get the statement by id', async () => {
            const returnedObject = await getStatementOperationUseCase.execute({user_id, statement_id})
            expect(returnedObject).toBeInstanceOf(Statement)
        })
        it('Should not be able to get a statement if user is not found', async () => {
          expect(async () => {
            await getStatementOperationUseCase.execute({user_id:'123', statement_id})
          }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
        })
       
        it('Should not be able to get a statement if it does not exists', async () => {
          expect(async () => {
            await getStatementOperationUseCase.execute({user_id, statement_id: '123'})
          }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
      })
    })
    
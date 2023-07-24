import express from 'express'
import { verifyJwt } from '../middlewears/verifyJwt'
import { getUsers, login } from '../controller/userController'

const userRouter = express.Router()


userRouter.post('/login', login)
userRouter.get('/', verifyJwt,getUsers)

export default userRouter
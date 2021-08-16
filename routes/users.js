import { Router } from 'express'
import * as usersCtrl from '../controllers/users.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
// IF YOU NEED ACCESS TO req.user, IT MUST GO BENEATH:
router.use(decodeUserFromToken)
router.get('/', checkAuth, usersCtrl.index)
router.get('/userProfile', checkAuth, usersCtrl.userProfile)
router.patch('/friend/:id', checkAuth, usersCtrl.friend)
router.patch('/unfriend/:id', checkAuth, usersCtrl.unfriend)



export { router }
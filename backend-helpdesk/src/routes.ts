import { Router } from 'express';
import multer from 'multer';

import { CreateUserController } from './controllers/CreateUserController';
import { AuthUserController } from './controllers/AuthUserController';
import { CreateTicketController } from './controllers/CreateTicketController';
import { ListTicketsController } from './controllers/ListTicketsController';
import { UpdateTicketController } from './controllers/UpdateTicketController';
import { DashboardMetricController } from './controllers/DashboardMetricController';
import { CreateClientController } from './controllers/CreateClientController'; 

import { isAuthenticated } from './middlewares/isAuthenticated';
import uploadConfig from './config/multer';

const router = Router();
const upload = multer(uploadConfig.upload('./tmp'));

const createUserController = new CreateUserController();
const authUserController = new AuthUserController();
const createTicketController = new CreateTicketController();
const listTicketsController = new ListTicketsController();
const updateTicketController = new UpdateTicketController();
const dashboardMetricController = new DashboardMetricController();
const createClientController = new CreateClientController();

// Rotas Usuário
router.post('/users', createUserController.handle);
router.post('/session', authUserController.handle);

// Rotas Chamados
router.get('/tickets', isAuthenticated, listTicketsController.handle);
router.post('/tickets', isAuthenticated, upload.single('file'), createTicketController.handle);
router.put('/tickets/update', isAuthenticated, updateTicketController.handle);

router.get('/metrics', isAuthenticated, dashboardMetricController.handle);
router.post('/users/client', isAuthenticated, createClientController.handle);

export { router };
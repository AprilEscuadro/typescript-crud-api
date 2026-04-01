import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../_middleware/validateRequest';
import { employeeService } from './employee.service';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

export default router;

function getAll(req: Request, res: Response, next: NextFunction): void {
    employeeService.getAll()
        .then((emps) => res.json(emps))
        .catch(next);
}

function getById(req: Request, res: Response, next: NextFunction): void {
    employeeService.getById(Number(req.params.id))
        .then((emp) => res.json(emp))
        .catch(next);
}

function create(req: Request, res: Response, next: NextFunction): void {
    employeeService.create(req.body)
        .then(() => res.json({ message: 'Employee created' }))
        .catch(next);
}

function update(req: Request, res: Response, next: NextFunction): void {
    employeeService.update(Number(req.params.id), req.body)
        .then(() => res.json({ message: 'Employee updated' }))
        .catch(next);
}

function _delete(req: Request, res: Response, next: NextFunction): void {
    employeeService.delete(Number(req.params.id))
        .then(() => res.json({ message: 'Employee deleted' }))
        .catch(next);
}

function createSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeNumber: Joi.string().required(),
        userEmail: Joi.string().email().required(),
        position: Joi.string().required(),
        departmentId: Joi.number().required(),
        hireDate: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction): void {
    const schema = Joi.object({
        employeeNumber: Joi.string().empty(''),
        userEmail: Joi.string().email().empty(''),
        position: Joi.string().empty(''),
        departmentId: Joi.number().empty(''),
        hireDate: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}
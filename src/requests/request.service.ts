import { db } from '../_helpers/db';
import { Request, RequestCreationAttributes } from './request.model';

export const requestService = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll(): Promise<Request[]> {
    return await db.Request.findAll();
}

async function getById(id: number): Promise<Request> {
    return await getRequest(id);
}

async function create(params: RequestCreationAttributes): Promise<void> {
    await db.Request.create({
        ...params,
        items: JSON.stringify(params.items),
        status: 'Pending',
        date: new Date().toISOString()
    });
}

async function update(id: number, params: Partial<RequestCreationAttributes>): Promise<void> {
    const req = await getRequest(id);
    await req.update(params);
}

async function _delete(id: number): Promise<void> {
    const req = await getRequest(id);
    await req.destroy();
}

async function getRequest(id: number): Promise<Request> {
    const req = await db.Request.findByPk(id);
    if (!req) throw new Error('Request not found');
    return req;
}
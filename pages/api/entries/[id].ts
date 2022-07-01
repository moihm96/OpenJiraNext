import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { db } from '../../../database';
import { Entry, IEntry } from '../../../models';

type Data =
    | { message: string }
    | IEntry
    | null


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {




    switch (req.method) {
        case 'GET':
            return getEntryById(res, req);
        case 'PUT':
            return updateEntry(res, req);

        default:
            return res.status(400).json({ message: 'Metodo no existe' });
    }
}

const getEntryById = async (res: NextApiResponse<Data>, req: NextApiRequest) => {
    const { id } = req.query;

    await db.connect();

    const entryById = await Entry.findById(id);

    await db.disconnect();

    if (!entryById) {

        return res.status(400).json({ message: 'No hay entrada con el siguiente: ' + id });
    }

    res.status(200).json(entryById!);
}

const updateEntry = async (res: NextApiResponse<Data>, req: NextApiRequest) => {

    const { id } = req.query;

    await db.connect();

    const entryToUpdate = await Entry.findById(id);

    if (!entryToUpdate) {
        await db.disconnect();
        return res.status(400).json({ message: 'No hay entrada con el siguiente: ' + id });
    }

    const
        {
            description = entryToUpdate.description,
            status = entryToUpdate.status
        } = req.body;

    try {
        const updatedEntry = await Entry.findByIdAndUpdate(id, { description, status }, { runValidators: true, new: true });
        await db.disconnect();
        res.status(200).json(updatedEntry!);

    } catch (error: any) {
        await db.disconnect();
        res.status(400).json({ message: error.errors.status.message });
    }


}
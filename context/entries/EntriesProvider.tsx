import { FC, useEffect, useReducer } from 'react';
import { entriesApi } from '../../apis';
import { Entry } from '../../interfaces';
import { EntriesContext, entriesReducer } from './';
import { useSnackbar } from 'notistack';

export interface EntriesState {
    entries: Entry[];
    isAdding: false;
}

const Entries_INITIAL_STATE: EntriesState = {
    entries: [],

    isAdding: false
}

interface Props {
    children: JSX.Element
}

export const EntriesProvider: FC<Props> = ({ children }) => {

    useEffect(() => {
        refreshEntries();
    }, []);

    const { enqueueSnackbar } = useSnackbar();


    const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE)

    const addEntry = async (description: string) => {

        const { data } = await entriesApi.post<Entry>('/entries', { description });

        dispatch({ type: '[Entry] - Add-Entry', payload: data });
    }

    const updateEntry = async ({ _id, description, status }: Entry, showSnackbar = false) => {
        try {

            const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, { description, status });

            dispatch({ type: '[Entry] - Entry-Updated', payload: data });

            if (showSnackbar) {
                enqueueSnackbar('Entrada actualizada', {
                    variant: 'success',
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    }
                })
            }

        } catch (error) {
            console.log(error);
        }

    }

    const refreshEntries = async () => {
        const { data } = await entriesApi.get<Entry[]>('/entries');
        dispatch({ type: '[Entry] - Initial-Entry', payload: data })
    }

    return (
        <EntriesContext.Provider value={{
            ...state,

            //Methods

            addEntry,
            updateEntry
        }}>
            {children}
        </EntriesContext.Provider>
    )
};
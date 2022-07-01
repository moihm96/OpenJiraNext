import React, { ChangeEvent, useState, useContext } from 'react';
import { Button, Box, TextField } from '@mui/material';

import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { EntriesContext } from '../../context/entries';
import { UIContext } from '../../context/ui';


export const NewEntry = () => {

    const [inputValue, setInputValue] = useState('');

    const [touched, setTouched] = useState(false);

    const { addEntry } = useContext(EntriesContext);

    const { isAddingEntry, setIsAddingEntry } = useContext(UIContext);

    const onTextFieldChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

        setInputValue(event.target.value);
    }

    const onSave = () => {
        if (inputValue.length === 0) return;

        addEntry(inputValue);

        setIsAddingEntry(false);

        setTouched(false);

        setInputValue('');
    }

    return (
        <Box sx={{ marginTop: 2, padding: 2 }}>
            {
                isAddingEntry ?
                    (
                        <>
                            <TextField
                                fullWidth
                                sx={{ marginTop: 2, marginBottom: 1 }}
                                placeholder='Nueva entrada'
                                autoFocus
                                multiline
                                label='Nueva entrada'
                                helperText={inputValue.length <= 0 && touched && "Ingrese un valor"}
                                error={inputValue.length <= 0 && touched}
                                value={inputValue}
                                onBlur={() => setTouched(true)}
                                onChange={onTextFieldChange}
                            />
                            <Box display='flex' justifyContent='space-between'>
                                <Button
                                    variant='text'
                                    onClick={() => setIsAddingEntry(false)}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    endIcon={<SaveOutlinedIcon />}
                                    onClick={onSave}
                                >
                                    Guardar
                                </Button>
                            </Box>
                        </>
                    )

                    :

                    (
                        <Button
                            startIcon={<AddCircleOutlineOutlinedIcon />}
                            fullWidth
                            variant='outlined'
                            onClick={() => setIsAddingEntry(true)}

                        >
                            Agregar tarea
                        </Button>
                    )
            }




        </Box>
    )
}

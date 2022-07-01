import { useState, ChangeEvent, useMemo, FC, useContext } from 'react';
import {
    capitalize, Card, CardHeader, Grid, CardContent, TextField,
    CardActions, Button, FormControl, FormLabel, RadioGroup,
    FormControlLabel, Radio, IconButton
}
    from "@mui/material";
import { Layout } from "../../components/layouts";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Entry, EntryStatus } from "../../interfaces";

import { GetServerSideProps } from 'next'

import { dbEntries } from '../../database';

import { EntriesContext } from '../../context/entries';
import { dateFunctions } from '../../utils';

const validStatus: EntryStatus[] = ['pending', 'in-progress', 'finished'];

interface Props {
    entry: Entry
}
const EntryPage: FC<Props> = ({ entry }) => {

    const { updateEntry } = useContext(EntriesContext);

    const [inputValue, setInputValue] = useState(entry.description);

    const [status, setStatus] = useState<EntryStatus>(entry.status);

    const [touched, setTouched] = useState(false);

    const onInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {

        setInputValue(event.target.value);
    }

    const onStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
        setStatus(event.target.value as EntryStatus);
    }

    const onSaved = () => {

        if (inputValue.trim().length === 0) return;

        const updatedEntry: Entry = {
            ...entry,
            status,
            description: inputValue
        }

        updateEntry(updatedEntry, true);


    }

    const isNotValid = useMemo(() => inputValue.length <= 0 && touched, [inputValue, touched])

    return (
        <Layout title={inputValue.substring(0, 10) + '...'}>
            <Grid>
                <Grid
                    container
                    justifyContent='center'
                    sx={{ marginTop: 2 }}
                >
                    <Grid item xs={12} sm={8} md={6} >
                        <Card>
                            <CardHeader
                                title="Entrada:"
                                subheader={`Creada hace: ${dateFunctions.getFormatDistanceToNow(entry.createdAt)}`}
                            />
                            <CardContent>
                                <TextField
                                    sx={{ marginTop: 2, marginBottom: 1 }}
                                    fullWidth
                                    placeholder="Nueva entrada"
                                    autoFocus
                                    multiline
                                    label="Nueva entrada"
                                    value={inputValue}
                                    onChange={onInputValueChange}
                                    helperText={isNotValid && 'Ingrese un valor'}
                                    onBlur={() => setTouched(true)}
                                    error={isNotValid}
                                />
                                <FormControl>
                                    <FormLabel>Estado: </FormLabel>
                                    <RadioGroup
                                        row
                                        value={status}
                                        onChange={onStatusChange}
                                    >
                                        {
                                            validStatus.map(option => (
                                                <FormControlLabel
                                                    key={option}
                                                    value={option}
                                                    control={<Radio />}
                                                    label={capitalize(option)}

                                                />
                                            ))
                                        }
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>

                            <CardActions>
                                <Button
                                    startIcon={<SaveOutlinedIcon />}
                                    variant="contained"
                                    fullWidth
                                    onClick={onSaved}
                                    disabled={inputValue.length <= 0}
                                >
                                    Guardar
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                </Grid>

                <IconButton
                    sx={{
                        position: 'fixed',
                        bottom: 30,
                        right: 30,
                        backgroundColor: 'error.dark'
                    }}
                >
                    <DeleteOutlinedIcon />
                </IconButton>
            </Grid>
        </Layout>
    )
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { id } = params as { id: string };

    const entry = await dbEntries.getEntryById(id);

    if (!entry) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            entry
        }
    }
}

export default EntryPage;

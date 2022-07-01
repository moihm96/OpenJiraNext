import React, { FC, useMemo, useContext, DragEvent } from 'react';

import { Paper, List } from '@mui/material';
import { EntryCard } from './';
import { EntryStatus } from '../../interfaces';
import { EntriesContext } from '../../context/entries';
import { UIContext } from '../../context/ui';

import styles from './EntryList.module.css';

interface Props {
    status: EntryStatus;
    children?: JSX.Element;
}
export const EntryList: FC<Props> = ({ status, children }) => {

    const { entries, updateEntry } = useContext(EntriesContext);

    const { isDragging, endDragging } = useContext(UIContext);

    const entriesByStatus = useMemo(() => entries.filter(entry => entry.status === status), [entries]);

    const onDropEntry = (event: DragEvent<HTMLDivElement>) => {
        const id = event.dataTransfer.getData('text');

        const entry = entries.find(e => e._id === id)!;
        entry.status = status;

        updateEntry(entry);
        endDragging();

    }

    const allowdrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    return (
        <div
            onDrop={onDropEntry}
            onDragOver={allowdrop}
            className={isDragging ? styles.dragging : ''}
        >
            <Paper sx={{ height: 'calc(100vh - 180px)', overflow: 'scroll', backgroundColor: 'transparent', padding: '1px 5px' }}>
                <List sx={{ opacity: isDragging ? 0.2 : 1, transition: 'all .3s' }}>
                    {
                        entriesByStatus.map(entry => (
                            <EntryCard key={entry._id} entry={entry} />
                        ))
                    }

                </List>
            </Paper>
        </div>
    )
}
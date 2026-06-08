'use client'
import {ListView, ListViewItem, type Selection} from '@react-spectrum/s2/ListView';
import {ActionBar, ActionButton} from '@react-spectrum/s2/ActionBar';
import Delete from '@react-spectrum/s2/icons/Delete';
import {Dispatch, SetStateAction, useState} from 'react';
import { TextField } from '@react-spectrum/s2/TextField';
import { Button } from '@react-spectrum/s2/Dialog';

export default function List({ name, values, setValues }: {
    name: string,
    values: Set<string>,
    setValues: Dispatch<SetStateAction<Set<string>>>,
}) {
  const [selected, setSelected] = useState<Selection>(new Set());
  const [text, setText] = useState<string>("");

  const handleDeleteValue = (selection: string) => {
    const newSet = new Set(Array.from(values));
    if (selection === 'all') {
        newSet.clear();
    }
    if (selection.includes(',')) {
        const splat = selection.split(',');
        splat.forEach(value => newSet.delete(value.trim()));
    }
    newSet.delete(selection);
    
    setSelected(new Set([]));
    setValues(newSet);
  }
  return (
    <div className='flex flex-col gap-3'>
        <h4>{name}</h4>
        <div className='w-full flex flex-row gap-3 justify-center items-end'>
            <TextField aria-label={name} value={text} onChange={setText} />
            <Button type='button' onPress={() => { 
                setValues(prev => {
                    const newSet = new Set(Array.from(prev));
                    newSet.add(text);
                    return newSet;
                });
                setText("");
            }}>Add</Button>
        </div>

        <ListView
        aria-label={name}
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        renderActionBar={(selectedKeys) => {
            let selection = selectedKeys === 'all' ? 'all' : [...selectedKeys].join(', ');
            return (
                <ActionBar>
                <ActionButton aria-label="Delete" onPress={() => handleDeleteValue(selection)}>
                    <Delete />
                </ActionButton>
                </ActionBar>
            );
            }}>
            {
                values && Array.from(values).map(value => <ListViewItem id={value} key={value}>{value}</ListViewItem>)
            }
        </ListView>
    </div>
  );
}
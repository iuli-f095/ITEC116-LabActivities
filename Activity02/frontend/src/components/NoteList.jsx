import React from 'react';
import NoteItem from './NoteItem';

const NoteList = ({ notes, onUpdateNote, onDeleteNote }) => {
  if (notes.length === 0) {
    return (
      <div className="note-card">
        <p>No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          onUpdate={onUpdateNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
};

export default NoteList;
import React, { useState } from 'react';
import NoteForm from './NoteForm';

const NoteItem = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updatedData) => {
    onUpdate(note.id, updatedData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };

  if (isEditing) {
    return (
      <NoteForm
        onSubmit={handleUpdate}
        initialData={note}
        onCancel={() => setIsEditing(false)}
        submitText="Update Note"
      />
    );
  }

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
      </div>
      <div className="note-content">
        <pre style={{ 
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          fontFamily: 'inherit',
          margin: 0,
          lineHeight: '1.5'
        }}>
          {note.content}
        </pre>
      </div>
      <div className="note-meta">
        <small>
          Last updated: {new Date(note.updated_at).toLocaleDateString()}
        </small>
      </div>
      <div className="note-actions">
        <button 
          className="btn btn-secondary" 
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button 
          className="btn btn-danger" 
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteItem;
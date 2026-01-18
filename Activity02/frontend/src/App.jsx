import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import NoteForm from './components/NoteForm';
import NoteList from './components/NoteList';
import { notesAPI } from './services/api';

function App() {
  const { user, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState('login');
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    setNotesLoading(true);
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const response = await notesAPI.create(noteData);
      setNotes(prevNotes => [response.data, ...prevNotes]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (id, noteData) => {
    try {
      const response = await notesAPI.update(id, noteData);
      setNotes(prevNotes =>
        prevNotes.map(note => (note.id === id ? response.data : note))
      );
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await notesAPI.delete(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!user) {
    return currentView === 'login' ? (
      <Login switchToRegister={() => setCurrentView('register')} />
    ) : (
      <Register switchToLogin={() => setCurrentView('login')} />
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>Manage your personal notes</p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>

      <NoteForm onSubmit={handleCreateNote} />

      <div style={{ marginTop: '40px' }}>
        <h2>Your Notes</h2>
        {notesLoading ? (
          <p>Loading notes...</p>
        ) : (
          <NoteList
            notes={notes}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        )}
      </div>
    </div>
  );
}

export default App;
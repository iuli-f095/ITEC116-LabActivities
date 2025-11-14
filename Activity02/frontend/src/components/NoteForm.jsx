import React, { useState } from 'react';

const NoteForm = ({ onSubmit, initialData = {}, onCancel, submitText = 'Create Note' }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      const newContent = formData.content.substring(0, start) + '\t' + formData.content.substring(end);
      
      setFormData({
        ...formData,
        content: newContent
      });
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 1;
      }, 0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData);
      if (!initialData.id) {
        setFormData({ title: '', content: '' });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-card">
      <div className="form-group">
        <input
          type="text"
          name="title"
          placeholder="Note Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          name="content"
          placeholder="Note Content"
          value={formData.content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          required
          rows="8"
          style={{
            fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        />
      </div>
      <div className="note-actions">
        <button type="submit" className="btn btn-primary">
          {submitText}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;
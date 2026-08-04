import React from 'react';
import { NotesView } from '../../components/notes/NotesView';
import { useApp } from '../../contexts/AppContext';

// Trang Notes: bọc NotesView và lấy data từ AppContext
const NotesPage: React.FC = () => {
  const {
    appState,
    setInspectedObject,
    handleAddNote,
    handleAddQuickNote,
  } = useApp();

  return (
    <NotesView
      quickNotes={appState.quickNotes}
      notes={appState.notes}
      boxes={appState.boxes}
      tags={appState.tags}
      onAddNote={handleAddNote}
      onAddQuickNote={handleAddQuickNote}
      onSelectObject={setInspectedObject}
    />
  );
};

export default NotesPage;

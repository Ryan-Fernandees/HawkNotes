const notesContainer = document.getElementById('notes-container');
const addBtn = document.getElementById('add-btn');
const noteText = document.getElementById('note-text');
let isEditing = false;
let editNoteId = null;

function getNotesFromStorage() {
  const notes = localStorage.getItem('notes');
  return notes ? JSON.parse(notes) : [];
}

function setNotesToStorage(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function displayNotes() {
  const notes = getNotesFromStorage();
  notesContainer.innerHTML = '';
  notes.forEach((note) => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `
      <p class="note-text">${note.text}</p>
      <div class="note-buttons">
        <button class="edit-btn" data-note-id="${note.id}">Editar Nota</button>
        <button class="delete-btn" data-note-id="${note.id}">Remover Nota</button>
      </div>`;
    notesContainer.appendChild(noteElement);

    const deleteBtn = noteElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      const noteId = deleteBtn.dataset.noteId;
      const newNotes = notes.filter((n) => n.id !== Number(noteId));
      setNotesToStorage(newNotes);
      displayNotes();
    });

    const editBtn = noteElement.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
      const noteId = editBtn.dataset.noteId;
      const noteToEdit = notes.find((n) => n.id === Number(noteId));
      noteText.value = noteToEdit.text;
      isEditing = true;
      editNoteId = noteId;
      addBtn.textContent = 'Atualizar Nota';
    });
  });
}

function addOrUpdateNoteHandler() {
  const newNoteText = noteText.value.trim();
  if (newNoteText) {
    let notes = getNotesFromStorage();
    if (isEditing && editNoteId !== null) {
      // Atualizar nota existente
      const noteIndex = notes.findIndex((n) => n.id === Number(editNoteId));
      notes[noteIndex].text = newNoteText;
      isEditing = false;
      editNoteId = null;
      addBtn.textContent = 'Adicionar Outra Nota';
    } else {
      // Adicionar nova nota
      const newNote = {
        id: Date.now(),
        text: newNoteText,
      };
      notes.push(newNote);
    }
    setNotesToStorage(notes);
    displayNotes();
    noteText.value = '';
  }
}

addBtn.addEventListener('click', addOrUpdateNoteHandler);

displayNotes();

const notesContainer = document.getElementById('notesContainer');
const newNoteBtn = document.getElementById('newNote');
const themeToggle = document.getElementById('themeToggle');

// Carregar notas do localStorage
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Inicializar
function init() {
    // Adiciona uma nota inicial se não houver nenhuma
    if (notes.length === 0) {
        notes.push({ title: '', content: '' });
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    renderNotes();
    updateThemeButton();
    toggleScrollToTopButton(); // Adiciona esta linha
}

// Renderizar notas
function renderNotes() {
    notesContainer.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = createNoteElement(note, index);
        notesContainer.appendChild(noteElement);
    });
}

// Criar elemento de nota
function createNoteElement(note, index) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note';
    noteDiv.innerHTML = `
        <div class="note-header">
            <input type="text" class="note-title" value="${note.title || 'Nova Nota'}" placeholder="Título">
            <textarea class="note-content" placeholder="Comece a escrever...">${note.content}</textarea>
        </div>
        <div class="note-actions">
            <button class="icon-btn edit-btn"><i class="fas fa-edit"></i></button>
            <button class="icon-btn download-btn"><i class="fas fa-download"></i></button>
            <button class="icon-btn delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Event listeners
    const deleteBtn = noteDiv.querySelector('.delete-btn');
    const editBtn = noteDiv.querySelector('.edit-btn');
    const downloadBtn = noteDiv.querySelector('.download-btn');
    const titleInput = noteDiv.querySelector('.note-title');
    const contentInput = noteDiv.querySelector('.note-content');

    // Atualizar em tempo real
    titleInput.addEventListener('input', () => {
        notes[index].title = titleInput.value;
        localStorage.setItem('notes', JSON.stringify(notes));
    });

    contentInput.addEventListener('input', () => {
        notes[index].content = contentInput.value;
        localStorage.setItem('notes', JSON.stringify(notes));
    });

    deleteBtn.addEventListener('click', () => {
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    });

    // Adicionar funcionalidade de download
    downloadBtn.addEventListener('click', () => {
        const title = titleInput.value || 'nota_sem_titulo';
        const content = contentInput.value;
        downloadNote(title, content);
    });

    // Adicionar funcionalidade de edição (já está implementada com os inputs)
    editBtn.addEventListener('click', () => {
        titleInput.focus(); // Foca no título para edição
    });

    return noteDiv;
}

// Salvar nota no LocalStorage (ainda permanece na lógica, mas sem o botão)
function saveNote(index, title, content) {
    notes[index] = { title, content };
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

// Excluir nota e criar uma nova
function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();

    // Criar nova nota automaticamente ao excluir
    if (notes.length === 0) {
        notes.push({ title: '', content: '' });
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    }
}

// Editar nota (ativa o campo de edição)
function editNote(contentInput) {
    contentInput.focus();
}

// Função para baixar a nota como .txt
function downloadNote(title, content) {
    // Remove caracteres inválidos para nome de arquivo
    const cleanTitle = title.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚãõâêîôûàèìòùçÇ\s_-]/g, '');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cleanTitle ? `${cleanTitle}.txt` : 'nota_sem_titulo.txt';
    document.body.appendChild(a);
    a.click();
    
    // Limpeza
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}

// Nova nota
newNoteBtn.addEventListener('click', () => {
    notes.push({ title: '', content: '' });
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    toggleScrollToTopButton(); // Adiciona esta linha
});

// Tema dark/light
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
    updateThemeButton();
});

function updateThemeButton() {
    const theme = document.body.dataset.theme || 'light';
    themeToggle.textContent = theme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
}

// Verificar tema salvo
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.dataset.theme = savedTheme;
}

// Função para alternar entre os modos
const themeToggleButton = document.getElementById("themeToggle");

themeToggleButton.addEventListener("click", () => {
    document.body.toggleAttribute("data-theme", "dark");
});

// Função para mostrar ou esconder o botão de scroll para o topo
function toggleScrollToTopButton() {
    const scrollToTopBtn = document.getElementById("scrollToTop");
    const notes = document.querySelectorAll(".note");
    
    // Verifica se há mais de 1 nota
    if (notes.length > 1) {
        scrollToTopBtn.style.display = "block"; // Exibe o botão
    } else {
        scrollToTopBtn.style.display = "none"; // Esconde o botão
    }
}

// Função para scroll para o topo
document.getElementById("scrollToTop").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Chama a função ao adicionar uma nova nota
document.getElementById("newNote").addEventListener("click", toggleScrollToTopButton);

init();

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetSection = this.getAttribute('data-section');

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });

    const appButtons = document.querySelectorAll('.app-btn');
    appButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('应用列表功能开发中，敬请期待！');
        });
    });

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的留言！我们会尽快回复您。');
            this.reset();
        });
    }

    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('联系我')) {
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === 'home') {
                        link.click();
                    }
                });
                setTimeout(() => {
                    const footer = document.querySelector('.footer');
                    footer.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        });
    });

    const designNotesConfig = {
        binId: '69a10d9843b1c97be9a2449b',
        apiKey: '$2a$10$QRufcwmxTvmyzZTZpgiyi.85OJvI/JByah95WIOTmmhs.iyGNgxOS',
        adminPassword: 'aotuodan'
    };

    const JSONBIN_API = 'https://api.jsonbin.io/v3';

    function fetchNotes() {
        const notesList = document.getElementById('notes-list');
        if (!notesList) return;

        const url = `${JSONBIN_API}/b/${designNotesConfig.binId}/latest`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data:', data);
                let notes = [];
                if (data.record && data.record.notes) {
                    notes = data.record.notes;
                } else if (Array.isArray(data.record)) {
                    notes = data.record;
                } else if (data.record) {
                    notes = [data.record];
                }
                displayNotes(notes);
            })
            .catch(error => {
                notesList.innerHTML = '<div class="error">加载失败，请刷新页面重试<br><small>错误: ' + error.message + '</small></div>';
                console.error('Error fetching notes:', error);
            });
    }

    function displayNotes(notes) {
        const notesList = document.getElementById('notes-list');
        if (!notesList) return;

        if (!notes || notes.length === 0) {
            notesList.innerHTML = '<div class="no-notes">暂无笔记，快去添加吧！</div>';
            return;
        }

        const sortedNotes = notes.sort((a, b) => new Date(b.date) - new Date(a.date));

        notesList.innerHTML = sortedNotes.map(note => `
            <div class="note-card">
                <div class="note-date">${formatDate(note.date)}</div>
                <div class="note-content">${escapeHtml(note.content)}</div>
            </div>
        `).join('');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showAdminPanel() {
        const adminPanel = document.getElementById('admin-panel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
        }
    }

    const articleCards = document.querySelectorAll('.article-card[data-section="design-notes"]');
    articleCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            navLinks.forEach(link => {
                if (link.getAttribute('data-section') === targetSection) {
                    link.click();
                }
            });
        });
    });

    const addNoteBtn = document.getElementById('add-note-btn');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', function() {
            const noteContent = document.getElementById('note-content').value.trim();
            const adminPassword = document.getElementById('admin-password').value;

            if (!noteContent) {
                alert('请输入笔记内容');
                return;
            }

            if (!adminPassword) {
                alert('请输入管理密码');
                return;
            }

            if (adminPassword !== designNotesConfig.adminPassword) {
                alert('密码错误');
                return;
            }

            this.textContent = '发布中...';
            this.disabled = true;

            fetch(`${JSONBIN_API}/b/${designNotesConfig.binId}/latest`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': designNotesConfig.apiKey
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Add note - fetched data:', data);
                let notes = [];
                if (data.record && data.record.notes) {
                    notes = data.record.notes;
                } else if (Array.isArray(data.record)) {
                    notes = data.record;
                } else if (!data.record || (typeof data.record === 'object' && Object.keys(data.record).length === 0)) {
                    notes = [];
                } else {
                    notes = [data.record];
                }

                const newNote = {
                    id: Date.now(),
                    content: noteContent,
                    date: new Date().toISOString()
                };

                notes.push(newNote);

                return fetch(`${JSONBIN_API}/b/${designNotesConfig.binId}`, {
                    method: 'PUT',
                    headers: {
                        'X-Master-Key': designNotesConfig.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ notes: notes })
                });
            })
            .then(() => {
                alert('笔记发布成功！');
                document.getElementById('note-content').value = '';
                document.getElementById('admin-password').value = '';
                fetchNotes();
            })
            .catch(error => {
                alert('发布失败，请稍后重试');
                console.error('Error adding note:', error);
            })
            .finally(() => {
                this.textContent = '发布笔记';
                this.disabled = false;
            });
        });
    }

    fetchNotes();
    showAdminPanel();
});
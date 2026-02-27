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
        binId: '69a11bf3ae596e708f4e35d3',
        apiKey: '$2a$10$QRufcwmxTvmyzZTZpgiyi.85OJvI/JByah95WIOTmmhs.iyGNgxOS',
        adminPassword: 'aotuodan'
    };

    const JSONBIN_API = 'https://api.jsonbin.io/v3';

    function fetchNotes() {
        const notesList = document.getElementById('notes-list');
        if (!notesList) return;

        const url = `${JSONBIN_API}/b/${designNotesConfig.binId}/latest`;

        fetch(url, {
            headers: {
                'X-Access-Key': designNotesConfig.apiKey
            }
        })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Full response data:', JSON.stringify(data));
                let notes = [];
                
                if (data.record) {
                    if (Array.isArray(data.record)) {
                        notes = data.record;
                    } else if (data.record.notes && Array.isArray(data.record.notes)) {
                        notes = data.record.notes;
                    } else if (typeof data.record === 'object') {
                        notes = Object.values(data.record).filter(item => 
                            item && typeof item === 'object' && item.content
                        );
                    }
                }
                
                console.log('Parsed notes:', notes);
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

        console.log('displayNotes received:', notes);
        
        if (!notes || !Array.isArray(notes) || notes.length === 0) {
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

    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            if (targetSection === 'design-notes') {
                navLinks.forEach(l => l.classList.remove('active'));
                
                const targetLink = Array.from(navLinks).find(link => link.getAttribute('data-section') === 'articles');
                if (targetLink) {
                    targetLink.classList.add('active');
                }
                
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetSection) {
                        section.classList.add('active');
                    }
                });
            } else if (targetSection === 'tech-sharing') {
                navLinks.forEach(l => l.classList.remove('active'));
                
                const targetLink = Array.from(navLinks).find(link => link.getAttribute('data-section') === 'articles');
                if (targetLink) {
                    targetLink.classList.add('active');
                }
                
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === 'tech-forum') {
                        section.classList.add('active');
                    }
                });
            } else if (targetSection === 'frontier-learning') {
                navLinks.forEach(l => l.classList.remove('active'));
                
                const targetLink = Array.from(navLinks).find(link => link.getAttribute('data-section') === 'articles');
                if (targetLink) {
                    targetLink.classList.add('active');
                }
                
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === 'frontier-learning') {
                        section.classList.add('active');
                    }
                });
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
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
                    'X-Access-Key': designNotesConfig.apiKey
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Add note - fetched data:', data);
                let notes = [];
                
                if (data.record) {
                    if (Array.isArray(data.record)) {
                        notes = data.record;
                    } else if (data.record.notes && Array.isArray(data.record.notes)) {
                        notes = data.record.notes;
                    } else if (typeof data.record === 'object') {
                        notes = Object.values(data.record).filter(item => 
                            item && typeof item === 'object' && item.content
                        );
                    }
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
                        'X-Access-Key': designNotesConfig.apiKey,
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

    const forumConfig = {
        binId: '69a15b9dae596e708f4eb71a',
        apiKey: '$2a$10$QRufcwmxTvmyzZTZpgiyi.85OJvI/JByah95WIOTmmhs.iyGNgxOS',
        adminPassword: 'aotuodan'
    };

    let selectedCommentId = null;

    function fetchComments() {
        const commentsList = document.getElementById('comments-list');
        if (!commentsList) return;

        const url = `${JSONBIN_API}/b/${forumConfig.binId}/latest`;

        fetch(url, {
            headers: {
                'X-Access-Key': forumConfig.apiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                let comments = [];
                if (data.record) {
                    if (Array.isArray(data.record)) {
                        comments = data.record;
                    } else if (data.record.comments && Array.isArray(data.record.comments)) {
                        comments = data.record.comments;
                    }
                }
                displayComments(comments);
            })
            .catch(error => {
                commentsList.innerHTML = '<div class="error">加载失败，请刷新页面重试<br><small>错误: ' + error.message + '</small></div>';
                console.error('Error fetching comments:', error);
            });
    }

    function displayComments(comments) {
        const commentsList = document.getElementById('comments-list');
        if (!commentsList) return;

        if (!comments || !Array.isArray(comments) || comments.length === 0) {
            commentsList.innerHTML = '<div class="no-notes">暂无评论，快来发表第一个评论吧！</div>';
            return;
        }

        const sortedComments = comments.sort((a, b) => new Date(b.date) - new Date(a.date));

        commentsList.innerHTML = sortedComments.map(comment => `
            <div class="comment-card ${selectedCommentId === comment.id ? 'selected' : ''}" data-id="${comment.id}">
                <div class="comment-author">${escapeHtml(comment.author)}</div>
                <div class="comment-date">${formatDate(comment.date)}</div>
                <div class="comment-content">${escapeHtml(comment.content)}</div>
            </div>
        `).join('');

        document.querySelectorAll('.comment-card').forEach(card => {
            card.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                if (selectedCommentId === id) {
                    selectedCommentId = null;
                    this.classList.remove('selected');
                } else {
                    document.querySelectorAll('.comment-card').forEach(c => c.classList.remove('selected'));
                    selectedCommentId = id;
                    this.classList.add('selected');
                }
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    document.getElementById('add-comment-btn')?.addEventListener('click', function() {
        const author = document.getElementById('comment-author').value.trim();
        const content = document.getElementById('comment-content').value.trim();

        if (!author || !content) {
            alert('请填写昵称和评论内容');
            return;
        }

        this.textContent = '发布中...';
        this.disabled = true;

        fetch(`${JSONBIN_API}/b/${forumConfig.binId}/latest`, {
            headers: {
                'X-Access-Key': forumConfig.apiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                let comments = [];
                if (data.record) {
                    if (Array.isArray(data.record)) {
                        comments = data.record;
                    } else if (data.record.comments) {
                        comments = data.record.comments;
                    }
                }

                const newComment = {
                    id: Date.now(),
                    author: author,
                    content: content,
                    date: new Date().toISOString()
                };

                comments.push(newComment);

                return fetch(`${JSONBIN_API}/b/${forumConfig.binId}`, {
                    method: 'PUT',
                    headers: {
                        'X-Access-Key': forumConfig.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comments: comments })
                });
            })
            .then(() => {
                alert('评论发布成功！');
                document.getElementById('comment-author').value = '';
                document.getElementById('comment-content').value = '';
                fetchComments();
            })
            .catch(error => {
                alert('发布失败，请稍后重试');
                console.error('Error adding comment:', error);
            })
            .finally(() => {
                this.textContent = '发布评论';
                this.disabled = false;
            });
    });

    document.getElementById('delete-comment-btn')?.addEventListener('click', function() {
        const adminPassword = document.getElementById('forum-admin-password').value;

        if (adminPassword !== forumConfig.adminPassword) {
            alert('管理密码错误');
            return;
        }

        if (!selectedCommentId) {
            alert('请先选择要删除的评论');
            return;
        }

        if (!confirm('确定要删除这条评论吗？')) {
            return;
        }

        fetch(`${JSONBIN_API}/b/${forumConfig.binId}/latest`, {
            headers: {
                'X-Access-Key': forumConfig.apiKey
            }
        })
            .then(response => response.json())
            .then(data => {
                let comments = [];
                if (data.record) {
                    if (Array.isArray(data.record)) {
                        comments = data.record;
                    } else if (data.record.comments) {
                        comments = data.record.comments;
                    }
                }

                comments = comments.filter(c => c.id.toString() !== selectedCommentId.toString());

                return fetch(`${JSONBIN_API}/b/${forumConfig.binId}`, {
                    method: 'PUT',
                    headers: {
                        'X-Access-Key': forumConfig.apiKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comments: comments })
                });
            })
            .then(() => {
                alert('评论已删除');
                selectedCommentId = null;
                document.getElementById('forum-admin-password').value = '';
                fetchComments();
            })
            .catch(error => {
                alert('删除失败，请稍后重试');
                console.error('Error deleting comment:', error);
            });
    });

    document.getElementById('back-to-articles')?.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        const articlesLink = Array.from(navLinks).find(l => l.getAttribute('data-section') === 'articles');
        const articlesSection = document.getElementById('articles');
        
        if (articlesLink) articlesLink.classList.add('active');
        if (articlesSection) articlesSection.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function initForum() {
        const forumSection = document.getElementById('tech-forum');
        if (forumSection) {
            fetchComments();
        }
    }

    initForum();

    let currentNewsSource = 'china';
    let allNewsArticles = [];
    let currentPage = 1;
    const itemsPerPage = 8;

    const translationMap = {
        'AI': '人工智能',
        'artificial intelligence': '人工智能',
        'machine learning': '机器学习',
        'deep learning': '深度学习',
        'neural network': '神经网络',
        'GPT': 'GPT',
        'OpenAI': 'OpenAI',
        'Google': '谷歌',
        'Meta': 'Meta',
        'Microsoft': '微软',
        'Amazon': '亚马逊',
        'Apple': '苹果',
        'NVIDIA': '英伟达',
        'Tesla': '特斯拉',
        'Anthropic': 'Anthropic',
        'Claude': 'Claude',
        'ChatGPT': 'ChatGPT',
        'Gemini': 'Gemini',
        'LLM': '大语言模型',
        'language model': '语言模型',
        'robot': '机器人',
        'automation': '自动化',
        'algorithm': '算法',
        'data science': '数据科学',
        'tech': '科技',
        'technology': '科技',
        'startup': '初创公司',
        'release': '发布',
        'launch': '推出',
        'announces': '宣布',
        'unveils': '发布',
        'introduces': '推出',
        'new': '新的',
        'how': '如何',
        'what': '什么',
        'why': '为什么',
        'can': '可以',
        'will': '将',
        'now': '现在',
        'first': '首次',
        'best': '最佳',
        'top': '顶级',
        'major': '主要',
        'latest': '最新',
        'research': '研究',
        'development': '开发',
        'breakthrough': '突破',
        'model': '模型',
        'training': '训练',
        'generative': '生成式',
        'prompt': '提示词',
        'benchmark': '基准测试',
        'performance': '性能',
        'accuracy': '准确性',
        'company': '公司',
        'says': '表示',
        'according to': '根据',
        'report': '报告',
        'study': '研究',
        'paper': '论文',
        'official': '官方'
    };

    function translateTitle(title) {
        if (!title) return '';
        
        return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(title)}&langpair=en|zh`)
            .then(response => response.json())
            .then(data => {
                if (data.responseData && data.responseData.translatedText) {
                    return data.responseData.translatedText;
                }
                return title;
            })
            .catch(error => {
                console.error('Translation error:', error);
                let translated = title;
                for (const [eng, chn] of Object.entries(translationMap)) {
                    const regex = new RegExp('\\b' + eng + '\\b', 'gi');
                    translated = translated.replace(regex, chn);
                }
                return translated;
            });
    }

    async function displayNewsPage(page) {
        const newsList = document.getElementById('news-list');
        if (!newsList) return;

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageArticles = allNewsArticles.slice(start, end);

        const translatedArticles = await Promise.all(pageArticles.map(async article => {
            const translatedTitle = await translateTitle(article.title);
            return { ...article, translatedTitle };
        }));

        newsList.innerHTML = translatedArticles.map(article => `
            <div class="news-item">
                <a href="${article.url || 'https://news.ycombinator.com/item?id=' + article.id}" target="_blank">
                    <div class="news-title">${escapeHtml(article.translatedTitle)}</div>
                    <div class="news-meta">
                        <span class="news-source">${escapeHtml(article.by || 'Hacker News')}</span>
                        <span class="news-date">${formatDate(new Date(article.time * 1000))}</span>
                        ${article.score ? `<span class="news-score">👍 ${article.score}</span>` : ''}
                    </div>
                </a>
            </div>
        `).join('');
    }

    function fetchAINews(source = 'china') {
        const newsList = document.getElementById('news-list');
        if (!newsList) return;

        currentNewsSource = source;
        currentPage = 1;
        newsList.innerHTML = '<div class="loading">加载中...</div>';

        fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
            .then(response => response.json())
            .then(storyIds => {
                const aiPromises = storyIds.slice(0, 150).map(id => 
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
                );
                return Promise.all(aiPromises);
            })
            .then(stories => {
                const aiStories = stories.filter(s => s && s.title && (
                    s.title.toLowerCase().includes('ai') || 
                    s.title.toLowerCase().includes('artificial') ||
                    s.title.toLowerCase().includes('gpt') ||
                    s.title.toLowerCase().includes('llm') ||
                    s.title.toLowerCase().includes('machine learning') ||
                    s.title.toLowerCase().includes('neural') ||
                    s.title.toLowerCase().includes('openai') ||
                    s.title.toLowerCase().includes('google ai') ||
                    s.title.toLowerCase().includes('meta ai') ||
                    s.title.toLowerCase().includes('anthropic') ||
                    s.title.toLowerCase().includes('claude') ||
                    s.title.toLowerCase().includes('gemini') ||
                    s.title.toLowerCase().includes('chatgpt') ||
                    s.title.toLowerCase().includes('deep learning') ||
                    s.title.toLowerCase().includes('nvidia')
                ));
                allNewsArticles = aiStories;
                displayNewsPage(currentPage);
                displayPagination();
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsList.innerHTML = '<div class="news-error">加载失败，请稍后刷新重试</div>';
            });
    }

    function displayPagination() {
        const pagination = document.getElementById('news-pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(allNewsArticles.length / itemsPerPage);
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';
        
        if (currentPage > 1) {
            html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">上一页</button>`;
        }
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<span class="page-dots">...</span>`;
            }
        }
        
        if (currentPage < totalPages) {
            html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">下一页</button>`;
        }

        pagination.innerHTML = html;
    }

    window.goToPage = async function(page) {
        currentPage = page;
        await displayNewsPage(page);
        displayPagination();
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    document.getElementById('refresh-news')?.addEventListener('click', function() {
        fetchAINews(currentNewsSource);
    });

    document.getElementById('back-to-articles-news')?.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        const articlesLink = Array.from(navLinks).find(l => l.getAttribute('data-section') === 'articles');
        const articlesSection = document.getElementById('articles');
        
        if (articlesLink) articlesLink.classList.add('active');
        if (articlesSection) articlesSection.classList.add('active');
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function initNews() {
        const newsSection = document.getElementById('frontier-learning');
        if (newsSection) {
            fetchAINews('china');
        }
    }

    initNews();
});
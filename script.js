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
});
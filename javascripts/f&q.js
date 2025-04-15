document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', event => {
        const faqItem = item.parentNode;
        faqItem.classList.toggle('active');
    });
});
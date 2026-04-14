document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const open = navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', open);
        });

        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => navLinks.classList.remove('open'));
        });
    }

    const carousel = document.getElementById('labsCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carousel && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 350, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -350, behavior: 'smooth' });
        });
    }

    const form = document.getElementById('contactForm');
    if (form) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        const btnSpinner = document.getElementById('btnSpinner');

        function showToast(msg, type = 'success') {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            const toastIcon = document.getElementById('toastIcon');

            if (toast && toastMsg && toastIcon) {
                toastMsg.textContent = msg;
                toast.className = `show ${type}`;
                toastIcon.className = type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-x-circle-fill';
                setTimeout(() => { toast.className = ''; }, 4500);
            }
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            btnText.textContent = 'Sending…';
            btnIcon.style.display = 'none';
            btnSpinner.style.display = 'block';

            try {
                const data = new FormData(form);
                const res = await fetch(form.action, { method: 'POST', body: data });
                const json = await res.json();

                if (json.success) {
                    showToast("Message sent! I'll get back to you soon.", "success");
                    form.reset();
                } else {
                    showToast('Something went wrong. Please try again.', 'error');
                }
            } catch {
                showToast('Network error. Check your connection.', 'error');
            } finally {
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                btnIcon.style.display = '';
                btnSpinner.style.display = 'none';
            }
        });
    }
});

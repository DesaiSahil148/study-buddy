import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = loginForm.querySelector('button[type="submit"]');

            // Visual Loading State
            const originalBtnText = btn.innerText;
            btn.innerHTML = '<span class="animate-spin inline-block mr-2">⟳</span> Signing In...';
            btn.disabled = true;
            btn.classList.add('opacity-75', 'cursor-not-allowed');

            // Mock API Call Delay
            setTimeout(() => {
                // Mock Success Logic
                if (email && password) {
                    // Extract name from email for demo purposes (e.g. sahil@test.com -> Sahil)
                    const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);

                    // Store user in localStorage
                    const user = {
                        name: name,
                        email: email,
                        token: 'mock-jwt-token-123456'
                    };
                    localStorage.setItem('studyBuddyUser', JSON.stringify(user));

                    showToast('Login Successful!', 'success');

                    // Redirect after short delay for toast visibility
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    showToast('Invalid credentials', 'error');
                    btn.innerText = originalBtnText;
                    btn.disabled = false;
                    btn.classList.remove('opacity-75', 'cursor-not-allowed');
                }
            }, 1000);
        });
    }
});

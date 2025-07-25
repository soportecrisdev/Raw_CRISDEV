// ==================== ASSETS/JS/AUTH.JS ====================

import { onAuthStateChanged } from './firebase.js';

class AuthManager {
    constructor() {
        this.loginScreen = document.getElementById('loginScreen');
        this.dashboardScreen = document.getElementById('dashboardScreen');
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.loginBtn = document.getElementById('loginBtn');
        this.registerBtn = document.getElementById('registerBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.userEmail = document.getElementById('userEmail');
        
        this.initEventListeners();
        this.initAuthStateListener();
    }

    initEventListeners() {
        this.loginBtn.addEventListener('click', () => this.handleLogin());
        this.registerBtn.addEventListener('click', () => this.handleRegister());
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Enter key support
        this.loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
    }

    initAuthStateListener() {
        // Check if accessing public app view
        const urlParams = new URLSearchParams(window.location.search);
        const publicAppKey = urlParams.get('app');
        
        if (publicAppKey) {
            // Show public view without authentication
            this.showPublicView(publicAppKey);
            return;
        }

        onAuthStateChanged(window.firebase.auth, (user) => {
            if (user) {
                this.showDashboard(user);
            } else {
                this.showLogin();
            }
        });
    }

    async handleLogin() {
        const email = this.loginEmail.value.trim();
        const password = this.loginPassword.value.trim();

        if (!email || !password) {
            this.showStatus('Por favor ingresa email y contraseña', 'error');
            return;
        }

        this.setLoading('login', true);

        try {
            await window.firebase.signInWithEmailAndPassword(window.firebase.auth, email, password);
            this.showStatus('¡Sesión iniciada exitosamente!', 'success');
        } catch (error) {
            this.handleAuthError(error);
        } finally {
            this.setLoading('login', false);
        }
    }

    async handleRegister() {
        const email = this.loginEmail.value.trim();
        const password = this.loginPassword.value.trim();

        if (!email || !password) {
            this.showStatus('Por favor ingresa email y contraseña', 'error');
            return;
        }

        if (password.length < 6) {
            this.showStatus('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }

        this.setLoading('register', true);

        try {
            await window.firebase.createUserWithEmailAndPassword(window.firebase.auth, email, password);
            this.showStatus('¡Cuenta creada exitosamente!', 'success');
        } catch (error) {
            this.handleAuthError(error);
        } finally {
            this.setLoading('register', false);
        }
    }

    async handleLogout() {
        try {
            await window.firebase.signOut(window.firebase.auth);
            this.showStatus('Sesión cerrada exitosamente', 'success');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    handleAuthError(error) {
        let errorMessage = 'Error de autenticación';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'Usuario no encontrado';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Contraseña incorrecta';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Email inválido';
                break;
            case 'auth/email-already-in-use':
                errorMessage = 'El email ya está registrado';
                break;
            case 'auth/weak-password':
                errorMessage = 'Contraseña muy débil';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos. Intenta más tarde';
                break;
        }
        
        this.showStatus(errorMessage, 'error');
    }

    showPublicView(appKey) {
        this.loginScreen.classList.add('hidden');
        this.dashboardScreen.classList.add('hidden');
        
        // Initialize public viewer
        if (window.publicViewer) {
            window.publicViewer.loadApp(appKey);
        }
    }

    showLogin() {
        this.loginScreen.classList.remove('hidden');
        this.dashboardScreen.classList.add('hidden');
    }

    showDashboard(user) {
        this.loginScreen.classList.add('hidden');
        this.dashboardScreen.classList.remove('hidden');
        this.userEmail.textContent = user.email;
        
        // Initialize app manager
        if (window.appManager) {
            window.appManager.loadApps();
        }
    }

    setLoading(type, isLoading) {
        const textElement = document.getElementById(`${type}Text`);
        const loadingElement = document.getElementById(`${type}Loading`);
        const buttonElement = document.getElementById(`${type}Btn`);

        if (isLoading) {
            textElement.classList.add('hidden');
            loadingElement.classList.remove('hidden');
            buttonElement.disabled = true;
        } else {
            textElement.classList.remove('hidden');
            loadingElement.classList.add('hidden');
            buttonElement.disabled = false;
        }
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('loginStatus');
        statusElement.textContent = message;
        statusElement.className = `status ${type} show`;
        
        setTimeout(() => {
            statusElement.classList.remove('show');
        }, 5000);
    }
}

export { AuthManager };
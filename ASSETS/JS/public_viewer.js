// ==================== ASSETS/JS/PUBLIC_VIEWER.JS ====================

class PublicViewer {
    constructor() {
        this.publicScreen = document.getElementById('publicRawScreen');
        this.publicAppName = document.getElementById('publicAppName');
        this.publicFileContent = document.getElementById('publicFileContent');
        this.publicDownloadBtn = document.getElementById('publicDownloadBtn');
        this.publicCopyBtn = document.getElementById('publicCopyBtn');
        
        this.currentContent = '';
        this.currentAppName = '';
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.publicDownloadBtn.addEventListener('click', () => this.downloadContent());
        this.publicCopyBtn.addEventListener('click', () => this.copyContent());
    }

    async loadApp(appKey) {
        try {
            // Show loading state
            this.publicFileContent.innerHTML = `
                <div style="text-align: center; padding: 60px; color: var(--text-secondary);">
                    <div class="loading" style="margin: 0 auto 20px;"></div>
                    <div>Cargando configuración...</div>
                </div>
            `;
            
            this.show();

            const appRef = window.firebase.ref(window.firebase.database, `vpn-apps/${appKey}`);
            const snapshot = await window.firebase.get(appRef);
            const appData = snapshot.val();

            if (appData) {
                this.currentAppName = appData.name;
                this.currentContent = appData.content;
                
                this.publicAppName.textContent = `${appData.name} - Configuración VPN`;
                this.publicFileContent.textContent = appData.content;
            } else {
                this.showError('Configuración no encontrada');
            }
        } catch (error) {
            console.error('Error loading public app:', error);
            this.showError('Error al cargar la configuración');
        }
    }

    show() {
        this.publicScreen.classList.remove('hidden');
        document.body.style.overflow = 'auto';
    }

    downloadContent() {
        try {
            const blob = new Blob([this.currentContent], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentAppName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.showToast('✅ Archivo descargado');
        } catch (error) {
            console.error('Error downloading file:', error);
            this.showToast('❌ Error al descargar');
        }
    }

    copyContent() {
        try {
            navigator.clipboard.writeText(this.currentContent).then(() => {
                this.showToast('✅ Contenido copiado al portapapeles');
            });
        } catch (error) {
            console.error('Error copying content:', error);
            this.showToast('❌ Error al copiar');
        }
    }

    showError(message) {
        this.publicFileContent.innerHTML = `
            <div style="text-align: center; padding: 60px; color: #ff4757;">
                <i class="ph-warning-circle" style="font-size: 48px; margin-bottom: 16px;"></i>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Error</div>
                <div>${message}</div>
            </div>
        `;
    }

    showToast(message) {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            z-index: 10000;
            font-family: var(--font-family);
            font-weight: 600;
            font-size: 14px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

export { PublicViewer };
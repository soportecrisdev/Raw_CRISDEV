// ==================== ASSETS/JS/RAW_VIEWER.JS ====================

class RawViewer {
    constructor() {
        this.modal = document.getElementById('rawModal');
        this.modalAppName = document.getElementById('modalAppName');
        this.fileContent = document.getElementById('fileContent');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyContentBtn = document.getElementById('copyContentBtn');
        this.copyLinkBtn = document.getElementById('copyLinkBtn');
        this.closeModal = document.getElementById('closeModal');
        
        this.currentContent = '';
        this.currentAppName = '';
        this.currentAppKey = '';
        
        this.initEventListeners();
    }

    initEventListeners() {
        this.closeModal.addEventListener('click', () => this.hide());
        this.downloadBtn.addEventListener('click', () => this.downloadContent());
        this.copyContentBtn.addEventListener('click', () => this.copyContent());
        this.copyLinkBtn.addEventListener('click', () => this.copyPublicLink());
        
        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.hide();
            }
        });
    }

    show(appName, content, appKey) {
        this.currentAppName = appName;
        this.currentContent = content;
        this.currentAppKey = appKey;
        
        this.modalAppName.textContent = appName;
        this.fileContent.textContent = content;
        
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    hide() {
        this.modal.style.display = 'none';
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

    copyPublicLink() {
        const publicLink = `${window.location.origin}${window.location.pathname}?app=${encodeURIComponent(this.currentAppKey)}`;
        try {
            navigator.clipboard.writeText(publicLink).then(() => {
                this.showToast('✅ Enlace público copiado al portapapeles');
            });
        } catch (error) {
            console.error('Error copying link:', error);
            this.showToast('❌ Error al copiar enlace');
        }
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

export { RawViewer };
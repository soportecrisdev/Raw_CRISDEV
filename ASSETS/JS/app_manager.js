// ==================== ASSETS/JS/APP_MANAGER.JS ====================

class AppManager {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.appName = document.getElementById('appName');
        this.saveBtn = document.getElementById('saveBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.appsList = document.getElementById('appsList');
        
        this.currentFile = null;
        this.currentFileContent = null;
        this.editingAppKey = null; // Para saber si estamos editando una app existente
        
        this.initEventListeners();
        this.initDragAndDrop();
        this.updateUIState();
    }

    initEventListeners() {
        this.uploadArea.addEventListener('click', () => this.handleUploadAreaClick());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        this.saveBtn.addEventListener('click', () => this.handleSave());
        this.cancelBtn.addEventListener('click', () => this.cancelEdit());
        this.refreshBtn.addEventListener('click', () => this.loadApps());
        
        // Listen for app name changes
        this.appName.addEventListener('input', () => this.updateUIState());
    }

    initDragAndDrop() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => {
                this.uploadArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.uploadArea.addEventListener(eventName, () => {
                this.uploadArea.classList.remove('dragover');
            });
        });

        this.uploadArea.addEventListener('drop', (e) => {
            this.handleFileSelect(e.dataTransfer.files);
        });
    }

    updateUIState() {
        const appNameValue = this.appName.value.trim();
        const hasFile = this.currentFileContent !== null;
        
        // Show/hide cancel button based on editing mode
        if (this.editingAppKey) {
            this.cancelBtn.style.display = 'block';
        } else {
            this.cancelBtn.style.display = 'none';
        }
        
        if (!appNameValue) {
            // No app name - show create app mode
            this.updateUploadArea({
                icon: 'ph-plus-circle',
                title: 'Crear Nueva App VPN',
                subtitle: 'Primero ingresa el nombre de tu app'
            });
            this.saveBtn.innerHTML = '<i class="ph-plus"></i><span id="saveText">Crear App</span><span id="saveLoading" class="loading hidden"></span>';
            this.saveBtn.disabled = false;
        } else if (this.editingAppKey) {
            // Editing existing app
            if (hasFile) {
                this.updateUploadArea({
                    icon: 'ph-check-circle',
                    title: 'Archivo cargado',
                    subtitle: 'Listo para actualizar la configuración'
                });
                this.saveBtn.innerHTML = '<i class="ph-upload"></i><span id="saveText">Actualizar Configuración</span><span id="saveLoading" class="loading hidden"></span>';
            } else {
                this.updateUploadArea({
                    icon: 'ph-file-plus',
                    title: 'Actualizar configuración',
                    subtitle: 'Arrastra tu archivo .json aquí o haz clic para seleccionar'
                });
                this.saveBtn.innerHTML = '<i class="ph-upload"></i><span id="saveText">Subir Archivo</span><span id="saveLoading" class="loading hidden"></span>';
                this.saveBtn.disabled = true;
            }
        } else {
            // New app name entered
            if (hasFile) {
                this.updateUploadArea({
                    icon: 'ph-check-circle',
                    title: 'App y archivo listos',
                    subtitle: 'Todo preparado para crear la app'
                });
                this.saveBtn.innerHTML = '<i class="ph-floppy-disk"></i><span id="saveText">Crear App con Archivo</span><span id="saveLoading" class="loading hidden"></span>';
            } else {
                this.updateUploadArea({
                    icon: 'ph-folder-plus',
                    title: 'Crear app o subir archivo',
                    subtitle: 'Puedes crear la app vacía o arrastrar un archivo'
                });
                this.saveBtn.innerHTML = '<i class="ph-plus"></i><span id="saveText">Crear App Vacía</span><span id="saveLoading" class="loading hidden"></span>';
            }
            this.saveBtn.disabled = false;
        }
    }

    updateUploadArea({ icon, title, subtitle }) {
        this.uploadArea.innerHTML = `
            <i class="${icon} upload-icon"></i>
            <div class="upload-text">${title}</div>
            <div class="upload-subtext">${subtitle}</div>
        `;
    }

    handleUploadAreaClick() {
        const appNameValue = this.appName.value.trim();
        
        if (!appNameValue) {
            this.showStatus('Por favor ingresa primero el nombre de la app', 'error');
            this.appName.focus();
            return;
        }
        
        this.fileInput.click();
    }

    handleFileSelect(files) {
        const appNameValue = this.appName.value.trim();
        
        if (!appNameValue) {
            this.showStatus('Por favor ingresa primero el nombre de la app', 'error');
            this.appName.focus();
            return;
        }

        if (files.length === 0) return;

        const file = files[0];
        
        // Accept any text-based file
        if (file.type.startsWith('text/') || 
            file.name.match(/\.(json|txt|dat|config|log)$/i) ||
            file.type === 'application/json' ||
            file.type === '') {
            
            this.currentFile = file;
            this.readFile(file);
        } else {
            this.showStatus('Por favor selecciona un archivo de configuración válido', 'error');
        }
    }

    readFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentFileContent = e.target.result;
            this.showFilePreview(this.currentFileContent);
            this.updateUIState();
        };
        reader.readAsText(file, 'UTF-8');
    }

    showFilePreview(content) {
        const preview = document.getElementById('filePreview');
        const previewText = content.length > 500 
            ? content.substring(0, 500) + '\n\n... (vista previa truncada)'
            : content;

        preview.innerHTML = `
            <div style="margin-top: 20px;">
                <div class="label">
                    <i class="ph-eye"></i> Vista Previa (${(content.length / 1024).toFixed(2)} KB)
                </div>
                <div class="raw-viewer">${previewText}</div>
            </div>
        `;
    }

    async handleSave() {
        const appNameValue = this.appName.value.trim();
        
        if (!appNameValue) {
            this.showStatus('Por favor ingresa el nombre de la app', 'error');
            return;
        }

        this.setLoading('save', true);

        try {
            if (this.editingAppKey) {
                // Updating existing app
                await this.updateExistingApp(appNameValue);
            } else {
                // Creating new app
                await this.createNewApp(appNameValue);
            }
        } catch (error) {
            console.error('Error saving app:', error);
            this.showStatus('❌ Error al guardar la app', 'error');
        } finally {
            this.setLoading('save', false);
        }
    }

    async createNewApp(appName) {
        // Check if app already exists
        const appRef = window.firebase.ref(window.firebase.database, `vpn-apps/${appName}`);
        const snapshot = await window.firebase.get(appRef);
        
        if (snapshot.exists()) {
            this.showStatus('❌ Ya existe una app con ese nombre', 'error');
            return;
        }

        const appData = {
            name: appName,
            content: this.currentFileContent || null,
            originalFilename: this.currentFile ? this.currentFile.name : null,
            size: this.currentFileContent ? this.currentFileContent.length : 0,
            uploadDate: new Date().toISOString(),
            uploadedBy: window.firebase.auth.currentUser.email,
            lastModified: new Date().toISOString(),
            hasContent: !!this.currentFileContent
        };

        await window.firebase.set(appRef, appData);

        if (this.currentFileContent) {
            const publicLink = `${window.location.origin}${window.location.pathname}?app=${encodeURIComponent(appName)}`;
            this.showStatus(`✅ App "${appName}" creada con contenido`, 'success');
            setTimeout(() => {
                this.showStatus(`🔗 Enlace público: ${publicLink}`, 'success');
            }, 2000);
        } else {
            this.showStatus(`✅ App "${appName}" creada. Ahora puedes subir el archivo`, 'success');
        }
        
        this.clearForm();
        this.loadApps();
    }

    async updateExistingApp(appName) {
        if (!this.currentFileContent) {
            this.showStatus('Por favor selecciona un archivo para actualizar', 'error');
            return;
        }

        const appRef = window.firebase.ref(window.firebase.database, `vpn-apps/${this.editingAppKey}`);
        const snapshot = await window.firebase.get(appRef);
        const existingData = snapshot.val();

        const updatedData = {
            ...existingData,
            content: this.currentFileContent,
            originalFilename: this.currentFile.name,
            size: this.currentFileContent.length,
            lastModified: new Date().toISOString(),
            hasContent: true
        };

        await window.firebase.set(appRef, updatedData);

        const publicLink = `${window.location.origin}${window.location.pathname}?app=${encodeURIComponent(this.editingAppKey)}`;
        this.showStatus(`✅ App "${appName}" actualizada exitosamente`, 'success');
        setTimeout(() => {
            this.showStatus(`🔗 Enlace público: ${publicLink}`, 'success');
        }, 2000);
        
        this.clearForm();
        this.loadApps();
    }

    async loadApps() {
        this.setLoading('refresh', true);

        try {
            const appsRef = window.firebase.ref(window.firebase.database, 'vpn-apps');
            const snapshot = await window.firebase.get(appsRef);
            const data = snapshot.val();

            this.renderApps(data);

        } catch (error) {
            console.error('Error loading apps:', error);
            this.showError('Error al cargar las aplicaciones');
        } finally {
            this.setLoading('refresh', false);
        }
    }

    renderApps(data) {
        if (!data) {
            this.appsList.innerHTML = `
                <div class="empty-state">
                    <i class="ph-folder-open empty-icon"></i>
                    <div>No hay apps VPN configuradas</div>
                    <div style="margin-top: 8px; font-size: 12px;">Crea tu primera app para comenzar</div>
                </div>
            `;
            return;
        }

        const apps = Object.entries(data).map(([key, app]) => ({ key, ...app }));
        
        this.appsList.innerHTML = apps.map(app => this.createAppCard(app)).join('');
    }

    createAppCard(app) {
        const uploadDate = new Date(app.uploadDate).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const sizeKB = app.hasContent ? (app.size / 1024).toFixed(2) : '0';
        const publicLink = `${window.location.origin}${window.location.pathname}?app=${encodeURIComponent(app.key)}`;
        const statusBadge = app.hasContent 
            ? '<span style="background: #2ed573; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">✓ CON ARCHIVO</span>'
            : '<span style="background: #ff6b6b; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 600;">⚠ SIN ARCHIVO</span>';

        return `
            <div class="card app-card">
                <div class="app-header">
                    <div class="app-info">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <h3>${app.name}</h3>
                            ${statusBadge}
                        </div>
                        <div class="app-meta">
                            <span><i class="ph-calendar"></i> ${uploadDate}</span>
                            <span><i class="ph-file"></i> ${sizeKB} KB</span>
                            <span><i class="ph-user"></i> ${app.uploadedBy}</span>
                        </div>
                    </div>
                </div>
                
                ${app.hasContent ? `
                    <div style="margin: 12px 0; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; font-size: 11px; font-family: monospace; word-break: break-all; color: var(--text-secondary);">
                        <strong>🔗 Enlace público:</strong><br>
                        ${publicLink}
                    </div>
                ` : ''}
                
                <div class="app-actions">
                    ${app.hasContent ? `
                        <button class="btn btn-small" onclick="appManager.viewRaw('${app.key}', '${app.name}')">
                            <i class="ph-code"></i> Ver Raw
                        </button>
                        <button class="btn btn-small" onclick="appManager.copyPublicLink('${publicLink}')">
                            <i class="ph-link"></i> Copiar Enlace
                        </button>
                    ` : ''}
                    <button class="btn btn-small btn-secondary" onclick="appManager.editApp('${app.key}', '${app.name}')">
                        <i class="ph-pencil"></i> ${app.hasContent ? 'Actualizar' : 'Subir Archivo'}
                    </button>
                    <button class="btn btn-small btn-danger" onclick="appManager.deleteApp('${app.key}', '${app.name}')">
                        <i class="ph-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    async viewRaw(appKey, appName) {
        try {
            const appRef = window.firebase.ref(window.firebase.database, `vpn-apps/${appKey}`);
            const snapshot = await window.firebase.get(appRef);
            const appData = snapshot.val();

            if (appData && appData.hasContent) {
                window.rawViewer.show(appName, appData.content, appKey);
            } else {
                this.showStatus('Esta app no tiene contenido todavía', 'error');
            }
        } catch (error) {
            console.error('Error loading app:', error);
            this.showStatus('Error al cargar la aplicación', 'error');
        }
    }

    editApp(appKey, appName) {
        // Set editing mode
        this.editingAppKey = appKey;
        this.appName.value = appName;
        this.appName.disabled = true; // Can't change name when editing
        
        this.updateUIState();
        
        // Scroll to upload section
        document.querySelector('.grid-2').scrollIntoView({ behavior: 'smooth' });
        
        this.showStatus(`Modo edición: ${appName}. Sube un archivo para actualizar.`, 'success');
    }

    copyPublicLink(link) {
        try {
            navigator.clipboard.writeText(link).then(() => {
                this.showStatus('✅ Enlace público copiado al portapapeles', 'success');
            });
        } catch (error) {
            console.error('Error copying link:', error);
            this.showStatus('❌ Error al copiar enlace', 'error');
        }
    }

    async deleteApp(appKey, appName) {
        if (!confirm(`¿Estás seguro de que quieres eliminar "${appName}"?\n\nEsta acción no se puede deshacer.`)) {
            return;
        }

        try {
            const appRef = window.firebase.ref(window.firebase.database, `vpn-apps/${appKey}`);
            await window.firebase.remove(appRef);
            
            this.showStatus(`✅ App "${appName}" eliminada exitosamente`, 'success');
            
            // If we were editing this app, clear the form
            if (this.editingAppKey === appKey) {
                this.clearForm();
            }
            
            this.loadApps();
        } catch (error) {
            console.error('Error deleting app:', error);
            this.showStatus('❌ Error al eliminar la app', 'error');
        }
    }

    clearForm() {
        this.fileInput.value = '';
        this.appName.value = '';
        this.appName.disabled = false;
        this.currentFile = null;
        this.currentFileContent = null;
        this.editingAppKey = null;
        document.getElementById('filePreview').innerHTML = '';
        this.updateUIState();
    }

    cancelEdit() {
        this.clearForm();
        this.showStatus('Edición cancelada', 'success');
    }

    setLoading(type, isLoading) {
        const textElement = document.getElementById(`${type}Text`);
        const loadingElement = document.getElementById(`${type}Loading`);
        const buttonElement = document.getElementById(`${type}Btn`);

        if (textElement && loadingElement && buttonElement) {
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
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('uploadStatus');
        statusElement.textContent = message;
        statusElement.className = `status ${type} show`;
        
        setTimeout(() => {
            statusElement.classList.remove('show');
        }, 5000);
    }

    showError(message) {
        this.appsList.innerHTML = `
            <div class="empty-state">
                <i class="ph-warning-circle empty-icon" style="color: #ff4757;"></i>
                <div style="color: #ff4757;">${message}</div>
            </div>
        `;
    }
}

export { AppManager };
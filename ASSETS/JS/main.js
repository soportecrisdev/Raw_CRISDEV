// ==================== ASSETS/JS/MAIN.JS ====================

import { AuthManager } from './auth.js';
import { AppManager } from './app_manager.js';
import { RawViewer } from './raw_viewer.js';
import { PublicViewer } from './public_viewer.js';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    window.authManager = new AuthManager();
    window.appManager = new AppManager();
    window.rawViewer = new RawViewer();
    window.publicViewer = new PublicViewer();
    
    console.log('🔥 VPN Manager initialized successfully');
    
    // Add version info to console
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║                         VPN MANAGER                          ║
    ║                    Sistema de Gestión v1.0                   ║
    ║                                                              ║
    ║  🔥 Firebase Integration                                     ║
    ║  🎨 Modern UI Design                                         ║
    ║  🔗 Public Link Sharing                                      ║
    ║  📱 Responsive Layout                                        ║
    ║  🔐 Secure Authentication                                    ║
    ║                                                              ║
    ║  Developed CRISDEV                                           ║
    ╚══════════════════════════════════════════════════════════════╝
    `);
});
# VPN Manager - Sistema de Gestión

Sistema profesional para gestionar configuraciones VPN con interfaz moderna y enlaces públicos compartibles.

## 🚀 Características

- **🔐 Autenticación segura** - Login con Firebase Auth
- **📁 Gestión de apps VPN** - Subir, actualizar, eliminar configuraciones
- **🔗 Enlaces públicos** - Compartir configuraciones sin login
- **📱 Diseño responsivo** - Funciona en móvil, tablet y desktop
- **🎨 UI moderna** - Diseño con efectos glow y animaciones
- **📄 Visor raw** - Muestra archivos completos sin restricciones

## 📂 Estructura del Proyecto

```
VPN-Manager/
├── index.html                 # Página principal
├── README.md                  # Documentación
├── assets/
│   ├── css/
│   │   ├── global.css         # Estilos base y variables
│   │   ├── login.css          # Estilos de login
│   │   └── dashboard.css      # Estilos del dashboard
│   ├── js/
│   │   ├── firebase.js        # Configuración Firebase
│   │   ├── auth.js            # Gestión de autenticación
│   │   ├── app_manager.js     # Gestión de apps VPN
│   │   ├── raw_viewer.js      # Visor de contenido raw
│   │   ├── public_viewer.js   # Visor público
│   │   └── main.js            # Inicialización
│   └── img/                   # Imágenes (futuro)
└── views/                     # Componentes HTML (integrados)
    ├── login.html             # Pantalla de login
    ├── dashboard.html         # Dashboard principal
    └── raw_viewer.html        # Modal visor raw
```

## 🎨 Paleta de Colores

| Elemento | Color | Descripción |
|----------|-------|-------------|
| **Primario** | `#3A63F2` | Azul neón principal |
| **Secundario** | `#6F7DFB` | Púrpura azulado |
| **Texto Principal** | `#FFFFFF` | Blanco puro |
| **Texto Secundario** | `#CFCFCF` | Gris claro |
| **Fondo** | Gradiente | Azul oscuro con efectos glow |
| **Cards** | `rgba(255,255,255,0.05)` | Transparente con blur |

## 🔧 Configuración

### 1. Firebase Setup
```javascript
// assets/js/firebase.js
const firebaseConfig = {
    apiKey: "tu-api-key",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto-default-rtdb.firebaseio.com",
    projectId: "tu-proyecto",
    // ... resto de configuración
};
```

### 2. Reglas de Firebase Database
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 3. Autenticación
- Habilitar **Email/Password** en Firebase Console
- Los usuarios pueden registrarse o ser creados desde console

## 📱 Uso

### Para Administradores:
1. **Login** - Acceso con email/contraseña
2. **Subir App** - Arrastra archivo .json o selecciona
3. **Gestionar** - Ver, actualizar, eliminar apps
4. **Compartir** - Copia enlace público de cada app

### Para Usuarios Públicos:
1. **Acceso directo** - URL: `tudominio.com?app=nombre-app`
2. **Solo lectura** - Ver contenido raw completo
3. **Descargar** - Obtener archivo original
4. **Copiar** - Contenido al portapapeles

## 🌐 URLs de Acceso

- **Dashboard**: `https://tudominio.com` (requiere login)
- **App pública**: `https://tudominio.com?app=nombre-app` (acceso libre)

## 🔗 Enlaces Públicos

Cada app VPN genera automáticamente un enlace público:
```
https://tudominio.com?app=mi-app-vpn
```

**Características del enlace público:**
- ✅ Sin login requerido
- ✅ Muestra contenido completo
- ✅ Permite descargar archivo
- ✅ Función copiar contenido
- ✅ Responsive en todos los dispositivos

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Realtime Database
- **Auth**: Firebase Authentication  
- **Hosting**: Compatible con cualquier hosting estático
- **Iconos**: Phosphor Icons
- **Fuentes**: Google Fonts (Poppins)

## 📦 Instalación

1. **Clonar archivos** en tu servidor web
2. **Configurar Firebase** en `assets/js/firebase.js`
3. **Activar servicios** en Firebase Console:
   - Authentication (Email/Password)
   - Realtime Database
4. **Configurar reglas** de seguridad
5. **Acceder** a tu dominio

## 🔐 Seguridad

- **Autenticación requerida** para el dashboard
- **Reglas de Firebase** protegen datos privados
- **Enlaces públicos** solo muestran contenido, no permiten edición
- **Validación** de tipos de archivo permitidos

## 📝 Licencia

Este proyecto está desarrollado para gestión de configuraciones VPN con fines educativos y comerciales.

---

**Desarrollado con ❤️ para la gestión eficiente de apps VPN**
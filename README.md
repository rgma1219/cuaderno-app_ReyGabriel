# 📓 Cuaderno — Gestor Estratégico de Tareas

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://cuaderno-app-rey-gabriel-indol.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0_Strict-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-ffca28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![AWS SES](https://img.shields.io/badge/AWS-SES_v3-ff9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/ses/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0_Passing_57/57-729b1a?style=for-the-badge&logo=vitest)](https://vitest.dev/)

> **Proyecto Integrador M4 — Henry Bootcamp**  
> **Cliente / Caso de Uso:** MateCode Startup  
> **Desarrollador:** Rey Gabriel  
> **Aplicación en Producción:** [https://cuaderno-app-rey-gabriel-indol.vercel.app](https://cuaderno-app-rey-gabriel-indol.vercel.app)

---

## 🌟 Descripción Ejecutiva

**Cuaderno** es una Single Page Application (SPA) para la gestión estratégica de tareas diarias desarrollada para los colaboradores de la startup MateCode. Diseñada con un enfoque riguroso _mobile-first_ y una estética contemporánea de **Liquid Glass (Glassmorphism)**, la plataforma permite a los usuarios registrarse e iniciar sesión de forma segura, administrar tareas con sincronización en tiempo real, filtrar por estados y despachar resúmenes ejecutivos directamente a su correo electrónico a través de una arquitectura serverless en la nube desacoplada y protegida.

---

## 🚀 Características Principales

1. **Autenticación Robusta y Multiproveedor**:
   - Registro e inicio de sesión con Correo / Contraseña.
   - Integración nativa con Google Auth Popup.
   - Persistencia reactiva de sesión (`onAuthStateChanged`) y protección de rutas privadas con `ProtectedRoute`.
   - Mensajería de error localizada 100% en español mapeando excepciones de Firebase.

2. **Gestión de Tareas en Tiempo Real (Cloud Firestore)**:
   - Sincronización reactiva bidireccional (`onSnapshot`) sin necesidad de recargar la página.
   - CRUD completo: creación, visualización, edición en línea, alternancia de estado (pendiente/completada) y eliminación con confirmación.
   - Pestañas de filtrado (_Todas_, _Pendientes_, _Completadas_) con segmented control responsivo y contadores en vivo.
   - Estados de carga animados (_skeleton shimmer_), estados vacíos y feedback visual ante errores de red.

3. **Arquitectura Serverless y Notificaciones por Correo (AWS SES)**:
   - Endpoint backend `/api/send-summary` ejecutado en Vercel Functions.
   - Integración con el SDK v3 de AWS (`@aws-sdk/client-ses`) en la región `us-east-2` (Ohio).
   - Verificación de sesión con Firebase ID Token en el encabezado `Authorization: Bearer <token>`.
   - Mitigación absoluta de Open Relay: el correo destinatario está forzado al email de la sesión verificada.
   - Sanitización HTML estricta contra inyecciones y phishing en el cuerpo del correo.
   - Plantillas duales: diseño visual HTML optimizado y versión de texto plano de respaldo.

4. **Diseño de Autor con Glassmorphism**:
   - Efecto de vidrio esmerilado con desenfoque de 20px (`backdrop-filter: blur(20px)`), transparencias calculadas y bordes reflectivos sutiles.
   - Compatibilidad nativa con temas Claro y Oscuro mediante CSS Tokens (`src/index.css`).
   - Logotipo oficial adaptable con `<picture>` para optimización de renderizado.
   - Cero dependencias CSS innecesarias: 100% Vanilla CSS responsivo y accesible.

5. **Suite Completa de Pruebas Automatizadas**:
   - 57 pruebas unitarias, de integración y serverless ejecutadas con **Vitest** y **React Testing Library**.
   - Cobertura completa de casos borde (inputs vacíos, espacios en blanco, respuestas serverless 500, fallos de red, tokens inválidos y estados de carga asíncronos).

---

## 🛠️ Stack Tecnológico

| Capa                   | Tecnología                | Justificación y Rol                                                                             |
| :--------------------- | :------------------------ | :---------------------------------------------------------------------------------------------- |
| **Frontend Framework** | **React 19**              | Biblioteca declarativa de interfaz de usuario con hooks modernos y componentes funcionales.     |
| **Lenguaje**           | **TypeScript 6 (Strict)** | Tipado estático riguroso (`noImplicitAny`, chequeo nulo estricto, cero `any` en `src/`).        |
| **Bundler & Tooling**  | **Vite 8.3**              | Empaquetado ultrarrápido y Hot Module Replacement (HMR) con plugin SSR para endpoints locales.  |
| **Autenticación**      | **Firebase Auth**         | Gestión segura de identidad de usuarios, tokens JWT y sesiones persistentes.                    |
| **Base de Datos**      | **Cloud Firestore**       | Base de datos NoSQL documental con sincronización reactiva en tiempo real por usuario.          |
| **Backend Serverless** | **Vercel Functions**      | Ejecución de funciones en el borde (_Serverless_) para aislar credenciales privadas de AWS.     |
| **Servicio de Correo** | **AWS SES (SDK v3)**      | Infraestructura escalable de envío de correos transaccionales en región autorizada `us-east-2`. |
| **Testing**            | **Vitest 5 + RTL**        | Entorno de pruebas de alto rendimiento con emulación DOM (`jsdom`) y mocks desacoplados.        |
| **Estilos**            | **Vanilla CSS**           | Sistema de tokens de diseño moderno, transiciones suaves y estética _Glassmorphism_.            |
| **Hosting & CI/CD**    | **Vercel**                | Despliegue continuo automatizado con integración directa a GitHub.                              |

---

## 🏗️ Decisiones Arquitectónicas

1. **Uso de `/api/` en lugar de `/functions/`**:
   - Vercel detecta automáticamente cualquier archivo TypeScript dentro de la carpeta `api/` como una **Vercel Serverless Function** sin requerir configuración adicional de build ni servidores Express auxiliares. Para el entorno de desarrollo local, se configuró un middleware SSR en `vite.config.ts` que simula la ejecución serverless bajo el mismo puerto, garantizando paridad entre desarrollo y producción.

2. **Patrón Adaptador de Servicios (`src/services/`)**:
   - Toda la interacción con dependencias de infraestructura externas (Firebase Auth, Cloud Firestore, AWS SES) se encapsuló en adaptadores desacoplados (`auth.service.ts`, `task.service.ts`, `email.service.ts`). Los componentes de la UI consumen únicamente entidades de dominio propias (`Task`, `UserSession`) y tipos de entrada (`TaskCreateInput`), permitiendo sustituir o actualizar proveedores de backend sin tocar el árbol de componentes de React.

3. **Filtrado por `userId` y Ordenamiento en Memoria**:
   - Cloud Firestore exige la creación de índices compuestos cuando se combinan cláusulas `where()` con `orderBy()` en diferentes campos. Para mantener la aplicación ágil, libre de dependencias de índices costosos y evitar errores de despliegue en entornos de evaluación, la consulta a Firestore filtra estrictamente por `where('userId', '==', userId)` y el ordenamiento cronológico descendente se realiza en memoria en la función adaptadora (`subscribeUserTasks`), optimizando los recursos de lectura.

4. **Autenticación por Token en Serverless**:
   - Para no añadir la pesada biblioteca `firebase-admin` (que exigiría inyectar credenciales completas de cuenta de servicio de Google Cloud en Vercel), la función serverless valida el `Authorization: Bearer <idToken>` utilizando directamente el endpoint REST oficial de Google Identity Toolkit (`accounts:lookup`). Esto garantiza seguridad de nivel bancario, valida la expiración del token y previene el relay no autorizado de emails sin sobrecargar el runtime.

---

## 📧 Flujo de Envío de Emails

El envío de resúmenes de tareas está desacoplado del frontend para resguardar las credenciales secretas de AWS y garantizar una operación segura:

```text
[ Usuario ]
    │  (1) Clic en "Enviar resumen"
    ▼
[ TasksPage.tsx ]
    │  (2) Obtiene ID Token JWT actual: auth.currentUser.getIdToken()
    ▼
[ email.service.ts ]
    │  (3) POST /api/send-summary con header "Authorization: Bearer <ID_TOKEN>"
    ▼
[ Vercel Function: /api/send-summary.ts ]
    │  (4) Valida el Token contra Google Identity Toolkit REST
    │  (5) Verifica que recipientEmail coincida con el email del usuario autenticado
    │  (6) Sanitiza caracteres HTML (<, >, &, ", ') para prevenir inyección y phishing
    │  (7) Valida límites de tareas (máximo 100) y longitud de textos
    ▼
[ AWS SES Client (SDK v3 - Región us-east-2) ]
    │  (8) Despacha SendEmailCommand con plantilla HTML y Texto Plano
    │      * Si la identidad está pendiente en Sandbox: dispara VerifyEmailIdentityCommand
    ▼
[ Bandeja de Entrada del Usuario ]
    │  (9) Recibe el correo formateado con métricas y estado de tareas
    ▼
[ Frontend Feedback ]
       (10) Muestra Toast de éxito o advertencia para confirmar buzón
```

---

## 📂 Estructura del Proyecto

```text
cuaderno-app/
├── api/
│   ├── send-summary.ts          # Serverless Function de Vercel (despacho seguro AWS SES)
│   └── verify-identity.ts       # Verificación de identidades para entorno Sandbox
├── documentation/
│   ├── capturas/                # Evidencias visuales del proceso de diseño
│   └── uso-de-ia.md             # Bitácora detallada de prompts, decisiones y análisis crítico
├── public/                      # Activos públicos estáticos
├── src/
│   ├── assets/                  # Isotipos y logotipos oficiales de Cuaderno
│   ├── components/              # Componentes UI reutilizables (TodoForm, TodoItem, TodoList, etc.)
│   ├── features/
│   │   ├── auth/                # Proveedor y contexto de autenticación (AuthProvider, auth-context)
│   │   └── theme/               # Proveedor y contexto de temas Claro/Oscuro (ThemeProvider, theme-context)
│   ├── hooks/                   # Custom Hooks (useAuth, useTasks, useTheme)
│   ├── pages/                   # Vistas principales (LoginPage, RegisterPage, TasksPage)
│   ├── routes/                  # Configuración de rutas y guardias (ProtectedRoute)
│   ├── services/                # Capa de adaptadores desacoplados (firebase, auth, task, email)
│   ├── types/                   # Definiciones de tipos e interfaces TypeScript (auth, task)
│   ├── utils/                   # Utilidades puras (date.utils)
│   ├── App.css                  # Estilos responsivos Mobile-First
│   ├── App.tsx                  # Enrutador principal de la aplicación
│   ├── index.css                # Sistema de tokens CSS, temas y utilidades Glassmorphism
│   └── main.tsx                 # Punto de entrada de React 19
├── tests/
│   ├── components/              # Pruebas de integración UI (TodoForm, TodoList, TodoItem, ThemeToggle, ProtectedRoute)
│   ├── unit/                    # Pruebas unitarias de servicios, backend y utilidades (auth, task, email, send-summary, date)
│   └── setup.ts                 # Configuración global de entorno y mocks de Vitest
├── firestore.rules              # Reglas de seguridad declarativas de Cloud Firestore
├── vercel.json                  # Reglas de enrutamiento SPA y reescritura de Vercel
├── vite.config.ts               # Configuración de Vite, SSR Serverless plugin y Vitest
└── tsconfig.app.json            # Configuración estricta del compilador TypeScript
```

---

## ⚙️ Configuración y Variables de Entorno

Toma como base el archivo [.env.example](./.env.example) para configurar tu `.env` local:

```bash
# ==========================================
# Firebase Configuration (Frontend / Vite)
# ==========================================
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...

# ==========================================
# AWS SES Configuration (Serverless Backend)
# ==========================================
AWS_SES_REGION=us-east-2
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCY...
AWS_SES_SENDER_EMAIL=correo@correo.com
```

> **Consideraciones de Infraestructura en Vercel**:
>
> 1. En la consola de Vercel (**Settings > Environment Variables**), carga las 6 variables `VITE_FIREBASE_*` y las 4 de AWS (`AWS_SES_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SES_SENDER_EMAIL`).
> 2. `AWS_REGION` está reservada por Vercel para el datacenter físico; la aplicación lee prioritariamente `AWS_SES_REGION` para apuntar a `us-east-2` (Ohio).

---

## 💻 Instalación y Ejecución Local

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/rgma1219/cuaderno-app_ReyGabriel.git
   cd cuaderno-app_ReyGabriel
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo (Frontend + Serverless local)**:

   ```bash
   npm run dev
   ```

   La aplicación se abrirá en `http://localhost:5173`.

4. **Verificar calidad de código y compilación**:

   ```bash
   # Linter estricto (0 errores, 0 advertencias)
   npm run lint

   # Compilación estricta de TypeScript y bundle de producción
   npm run build
   ```

---

## 🧪 Pruebas Automatizadas

La aplicación cuenta con **57 tests automatizados** desarrollados con **Vitest** y **React Testing Library**, estructurados con mocks completos para correr de forma 100% aislada:

```bash
# Ejecutar la suite completa de pruebas
npm run test

# Ejecutar en modo interactivo / watch
npm run test:watch
```

### Detalle de Suites de Pruebas:

- `tests/unit/date.utils.test.ts`: Formateo de fechas y manejo de timestamps inválidos (2 tests).
- `tests/unit/auth.service.test.ts`: Mapeo exhaustivo de errores de Firebase en español y desacople de sesión (10 tests).
- `tests/unit/task.service.test.ts`: Operaciones CRUD con Firestore mockeado y ordenamiento cronológico (7 tests).
- `tests/unit/email.service.test.ts`: Cliente de email, token Bearer y control de errores de red (6 tests).
- `tests/unit/send-summary.handler.test.ts`: Handler serverless de Vercel, validación de token 401, rechazo de correo ajeno 403, saneamiento HTML y despacho SES 200 (9 tests).
- `tests/components/ProtectedRoute.test.tsx`: Redirección sin sesión, pantalla de loading y renderizado seguro (3 tests).
- `tests/components/TodoForm.test.tsx`: Validaciones de formulario, espacios en blanco y bloqueo en loading (5 tests).
- `tests/components/TodoList.test.tsx`: Skeletons, filtrado por pestañas y estados vacíos (7 tests).
- `tests/components/TodoItem.test.tsx`: Flujo de edición en línea, cancelación, validación de título y feedback de error (6 tests).
- `tests/components/ThemeToggle.test.tsx`: Conmutador dinámico de temas y accesibilidad (2 tests).

---

## 🛡️ Reglas de Seguridad de Cloud Firestore

El archivo [firestore.rules](./firestore.rules) garantiza el principio de mínimo privilegio:

```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.title is string
                    && request.resource.data.title.size() > 0;
      allow update: if request.auth != null
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.title is string
                    && request.resource.data.title.size() > 0;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🤖 Reflexión sobre el Uso Crítico y Responsable de Inteligencia Artificial

Durante el desarrollo de **Cuaderno**, las herramientas de Inteligencia Artificial (Google Gemini, Claude y Antigravity AI) se emplearon bajo una metodología rigurosa de **pair-programming asistido**, priorizando siempre la comprensión del código y el criterio propio del desarrollador:

1. **Patrones de Interacción Adoptados**:
   - **Pedir pasos**: En lugar de solicitar bloques masivos de código, las tareas complejas (como la arquitectura mobile-first o la integración con SES) se descompusieron en fases lógicas iterativas.
   - **Pedir ejemplos mínimos**: Ante escenarios desconocidos (como la configuración del plugin SSR de Vite para emular Vercel Functions en local), se solicitaron pruebas de concepto concisas y aisladas.
   - **Comparar con docs**: Cada sugerencia sobre el SDK v3 de AWS o la API modular de Firebase v13 fue contrastada directamente con la documentación técnica oficial antes de integrarse.
   - **Escribir tests para validar**: Se desarrollaron pruebas unitarias y de integración inmediatamente después de cada componente o servicio para certificar empíricamente el comportamiento y los casos borde.

2. **Decisiones Técnicas Justificadas con Criterio Propio**:
   - Se descartó el uso de `firebase-admin` en el backend serverless para no incorporar claves de cuenta de servicio complejas, resolviendo la autenticación mediante la API REST de Google Identity Toolkit.
   - Se migró estratégicamente la infraestructura de SES a `us-east-2` tras diagnosticar los bloqueos por políticas SCP en `us-east-1`.
   - Se eliminaron las llamadas sincrónicas de `setState` dentro de efectos en `useTasks.ts` para alinearse con los estándares del React Compiler y optimizar los renders.

> Para consultar el registro cronológico completo de las 10 etapas de desarrollo, prompts y análisis crítico, consulta la [Bitácora de Uso de IA](./documentation/uso-de-ia.md).

---

## 📄 Licencia

Desarrollado con dedicación por **Rey Gabriel** para el Proyecto Integrador M4 de Henry.  
Distribuido bajo la licencia MIT.

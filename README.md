# 📓 Cuaderno — Gestor Estratégico de Tareas

[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://cuaderno-app-rey-gabriel-indol.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x_Strict-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-ffca28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![AWS SES](https://img.shields.io/badge/AWS-SES_v3-ff9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/ses/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0_Passing_27/27-729b1a?style=for-the-badge&logo=vitest)](https://vitest.dev/)

> **Proyecto Integrador M4 — Henry Bootcamp**  
> **Cliente / Caso de Uso:** MateCode Startup  
> **Desarrollador:** Rey Gabriel  
> **Aplicación en Producción:** [https://cuaderno-app-rey-gabriel-indol.vercel.app](https://cuaderno-app-rey-gabriel-indol.vercel.app)

---

## 🌟 Descripción Ejecutiva

**Cuaderno** es una aplicación web de gestión estratégica de tareas diseñada con un enfoque _mobile-first_ y una estética contemporánea de **Liquid Glass (Glassmorphism)** inspirada en los sistemas operativos modernos de Apple. La plataforma permite a los usuarios autenticarse de manera segura, registrar y categorizar tareas en tiempo real, visualizar métricas dinámicas de productividad y despachar resúmenes ejecutivos directamente a su correo electrónico mediante una arquitectura serverless en la nube.

---

## 🚀 Características Principales

1. **Autenticación Robusta y Multiproveedor**:
   - Registro e inicio de sesión con Correo / Contraseña.
   - Integración nativa con Google Auth Popup.
   - Persistencia reactiva de sesión (`onAuthStateChanged`) y protección de rutas privadas.
   - Mensajería de error localizada 100% en español.

2. **Gestión de Tareas en Tiempo Real (Cloud Firestore)**:
   - Sincronización bidireccional reactiva (`onSnapshot`) sin necesidad de recargar la página.
   - Creación, edición en línea, cambio de estado (pendiente/completada) y eliminación de tareas.
   - Pestañas de filtrado (_Todas_, _Pendientes_, _Completadas_) con contadores numéricos interactivos.
   - Estados de carga interactivos (_skeleton shimmer_) y estados vacíos ilustrados.

3. **Arquitectura Serverless y Despacho de Correos (AWS SES)**:
   - Endpoint backend `/api/send-summary` ejecutado en Vercel Functions.
   - Integración con el SDK v3 de AWS (`@aws-sdk/client-ses`).
   - Plantillas de correo duales: diseño visual HTML optimizado para dispositivos móviles y versión en texto plano para clientes heredados.
   - Validación rigurosa de payload y manejo exhaustivo de excepciones de red y credenciales.

4. **Diseño de Autor con Glassmorphism**:
   - Efecto de vidrio esmerilado con desenfoque de 20px (`backdrop-filter: blur(20px)`), transparencias calculadas y bordes reflectivos sutiles.
   - Compatibilidad nativa con temas Claro y Oscuro mediante CSS Tokens (`src/index.css`).
   - Logotipo oficial adaptable con `<picture>` para optimización de renderizado.
   - Cero dependencias CSS innecesarias: 100% Vanilla CSS responsivo y accesible.

5. **Suite Completa de Pruebas Automatizadas**:
   - 27 pruebas unitarias y de integración de componentes ejecutadas con **Vitest** y **React Testing Library**.
   - Cobertura de casos borde (inputs vacíos, espacios en blanco, respuestas serverless 500, fallos de red y estados de carga asíncronos).

---

## 🛠️ Stack Tecnológico

| Capa                   | Tecnología                | Justificación y Rol                                                                                             |
| :--------------------- | :------------------------ | :-------------------------------------------------------------------------------------------------------------- |
| **Frontend Framework** | **React 19**              | Biblioteca declarativa de interfaz de usuario con hooks modernos.                                               |
| **Lenguaje**           | **TypeScript 5 (Strict)** | Tipado estático riguroso (`noImplicitAny`, chequeo nulo estricto) para prevenir errores en tiempo de ejecución. |
| **Bundler & Tooling**  | **Vite 6**                | Empaquetado ultrarrápido y Hot Module Replacement (HMR).                                                        |
| **Autenticación**      | **Firebase Auth**         | Gestión segura de identidad de usuarios, tokens JWT y sesiones persistentes.                                    |
| **Base de Datos**      | **Cloud Firestore**       | Base de datos NoSQL documental con sincronización reactiva en tiempo real.                                      |
| **Backend Serverless** | **Vercel Functions**      | Ejecución de funciones en el borde (_Edge/Serverless_) para aislar credenciales privadas.                       |
| **Servicio de Correo** | **AWS SES (SDK v3)**      | Infraestructura empresarial escalable de envío de correos electrónicos transaccionales.                         |
| **Testing**            | **Vitest + RTL**          | Entorno de pruebas de alto rendimiento con emulación DOM (`jsdom`).                                             |
| **Estilos**            | **Vanilla CSS**           | Sistema de tokens de diseño moderno, transiciones suaves y estética _Glassmorphism_.                            |
| **Hosting & CI/CD**    | **Vercel**                | Despliegue continuo automatizado con integración directa a GitHub.                                              |

---

## 📂 Estructura del Proyecto

El código fuente sigue una arquitectura por capas modular y predecible:

```text
cuaderno-app/
├── api/
│   ├── send-summary.ts          # Serverless Function de Vercel (despacho AWS SES)
│   └── verify-identity.ts       # Verificación automática de identidades en AWS SES Sandbox
├── public/                      # Activos públicos estáticos
├── src/
│   ├── assets/                  # Isotipos y logotipos oficiales de Cuaderno
│   ├── components/              # Componentes de UI reutilizables (TodoForm, TodoItem, TodoList, etc.)
│   ├── features/
│   │   └── auth/                # Proveedor de contexto y estado de autenticación (AuthContext)
│   ├── hooks/                   # Custom Hooks (useAuth, useTasks)
│   ├── pages/                   # Páginas de la aplicación (LoginPage, RegisterPage, TasksPage)
│   ├── routes/                  # Configuración de React Router y Guardias (ProtectedRoute)
│   ├── services/                # Capa de adaptadores e integraciones (firebase, auth, task, email)
│   ├── types/                   # Definiciones de tipos e interfaces TypeScript (auth, task)
│   ├── utils/                   # Funciones utilitarias puras (date.utils)
│   ├── App.css                  # Estilos del layout dividido y contenedor principal
│   ├── App.tsx                  # Enrutador principal de la aplicación
│   ├── index.css                # Sistema de tokens CSS, temas claro/oscuro y utilidades Glass
│   └── main.tsx                 # Punto de entrada de React 19
├── tests/
│   ├── components/              # Pruebas de integración de componentes UI (TodoForm, TodoList)
│   ├── unit/                    # Pruebas unitarias de servicios y utilidades (auth, email, date)
│   └── setup.ts                 # Configuración global del entorno de pruebas
├── firestore.rules              # Reglas de seguridad declarativas de Cloud Firestore
├── vercel.json                  # Reglas de enrutamiento SPA y reescritura de Vercel
├── vite.config.ts               # Configuración de compilador y entorno Vitest
└── tsconfig.app.json            # Configuración estricta del compilador TypeScript
```

---

## ⚙️ Configuración y Variables de Entorno

Para ejecutar el proyecto localmente o desplegarlo en Vercel, se debe configurar un archivo `.env` en la raíz (toma como base [.env.example](file:///.env.example)):

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
AWS_REGION=us-east-2
AWS_SES_REGION=us-east-2
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCY...
AWS_SES_SENDER_EMAIL=info.cuadernoapp@gmail.com
```

> **Nota técnica sobre AWS SES y Vercel (Modo Sandbox & Región)**:
>
> 1. **Aislamiento de Región**: Vercel asigna automáticamente la variable reservada de sistema `AWS_REGION=us-east-1` por su datacenter físico. El backend de Cuaderno implementa `AWS_SES_REGION` para desacoplar el servicio de mensajería y garantizar la conexión con la región autorizada (`us-east-2` Ohio).
> 2. **Modo Sandbox**: La cuenta de AWS SES opera bajo el entorno controlado de Sandbox (sin dominio corporativo propio). En este modo, tanto el remitente (`info.cuadernoapp@gmail.com`) como los destinatarios deben ser identidades verificadas.
> 3. **Verificación Automática al Registrarse**: Para optimizar la experiencia de usuario, la aplicación invoca automáticamente el endpoint `/api/verify-identity` al crear una cuenta o iniciar sesión. AWS SES envía de inmediato un email de confirmación al buzón del usuario; una vez confirmado el enlace, queda habilitado para recibir el resumen de sus tareas.

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

3. **Iniciar el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

   La aplicación se abrirá en `http://localhost:5173`.

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

---

## 🧪 Pruebas Automatizadas

La aplicación cuenta con **27 tests automatizados** desarrollados con **Vitest** y **React Testing Library**, cubriendo flujos exitosos y casos de borde:

```bash
# Ejecutar la suite completa de pruebas
npm run test

# Ejecutar en modo observador (watch)
npm run test:watch
```

### Resumen de Pruebas:

- `tests/unit/date.utils.test.ts`: Formateo de fechas relativas y manejo de marcas de tiempo nulas o inválidas (2 tests).
- `tests/unit/auth.service.test.ts`: Mapeo exhaustivo de códigos de error de Firebase a mensajes legibles en español y formateo de sesiones (10 tests).
- `tests/unit/email.service.test.ts`: Despacho del resumen, validación de respuestas 200, captura de fallos 500 y errores de red en el serverless (3 tests).
- `tests/components/TodoForm.test.tsx`: Renderizado, validación de títulos vacíos o solo espacios, guardado asíncrono y bloqueo de inputs durante carga (5 tests).
- `tests/components/TodoList.test.tsx`: Renderizado de skeleton loaders, estados vacíos, filtrado por pestañas, alternancia de estados y confirmación de borrado en línea (7 tests).

---

## 🛡️ Reglas de Seguridad de Cloud Firestore

Para proteger la integridad y privacidad de la información, el archivo [firestore.rules](file:///firestore.rules) garantiza que cada usuario autenticado tenga acceso exclusivamente a sus propios documentos:

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
                    && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🤖 Reflexión sobre el Uso de Inteligencia Artificial

Durante el desarrollo de **Cuaderno**, la Inteligencia Artificial fue utilizada de forma estratégica, metódica y reflexiva bajo el rol de **asistente de programación en pareja (_pair programming_) y mentor pedagógico**:

1. **Diseño y Exploración de Identidad (Etapas 0 y 1)**:
   - Se utilizaron modelos generativos para explorar naming, paletas cromáticas accesibles y el diseño conceptual del isotipo, seleccionando la metáfora de un cuaderno clásico fusionada con el efecto vanguardista _Liquid Glass_ de Apple.
2. **Arquitectura y Aislamiento de Capas**:
   - Se estructuró el código separando estrictamente la UI de la infraestructura mediante servicios desacoplados (`task.service.ts`, `auth.service.ts`, `email.service.ts`), asegurando que la lógica de Firebase o AWS no contaminara los componentes de React.
3. **Resolución Crítica de Problemas en la Nube (AWS SES & Vercel)**:
   - Ante el bloqueo originado por las políticas de control de servicio (SCP) de AWS en `us-east-1` y la colisión de la variable reservada `AWS_REGION` de Vercel Functions, se analizó el error en profundidad, diagnosticando la necesidad de operar en `us-east-2` (Ohio) y desacoplando la variable con `AWS_SES_REGION`.
4. **Validación Rigurosa y Criterio Propio**:
   - Ninguna línea de código fue integrada sin previo análisis crítico y validación de tipos. Se adaptaron sintaxis modernas (reemplazo de `FormEvent` deprecado en React 19 por `SyntheticEvent<HTMLFormElement>`, manejo de `act(...)` en Vitest y ordenamiento en memoria para optimizar Firestore sin necesidad de índices compuestos costosos).

> Para consultar el registro cronológico completo de prompts, iteraciones y decisiones de diseño, consulta la [Bitácora de Uso de IA](file:///documentation/uso-de-ia.md).

---

## 📄 Licencia

Desarrollado con dedicación por **Rey Gabriel** para el Proyecto Integrador M4 de Henry.
Distribuido bajo la licencia MIT.

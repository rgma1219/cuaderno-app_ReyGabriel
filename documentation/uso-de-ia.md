# 📓 Bitácora de Uso y Asistencia de Inteligencia Artificial

> **Proyecto:** Cuaderno (Gestor de tareas minimalista con estética _Glassmorphism_)  
> **Desarrollador:** Rey Gabriel  
> **Objetivo del documento:** Registrar de manera transparente, metódica y estructurada todas las interacciones con herramientas de Inteligencia Artificial a lo largo del ciclo de vida del desarrollo, incluyendo prompts, análisis crítico de las respuestas, decisiones adoptadas y evidencias visuales (capturas de pantalla).

---

## 🗂️ Índice de Etapas de Desarrollo

- [Etapa 0: Ideación y Naming](#-etapa-0-ideación-y-naming)
- [Etapa 1: Diseño de identidad visual y paletas UX/UI](#-etapa-1-diseño-de-identidad-visual-y-paletas-uxui)
- [📋 Plantilla Reutilizable para Nuevas Interacciones](#-plantilla-reutilizable-para-nuevas-consultas)
- [Guía para adjuntar capturas de pantalla](#-guía-para-adjuntar-capturas-de-pantalla)

---

## 🚀 Etapa 0: Ideación y Naming

### 📋 Ficha Técnica

- **Fecha:** 11/10/2026
- **Modelo:** Google Gemini
- **Objetivo:** Lluvia de ideas y validación de naming/branding para el proyecto integrador (gestor de tareas).

---

### 📥 1. Prompt Inicial (Usuario)

> _"Tengo que hacer un gestor de tareas como proyecto integrador de mi curso de programación. Que nombre recomendarias? Pensé en DO-Tasks... recomendame algunos."_

---

### 📤 2. Respuesta de la IA

- **Análisis de la propuesta:** Validación de _DO-Tasks_.
- **Propuestas presentadas (categorizadas en tres enfoques):**
  - **Guiños a código:** `TaskScript`, `CommitTask`, `Console.todo()`, `BitTask`.
  - **Minimalistas / Startups:** `Taskify`, `ZenTask`, `Tickly`, `NexusTask`.
  - **En español:** `HacerApp`, `PendienteX`, `Metódico`.

---

### 🔄 3. Intercambio y Refinamiento (Iteración)

#### Prompt del Usuario (Iteración 1)

> _"Pienso en darle un estilo minimalista actual como liquid glass de Apple... Me gusta el nombre Cuaderno... que te parece?"_

#### Respuesta de la IA (Iteración 1)

- **Evaluación del concepto:** Se aprobó y valoró positivamente el nombre **Cuaderno**, destacando el contraste armónico entre un concepto tradicional/analógico y una estética digital vanguardista (_Liquid Glass / Glassmorphism_).
- **Sugerencia de variantes:** `Cuaderno Glass`, `Cuaderno.glass`, `Cuaderno OS`.
- **Aportes técnicos y de diseño:** Recomendaciones rápidas de UI (tipografías sans-serif limpias, paletas de colores neutras y reglas CSS para el efecto translúcido/vidrio desenfocado `backdrop-filter`).

---

### 📸 4. Evidencias Visuales (Capturas de Pantalla)

<!-- Pega aquí la captura de tu conversación con Gemini -->

![Conversación con Gemini sobre el naming y diseño](./capturas/etapa-00-naming-gemini.png)  
_Captura 0.1: Intercambio con Google Gemini definiendo el nombre "Cuaderno" y el estilo visual Liquid Glass._

---

### 📌 5. Conclusiones y Decisiones Tomadas

- [x] **Nombre seleccionado:** **Cuaderno** (con posibilidad de usar _Cuaderno.glass_ como identidad de marca/subtítulo).
- [x] **Dirección del proyecto:** Gestor de tareas con interfaz minimalista inspirada en el efecto _Liquid Glass_ (estilo Apple / Glassmorphism moderno).
- [x] **Criterio de adopción:** Se descartaron nombres técnicos en inglés en favor de un nombre cercano y directo en español que enfatice simplicidad y claridad de uso.

---

## 🚀 Etapa 1: Diseño de identidad visual y paletas UX/UI

### 📋 Ficha Técnica

- **Fecha:** 11/10/2026
- **Modelo:** ChatGPT (GPT-6)
- **Objetivo:** Diseñar una propuesta de logo minimalista para una aplicación web mobile-first de gestión de tareas llamada Cuaderno, utilizando Glassmorphism, y definir dos paletas de colores coherentes para los temas claro y oscuro.

---

### 📥 1. Prompt Inicial (Usuario)

> _"Se un diseñador gráfico experto diseño UI/UX._  
> _Estoy por hacer una aplicación web mobile-first de un gestor de tareas. El nombre va a ser Cuaderno, así con la C mayúscula. El concepto de diseño de la app es Glassmorphism. Necesito un logo. No debería ser tan invasivo porque la idea es mantenerlo limpio como un cuaderno nuevo. Dame una propuesta."_

---

### 📤 2. Respuesta de la IA

- **Puntos clave de la respuesta:**
  - **Identidad visual:** Se propuso un isotipo con forma de cuaderno de hojas translúcidas, bordes redondeados y una letra «C» blanca como elemento central.
  - **Estilo gráfico:** Se aplicó el concepto Glassmorphism mediante transparencias, efecto de vidrio esmerilado, reflejos suaves, degradados pastel y sombras difuminadas.
  - **Tipografía:** Se recomendó una tipografía sans serif moderna, limpia y ligeramente redondeada, utilizando el nombre «Cuaderno» con la C mayúscula.
  - **Tema oscuro:** Se desarrolló una propuesta visual con fondo azul noche, superficies azuladas y reflejos en azul, lavanda y rosa.
  - **Tema claro:** Se generó una propuesta complementaria con fondos blancos y grisáceos, azul cielo, lavanda y rosa pastel.
  - **Diseño adaptable:** Se mostraron variantes del icono para diferentes tamaños y simulaciones de interfaz de escritorio y móvil.
  - **Criterios UX/UI:** Se recomendó priorizar la legibilidad, mantener espacios en blanco y reservar los efectos de vidrio para tarjetas, paneles y elementos de navegación.
  - **Implementación técnica:** Se sugirieron valores iniciales para opacidad, desenfoque, bordes redondeados y sombras.

#### 🎨 Paletas de colores propuestas

**Tema claro**

| Uso                          | Tema Claro | Tema Oscuro |
| ---------------------------- | ---------- | ----------- |
| Fondo principal              | #FDFDFD    | #0F172A     |
| Superficies y tarjetas Glass | #E8F2FF    | #1E293B     |
| Bordes y divisores           | #E2E8F0    | #475569     |
| Acciones principales         | #A7D8FF    | #3B82F6     |
| Acentos y detalles           | #C7B8FF    | #A78BFA     |
| Etiquetas y estados          | #FFB6D9    | #F472B6     |
| Títulos y contenido          | #334155    | #F8FAFC     |
| Texto secundario             | #64748B    | #94A3B8     |
| Estado completado            | #059669    | #34D399     |

![Propuesta paletas de colores de Cuaderno](./capturas/paletas-cuaderno.png)

---

### 🔄 3. Intercambio y Refinamiento (Iteración)

#### Prompts del Usuario (Iteraciones de seguimiento)

- **Iteración 1 (Tema oscuro):**

  > _"Me encantó el diseño y las recomendaciones. Me puedes dar una opción para el tema oscuro de la app con su respectiva paleta de colores."_

- **Iteración 2 (Tema claro):**
  > _"Haz una propuesta así como esta pero con los colores para el tema claro. Así tengo las dos opciones."_

#### Análisis Crítico y Modificaciones del Desarrollador

- **¿Qué se adoptó directamente?:**
  - La idea de un cuaderno translúcido como símbolo de marca.
  - La letra «C» blanca como elemento central del isotipo.
  - La combinación de Glassmorphism con una estética minimalista.
  - La utilización de tonos pastel en el tema claro y colores azulados más profundos en el tema oscuro.
  - La adaptación visual del sistema para dispositivos móviles y pantallas de escritorio.
  - La recomendación de mantener una interfaz despejada, donde las tareas sean las protagonistas.

- **¿Qué se modificó o descartó?:**
  - Durante esta interacción no se documentaron modificaciones ni descartes explícitos por parte del desarrollador.
  - Las paletas y los valores técnicos se consideran propuestas iniciales, sujetas a validación mediante pruebas de legibilidad, accesibilidad y uso real.
  - Los colores definitivos y los efectos de transparencia deberán ajustarse durante la implementación del diseño en código.

---

### 📸 4. Evidencias Visuales (Capturas de Pantalla)

<!-- Capturas de pantalla de la identidad visual y temas -->

![Propuesta de identidad visual y paleta para el tema oscuro de Cuaderno](./capturas/cuaderno-tema-oscuro.png)  
_Captura 1.1: Identidad visual de Cuaderno, paleta de colores del tema oscuro y ejemplos de interfaz para escritorio y móvil._

![Propuesta de identidad visual y paleta para el tema claro de Cuaderno](./capturas/cuaderno-tema-claro.png)  
_Captura 1.2: Adaptación de la identidad visual al tema claro, con tonos pastel, superficies translúcidas y ejemplos de interfaz._

> **Nota:** Las rutas de las capturas son referencias para organizar las evidencias del proyecto. Se deben guardar las imágenes correspondientes en la carpeta `capturas` y ajustar los nombres si fuera necesario.

---

### 📌 5. Conclusiones y Decisiones Tomadas

- [x] **Dirección visual:** Definir una dirección visual inicial para la marca Cuaderno.
- [x] **Isotipo:** Proponer un isotipo minimalista basado en un cuaderno translúcido con la letra «C».
- [x] **Paleta tema claro:** Definir una paleta cromática inicial para el tema claro.
- [x] **Paleta tema oscuro:** Definir una paleta cromática inicial para el tema oscuro.
- [x] **Criterios de diseño:** Establecer criterios generales de diseño responsive y Glassmorphism.

**Resultado final:** La inteligencia artificial se utilizó como asistente de diseño gráfico y UX/UI para explorar una identidad visual, generar referencias gráficas y definir una base cromática para ambos temas. Las propuestas deberán integrarse y validarse durante el desarrollo de la aplicación.

---

## 📋 Plantilla Reutilizable para Nuevas Consultas

> 💡 _Puedes copiar y pegar este bloque al final de este documento tantas veces como necesites para registrar consultas adicionales o temas específicos._

```markdown
### 🚀 [Número y Nombre de la Consulta / Interacción]

#### 📋 Ficha Técnica

- **Fecha:** DD/MM/AAAA
- **Modelo:** Google Gemini / Claude / ChatGPT
- **Objetivo:** [Describir en una línea qué se buscaba resolver]

#### 📥 Prompt del Usuario

> "[Escribe aquí el prompt exacto que enviaste]"

#### 📤 Respuesta de la IA

- **Puntos clave de la respuesta:**
  - [Punto 1]
  - [Punto 2]

#### 🔄 Análisis Crítico y Modificaciones del Desarrollador

- **¿Qué se adoptó directamente?:** [Detalle]
- **¿Qué se modificó o descartó?:** [Detalle de los cambios propios]

#### 📸 Evidencia Visual (Captura de Pantalla)

![Descripción de la captura](./capturas/nombre-de-la-captura.png)
_Captura X.X: [Breve descripción de la evidencia]_

#### 📌 Conclusión

- [ ] [Acción o decisión final implementada en el código]
```

---

## 📸 Guía para adjuntar capturas de pantalla

Para mantener el proyecto ordenado y asegurar que las imágenes se visualicen correctamente tanto en VS Code / IDE como en GitHub:

1. **Guarda las imágenes** en la carpeta local:  
   📂 `Documentación/capturas/`
2. **Convención de nombres recomendada:**  
   `etapa-[número]-[descripcion].png` (por ejemplo: `etapa-00-naming-gemini.png`).
3. **Inserta la imagen en Markdown:**
   ```markdown
   ![Descripción de la captura](./capturas/etapa-00-naming-gemini.png)
   ```
4. _Opcional:_ Puedes agregar un pie de foto descriptivo debajo de la imagen usando cursiva (`*Captura 1.1: Interacción con Gemini...*`).

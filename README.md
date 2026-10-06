# Podcast App

Aplicación web de podcasts desarrollada como prueba técnica frontend, utilizando **Next.js, React, TypeScript y CSS Modules**, consumiendo datos de la API pública de Apple Podcasts.

El objetivo del proyecto no es únicamente implementar las funcionalidades solicitadas, sino mantener una arquitectura **modular, mantenible, testeable y escalable**, justificando las decisiones técnicas tomadas durante el desarrollo.

---

## 1. Funcionalidades

La aplicación permite:

* Consultar el Top 100 de podcasts de Apple Podcasts.
* Buscar podcasts por título o autor.
* Acceder al detalle de un podcast.
* Consultar sus episodios.
* Acceder al detalle individual de un episodio.
* Reproducir el episodio mediante el reproductor de audio nativo del navegador.
* Mantener los datos en caché durante 24 horas.
* Navegar entre las diferentes vistas mediante rutas dinámicas.
* Adaptar la interfaz a desktop, tablet y mobile.
* Mostrar estados de carga reutilizables.
* Gestionar errores de las peticiones a la API.
* Mantener una interfaz accesible mediante HTML semántico y atributos ARIA cuando son necesarios.

---

# 2. Tecnologías utilizadas

## Core

* **Next.js 16**
* **React**
* **TypeScript**
* **App Router**

## Estilos

* **CSS Modules**
* **CSS Variables**
* CSS responsive desarrollado desde cero.

No se utilizan librerías de componentes como Material UI, Bootstrap, Chakra UI o similares, siguiendo los requisitos de la prueba.

## Testing

* **Jest**
* **React Testing Library**
* **@testing-library/user-event**
* **jest-dom**

## Calidad y desarrollo

* **ESLint**
* **Turbopack**
* **Git**
* **Git tags**

---

# 3. Arquitectura

La aplicación sigue una arquitectura basada en separación de responsabilidades.

```text
src/
├── app/
│   ├── page.tsx
│   ├── podcast/
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── episode/
│   │           └── [episodeId]/
│   │               └── page.tsx
│   └── globals.css
│
├── components/
│   ├── Header/
│   ├── Loading/
│   ├── PodcastCard/
│   ├── PodcastDetail/
│   ├── PodcastEpisodeDetail/
│   ├── PodcastGrid/
│   ├── PodcastSidebar/
│   └── SearchBar/
│
├── hooks/
│   ├── usePodcasts.ts
│   └── usePodcastDetail.ts
│
├── services/
│   └── podcastService.ts
│
├── lib/
│   └── cache.ts
│
└── types/
    └── podcast.ts
```

La intención es evitar que los componentes de presentación conozcan los detalles de comunicación con la API o de persistencia de datos.

---

# 4. Separación de responsabilidades

La aplicación separa las responsabilidades en diferentes capas.

### Components

Los componentes se encargan principalmente de la representación visual y de la interacción del usuario.

Por ejemplo:

* `PodcastCard`
* `PodcastGrid`
* `SearchBar`
* `PodcastSidebar`
* `PodcastDetail`
* `PodcastEpisodeDetail`

Cada componente tiene una responsabilidad concreta.

### Hooks

Los custom hooks encapsulan la lógica relacionada con la obtención y gestión de datos.

```text
usePodcasts
      ↓
podcastService
      ↓
Apple Podcasts API
```

Y para el detalle:

```text
usePodcastDetail
      ↓
cache
      ↓
podcastService
      ↓
Apple Podcasts API
```

Esto permite mantener la lógica de datos fuera de los componentes visuales.

### Services

`podcastService.ts` es responsable exclusivamente de comunicarse con Apple Podcasts y transformar su respuesta al modelo utilizado por la aplicación.

De esta forma, los componentes no necesitan conocer la estructura concreta de la respuesta de Apple.

### Lib

Las utilidades generales se encuentran en `lib`.

Actualmente contiene la estrategia de caché utilizada por la aplicación.

### Types

Los modelos de dominio se centralizan en `types/podcast.ts`.

Esto permite mantener el tipado consistente entre servicios, hooks y componentes.

---

# 5. Flujo de datos

El flujo principal de la aplicación es:

```text
                    ┌─────────────────────┐
                    │       Page          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Custom Hook      │
                    │ usePodcasts /       │
                    │ usePodcastDetail    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │       Cache         │
                    │    localStorage     │
                    └──────────┬──────────┘
                               │
                         cache miss
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Service        │
                    │  podcastService     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Apple Podcasts    │
                    │        API          │
                    └─────────────────────┘
```

La separación permite cambiar posteriormente la fuente de datos sin tener que modificar los componentes de presentación.

---

# 6. Patrones y principios utilizados

## Single Responsibility Principle

Cada pieza de la aplicación intenta tener una responsabilidad clara.

Por ejemplo:

* `SearchBar` gestiona la interfaz de búsqueda.
* `PodcastGrid` representa una colección de podcasts.
* `PodcastCard` representa un podcast individual.
* `podcastService` se ocupa de la comunicación con Apple.
* `cache.ts` gestiona la persistencia temporal.
* `usePodcastDetail` coordina la obtención del detalle.

Esto facilita el mantenimiento y especialmente el testing.

---

## Componentización

La interfaz se divide en componentes reutilizables.

Un ejemplo es `PodcastSidebar`.

Inicialmente la información lateral era necesaria en más de una vista. En lugar de duplicar el código, se extrajo a un componente reutilizable:

```tsx
<PodcastSidebar podcast={podcast} />
```

Y en el detalle del episodio:

```tsx
<PodcastSidebar
  podcast={podcast}
  showBackLink
/>
```

De esta forma se reutiliza la estructura visual manteniendo pequeñas diferencias mediante propiedades.

---

## Composición

Se utiliza composición para evitar componentes excesivamente acoplados.

Por ejemplo, `PodcastEpisodeDetail` utiliza `PodcastSidebar` como parte de su estructura en lugar de duplicar su implementación.

Esto facilita modificar posteriormente la sidebar desde un único lugar.

---

# 7. Custom Hooks

Se utilizan custom hooks para separar la lógica de datos de la interfaz.

## usePodcasts

Se encarga de:

* Obtener los podcasts.
* Consultar la caché.
* Realizar la petición cuando es necesaria.
* Actualizar el estado.
* Gestionar el estado de carga.
* Gestionar errores.

## usePodcastDetail

Se encarga de:

* Obtener el detalle de un podcast.
* Consultar la caché correspondiente.
* Reutilizar información disponible desde la home.
* Obtener los episodios.
* Guardar el resultado en caché.
* Gestionar el estado de carga y errores.

Esto permite que las páginas permanezcan centradas en la composición de la interfaz.

---

# 8. Gestión del estado

No se ha incorporado una librería global de estado ni Context API porque el estado necesario en esta aplicación es limitado y está localizado.

Existen principalmente dos tipos de estado:

### Estado remoto

La información procedente de Apple Podcasts se gestiona mediante:

* `usePodcasts`
* `usePodcastDetail`
* servicio de API
* caché

### Estado local

El texto introducido en el buscador pertenece únicamente a la home:

```tsx
const [search, setSearch] = useState('');
```

No existe actualmente un estado global complejo que justifique introducir una capa adicional.

Esta decisión evita sobrearquitectura y mantiene la solución sencilla.

Si la aplicación evolucionase y apareciera información compartida entre múltiples flujos, podría incorporarse Context API, Zustand u otra solución de estado global de forma justificada.

---

# 9. Estrategia de caché

Uno de los requisitos importantes de la aplicación es evitar peticiones innecesarias.

Se implementó una caché basada en `localStorage` con una duración de **24 horas**.

```text
                    ¿Existe caché?
                         │
                ┌────────┴────────┐
                │                 │
               NO                SÍ
                │                 │
                ▼                 ▼
          Apple Podcasts     ¿Ha expirado?
                │                 │
                │          ┌──────┴──────┐
                │          │             │
                │         NO            SÍ
                │          │             │
                │          ▼             ▼
                │       Usar caché   Nueva petición
                │                        │
                └──────────┬─────────────┘
                           ▼
                     Guardar caché
```

La caché almacena:

```ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
}
```

Cuando se recuperan los datos se comprueba:

```text
Date.now() - timestamp > 24 horas
```

Si la información ha expirado, se elimina y se realiza una nueva petición.

### ¿Por qué 24 horas?

El Top de podcasts no necesita actualizarse constantemente para este caso de uso.

Una duración de 24 horas permite:

* Reducir peticiones a Apple.
* Mejorar los tiempos de navegación.
* Evitar peticiones repetidas durante una misma sesión.
* Mantener una información suficientemente actualizada para el objetivo de la prueba.

---

# 10. Caché del detalle

El detalle de cada podcast utiliza una clave independiente:

```text
podcast-detail-{podcastId}
```

Esto evita que consultar un podcast implique volver a solicitar todos los detalles previamente consultados.

Además, si existe información del podcast procedente de la home, se utiliza para completar datos que puedan no estar disponibles en la respuesta de detalle.

Esto permite aprovechar información que ya posee el cliente y reducir dependencias innecesarias.

---

# 11. Filtrado de podcasts

El filtrado se realiza en cliente porque el Top 100 ya está disponible en el navegador.

Se utiliza `useMemo`:

```tsx
const filteredPodcasts = useMemo(() => {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return podcasts;
  }

  return podcasts.filter(
    (podcast) =>
      podcast.title.toLowerCase().includes(normalizedSearch) ||
      podcast.author.toLowerCase().includes(normalizedSearch),
  );
}, [podcasts, search]);
```

Se normaliza el texto para que la búsqueda no dependa de mayúsculas/minúsculas ni de espacios innecesarios.

No se realiza una petición a la API por cada búsqueda porque no aporta valor en este caso y generaría tráfico innecesario.

---

# 12. Gestión de la API

La comunicación con Apple está centralizada en:

```text
src/services/podcastService.ts
```

Se utilizan dos endpoints principales.

### Top podcasts

```text
https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json
```

### Detalle y episodios

```text
https://itunes.apple.com/lookup?id={id}&media=podcast&entity=podcastEpisode&limit=20
```

El servicio transforma las respuestas externas al modelo interno de la aplicación.

Esto evita propagar la estructura específica de Apple por toda la aplicación.

---

# 13. TypeScript

El proyecto utiliza TypeScript para mantener un contrato claro entre las diferentes capas.

Por ejemplo:

```ts
export interface Podcast {
  id: string;
  title: string;
  author: string;
  image: string;
  description: string;
  podcastUrl?: string;
}
```

Y los episodios utilizan un modelo específico:

```ts
export interface Episode {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  duration: number;
  audioUrl: string;
}
```

Esto reduce errores durante el desarrollo y facilita la evolución del modelo.

Además, las respuestas externas de Apple se tipan antes de transformarse al modelo interno.

---

# 14. Manejo de errores

Las peticiones HTTP comprueban explícitamente el estado de la respuesta:

```ts
if (!response.ok) {
  throw new Error(
    `Failed to fetch podcasts: ${response.status}`,
  );
}
```

Los hooks capturan posteriormente los errores para evitar que un fallo de red provoque un error no controlado en la interfaz.

En caso de fallo, el estado de carga finaliza correctamente y la aplicación mantiene un estado seguro.

La capa de servicio, por tanto, se responsabiliza de los errores relacionados con la comunicación y los hooks de coordinar el estado de la interfaz.

---

# 15. Estados de carga

El estado de carga se ha encapsulado en un componente reutilizable:

```tsx
<Loading message="Cargando podcasts..." />
```

Esto evita duplicar estructuras de loading entre páginas.

Además, utiliza:

```html
role="status"
```

para comunicar el estado de carga a tecnologías de asistencia.

---

# 16. HTML procedente de Apple

La descripción de los episodios puede contener HTML y URLs.

En lugar de mostrar directamente el contenido sin procesar, se realiza una transformación previa.

Las URLs encontradas dentro del texto se convierten en enlaces:

```text
https://example.com
        ↓
<a href="https://example.com">
  https://example.com
</a>
```

Los enlaces externos utilizan:

```html
target="_blank"
rel="noopener noreferrer"
```

para evitar problemas relacionados con la apertura de contenido externo.

La transformación se realiza antes de utilizar `dangerouslySetInnerHTML`.

---

# 17. Responsive Design

El diseño se ha implementado desde cero utilizando CSS Modules y media queries.

No se utiliza ninguna librería visual externa.

El grid adapta el número de columnas dependiendo del viewport:

```text
Desktop
┌────┬────┬────┬────┐
│    │    │    │    │
└────┴────┴────┴────┘

Tablet
┌────┬────┬────┐
│    │    │    │
└────┴────┴────┘

Mobile
┌────┐
│    │
├────┤
│    │
└────┘
```

Esto permite mantener el diseño solicitado por la prueba sin depender de frameworks CSS.

---

# 18. CSS Modules y variables CSS

Se utiliza CSS Modules para encapsular los estilos de cada componente.

Ejemplo:

```text
PodcastCard.module.css
PodcastGrid.module.css
PodcastDetail.module.css
PodcastSidebar.module.css
```

Además, los valores reutilizables se centralizan mediante variables CSS:

```css
var(--color-primary)
var(--spacing-md)
var(--spacing-lg)
var(--font-size-md)
```

Esto permite modificar rápidamente aspectos globales del diseño sin introducir un sistema de diseño externo.

---

# 19. Accesibilidad

Se han aplicado diferentes medidas de accesibilidad:

* HTML semántico.
* Uso de `main`, `article`, `aside`, `h1`, `h2`, etc.
* `aria-label` en elementos cuyo propósito debe ser más explícito.
* `role="status"` para estados de carga.
* Navegación mediante elementos `<a>` reales.
* Texto alternativo en imágenes.
* Reproductor `<audio>` nativo.
* Elementos interactivos accesibles mediante teclado.

Por ejemplo, cada podcast tiene un nombre accesible:

```tsx
aria-label={`Ver podcast ${podcast.title}`}
```

Esto facilita la navegación mediante lectores de pantalla.

---

# 20. Optimización de imágenes

Las imágenes se cargan utilizando `next/image`.

Esto permite aprovechar las optimizaciones proporcionadas por Next.js.

Además, se utiliza `priority` únicamente para la primera imagen del grid:

```tsx
priority={index === 0}
```

La intención es evitar marcar todas las imágenes como prioritarias, reduciendo el impacto sobre la carga inicial.

---

# 21. Testing

El proyecto utiliza Jest y React Testing Library.

La estrategia de testing se centra en probar el **comportamiento observable** de la aplicación en lugar de detalles internos de implementación.

Actualmente se cubren:

```text
9 suites
57 tests
```

### Áreas cubiertas

| Área                 | Cobertura                                |
| -------------------- | ---------------------------------------- |
| Loading              | Renderizado y accesibilidad              |
| SearchBar            | Valor, cambios y limpieza                |
| PodcastGrid          | Renderizado, enlaces e imágenes          |
| PodcastDetail        | Episodios, fechas, duración y navegación |
| PodcastEpisodeDetail | Contenido, audio y navegación            |
| usePodcasts          | Carga, caché y errores                   |
| usePodcastDetail     | Caché, API y combinación de datos        |
| podcastService       | Peticiones y transformación de datos     |
| cache                | Persistencia y expiración                |

---

# 22. Ejemplo de test de componente

Por ejemplo, `PodcastGrid` comprueba que cada podcast genera el enlace correspondiente:

```tsx
it('crea un enlace al detalle de cada podcast', () => {
  render(<PodcastGrid podcasts={podcasts} />);

  expect(
    screen.getByRole('link', {
      name: 'Ver podcast First Podcast',
    }),
  ).toHaveAttribute('href', '/podcast/1');
});
```

Este test verifica el comportamiento que realmente necesita el usuario: que el podcast permite navegar a su detalle.

No se comprueba una clase CSS concreta ni una implementación interna.

---

# 23. Ejemplo de test de caché

La caché también se prueba de forma independiente.

Los tests verifican situaciones como:

```text
No existe → devuelve null

Existe y no ha expirado → devuelve datos

Existe pero ha expirado → elimina datos y devuelve null

setCachedData → almacena datos + timestamp
```

Esto permite garantizar una parte crítica de la arquitectura independientemente de la interfaz.

---

# 24. Ejemplo de test de servicio

El servicio se prueba comprobando:

* Que se realiza la petición correcta.
* Que los datos de Apple se transforman al modelo interno.
* Que los errores HTTP se propagan correctamente.
* Que los episodios se convierten correctamente.

Esta separación permite detectar errores en la integración con la API sin depender de renderizar componentes.

---

# 25. Calidad del código

Se utiliza ESLint para detectar problemas durante el desarrollo.

La aplicación se mantiene sin errores ni warnings de lint.

También se utiliza TypeScript para detectar inconsistencias de tipos antes de ejecutar la aplicación.

Los tests y el build se ejecutan como parte de la validación final del proyecto.

---

# 26. Rendimiento

Las principales decisiones relacionadas con rendimiento son:

### Caché

Reduce peticiones repetidas a Apple.

### `next/image`

Optimiza las imágenes.

### `priority`

Se utiliza únicamente para el primer elemento prioritario del grid.

### `useMemo`

Evita recalcular el filtrado cuando no cambian sus dependencias.

### Separación de datos y UI

Evita repetir lógica de obtención de datos en diferentes componentes.

### Producción

Next.js genera una build optimizada para producción.

---

# 27. ¿Por qué Next.js?

Next.js se ha utilizado porque proporciona una base adecuada para una aplicación React moderna y permite mantener abierta la posibilidad de utilizar renderizado del lado servidor cuando sea necesario.

Además proporciona:

* App Router.
* Routing basado en archivos.
* Optimización de imágenes.
* Build de producción optimizada.
* Integración natural con TypeScript.
* Arquitectura preparada para aplicaciones escalables.

Aunque la aplicación actual utiliza hooks cliente para determinadas funcionalidades, la arquitectura permite evolucionar posteriormente hacia estrategias de renderizado diferentes.

---

# 28. ¿Por qué no utilizar una librería de componentes?

La prueba solicita explícitamente componentes creados desde cero.

Por este motivo no se utilizan:

* Material UI.
* Bootstrap.
* Chakra UI.
* Ant Design.
* Tailwind UI.
* Otras librerías de componentes.

Esto permite controlar completamente:

* Espaciados.
* Tipografías.
* Responsive.
* Estados visuales.
* Estructura HTML.
* Accesibilidad.

---

# 29. ¿Por qué no utilizar Zustand?

Zustand es una solución excelente para gestionar estado global, pero en esta aplicación no existe un problema de estado global suficientemente complejo como para justificar su introducción.

El estado actual puede mantenerse correctamente mediante:

```text
useState
useMemo
custom hooks
localStorage
```

Introducir Zustand únicamente porque es una tecnología conocida habría añadido una dependencia y una capa de abstracción innecesaria.

La decisión se basa, por tanto, en las necesidades reales de la aplicación y no en utilizar una tecnología por defecto.

---

# 30. Escalabilidad

La estructura actual permite añadir nuevas funcionalidades sin tener que modificar toda la aplicación.

Por ejemplo, si posteriormente se añadiera:

* Favoritos.
* Historial de reproducción.
* Autenticación.
* Categorías.
* Nuevas fuentes de podcasts.
* Persistencia en backend.
* Estado global compartido.

Podrían incorporarse nuevas capas sin romper la separación actual.

Por ejemplo:

```text
components/
hooks/
services/
lib/
types/
```

podrían crecer independientemente.

Si el proyecto necesitara consumir otra fuente de podcasts, el cambio principal se produciría en la capa de servicios, manteniendo los componentes desacoplados del proveedor.

---

# 31. Git y estrategia de desarrollo

El desarrollo se ha dividido en diferentes hitos funcionales y visuales utilizando commits y tags.

Algunos de los hitos principales son:

```text
v0.15.0-responsive-podcast-grid
v0.16.0-home-final
v0.17.0-podcast-detail-final
v0.17.1-reusable-podcast-sidebar
v0.18.0-episode-detail-final
```

Los tags permiten identificar fácilmente estados estables del proyecto durante su evolución.

Los commits utilizan mensajes descriptivos siguiendo una estructura similar a Conventional Commits:

```text
feat:
fix:
refactor:
test:
docs:
```

Esto facilita revisar la evolución del proyecto y entender el propósito de cada cambio.

---

# 32. Instalación

Clonar el repositorio:

```bash
git clone <REPOSITORY_URL>
cd aortega-podcast-app
```

Instalar dependencias:

```bash
npm install
```

---

# 33. Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:3000
```

---

# 34. Linter

Ejecutar ESLint:

```bash
npm run lint
```

---

# 35. Tests

Ejecutar todos los tests:

```bash
npm test
```

Ejecutar los tests en modo watch:

```bash
npm run test:watch
```

Generar cobertura:

```bash
npm run test:coverage
```

---

# 36. Build de producción

Crear la build:

```bash
npm run build
```

Iniciar la aplicación en producción:

```bash
npm start
```

El flujo de producción es:

```text
npm run build
      ↓
Next.js compila y optimiza
      ↓
npm start
      ↓
Servidor de producción
```

---

# 37. Rutas

La aplicación dispone de las siguientes rutas:

| Ruta                                | Descripción            |
| ----------------------------------- | ---------------------- |
| `/`                                 | Lista de podcasts      |
| `/podcast/[id]`                     | Detalle de un podcast  |
| `/podcast/[id]/episode/[episodeId]` | Detalle de un episodio |

Las rutas dinámicas permiten reutilizar las mismas páginas para diferentes podcasts y episodios.

---

# 38. API utilizada

La aplicación utiliza la API pública de Apple Podcasts.

Top podcasts:

```text
https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json
```

Detalle:

```text
https://itunes.apple.com/lookup?id={id}&media=podcast&entity=podcastEpisode&limit=20
```

El endpoint de detalle solicita explícitamente un máximo de 20 episodios, siguiendo el requisito de la prueba.

---

# 39. Requisitos de la prueba cubiertos

| Requisito              | Implementación                    |
| ---------------------- | --------------------------------- |
| React                  | React + Next.js                   |
| TypeScript             | Tipado completo                   |
| Next.js                | App Router                        |
| Componentes desde cero | Sí                                |
| Responsive             | CSS + media queries               |
| Sin UI library         | Sí                                |
| Custom Hooks           | `usePodcasts`, `usePodcastDetail` |
| API Apple Podcasts     | `podcastService`                  |
| Caché                  | `localStorage`, 24h               |
| Tests                  | Jest + React Testing Library      |
| Lint                   | ESLint                            |
| Accesibilidad          | HTML semántico + ARIA             |
| Git                    | Commits y tags                    |
| Producción             | `next build` + `next start`       |

---

# 40. Decisiones de diseño

Uno de los objetivos principales del desarrollo ha sido evitar añadir complejidad que no estuviese justificada por los requisitos.

Las decisiones principales pueden resumirse así:

```text
Necesidad
    ↓
Analizar complejidad real
    ↓
Aplicar la solución más sencilla
    ↓
Mantener posibilidad de evolución
```

Por este motivo:

* Se utilizan custom hooks en lugar de introducir una solución global de estado.
* Se utiliza `localStorage` en lugar de una infraestructura de caché externa.
* Se utiliza CSS Modules en lugar de una librería visual.
* Se utiliza `useMemo` únicamente donde aporta valor.
* Se extraen componentes cuando existe una responsabilidad reutilizable.
* La comunicación con la API está aislada en un servicio.
* Los modelos están centralizados mediante TypeScript.

La intención es mantener una arquitectura sencilla pero preparada para crecer.

---

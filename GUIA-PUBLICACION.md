# Publicar Punto en GitHub Pages gratis — guía en español

## Primero: qué funciona en GitHub y qué necesita otro servicio

Este paquete publica la **web** en GitHub Pages. Los clientes, puntos, permisos, archivos y acceso con Google/Apple siguen conectados a **Lovable Cloud**. GitHub Pages no ofrece una base de datos ni ejecuta esas reglas. No es posible mantener todo el sistema actual funcionando únicamente en GitHub.

La publicación web en GitHub Pages es gratuita con GitHub Free **en un repositorio público**. El código y la página serán públicos; el panel seguirá necesitando acceso autorizado. Los servicios externos conservan sus cuotas y posibles costos: esta entrega no garantiza que todo el sistema sea gratis.

No borres el proyecto original ni sus datos. Su sitio publicado debe permanecer disponible para el acceso gestionado. Esta variante es un paquete separado: no la subas al repositorio conectado a Lovable para sustituir la versión original.

**Uso personal:** GitHub prohíbe usar Pages como alojamiento gratuito de un negocio en línea, comercio electrónico o SaaS comercial. Si ofreces Punto comercialmente a empresas, usa otro alojamiento para la web. Guardar código en GitHub es distinto de alojar allí un servicio comercial.

Fuentes oficiales:
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://docs.github.com/en/get-started/learning-about-github/githubs-plans

## 1. Descargar y descomprimir

1. Descarga `punto-github-pages.zip` de esta conversación.
2. Descomprímelo y abre la carpeta `punto-github-pages`.
3. Debes subir **su contenido**, no el ZIP ni la carpeta envolvente.
4. Usa este paquete, no el ZIP anterior: está adaptado específicamente a Pages.

Incluye código fuente, diseños, configuración pública de conexión, dependencias fijadas, publicación automática y esta guía. No contiene datos de clientes, contraseñas, archivos internos de Lovable ni programas instalados.

## 2. Crear un repositorio gratuito

1. Inicia sesión o crea una cuenta en https://github.com.
2. Pulsa **+ → New repository**.
3. Nombre sugerido: `punto`.
4. Selecciona **Public**. Pages en repositorios privados no está incluido en GitHub Free.
5. No marques añadir README ni `.gitignore`: ya vienen en el paquete.
6. Pulsa **Create repository**.

## 3. Subir los archivos sin usar comandos

1. En el repositorio pulsa **uploading an existing file**, o **Add file → Upload files**.
2. Arrastra los archivos y carpetas que están dentro de `punto-github-pages`.
3. Si GitHub no acepta todos en un lote, sube varios lotes conservando las carpetas. La carga web limita el número de archivos por lote.
4. Incluye los archivos ocultos, especialmente `.github` y `.env.production`.
   - Windows: Explorador → Ver → Mostrar → Elementos ocultos.
   - macOS: `Command + Shift + .`.
5. Escribe un mensaje como `Agregar Punto para GitHub Pages` y pulsa **Commit changes**.
6. Confirma que la rama se llama **main**.

### Si no puedes subir `.github`

Usa **Add file → Create new file**, escribe exactamente `.github/workflows/pages.yml`, pega el contenido del archivo del paquete con ese mismo nombre y guarda con **Commit changes**. Sin ese archivo, la publicación automática no existe.

### Estructura esperada en la raíz

```text
.github/workflows/pages.yml
.env.production
.gitignore
AGENTS.md
GUIA-PUBLICACION.md
README.md
bun.lock
package.json
index.html
vite.config.ts
tsconfig.json
scripts/pages-fallback.mjs
src/...
public/...
```

Si ves solamente una carpeta `punto-github-pages` en la raíz, subiste el contenido un nivel demasiado profundo. Los archivos deben quedar directamente en la raíz del repositorio.

**Seguridad:** `.env.production` contiene solo los valores públicos que la web ya usa para conectarse. No contiene una clave privada. No agregues contraseñas, claves privadas ni exportaciones de clientes. La publicación del código no convierte los registros de clientes en archivos públicos; su protección sigue dependiendo de los permisos del servicio existente.

## 4. Activar la publicación gratis

1. En el repositorio abre **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Abre **Actions → Publicar Punto en GitHub Pages**.
4. Pulsa **Run workflow**, selecciona `main` y confirma. Si ya está ejecutándose, espera.
5. Cuando todas las etapas estén verdes, vuelve a **Settings → Pages → Visit site**.

La dirección normal será `https://TU_USUARIO.github.io/punto/`. Sustituye `TU_USUARIO` por tu nombre de usuario real. Si eliges otro nombre de repositorio, la dirección cambia; el proceso calcula automáticamente esa carpeta.

El proceso instala las dependencias, ejecuta cinco validaciones, prepara la web y la publica. No necesitas instalar herramientas en tu computadora ni subir `node_modules` o `dist`.

## 5. Autorizar Google y Apple: paso obligatorio

La conexión a los datos existentes viene incluida, pero debes autorizar la nueva dirección de retorno antes de considerar que el acceso funciona.

1. Abre el proyecto original de Punto en Lovable.
2. Abre **More → Users → Auth settings → Advanced**.
3. En **Redirect URLs**, añade `https://TU_USUARIO.github.io/punto/**`, sustituyendo usuario y repositorio por los tuyos.
4. Conserva las direcciones existentes; no las reemplaces ni desactives Google/Apple.
5. Guarda los cambios.
6. Abre la web en GitHub Pages, pulsa **Ingresar**, acepta las condiciones y prueba Google.
7. Prueba Apple si ya está habilitado y tu cuenta es compatible.

El paquete empieza el acceso en el sitio original de Punto, porque GitHub no sirve las direcciones especiales de acceso gestionado de Lovable. La vuelta debe estar autorizada. No se sustituyó Google/Apple por contraseñas ni se desactivó seguridad.

**Limitación pendiente:** todavía no existe una dirección de tu GitHub autorizada y comprobada en esta entrega. El acceso Google/Apple desde GitHub no está verificado. Si el servicio rechaza el retorno externo incluso después de autorizarlo, la copia no será plenamente funcional en Pages: conserva el sitio original, no reduzcas permisos ni controles de seguridad.

## 6. Revisar antes de compartir

- **Inicio:** se ven el diseño, personaje y botones.
- **Avisos:** abren Condiciones, Privacidad y Cookies.
- **Acceso:** Google/Apple regresan a tu dirección GitHub y el panel termina de cargar.
- **Empresa:** cambia un dato no sensible, guarda, recarga y confirma; restáuralo después si era de prueba.
- **Administrador:** tu cuenta autorizada sigue viendo Administración. No se crean privilegios administrativos desde el navegador.
- **QR:** descarga nuevos QR desde el panel de GitHub. Los enlaces deben incluir tu repositorio, como `/punto/unirse/...` y `/punto/sumar/...`.
- **Tarjeta:** abre el primer QR, acepta condiciones y crea una tarjeta de prueba; confirma que aparece en Clientes.
- **Puntos:** escanea el segundo QR desde el mismo navegador del cliente. Confirma un punto y que otro intento no suma antes de 24 horas.
- **Limpieza:** elimina la tarjeta de prueba desde tu panel.
- **Enlaces directos:** abre una tarjeta en otra pestaña y recarga. El respaldo de Pages debe recuperar su pantalla.
- **Celular:** comprueba inicio, panel y tarjeta sin desplazamiento horizontal.

Las tarjetas recordadas por el navegador del sitio original no se trasladan automáticamente al navegador de GitHub: cada dirección tiene su propio almacenamiento. Los datos alojados siguen siendo los mismos. No publiques enlaces de tarjetas de clientes; funcionan como llaves de acceso.

**Wallet no está implementado** y no se añadió en esta variante.

## 7. Comprobaciones realizadas

La copia generó correctamente los archivos estáticos para `/punto/` y pasaron las cinco pruebas de enlaces, identidad de mascotas y datos legales. En una simulación local de Pages se verificaron inicio, Privacidad, recuperación de enlaces directos, panel con empresa y QR con `/punto/`, Administración y ajuste del inicio móvil sin errores de ejecución. El panel se comprobó restaurando una sesión real; eso no sustituye la prueba de Google/Apple.

No se ha comprobado publicación real en tu GitHub, acceso social desde su dirección, ni creación y suma de puntos desde esa dirección. No se modificó tu aplicación original ni su base de datos.

## 8. Resolver problemas comunes

### No aparece nada en Actions

Comprueba que `.github/workflows/pages.yml` existe y la rama es `main`. Si Actions está deshabilitado, actívalo en **Settings → Actions** y usa **Run workflow**.

### Primera ejecución roja

Activa primero **Settings → Pages → Source → GitHub Actions** y vuelve a ejecutar el proceso. La primera carga puede iniciarse antes de que actives Pages.

### Error instalando dependencias

Sube `bun.lock` y `package.json` de este mismo paquete, sin mezclarlos con el ZIP anterior. La publicación usa Bun 1.4.4 y las dependencias fijadas.

### Pantalla vacía o estilos ausentes

Verifica que Pages utiliza **GitHub Actions**, no **Deploy from a branch**. El proceso debe preparar y subir `dist`, no publicar directamente `src`. Revisa la última ejecución y espera su marca verde.

### Google rechaza la dirección de retorno

Revisa usuario, repositorio, HTTPS y `/**` final en la sección 5. Mantén el sitio original disponible. El acceso no se ejecuta directamente en GitHub.

### El inicio carga pero no los clientes

Comprueba que Lovable Cloud sigue activo y no se eliminaron sus tablas o permisos. No hagas públicas las tablas de clientes para resolverlo. GitHub no contiene copias de tus clientes.

### Un enlace directo muestra brevemente 404

Pages responde inicialmente 404 a direcciones que no corresponden a archivos. El respaldo devuelve al inicio y recupera esa pantalla. Es una limitación de Pages para aplicaciones con direcciones dinámicas. Si el error permanece, comprueba que se publicó `404.html` mediante el proceso automático.

## 9. Actualizar o retirar la publicación

Para actualizar, sube los archivos modificados a `main`; Actions vuelve a preparar y publicar. Espera la marca verde. Esta copia no actualiza automáticamente tu proyecto original en Lovable.

Para retirar la web, abre **Settings → Pages → Unpublish site**, si aparece, o desactiva Pages. Esto no elimina los datos alojados en Lovable Cloud.

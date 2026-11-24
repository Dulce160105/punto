# Punto para GitHub Pages

Lee **GUIA-PUBLICACION.md** para subir y publicar la web gratis desde un repositorio público.

**No funciona todo solo en GitHub:** datos y Google/Apple permanecen en Lovable Cloud. Debes mantener el proyecto original y autorizar la nueva dirección de retorno. El acceso social desde GitHub aún no está verificado.

- Publicación automática: `.github/workflows/pages.yml`.
- Desarrollo local opcional: instala Bun 1.4.4, ejecuta `bun install --frozen-lockfile` y `bun run dev`.
- `.env.production` incluye únicamente configuración pública de la conexión existente, no contraseñas ni claves privadas.
- No subas clientes, contraseñas, `node_modules` ni `dist`.
- GitHub Pages gratis no permite alojar un negocio en línea o SaaS comercial; úsalo solo si tu uso personal cumple sus condiciones.
- Wallet no está implementado.

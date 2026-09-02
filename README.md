# Greizy González — Sitio inmobiliario

React + TypeScript + Vite + Tailwind v4. Consume el API de `../back-end` (Node + Express + MySQL, **JavaScript puro, sin TypeScript**).

---

## Arrancar

```bash
# 1) API (en otra terminal)
cd ../back-end
cp .env.example .env      # DB_PORT=8889 si usas MAMP
npm install
npm start                  # http://localhost:4000

# 2) Este front
cp .env.example .env.local
npm install
npm run dev                # http://localhost:3000
npm run build              # ./dist
```

**El sitio necesita el API encendido.** Si no responde, el catálogo sale vacío y aparece un
aviso arriba. Ya no hay datos de demostración: todo viene de la base.

---

## Acceso al panel

Botón **Login** en la barra superior, o «Iniciar Sesión» en el pie.

Las credenciales iniciales se definen en el servidor y deben entregarse por un canal privado.
Cambia cualquier contraseña temporal al entrar. Autenticación con **JWT**: el token se guarda en `localStorage` y viaja
en la cabecera `Authorization` de cada petición. Cada carga del panel revalida el token
contra `/auth/me`, así que un token caducado no da acceso. El API además comprueba el rol
(`admin` o `editor`) en las rutas de escritura.

## Compilar y publicar

```bash
cp .env.production.example .env.production
# Ajusta VITE_SITE_URL al dominio HTTPS definitivo.
npm ci
npm run lint
npm run build
```

El contenido publicable queda en `dist/`. La configuración recomendada publica el API bajo
`/api` en el mismo dominio, evitando URLs de localhost dentro del bundle. Usa como base
`../deployment/nginx.greizy.conf.example` y reemplaza el dominio y las rutas del servidor.

---

## Cómo funcionan las fotos

En el formulario de propiedad puedes seleccionar **todas las fotos de una vez**. El orden
importa:

- **La primera (índice 0) es la portada** — es la que sale en el catálogo y al compartir el
  enlace.
- **El resto forma la galería** de la ficha, en ese mismo orden.

Puedes reordenar con «Hacer portada» antes de guardar. Al guardar, el navegador envía los
archivos en el orden elegido y el servidor los guarda igual: convierte cada uno a WebP,
los redimensiona a 1920 px y marca el primero como portada.

---

## Cambiar la marca (revender la plantilla)

| Archivo | Qué contiene |
|---|---|
| `src/config/site.ts` | Nombre, contacto, WhatsApp, textos, servicios, valores, alianzas |
| `public/brand/` | `isotipo.png`, `isotipo-blanco.png`, fotos de perfil |
| `public/favicon*` | Favicons generados del isotipo |

Los colores están como hex de Tailwind en los componentes. La paleta actual sale del logo:

| Uso | Hex |
|---|---|
| Azul principal | `#03459C` |
| Azul hover | `#022F70` |
| Azul claro (acento) | `#049FD5` |
| Fondo oscuro | `#071B33` |
| Texto secundario | `#7A8AA3` |
| Bordes | `#DBE3EE` |
| Fondo de página | `#F7FAFC` |

Para rebrandear: buscar y reemplazar esos hex en `src/`.

---

## Estructura

```
src/
  config/site.ts            Marca y contenido (EDITAR)
  lib/
    api.ts                  Todas las llamadas al back-end
    adapters.ts             Traducción entre el modelo del API y el del front
  types.ts                  Tipos compartidos
  components/
    common/                 Navbar, Footer, Logo, WhatsApp flotante, Toast
    modals/                 ContactModal (envía al API), LoginModal (JWT)
    views/                  Home, About, Services, Contact, Listings, PropertyDetail
    views/admin/            Panel completo
  data/mockData.ts          Solo perfil y roles; sin propiedades
```

---

## Qué se quitó de la plantilla original

- **Nuestro Equipo** y **Novedades**: eliminadas. Los archivos quedaron en
  `_BORRAR_RESIDUOS/vistas-eliminadas/`.
- **Acceso rápido por rol** del login: permitía entrar con cualquier correo y sin contraseña.
- **Propiedades y contactos de ejemplo**: ahora todo viene del API.

---

## Pendiente

- `ServicesView` conserva las calculadoras de la plantilla. Revisa si las quieres.
- Las fotos de las 3 propiedades se sirven desde `public/propiedades/`. Las que subas desde
  el panel irán a `/uploads` del API, que es lo correcto para producción.

---

## Desarrollo local vs producción

La URL del API sale de **un solo archivo**: `src/config/api.ts`.

```bash
cp .env.local.example .env.local     # apunta a http://localhost:4000/api
npm run dev
```

Sin `.env.local`, el front usa el API de producción
(`https://back-endinmo.furrixempire.com/api`). Borra el archivo para volver a producción.

> Antes esta URL estaba duplicada: `api.ts` apuntaba a producción y `adapters.ts` a `/api`.
> Como `adapters.ts` construye las URLs de las fotos, las imágenes se resolvían contra el
> dominio del front y salían rotas. Ahora ambos leen de `config/api.ts`.

---

## Usuarios y roles

**Panel → Usuarios.** Crear, editar, cambiar rol, activar/desactivar y eliminar.
Todo persiste en la base a través de `/api/admin/users`.

| Rol | Puede |
|---|---|
| **Administrador** | Todo, incluida la gestión de usuarios |
| **Editor** | Propiedades y solicitudes. No ve ni toca usuarios |

Reglas que aplica el servidor y no se pueden saltar desde la interfaz:

- Solo un **administrador** entra a `/api/admin/users`. Un editor recibe 403.
- Nadie puede **cambiar su propio rol** ni **desactivarse o eliminarse** a sí mismo.
- **Siempre debe quedar al menos un administrador activo.** El sistema rechaza la última
  degradación, desactivación o borrado que dejaría el panel sin administradores.
- Contraseña mínima: 10 caracteres con al menos una letra y un número.
- Correo único: repetirlo devuelve un error claro.

Al crear un usuario se le envía un correo de aviso. **Sin SMTP configurado ese correo no
sale** (queda en el log del servidor), así que hay que comunicarle la contraseña por otro
medio y pedirle que la cambie desde *Mi cuenta*.

# OSAPM Web — sitio institucional + portales

Sitio oficial de OSAPM (Obra Social de Agentes de Propaganda Médica), www.osapm.org. SPA con tres áreas:
- **Sitio público**: home, planes, centro médico, noticias, información (trámites, discapacidad, formularios, FAQ), contacto.
- **Portal Afiliados**: login por DNI, credencial, grupo familiar, cartilla, estado de cuenta.
- **Portal Prestadores**: login por CUIT, liquidaciones, tarifario, archivos, afiliados, normativas, discapacidad, prescripción SESAM.
- **Backoffice** (`admin-dashboard`): maqueta. El login es falso (guarda `admin_token = 'secret-admin-session'`). Se entra con un botón invisible abajo a la izquierda.

## Comandos
- `npm run dev`: Vite en el puerto 3000, expuesto en la red (`host 0.0.0.0`).
- `npm run build`: genera `dist/` (ignorado por git).
- `npx tsc --noEmit -p .`: chequeo de tipos. No hay tests ni linter.

## El stack difiere del global
Este repo **no** sigue el stack de `~/.claude/CLAUDE.md`. Respetar lo que hay:
- **React 19**. No usa React Router, TanStack Query ni React Hook Form.
- **Ruteo casero**: `App.tsx` maneja `currentView: string` + `navigateTo(view)`, que hace `pushState('/<view>')`. La vista inicial sale de `location.pathname`. IIS hace el fallback a `index.html` (`public/web.config`).
- **Tailwind por CDN**, configurado en `index.html`. No hay `tailwind.config` ni PostCSS. Tokens: `celeste #00AEEF`, `azul #1C75BB`, `oscuro #111111`. En la práctica el código usa los hex directo (`text-[#1C75BB]`). Fuente: Source Sans 3.
- **Imports relativos** (`../services/api`). El alias `@/` está configurado pero nadie lo usa.
- **TS no estricto** (`strict` no está activado) y hay `any` en el código existente. En código nuevo, no agregar `any`.
- **HTTP**: conviven `fetch` (en `services/api.ts`, la mayoría) y Axios (`services/apiClient.ts`, con interceptor `auth_token` para afiliados).
- **Forms** con `useState` controlado. Íconos: lucide-react.
- `index.html` tiene un `importmap` a esm.sh, que es un resto de AI Studio. Lo mismo `GEMINI_API_KEY` en `vite.config.ts` y `.env.local`, `metadata.json`, `app.json` y `config.yml`. No se usan.
- `AuthProvider` envuelve la app dos veces (`index.tsx` y `App.tsx`).

## Estructura
```
src/
  App.tsx                 vistas + navegación (agregar vista: import, onSectionClick y render)
  constants.tsx           NAV_STRUCTURE (menú del header), PLANS
  types.ts
  components/             secciones públicas (Tramites, Discapacidad, FormularioSalud, ...)
  portalAfiliado/         Login, Register, Dashboard, Credencial, Cartilla
  portalPrestador/        LoginPrestador, DashboardPrestador, sections/*
  backoffice/             AdminLogin, AdminDashboard (maqueta)
  services/
    apiConfig.ts          API_BASE_URL + API_ENDPOINTS (afiliados)
    api.ts                apiService: público + todo el portal prestador (pfetch)
    apiClient.ts          axios afiliados
    authService.ts / afiliadoService.ts / cartillaService.ts / formularioService.ts
  context/authContext.tsx sesión afiliado
public/
  formularios/            PDFs descargables (discapacidad/ = anexos 2027)
  img/discapacidad/modelos/ modelos de prescripción (.webp, solo visualización)
  web.config              reglas IIS (SPA fallback, cache). NO pisar en deploy
sql/                      scripts de datos (FAQ web = TipoAppId 3)
```

## Backends (.NET, otro repo)
| Uso | Dev (proxy de Vite) | Prod |
|---|---|---|
| App/afiliados/prestadores/datos útiles | `/api-main/AppOSAPM` | `https://appapis.apm.org.ar/AppOSAPM` |
| Backoffice (noticias, tickets) | `/api-backoffice` | `https://osapmapis.apm.org.ar` |

- **Afiliados**: JWT en `localStorage.auth_token`. Los claims `nameid` (DNI), `AfiliadoId`, `PlanId` y `SeccionalId` (si es `099`, se usa `001`).
- **Prestadores**: `prestador_token`, `prestador_refresh_token` y `prestador_cuit`. `pfetch` refresca solo ante un 401. Si falla, tira `Error('SESSION_EXPIRED')` y las secciones lo manejan con `onSessionExpired`.
- **Alta de prestadores**: no hay autoregistro. "Solicitar acceso" (`/api/AuthPrestador/solicitar-acceso`) devuelve `OK | NO_ACTIVO | YA_TIENE_CUENTA | YA_SOLICITADO`. La clave se genera o recupera con un OTP por mail (`olvide-clave` → `reset-clave`).
- **Menú del portal prestador**: "Discapacidad" solo se muestra si `datos.esDiscapacidad`. "Prescripción" solo si `datos.esSesam`.
- **FAQ públicas**: `GET /api/DatosUtiles/preguntas-frecuentes/{tipoId}`. Web = 3, App = 1. No hay FAQ de discapacidad en la API: están hardcodeadas en `Discapacidad.tsx`.

## Patrón visual de secciones públicas
Seguir `Tramites.tsx` / `Discapacidad.tsx`:
- Banda azul `bg-[#1C75BB]` con ícono en `bg-white/10`, título `font-black uppercase tracking-tighter` y la palabra destacada en `#00AEEF`.
- Control de tamaño de letra XS–XL a la derecha (`FONT_SIZES = [14..22]`).
- Tabs laterales: `aside` con `lg:w-80 lg:sticky lg:top-28`. El tab activo va en `bg-[#1C75BB] text-white lg:translate-x-2`.
- Contenido en `main` blanco con `rounded-[3rem]`. Tarjetas `rounded-3xl` en `bg-slate-50 border-gray-100`, con hover en `border-[#00AEEF]`.
- Subtítulos con `border-l-4 border-[#00AEEF]` en mayúsculas.
- Acordeones con `Plus`/`Minus` y borde `#00AEEF` cuando están abiertos (como `PreguntasFrecuentes.tsx`).

Para agregar una entrada en **Información** o **Contacto**:
1. Item en `NAV_STRUCTURE` (`href: '#x'`).
2. Mapear el hash en `onSectionClick` de `App.tsx`.
3. Render `currentView === 'x'`.
4. Agregar la vista a `INFO_VIEWS` / `CONTACTO_VIEWS` en `Header.tsx`, para que se marque activa.

## Sección Discapacidad (`components/Discapacidad.tsx`)
- Contenido 2027, sacado del instructivo y de un docx de diseño del área.
- La consulta de personas con CUD se envía por `mailto:prestacionesespeciales@apm.org.ar`. Si hace falta, se pasa a un endpoint.
- Hay dudas abiertas con el área (FAQ incompletas, horas de integración escolar, anexo del presupuesto de Estimulación Temprana, Hoja de verificación descargable, escala FIM). Ver la memoria `seccion-discapacidad`.

## Contactos que aparecen en el sitio
- Mesa de Ayuda: 0800-666-7276. Central: 4633-7878 (es línea fija: no usar el formato +54 9).
- Discapacidad: int. 114, de lunes a viernes de 9 a 16 hs, prestacionesespeciales@apm.org.ar.
- Facturación de prestadores: comprobantes@apm.org.ar. Datos para facturar: OSAPM, CUIT 30-62311465-9, Av. Avellaneda 2144, CABA.

## Deploy
`deploy_web_osapm.ps1`: primero `npm run build`, después robocopy de `dist/` a `\\WEB01\c$\inetpub\wwwroot\WebOSAPM`, con backup previo. No borra lo que no está en el origen, así que preserva `web.config`.
- La ruta de origen del script es `C:\GyF\Pagina OSAPM\OSAPM FrontEnd`. Desde este clon (`Desktop\OSAPMweb`), ajustar `$src`.
- Para verificar: `curl -sk https://www.osapm.org/ | grep index-` (el hash tiene que coincidir).
- El IIS no trae tipos MIME modernos: cada extensión nueva (ej. `.webp`) hay que agregarla en `public/web.config`. Si no, devuelve 404.
- Ninguna carpeta de `public/` puede llamarse igual que una vista (ej. `/discapacidad`): IIS la trata como directorio y el F5 da 403. Assets en `public/img/<seccion>/`.

## Convenciones del repo
- Commits en español, describiendo el cambio (ej.: "SESAM Prescripción: ...").
- Assets pesados en `public/`: comprimir. Las imágenes pasaron a WebP con `npx sharp-cli`.
- Los archivos están en CRLF (`core.autocrlf=true`).

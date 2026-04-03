
 # Christmas Countdown 
 <p align="center">
	<img src="./public/readme.png" alt="Christmas Countdown" width="1200" />
</p>

 ![License](https://img.shields.io/github/license/LuiccianDev/christmas-countdown)
 ![TypeScript](https://img.shields.io/badge/TypeScript-%5E5.9-blue)
 ![Vite](https://img.shields.io/badge/Vite-%5E7.2-brightgreen)
 ![Package Manager](https://img.shields.io/badge/PackageManager-pnpm-blue)

 Una página web interactiva con cuenta regresiva para Navidad, con efectos de nieve y música de fondo.

![Christmas Countdown Preview](./public/picReadme.png)
 *Portada: vista previa del proyecto*

 **Características**

 - ⏰ Cuenta regresiva en tiempo real hasta Navidad
 - ❄️ Efecto de nieve animado (Canvas)
 - 🎵 Música de fondo con controles de reproducción
 - 📱 Diseño responsive

 **Tecnologías principales**

 - TypeScript
 - Vite
 - HTML5 Canvas 2D
 - HTML5 Audio API
 - CSS3

 **Uso rápido**

 ```bash
 # Instalar dependencias
 pnpm install

 # Ejecutar en modo desarrollo
 pnpm dev

 # Compilar para producción
 pnpm build

 # Ejecutar linter
 pnpm run lint

 # Formatear
 pnpm run format
 ```

 **Desarrollo y pruebas**

 - Abre `http://localhost:5173` (o la URL que indique Vite) para ver la app en desarrollo.
 - Para probar sin servidor, abre `index.html` en `public/` en un navegador moderno.

 **Agregar tu propia música**

 1. Coloca un archivo de audio (p.ej. `christmas-music.mp3`) en `public/music/`.
 2. Actualiza el `src` del elemento `<audio id="background-music">` si es necesario.

 **Estructura relevante**

 - `src/` - código TypeScript y estilos
 - `public/` - recursos (imágenes, música, fuentes)
 - `index.html` - punto de entrada

 **Contribuciones**

 Pull requests bienvenidos. Abre un issue antes de cambios grandes.

 **Licencia**

 MIT — ver el archivo [LICENSE](LICENSE)

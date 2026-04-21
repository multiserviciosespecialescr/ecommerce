# Guía para Agentes de IA: Mantenimiento y Despliegue (E-Commerce WA)

**¡Hola, futuro agente de IA (o desarrollador)!** 
Si estás leyendo esto, el usuario te ha pedido que modifiques o actualices el código de esta tienda en línea. Lee esta guía antes de hacer cambios para mantener la integridad del proyecto.

## Arquitectura Base
1. **Framework:** Next.js 14+ (App Router). Ubicación principal del código: `src/app/`.
2. **Estilos:** Tailwind CSS v4 (`@import "tailwindcss";` está configurado en `globals.css`).
3. **Base de Datos / Storage:** Supabase. Las peticiones a Supabase se hacen desde el Cliente y el Servidor utilizando el cliente existente en `src/lib/supabase.ts`.
4. **Estado:** React Context para el carrito (`src/components/CartContext.tsx`) respaldado por `localStorage`.
5. **Autenticación (Admin):** Extremadamente simple, basada en variable de entorno (`NEXT_PUBLIC_ADMIN_PASSWORD`) verificada visualmente en el frontend. No hay cuentas de usuario.

## Reglas Críticas (No romper)
- **No remover `export const dynamic = 'force-dynamic'`:** Las páginas que leen de la base de datos (como `src/app/productos/page.tsx`) incluyen esta directiva para obligar a Vercel a realizar Fetch del catálogo real en cada visita. Si lo cambias a estático, los clientes no verán los productos nuevos creados desde el `/admin` a menos que se haga un redespliegue de código.
- **Carrito Local:** El carrito vive enteramente en el cliente y genera un string de WhatsApp para el Checkout. No agregues Endpoints de Stripe ni bases de datos de pedidos a menos que el usuario lo solicite explícitamente en el futuro cambiando todo el modelo de negocio.

## Proceso de Despliegue (Cómo subir cambios a producción)

El usuario tiene el proyecto conectado a **Vercel** mediante "Continuous Deployment" vinculado a la rama `main` de su repositorio en GitHub.

Si el usuario te pide: **"Publica los cambios"**, **"Aplica esto a la web"**, o **"Súbelo a producción"**, **DEBES EJECUTAR COMANDOS DE GIT automáticamente**. 

Secuencia obligatoria paso a paso para el Agente:
1. Asegúrate de haber completado tus tareas de código.
2. Ejecuta:
   ```bash
   git add .
   git commit -m "AI Update: [Breve descripción de tus cambios aquí]"
   git push origin main
   ```
3. Informa al usuario que Vercel ha recibido la actualización y que los cambios se reflejarán en internet en aproximadamente 1 o 2 minutos.

*Fin de instrucciones.*

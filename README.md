# Estilos Creativos — Tienda de Productos Personalizados

Tienda en línea para **Estilos Creativos**, especializada en productos personalizados: tazas, camisas, botellas, llaveros, platos, artículos de decoración y alquiler de salones para eventos.

## Stack Tecnológico

- **Framework:** Next.js (App Router)
- **Estilos:** Tailwind CSS v4
- **Base de Datos:** Supabase
- **Despliegue:** Vercel (Continuous Deployment desde `main`)
- **Checkout:** WhatsApp (sin pasarela de pago)

## Desarrollo Local

```bash
npm install
npm run dev
```

## Estructura

```
src/
├── app/
│   ├── admin/          # Panel de administración de productos
│   ├── productos/      # Catálogo y detalle de productos
│   ├── layout.tsx      # Layout principal con Navbar, CartDrawer
│   ├── page.tsx        # Landing page
│   └── globals.css     # Design system (Tailwind + brand tokens)
├── components/         # Componentes reutilizables
└── lib/                # Supabase client, constantes
```

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_ADMIN_PASSWORD=
```

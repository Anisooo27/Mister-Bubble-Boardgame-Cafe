# 🧋 Mister Bubble Café — Web Application

> An interactive web application for **Mister Bubble Café**, an Asian-themed bubble tea and board game café located in Salamandre, Mostaganem, Algeria.

---

## 🌟 Features Overview

- **Interactive Menu & Drink Customizer**: Complete digital menu with category filtering, live search, volume selection, sugar/ice level adjustments, and boba topping add-ons.
- **Bilingual & RTL Support**: Full French and Arabic localization with instantaneous layout flipping.
- **Table QR & Ordering System**: Table-side ordering with bill calculations (in Algerian Dinars, DA), receipt modal, and live order tray.
- **Board Game Library**: Interactive board game catalogue (50+ games) with player counts, difficulty filters, and quick rules cards.
- **Atmosphere & Venue Gallery**: High-resolution showcase of the ground floor bar, mezzanine loft lounge, board game wall, and resident cats.
- **Events & Private Bookings**: Private mezzanine booking inquiry form for birthdays, tournaments, and gatherings.
- **Digital Loyalty Card**: Interactive loyalty stamp tracker for frequent customers.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utility Tools**: `canvas-confetti`, `qrcode`

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mister-bubble-cafe.git
cd mister-bubble-cafe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to view the application.

### 4. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
├── public/
│   └── photos/              # High-resolution café & menu asset images
├── src/
│   ├── assets/              # Static branding and icon assets
│   ├── components/          # Reusable UI components (Navbar, Menu, BoardGames, etc.)
│   ├── context/             # React Context providers (Language, Cart, Table state)
│   ├── data/                # Data stores (menu items, games, events, translations)
│   │   ├── menuData.ts      # Menu items catalog, pricing, tags & ingredients
│   │   ├── gamesData.ts     # Board game library data
│   │   ├── eventsData.ts    # Events and mezzanine booking options
│   │   ├── photoManifest.ts # Asset filename mappings & captions
│   │   └── translations.ts  # French & Arabic language strings
│   ├── App.tsx              # Main application entry layout
│   ├── main.tsx             # React DOM root mounting
│   └── index.css            # Tailwind CSS directives & global styling
├── package.json
└── vite.config.ts
```

---

## 📸 Updating Menu Assets & Items

### Adding or Modifying Menu Items

1. Open `src/data/menuData.ts`.
2. Locate the relevant category section (e.g., `FRUIT TEA SERIES`, `BUBBLE WAFFLES`, `MOJITO SERIES`).
3. Add or update the item object:
   ```typescript
   {
     id: 'fruittea-mango',
     name: 'Mango Fruit Tea',
     category: 'fruit-tea',
     price: 400,
     description: 'Golden mango fruit tea with popping boba pearls.',
     image: '/photos/menu-fruittea-mango.jpg',
     imageFilename: 'menu-fruittea-mango.jpg',
     isPopular: true,
     tags: ['Mango Puree', 'Popping Boba', 'Green Tea Base'],
     volume: '500 ml',
   }
   ```

### Adding New Photos

1. Place your image file in the `public/photos/` directory (e.g., `public/photos/menu-your-item.jpg`).
2. Reference the path as `/photos/menu-your-item.jpg` in `src/data/menuData.ts` and `src/data/photoManifest.ts`.
3. Rebuild the app with `npm run build` so Vite packages the static assets into `dist/photos/`.

---

## 📄 License

This project is created for **Mister Bubble Café**. All rights reserved.

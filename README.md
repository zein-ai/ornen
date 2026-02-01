# Ornen Agency

A premium, bilingual (English/Chinese) marketing agency landing page showcasing cross-border marketing expertise. Built with React, TypeScript, and modern web technologies.

## Features

- **Bilingual Support**: Seamless switching between English and Chinese
- **Modern Design**: Sleek, animated UI with parallax scrolling effects
- **AI Integration**: ElevenLabs ConvAI chatbots for visitor engagement
- **Responsive**: Fully responsive design for all device sizes
- **Performance**: Built with Vite for lightning-fast development and optimized production builds

## Tech Stack

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icons
- **ElevenLabs ConvAI** - AI-powered chat widgets

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zein-ai/ornen.git
   cd ornen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project Structure

```
ornen-agency/
├── App.tsx           # Main application component
├── index.tsx         # Application entry point
├── index.html        # HTML template
├── index.css         # Global styles and Tailwind directives
├── types.ts          # TypeScript type definitions
├── package.json      # Project dependencies
├── tsconfig.json     # TypeScript configuration
├── vite.config.ts    # Vite configuration
└── .gitignore        # Git ignore rules
```

## Customization

### Content

All content is centralized in the `CONTENT` object in `App.tsx`. You can easily modify text for both English and Chinese versions.

### Styling

The project uses Tailwind CSS. Custom styles can be added to `index.css` or as utility classes in components.

### AI Chat Agents

The ElevenLabs ConvAI agent IDs are configured in `App.tsx`. Replace with your own agent IDs:

```tsx
<elevenlabs-convai agent-id="your-agent-id" />
```

## Deployment

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/zein-ai/ornen)

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/zein-ai/ornen)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ by Ornen Agency

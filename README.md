# ⏰ Glassmorphism Digital Clock

A beautiful, modern digital clock built with React and Vite, featuring glassmorphism design and smooth animations.

## ✨ Features

- **Real-time Clock**: Live updating time display with AM/PM format
- **Glassmorphism Design**: Modern glass-like aesthetic with backdrop blur
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Floating effects, glowing text, and pulsing decorations
- **Modern Typography**: Uses Orbitron and Roboto Mono fonts for a futuristic look
- **Auto-deployment**: Configured for automatic GitHub Pages deployment

## 🚀 Live Demo

Visit the live demo: [https://yourusername.github.io/your-repo-name/](https://yourusername.github.io/your-repo-name/)

## 🛠️ Technologies Used

- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **CSS3** - Styling with advanced effects
- **Google Fonts** - Typography (Orbitron, Roboto Mono)
- **GitHub Actions** - CI/CD for deployment

## 📱 Screenshots

The clock features a beautiful glassmorphism design with:

- Translucent glass card with backdrop blur
- Animated floating effect
- Glowing time display
- Colorful gradient background shapes
- Responsive design for all screen sizes

## 🎯 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automatic Deployment

1. Push your changes to the `main` or `master` branch
2. GitHub Actions will automatically build and deploy your app
3. Your app will be available at `https://yourusername.github.io/repository-name/`

### Manual Deployment

If you prefer manual deployment:

1. Install gh-pages:

   ```bash
   npm install -g gh-pages
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "GitHub Actions" as the source
4. The deployment workflow will handle the rest

## 🎨 Customization

### Colors

You can customize the color scheme by modifying the CSS variables in `src/App.css`:

- Background gradient colors
- Glass effect opacity
- Decorative shape colors
- Text colors and glows

### Fonts

The project uses:

- **Orbitron** for the time display and day
- **Roboto Mono** for general text

You can change these in the Google Fonts import in `src/App.css`.

### Animations

Customize animation timing and effects by modifying the keyframes in `src/App.css`:

- `@keyframes float` - Main container floating
- `@keyframes pulse` - Shape pulsing effects
- `@keyframes glow` - Text glowing effects

## 📁 Project Structure

```
├── public/
│   ├── vite.svg
│   └── react.svg
├── src/
│   ├── App.jsx          # Main clock component
│   ├── App.css          # Styles and animations
│   ├── main.jsx         # React app entry point
│   └── index.css        # Global styles (minimal)
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions deployment
├── package.json
├── vite.config.js       # Vite configuration
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Glassmorphism design inspiration
- React and Vite communities
- Google Fonts for beautiful typography
- CSS-Tricks for advanced CSS techniques

---

Made with ❤️ and modern web technologies

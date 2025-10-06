# Travel Beyond Tours - Travel Agency Frontend

A modern, responsive travel agency website built with React, TypeScript, TailwindCSS, and GSAP animations.

## 🚀 Features

### 📱 Pages
- **Landing Page** - Hero section with animated headlines and featured tours
- **About Page** - Company information with smooth GSAP reveals
- **Contact Page** - Contact form with validation and company details
- **Blog Page** - Blog listing with search functionality
- **Gallery Page** - Image gallery with lightbox modal
- **Payment Page** - Secure checkout form with validation
- **Packages Page** - Tour listings with search and filter
- **Tour Detail Page** - Detailed tour information with itinerary and booking

### 🧩 Components
- **Navbar** - Responsive navigation with scroll animations
- **Footer** - Comprehensive footer with links and social media
- **TourCard** - Reusable tour card component
- **BlogCard** - Blog post card component
- **GalleryItem** - Gallery image with hover effects
- **SearchBar** - Search functionality component
- **LoadingSpinner** - Animated loading indicator
- **Modal** - Reusable modal component

### ✨ Animations
- GSAP-powered animations throughout the site
- Scroll-triggered animations
- Hover effects and transitions
- Stagger animations for lists and grids
- Smooth page transitions

### 🎨 Styling
- TailwindCSS for utility-first styling
- Responsive design for all screen sizes
- Modern UI/UX design patterns
- Custom animations and transitions

## 🛠️ Tech Stack

- **React 19** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS 4** - CSS framework
- **GSAP** - Animation library
- **React Router v6** - Client-side routing
- **Leaflet** - Maps integration (ready for implementation)

## 📦 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd travel-frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── BlogCard.tsx
│   ├── Footer.tsx
│   ├── GalleryItem.tsx
│   ├── LoadingSpinner.tsx
│   ├── Modal.tsx
│   ├── Navbar.tsx
│   ├── SearchBar.tsx
│   └── TourCard.tsx
├── layouts/            # Layout components
│   └── MainLayout.tsx
├── pages/              # Page components
│   ├── AboutPage.tsx
│   ├── BlogPage.tsx
│   ├── ContactPage.tsx
│   ├── GalleryPage.tsx
│   ├── LandingPage.tsx
│   ├── PackagesPage.tsx
│   ├── PaymentPage.tsx
│   └── TourDetailPage.tsx
├── router/             # Routing configuration
│   └── index.tsx
├── assets/             # Static assets
│   └── images/
├── App.tsx            # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Breakpoints for all device sizes
- Touch-friendly interactions

### Performance
- Lazy loading for pages
- Optimized images
- Efficient animations
- Code splitting

### Accessibility
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Focus management

### SEO Ready
- Proper meta tags
- Semantic structure
- Fast loading times
- Mobile optimization

## 🎨 Customization

### Colors
The color scheme can be customized in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

### Animations
GSAP animations can be customized in individual components. Common animation patterns:

```javascript
// Fade in animation
gsap.fromTo(element, 
  { opacity: 0, y: 50 }, 
  { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
);

// Stagger animation
gsap.fromTo(elements, 
  { opacity: 0, y: 30 }, 
  { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }
);
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Unsplash](https://unsplash.com/) - Stock photos
- [Heroicons](https://heroicons.com/) - Icons

---

**Happy Traveling! 🌍✈️**
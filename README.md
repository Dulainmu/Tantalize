# 🎭 Tantalize 2025 - Sri Lanka's Premier Cultural & Music Event

A stunning, animation-heavy website built with Next.js, featuring premium dark blue aesthetics with gold accents, designed to create a "WOW" factor for visitors and drive them to scan the QR code for Pickme Events registration.

## ✨ Features

### 🎨 Visual Design
- **Premium Dark Blue Theme** (#0A0E27) with gold accents (#FFD700)
- **Full-screen video background** with cinematic overlay effects
- **Floating particle animations** for immersive experience
- **Glass morphism effects** throughout the interface
- **Custom gradient text effects** with shimmer animations
- **Responsive design** optimized for all devices

### 🚀 Animations & Interactions
- **Framer Motion** powered smooth animations
- **Parallax scrolling effects** for depth
- **Hover animations** and micro-interactions
- **Scroll-triggered animations** for content reveal
- **Staggered animations** for sequential content loading
- **Smooth page transitions** and loading states

### 📱 Sections
1. **Hero Section** - Full-screen video with dramatic typography
2. **About Section** - QR code integration for Pickme Events
3. **Artist Lineup** - Interactive artist cards with hover effects
4. **Event Schedule** - Timeline with alternating layout
5. **Sponsors** - Tiered sponsor showcase
6. **Contact** - Multiple contact methods and final CTA

### 🎯 Key Features
- **QR Code Integration** - Directs users to Pickme Events for ticket purchase
- **Ticket Pricing Display** - General (Rs. 2,500) and VIP (Rs. 5,000)
- **Mobile-First Design** - Hamburger menu and touch-optimized interactions
- **Performance Optimized** - Lazy loading and efficient animations
- **SEO Optimized** - Meta tags and structured data

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter & Poppins (Google Fonts)
- **Deployment**: Vercel (recommended)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tantalize-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your video background**
   - Place your background video as `public/background-video.mp4`
   - Recommended: MP4 format, 1920x1080, optimized for web

4. **Start development server**
```bash
npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`

## 📁 Project Structure

```
tantalize-2025/
├── src/
│   └── app/
│       ├── globals.css          # Global styles and animations
│       ├── layout.tsx           # Root layout with metadata
│       └── page.tsx             # Main page component
├── public/
│   └── background-video.mp4     # Hero section video
├── tailwind.config.js           # Tailwind configuration
└── package.json
```

## 🎨 Design System

### Colors
- **Primary Dark Blue**: #0A0E27
- **Gold Accent**: #FFD700
- **Gradients**: Custom gold and blue gradients
- **Glass Effects**: Semi-transparent overlays

### Typography
- **Display Font**: Poppins (headings)
- **Body Font**: Inter (content)
- **Sizes**: Responsive typography scale

### Animations
- **Fade In Up**: Content reveal animations
- **Stagger**: Sequential element animations
- **Hover Effects**: Interactive micro-animations
- **Particles**: Floating background elements

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Add environment variables if needed

### Other Platforms
- **Netlify**: Build command: `npm run build`
- **AWS Amplify**: Framework: Next.js
- **Railway**: Automatic detection

## 🎯 Performance Features

- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Intersection Observer for animations
- **Video Optimization**: Compressed background video
- **Font Optimization**: Google Fonts with display swap

## 🔧 Customization

### Adding New Sections
1. Create new section component in `page.tsx`
2. Add navigation link in the nav menu
3. Use consistent animation patterns
4. Follow the design system guidelines

### Updating Content
- **Event Details**: Update in the respective sections
- **Pricing**: Modify in the About section
- **Contact Info**: Update in the Contact section
- **Sponsors**: Add/remove in the Sponsors section

### Styling Changes
- **Colors**: Update in `tailwind.config.js`
- **Animations**: Modify in `globals.css`
- **Components**: Use Tailwind classes for styling

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## ⚖️ Copyright & License

**© 2025 Tantalize. All Rights Reserved.**

This repository and its contents, including but not limited to the source code, design elements, assets, and documentation, are the proprietary property of **Tantalize 2025** and its developers.

**Strictly Prohibited Actions:**
- Unauthorized copying, cloning, or forking of this repository.
- Reproduction, modification, or distribution of any part of this codebase.
- Use of the design, assets, or code for commercial or non-commercial purposes without explicit written permission.

This project is intended for viewing purposes only. Any violation of these terms may result in legal action.

## 🎭 About Tantalize

Tantalize is Sri Lanka's premier cultural and music event, bringing together thousands of attendees, top artists, and prominent sponsors for an unforgettable celebration of culture and music.

---

**Built with ❤️ for Tantalize 2025**

*Experience the pinnacle of entertainment*
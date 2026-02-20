<div align="center">

# 🚀 MEGP Portfolio

**Personal Portfolio Website of Enggi Pratama**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-FF4785?style=flat-square&logo=framer)](https://www.framer.com/motion/)

[🌐 Live Demo](https://enggipratama.my.id) · [📧 Contact](mailto:work.enggipratama@gmail.com) · [💼 LinkedIn](https://linkedin.com/in/enggipratama)

</div>

---

## ✨ Features

- 🎨 **Modern UI/UX** — Clean and minimalist design with smooth animations
- 🌓 **Dark/Light Mode** — Seamless theme switching with next-themes
- 📱 **Fully Responsive** — Optimized for all devices and screen sizes
- ✉️ **Contact Form** — Functional contact form with email integration via Resend
- 📊 **GitHub Stats** — Live GitHub contribution heatmap and repository stats
- 💬 **Discussion Board** — Giscus-powered comment system for interactions
- ⚡ **Performance** — Built with Next.js App Router for optimal performance
- 🎯 **SEO Optimized** — Meta tags and structured data for better search visibility

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Forms** | React Hook Form + Zod |
| **Email** | [Resend](https://resend.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📸 Screenshots

<div align="center">

| Light Mode | Dark Mode |
|:----------:|:---------:|
| ![Light Mode](/Images/screenshot-light.png) | ![Dark Mode](/Images/screenshot-dark.png) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/enggipratama/enggipratama_porto.git
   cd enggipratama_porto
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   # Email Configuration (Resend)
   RESEND_API_KEY=your_resend_api_key
   CONTACT_RECEIVER_EMAIL=your_email@example.com

   # GitHub API
   GITHUB_ACCESS_TOKEN=your_github_token
   GITHUB_USERNAME=your_github_username
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form handler
│   │   └── github/        # GitHub stats API
│   ├── contact/           # Contact page
│   ├── giscus/            # Discussion page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── portfolio_card/    # Portfolio cards
├── lib/                   # Utility functions
├── public/                # Static assets
└── ...config files
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## 🌟 Key Features Explained

### 📧 Contact Form
- Spam protection with honeypot field
- Email delivery via Resend API
- Toast notifications for user feedback

### 📊 GitHub Integration
- Real-time contribution heatmap
- Repository statistics
- Pinned repositories display

### 🎭 Theme System
- System preference detection
- Manual toggle with persistent state
- Smooth transitions between themes

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.

---

## 🤝 Connect With Me

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-enggipratama-181717?style=flat-square&logo=github)](https://github.com/enggipratama)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-enggipratama-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/enggipratama)
[![Instagram](https://img.shields.io/badge/Instagram-enggiipratama-E4405F?style=flat-square&logo=instagram)](https://instagram.com/enggiipratama)
[![Email](https://img.shields.io/badge/Email-work.enggipratama@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:work.enggipratama@gmail.com)

</div>

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Enggi Pratama](https://enggipratama.my.id)

</div>

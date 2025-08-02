# Smart Doctor - AI-Powered Medical Assistant

A modern, mobile-first web application built with React and Tailwind CSS that provides AI-powered medical assistance, doctor booking, and health management features.

## 🚀 Features

### Core Features
- **User Authentication & Profile Management**
- **AI-Powered Report Analysis** - Upload X-rays, CT scans, blood reports
- **Local Doctor Finder** - Find specialists by location, specialty, rating
- **Appointment Booking System** - Schedule and manage appointments
- **Symptom-to-Diagnosis Chat** - AI chat assistant for symptom analysis
- **Health Timeline** - Track medical history and AI diagnoses

### Advanced Features
- **Image-to-Insight Scanner** - Upload skin symptoms for AI analysis
- **Drug Interaction Checker** - Check prescription interactions and allergies
- **Risk Zone & Heat Map** - View health risks in your area
- **Insurance Assistant** - Check coverage and claim status
- **Preventive Health Coach** - Personalized health recommendations
- **Video Consult with AI** - AI doctor consultations when real doctors unavailable

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Routing**: React Router DOM

## 📱 UI/UX Design

- **Mobile-First Design** - Optimized for mobile devices
- **Health-Tech Theme** - Blue, white, and light gray color scheme
- **Modern Components** - Rounded corners, soft shadows, smooth transitions
- **Native App Feel** - Designed to feel like a native mobile application

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-doctor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
smart-doctor/
├── src/
│   ├── components/
│   │   ├── StatusBar.tsx          # iOS-style status bar
│   │   ├── UserHeader.tsx         # User profile header
│   │   ├── UpcomingSchedule.tsx   # Appointment cards
│   │   ├── DoctorFinder.tsx       # Doctor search and filters
│   │   ├── DailyReport.tsx        # Health report section
│   │   ├── BottomNav.tsx          # Bottom navigation
│   │   ├── ReportUpload.tsx       # File upload component
│   │   ├── AIResultCard.tsx       # AI diagnosis results
│   │   └── SymptomChat.tsx        # AI chat interface
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # App entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tailwind.config.js            # Tailwind configuration
├── vite.config.ts                # Vite configuration
└── README.md                     # This file
```

## 🎨 Design System

### Colors
- **Primary Blue**: `#2563eb` (bg-blue-600)
- **Light Blue**: `#eff6ff` (bg-blue-50)
- **Gray Scale**: Various gray shades for text and backgrounds
- **Health Colors**: Green for success, red for warnings, yellow for alerts

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: Responsive text sizing with Tailwind utilities

### Components
- **Rounded Corners**: `rounded-xl`, `rounded-full`
- **Shadows**: `shadow-md`, `shadow-soft`
- **Spacing**: Consistent padding and margins
- **Transitions**: Smooth hover and focus states

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Extended color palette for health-tech theme
- Custom font family (Inter)
- Custom shadow utilities
- Mobile-first responsive design

### Vite
- Fast development server
- Hot module replacement
- Optimized build process

## 📱 Mobile Optimization

The app is designed specifically for mobile devices with:
- **375px max-width container** for optimal mobile viewing
- **Touch-friendly buttons** and interactive elements
- **Responsive typography** that scales appropriately
- **Mobile-first navigation** with bottom tab bar

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Import the project
3. Build command: `npm run build`
4. Output directory: `dist`

### Netlify
1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- **Offline Mode** - Work without internet connection
- **Push Notifications** - Health reminders and alerts
- **Voice Commands** - Voice-to-text for symptom description
- **AR Integration** - Augmented reality for symptom scanning
- **Blockchain Health Records** - Secure, decentralized health data
- **Telemedicine Integration** - Direct video calls with doctors

---

Built with ❤️ for better healthcare accessibility 
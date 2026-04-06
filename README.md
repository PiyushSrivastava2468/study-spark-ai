# Study Spark AI 📚✨

> Your all-in-one AI-powered student productivity app — study smarter, not harder.

Study Spark AI combines artificial intelligence with powerful productivity tools to help students manage tasks, take notes, track academic progress, and prepare for exams — all in one place.

---

## 🚀 Features

### 🧠 AI-Powered Learning
| Feature | Description |
|---------|------------|
| **AI Chat Assistant** | Real-time conversational AI tutor — ask questions, get explanations, solve problems with full context memory |
| **Smart Summaries** | Turn lengthy notes into concise, key-point summaries using Groq AI (Llama 3.3) |
| **AI Flashcards** | Auto-generate interactive flashcards with flip animations from any study material |
| **Quiz Generator** | Create auto-graded multiple-choice quizzes instantly from your notes |
| **Important Questions** | Get AI-predicted likely exam questions for any topic |
| **5-Min Revision** | Ultra-quick revision notes for last-minute study sessions |

### ⚡ Productivity Suite
| Feature | Description |
|---------|------------|
| **Task Manager** | Create, organize, and track tasks with priorities, due dates, and status filters |
| **Focus Timer** | Pomodoro-style timer with customizable durations and automatic session logging |
| **Weekly Planner** | Time-blocked weekly schedule for organizing study sessions |
| **Notes** | Full-featured note-taking with search and organization |
| **Goal Tracking** | Set academic goals and track progress with visual indicators |

### 📊 Academic Tracking
| Feature | Description |
|---------|------------|
| **GPA Calculator** | Multi-semester GPA tracking with target setting |
| **Analytics Dashboard** | Charts and heatmaps showing productivity patterns and trends |
| **Activity History** | Complete audit trail of all tasks, goals, and focus sessions |
| **AI Material Library** | Save and access all AI-generated study materials anytime |

### ✨ Platform
- 🌙 Dark & Light Mode
- 📱 Fully Responsive (Mobile, Tablet, Desktop)
- 📲 Android App (via Capacitor)
- 🔐 Secure Authentication (Supabase Auth)
- 📄 Multi-input: Text, PDF, Image OCR, Voice

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn/UI, Radix Primitives
- **AI**: Groq API (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`, `mixtral-8x7b-32768`)
- **Backend**: Supabase (Auth, Database, Row-Level Security)
- **Mobile**: Capacitor (Android)
- **Charts**: Recharts
- **OCR**: Tesseract.js
- **PDF**: pdfjs-dist

---

## 📦 Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (v9+)
- A [Groq API Key](https://console.groq.com/) (free)
- A [Supabase](https://supabase.com/) project (free tier)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/study-spark-ai.git
   cd study-spark-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Fill in your keys:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📖 Usage Guide

### AI Chat Assistant
Navigate to **AI Chat** from the sidebar. Type any study-related question and the AI will respond with markdown-formatted answers. The conversation remembers context for follow-up questions.

### AI Study Hub
Go to **AI Study Hub** → select a tool (Summary, Flashcards, Quiz, etc.) → enter your topic or paste notes → click **Generate**. Save results to your Library.

### Tutorials
Visit the **Tutorials** page for step-by-step guides on using every feature in the app.

### Features Page
Check the **Features** page for a comprehensive overview of all capabilities.

---

## 📱 Building for Android

```bash
npm run build
npx cap sync
```
Then open the `android` folder in Android Studio and build your APK.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Follow existing code style and conventions
- Write descriptive commit messages
- Test your changes before submitting
- Update documentation if adding new features

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) — Ultra-fast AI inference engine
- [Supabase](https://supabase.com/) — Backend & Auth
- [Shadcn/UI](https://ui.shadcn.com/) — UI components
- [Lucide Icons](https://lucide.dev/) — Beautiful icons
- [Capacitor](https://capacitorjs.com/) — Native mobile builds

---

<p align="center">
  Made with ❤️ for students everywhere
</p>

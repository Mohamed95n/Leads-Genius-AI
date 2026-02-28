# LeadGenius AI 🎯

LeadGenius AI is an AI-powered Google Maps lead scraper, scorer, and sales automation CRM. It allows you to find highly targeted leads using natural language, analyze their business, find decision-makers, and generate personalized cold emails—all within a single, seamless interface.

## 🚀 Features

### 1️⃣ AI Lead Scraper
- Find businesses using natural language prompts (e.g., "Luxury restaurants in Riyadh with rating under 4 stars").
- Extracts business name, phone number, location, website, rating, and review count using Google Maps integration.
- Export results to CSV or save them directly to the built-in CRM.

### 2️⃣ Smart Lead Scoring
- Automatically scores leads from 0 to 100 based on data completeness, reviews, ratings, and contact information availability.
- Helps prioritize the leads with the highest sales potential.

### 3️⃣ AI Business Insights
- Analyzes a business to identify potential pain points and challenges.
- Suggests smart entry angles and conversation starters to improve your outreach success rate.

### 4️⃣ Decision Maker Finder
- Uses advanced search to find key decision-makers (CEOs, Founders, Directors) and their LinkedIn profiles.
- Helps you bypass customer service and reach the people who matter.

### 5️⃣ AI Email Generator
- Generates highly personalized cold sales emails based on the business's identified problems and suggested entry angles.
- Supports multiple tones: Formal, Friendly, Direct, and Consultative.

### 6️⃣ Sales Kanban CRM
- A simple, drag-and-drop Kanban board to track your sales pipeline.
- Stages include: New Leads, Contacted, Follow-up, Closed Won, and Closed Lost.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI Integration:** Google Gemini API (`@google/genai`)
- **Drag & Drop:** `@dnd-kit`
- **CSV Export:** PapaParse

## ⚙️ Setup & Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env.local` file and add your Gemini API key:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY="your_gemini_api_key_here"
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 How it Works

1. **Scrape:** Go to the "Lead Scraper" tab and enter a prompt describing your ideal customer profile.
2. **Save:** Review the results and click "Save to CRM" to add them to your pipeline.
3. **Analyze:** Open a lead from the Kanban board and click "Analyze Business" to get AI insights.
4. **Find Contacts:** Click "Find Contacts" to discover decision-makers.
5. **Outreach:** Generate a personalized email and move the lead across your Kanban board as you progress through the sales cycle.

## 📝 License

MIT License

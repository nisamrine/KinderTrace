# KinderTrace AI: Technical Implementation Guide

## 1. System Architecture
KinderTrace AI is built as a highly responsive React SPA (Single Page Application) utilizing a decoupled service architecture. The system is designed to handle high-frequency data entry (pedagogical logs) and transform it into low-frequency, high-value creative assets (storybooks).

### Core Tech Stack
- **Frontend Framework:** React 19 (ES6 Modules)
- **Language:** TypeScript (Strict Typing)
- **Styling:** Tailwind CSS (Utility-first, responsive design)
- **Data Visualization:** Recharts (SVG-based analytics)
- **Iconography:** Lucide-React
- **AI Engine:** Google Gemini SDK (@google/genai)

---

## 2. Multi-Agent Orchestration
The "Intelligence Layer" of KinderTrace AI follows an agentic workflow where different models are selected based on the specific cognitive load of the task.

### A. The Analyst Agent (Gemini 3 Flash)
- **Role:** Data extraction and structured processing.
- **Function:** Processes raw voice transcripts and staff notes to extract structured JSON entities (Activities, Behaviors, Milestones).
- **Justification:** High speed and low latency are critical for real-time feedback in the "Pulse" screen.

### B. The Senior Pedagogue (Gemini 3 Pro)
- **Role:** Synthesis and Insight generation.
- **Function:** Analyzes 30+ days of child data to generate "Pedagogical Recommendations" and "Journey Narratives."
- **Justification:** Requires deep reasoning and context windows to understand developmental patterns over time.

### C. The Creative Director (Gemini 3 Pro)
- **Role:** Narrative weaving and visual prompt engineering.
- **Function:** Converts structured data into a 5-page storybook script. It also engineers detailed Manga-style prompts for the Artist Agent.

### D. The Artist Agent (Gemini 3 Pro Image Preview)
- **Role:** Context-aware image generation.
- **Function:** Generates 1K resolution Manga illustrations using child-specific "Visual Descriptions" and "Reference Avatars" to maintain character consistency.

---

## 3. Data Flow & State Management

### State Synchronization
- **Global Context:** Managed in `App.tsx`, tracking `selectedChild` and `currentScreen`.
- **Local State:** Screens like `PulseScreen` manage transient form data (tags, recording states) before committing to the mock-backend.

### Data Service Layer (`services/dataService.ts`)
- **JSON Hydration:** Simulates a cloud-stored database by fetching structured logs from the `/data/logs/` directory.
- **Error Handling:** Implements mapping logic to handle naming variations and legacy data structures.

---

## 4. UI/UX Implementation: "Whimsical Professionalism"

### Design tokens
- **Font:** `Quicksand` (Primary) for a soft, child-friendly yet legible feel.
- **Blur:** `backdrop-blur-xl` (Glassmorphism) used to differentiate between system layers and content layers.
- **Animation:** `framer-motion` style transitions (via Tailwind `animate-in`) for smooth screen state changes.

### Voice Integration
- **Implementation:** Utilizes the Web Speech API (`SpeechRecognition`).
- **UX Flow:** Continuous interim results are appended to a persistent `initialTextRef` to prevent data loss during long dictations, supporting hands-free operation for staff.

---

## 5. Security & Compliance
- **Statelessness:** No PII (Personally Identifiable Information) is stored within the AI model weights; data is passed as context and cleared post-session.
- **Permissioning:** Metadata explicitly requests `microphone` and `camera` access to ensure browser-level transparency.
- **Grounding:** All AI recommendations are prompted with a "Senior Child Psychologist" system instruction to maintain professional boundaries.

---

## 6. Future Scalability Path
1. **Live API Integration:** Transition the "Pulse" screen to the Gemini Live API for real-time pedagogical coaching during observations.
2. **Video Generation:** Implementation of `veo-3.1-fast-generate-preview` for "Month in Motion" video memories.
3. **Multi-lingual Support:** Leveraging Gemini's native translation capabilities for multi-lingual parent bodies.

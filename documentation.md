
# KinderTrace AI - Product & Technical Documentation

## 1. Vision & Overview
KinderTrace AI is an educational documentation platform designed for daycare centers. It uses **agentic AI architecture** to transform observations into structured data on child development, regulatory compliance reports, and memory albums for parents.

---

## 2. Design System:

---

## 3. Screen Breakdown & Functionalities

### 3.1. Authentication Portal
- **User interface:**
- **Function:** restricts access to authorized daycare staff.

### 3.2. Observation Center
- **Main interface:** the **manual log**, a structured form for recording arrivals/departures, activities, and behaviors.
- **Tag system:** Activity and behavior tags are interactive. Users can add "Other" categories via a dotted-border field that integrates seamlessly into the user interface.
- **AI-assisted text fields:**
- **Staff and parent notes:** Localized "Mic" buttons that trigger voice-to-text conversion.
- **Transcription label:** "AI will automatically transcribe" the data.

### 3.3. Insights Dashboard (the "brain")
- **Dynamic professional actions:**
  - **Educational recommendations:** an interactive AI consultant. Powered by **Gemini 3 Flash**, it analyzes the child's current indicators (sleep, mood, attendance) to generate three actionable educational recommendations for staff.
- **Key performance widgets:**
  - **Sleep tracking:** visualizes nap times against each child's individual goals.
  - **Line graph of mood:** tracks "calm," "energetic," and "restless" trends throughout the week.
  - **Bar chart of attendance hours:** calculates and displays daily arrival and departure times, weekly totals, and attendance trends.
- **Educational summary:** AI-generated historical milestones.

### 3.4. Daily Storybook (Magic Screen)
- **UI:** A whimsical, "storybook-style" layout with Manga-inspired illustrations.
- **Function:** Triggers the "Agentic Pipeline."
  - **Step 1:** Analyst extracts milestones.
  - **Step 2:** Compliance agent verifies pedagogical value.
  - **Step 3:** Creative agent writes a 5-page whimsical narrative.
  - **Step 4:** Gemini 2.5 Flash Image generates tailored illustrations.
- **Sharing:** Features Share and PDF Export capabilities for parent communication.

---

## 4. Technical Architecture: Multi-Agent Orchestration
KinderTrace AI operates on a tiered AI model:

1.  **The Analyst Agent (Gemini 3 Flash):** Optimized for speed and extraction. It converts messy staff notes into clean JSON milestones.
2.  **The Compliance Agent (Gemini 3 Pro):** The "Senior Pedagogue." It ensures all documentation meets the rigorous standards of the French national framework.
3.  **The Creative Agent (Gemini 3 Pro):** The "Narrator." It uses the high reasoning capabilities of the Pro model to weave complex data into simple, warm stories.
4.  **The Artist (Gemini 2.5 Flash Image):** Converts text prompts into high-quality Manga caricature art.

---

## 5. Data Structure & Backend
- **Storage Strategy:** Observations are stored in a schema optimized for Google Cloud Storage (GCS) integration. 
- **Privacy:** All AI calls are stateless; pedagogical data is processed as context and stored in the secure backend service, ensuring PII is protected.
- **Scalability:** The child-selector context ensures the agents only "see" relevant data for the specific child being analyzed.

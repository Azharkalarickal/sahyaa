# 🌿 Sahyaa — Literary Social & Publishing Platform

**Sahyaa** is a social publishing and reading platform built for poets, writers, essayists, and readers celebrating contemporary literature, regional translations, and South Asian / Western Ghats heritage lore.

---

## 🏛️ Platform Architecture & Features

The platform implements the complete interactive architecture corresponding to the **Sahyaa MVP User Flow**:

1. **Role Onboarding & Literary Taxonomy Calibration (`OnboardingModal`)**:
   - Persona setup: **Writer & Bard**, **Avid Reader & Critic**, **Journal Curator & Editor**, and **Platform Guardian**.
   - Literary taxonomy calibration: Poetry, Short Fiction, Essays & Criticism, Monsoon Lore & Ecology, Magic Realism, Malayalam Literature, and Regional Translations.
   - Pen-name registration and instant feed customization.

2. **Dual-Role Profiles & Archives (`ProfileModal`)**:
   - Published works catalog, private drafts repository, saved reading list bookmarks, follower metrics, and persona badge.

3. **Writer Studio & Publishing Engine (`StudioEditor`)**:
   - Formats: **Lyrical Poetry & Verse** (with stanza spacing & verse formatting), **Short Stories**, **Literary Essays**, and **Micro-Musings**.
   - Live word counter, character counter, and read-time estimator.
   - Cover art selector with literary presets (*Monsoon Rains*, *Teak Library*, *Western Ghats Mist*, etc.).
   - Featured quote highlight extractor.
   - Direct publishing to Sahyaa Feed OR **Submit & Pitch to Literary Journals** (*The Monsoon Review*, etc.).

4. **Literary Social Feed & Quote Card Sharer (`Feed`, `ReaderModal`, `QuoteCardModal`)**:
   - Multi-tab discover feed: *All*, *Trending*, *Editor's Picks*, *Poetry Lounge*, *Short Stories*, *Essays*.
   - **Distraction-Free Immersion Reader**: Switch between *Obsidian Dark*, *Emerald Night*, *Warm Sepia*, and *Parchment Light* themes; font size sliders; and built-in **Speech Synthesis Audio Reader**.
   - **Multi-Applaud Clapping**: Animated floating applaud counters with confetti celebrations.
   - **Visual Quote Card Creator**: Generate styled image cards with themes (*Emerald Rain*, *Royal Midnight*, *Warm Parchment*, *Sunset Amber*, *Obsidian Minimal*) ready for social media export.
   - Threaded literary discussions and comments.

5. **Digital Magazines & Editorial Review Desk (`MagazinesHub`, `EditorialDashboard`)**:
   - Curated literary journals (*The Monsoon Review*, *Sahya Chronicles*, *Kavya Quarterly*).
   - Themed issue releases (*Monsoon Whispers & Rain Lore*, *Shadows of the Banyan Tree*).
   - Author pitch and submission pipeline.
   - Chief Editor review desk: read author cover letters, review draft extracts, and accept/decline with constructive editorial feedback.

6. **Community Moderation & Plagiarism Triage (`ModerationDashboard`, `ReportModal`)**:
   - Flag content for *Plagiarism*, *Hate Speech*, *NSFW*, or *Harassment*.
   - Guardian desk triage queue for review, warning authors, and quarantining content.

7. **Interactive Architecture Map (`ArchitectureViewer`)**:
   - Built-in interactive flowchart visualizer of the 6 platform phases with clickable nodes, relational database models, API endpoint mappings, and a 1-click **"Launch & Test This Flow Live"** runner.

---

## 📦 Local Database (Same Folder)

The database is stored directly in the project workspace folder:
```
c:\Users\Azhar\Desktop\sahya\sahyaa.db
```

### Database Tables:
- `users`: User profiles, roles (reader/writer/editor/moderator), pen-names, badges, genres.
- `posts`: Literary pieces, verses, stories, essays, drafts, applauds count, bookmarks, view count.
- `magazines`: Curated literary journals, curators, guidelines.
- `magazine_issues`: Volume editions with themes and release dates.
- `magazine_submissions`: Author pitches, editorial status (`pending`, `accepted`, `rejected`), feedback notes.
- `comments`: Literary discussions and feedback on pieces.
- `interactions`: Applauds, bookmarks, and author follow tracking.
- `moderation_reports`: Community safety reports and resolution audit logs.
- `quote_cards`: Generated shareable quote snippets.

---

## 🚀 How to Run

### 1. Start the Full-Stack Production App
```bash
npm start
```
Open **[http://localhost:3001](http://localhost:3001)** in your browser.

### 2. Development Mode (with Hot Reload)
In one terminal:
```bash
npm run server
```
In another terminal:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

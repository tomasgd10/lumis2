# Lumis 2.0 - Cyberpunk Edition

> *Where blockchain meets myth. Reimagined with cyberpunk aesthetics.*

## 🌟 What's New in Lumis 2.0

Lumis 2.0 takes the mythological blockchain education experience and wraps it in a stunning **cyberpunk/sci-fi aesthetic** inspired by the Proxim8 project. This version maintains all the Lumis content and functionality while introducing:

### Visual Enhancements

- **Dark Cyber Theme**: Deep space blues with electric cyan and vibrant orange accents
- **Scanline Overlay**: Retro CRT monitor effect across the entire site
- **Grid Overlay**: Subtle cyberpunk grid pattern in the background
- **Vignette Effect**: Dramatic lighting that draws focus to content
- **Corner Crosshairs**: Tactical UI elements in all four corners
- **Glowing Effects**: Neon glow on interactive elements and text

### UI Improvements

- **Fixed Navigation Elements**:
  - Glowing LUMIS logo at top center
  - Animated "ENTER THE LUMISVERSE" button (top right)
  - Vertical sidebar navigation (right side)
  - Scroll progress indicator

- **Enhanced Typography**:
  - **Orbitron** font for UI elements (futuristic, tech-focused)
  - **Cinzel** font for titles (mythological, epic)
  - Terminal-style text with `>` prefix for system messages

- **Interactive Journey System** (fully functional):
  - 5 arcs with progressive unlock system
  - Expandable/collapsible arc content
  - Quiz validation with visual feedback
  - Progress tracking with localStorage persistence
  - Completion celebration modal

### Color System

```css
--cyber-cyan: hsl(180, 100%, 43%)     /* Primary accent, links, highlights */
--cyber-orange: hsl(18, 100%, 60%)    /* Secondary accent, CTAs, villains */
--cyber-bg: hsl(202, 50%, 8%)          /* Main background */
--cyber-dark: hsl(202, 60%, 5%)        /* Darker sections */
--muted-foreground: hsl(200, 10%, 60%) /* Body text, descriptions */
```

## 📂 Project Structure

```
lumis2/
├── index.html          # Main page with all sections
├── styles.css          # Complete cyberpunk styling
├── script.js           # Interactive journey system
└── README.md           # This file
```

## 🎨 Sections Overview

### 1. Hero Section
- Animated title with staggered word reveals
- Stats display (Realms, Arcs, Guide)
- Floating scroll hint with arrow
- Terminal-style subtitle

### 2. Journey Section
- Progress bar showing completion (0-100%)
- 5 interactive arcs with lessons and quizzes
- Lock/unlock progression system
- Correct/incorrect answer feedback
- Completion celebration modal

### 3. Realms Section
- Cards for Origin Citadel (Bitcoin), The Foundry (Ethereum), Tronara (Tron)
- Hover effects with cyan glow
- Value tags for each realm
- CTA for protocol partnerships

### 4. Shadow Syndicate Section
- Villain cards for Rugrath, Phishara, Centralis
- Threat type information
- Link to Shadow Syndicate Defender game
- Orange accent theme for danger

### 5. Lumi AI Section
- Description of Lumi's capabilities
- Feature list with icon bullets
- CTA button to open Lumi chat

### 6. Footer
- Links to all sections
- Tagline and copyright
- Minimalist design with border accent

## 🎮 Interactive Features

### Journey System Functions

```javascript
toggleArc(arcNum)              // Expand/collapse arc content
selectQuizOption(arcNum, idx)  // Select a quiz answer
submitQuiz(arcNum, correct)    // Validate and progress
resetProgress()                // Clear all saved progress (console)
```

### Progress Persistence

- All completed arcs saved to `localStorage`
- Survives page refreshes
- Can be reset via console: `resetProgress()`

### Notifications

- Success messages (green)
- Warning messages (yellow)
- Info messages (cyan)
- Auto-dismiss after 3 seconds

## 🔧 Technical Stack

- **HTML5**: Semantic, accessible structure
- **CSS3**: Custom properties, animations, gradients
- **Vanilla JavaScript**: No frameworks, pure DOM manipulation
- **localStorage**: Client-side persistence
- **Google Fonts**: Orbitron + Cinzel

## 🌐 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (responsive design)

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+ (full experience with sidebar nav)
- **Tablet**: 768px - 1023px (simplified nav)
- **Mobile**: < 768px (stacked layout, hidden decorative elements)

## 🎨 Design Inspirations

This version combines:
- **Lumis Original**: Mythology, storytelling, blockchain education
- **Proxim8 Project**: Cyberpunk aesthetics, neon colors, tactical UI
- **Retro-Futurism**: CRT scanlines, terminal text, grid overlays
- **Modern Web**: Smooth animations, accessible interactions

## 🚀 Getting Started

### Standalone Version

Simply open `index.html` in a browser. Everything works client-side!

### With Live Server (Recommended)

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using VS Code Live Server extension
Right-click index.html → "Open with Live Server"
```

Then visit: `http://localhost:8000`

## 🔗 Integration with Original Lumis

This version is **standalone** and doesn't require the original Lumis files. However, you can:

1. **Link to original features**:
   - Update `href="lumi-chat.html"` to point to `../lumis/lumi-chat.html`
   - Update `href="game.html"` to point to `../lumis/game.html`

2. **Copy original files here**:
   ```bash
   cp ../lumis/lumi-chat.html .
   cp ../lumis/game.html .
   cp ../lumis/server.js .
   cp ../lumis/package.json .
   ```

3. **Use as a landing page**:
   - This could be the main entry point
   - Original Lumis files become sub-pages

## 🎯 Next Steps (Optional Enhancements)

### Easy Wins
- [ ] Add more realm cards (Solana, Polygon, Avalanche)
- [ ] Integrate actual game.html and lumi-chat.html
- [ ] Add glossary modal/page
- [ ] Partnership deck integration

### Advanced Features
- [ ] Parallax scrolling effects
- [ ] Animated background particles
- [ ] Sound effects on interactions
- [ ] NFT badge system for completion
- [ ] Web3 wallet connection
- [ ] On-chain progress tracking

### Content Expansion
- [ ] More quiz questions per arc
- [ ] Deeper lessons with sub-modules
- [ ] Video/image content integration
- [ ] Realm-specific hero stories
- [ ] Interactive comic panels

## 💡 Developer Notes

### Console Commands

Open browser console and try:
```javascript
journeyState              // View current progress
resetProgress()           // Clear all progress
showNotification('Test')  // Test notification system
```

### Customization

**Colors**: Edit CSS variables in `styles.css` `:root`
**Content**: Update text directly in `index.html`
**Behavior**: Modify functions in `script.js`

### Performance

- No external dependencies (except fonts)
- Minimal JavaScript (< 300 lines)
- Optimized CSS with modern selectors
- No images (pure CSS graphics)

## 📜 License

MIT - The light belongs to everyone.

## 🌟 Credits

- **Original Lumis**: Claude Opus (concept & content)
- **Cyberpunk Aesthetics**: Proxim8 Project inspiration
- **Lumis 2.0 Integration**: Claude Sonnet 4.5
- **Fonts**: Google Fonts (Orbitron, Cinzel)

---

**The Chains are calling. Your journey awaits. Step into the light.** ✧

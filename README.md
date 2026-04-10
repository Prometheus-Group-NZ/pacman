# 🟡 PacMan — Pac-Man Clone + Maze Editor

A fully browser-based Pac-Man clone with a built-in maze editor, designed for Cloudflare Pages hosting.

## Features

### Game (`index.html`)
- Classic Pac-Man gameplay with 4 unique ghosts
- Boss ghost with horror ambience, 3 HP, and menacing visuals
- Power pellets, bonus fruits, and scoring system
- Progressive difficulty: extra ghosts + speed boosts each round
- Touch controls (swipe + on-screen D-pad)
- Keyboard controls (Arrow keys / WASD)
- Sound effects via Web Audio API (no external assets needed)

### Editor (`editor.html`)
- Visual tile-based maze editor
- Tools: Wall, Erase, Dot, Power Pellet, Gate, Pac-Man start, Ghost start, Fill
- Undo/Redo (Ctrl+Z / Ctrl+Y / two-finger tap / long press)
- Save/Load mazes to localStorage
- Import/Export mazes as JSON files
- Random maze generation
- Test Play button to instantly play your custom maze

## Deploy to Cloudflare Pages

### Option 1: Drag & Drop (Easiest)
1. Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/?to=/:account/pages)
2. Click **Create a project** → **Direct Upload**
3. Upload the entire `PacMan` folder
4. Your site is live at `https://pacman.pages.dev`

### Option 2: Wrangler CLI
```bash
npm install -g wrangler
wrangler pages publish .
```

### Option 3: Git Integration
1. Push this folder to a GitHub repository
2. Connect repo in Cloudflare Pages dashboard
3. Build settings:
   - Build command: *(leave empty)*
   - Build output directory: `.`
   - Root directory: `PacMan` (if in subfolder)

## Project Structure
```
PacMan/
├── index.html      # Main game
├── editor.html     # Maze editor
├── _headers        # Cloudflare Pages security headers
├── _redirects      # Cloudflare Pages redirects
├── wrangler.toml   # Wrangler CLI config
└── README.md       # This file
```

## Cloudflare Pages Compatibility

✅ **Static site** — no server-side rendering required  
✅ **Zero dependencies** — pure HTML/CSS/JS, no build step  
✅ **LocalStorage** — saves mazes and high scores client-side  
✅ **SessionStorage** — test play communication between pages  
✅ **Web Audio API** — procedural sound effects (no audio files)  
✅ **Canvas API** — all rendering via 2D canvas  
✅ **Touch-friendly** — responsive design for tablets and phones  
✅ **Offline-capable** — works once loaded, no external dependencies (except Lineicons CDN)  

## Performance Optimizations
- Fixed 60 FPS game loop (prevents UI freezing on high refresh displays)
- Offscreen canvas caching for static wall rendering
- Efficient tile-based collision detection
- Debounced render calls (only re-renders when state changes)

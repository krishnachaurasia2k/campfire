# 🎭 Beyond The Reality

> *A Trauma-Based Psychological Thriller Game*

> "Sometimes the scariest place isn't the world outside — it's the world inside."

---

🏆 **Winner — Best Ideation | Campfire Hackathon**

---

## 🧠 About The Game

**Beneath the Mask** is a trauma-driven psychological thriller that explores the hidden layers of a person's personality.

The game follows a protagonist who survives a traumatic plane crash — only to awaken in a familiar yet distorted version of reality. As the story unfolds, players navigate between:

- 🌐 The **real world**
- 🩸 The **subconscious mind**
- 🎭 The **masked persona**
- 🌀 The **true hidden self**

Every action reveals fragments of suppressed trauma, inner darkness, and emotional scars.

---

## 🎮 Core Concept

The game explores:

- Trauma and repression
- Duality of personality
- Psychological breakdown
- Reality vs hallucination
- The mask people wear in society

Players slowly uncover that the real antagonist may not be external — but **internal**.

---

## 🕹️ Gameplay Features

- 🧩 Puzzle-based progression
- 🌍 Semi open-world exploration
- 👁️ Psychological horror elements
- 🎨 Pixel-art / stylized visuals
- 🔀 Reality-switch mechanics
- 🩸 Symbolic storytelling
- 🎧 Atmospheric sound design

---

## 🧩 Story Overview

After a devastating plane crash, the protagonist wakes up in an empty classroom.

Nothing feels right.

The school corridors are silent. Shadows move where they shouldn't. Memories replay in distorted forms.

As the player explores deeper, the world transforms into manifestations of trauma:

- Bullies become monstrous forms
- Classrooms morph into warzones
- The sky fractures
- The protagonist's reflection changes

Eventually, players confront the **true self** hidden beneath layers of denial and rage.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Engine   | HTML5      |
| Language | HTML / JavaScript / CSS |
| Art Style | Pixel / Stylized 2D |
| Audio    | Ambient psychological soundtrack |

---

## 📁 Project Structure

```
campfire/
├── public/                     # Static assets served at root path
│   ├── BEYOND/                 # Vanilla JS standalone game
│   │   ├── index.html          # Game entry point (plain HTML)
│   │   ├── game.js             # Core game logic
│   │   └── style.css           # Game styles
│   ├── classroom_bg.png        # Scene background — classroom
│   ├── college_bg.png          # Scene background — college courtyard
│   ├── house_bg.png            # Scene background — house
│   ├── imagination_bg.png      # Scene background — subconscious world
│   ├── street_bg.png           # Scene background — street
│   └── vite.svg                # Favicon
│
├── src/                        # React + TypeScript source
│   ├── components/             # UI components
│   │   ├── DialogueUI.tsx      # In-game dialogue display
│   │   ├── GameCanvas.tsx      # Canvas renderer wrapper
│   │   ├── GlitchOverlay.tsx   # Glitch visual effect
│   │   ├── GlitchOverlay.css   # Glitch animation styles
│   │   ├── RainSystem.tsx      # Atmospheric rain effect
│   │   └── SkillBar.tsx        # Player skill/status bar
│   ├── game/                   # Game engine (TypeScript)
│   │   ├── CombatSystem.ts     # Combat logic
│   │   ├── Enemy.ts            # Enemy behaviour & AI
│   │   ├── GameEngine.ts       # Main engine loop
│   │   ├── Interactable.ts     # Interactable objects
│   │   ├── Player.ts           # Player controller
│   │   └── SceneManager.ts     # Scene switching & background loading
│   ├── assets/                 # Internal bundled assets
│   ├── App.tsx                 # Root React component
│   ├── App.css                 # App-level styles
│   ├── index.css               # Global styles
│   └── main.tsx                # React entry point
│
├── index.html                  # React app HTML shell
├── game.html                   # Game-specific HTML shell
├── game.zip                    # Packaged game export
├── package.json                # Dependencies & scripts
├── package-lock.json
├── vite.config.ts              # Vite build config (dual entry)
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .gitignore
└── README.md
```

---

## ⚠️ Content Warning

This game contains themes of:

- Trauma
- Psychological distress
- Violence (symbolic)
- Emotional breakdown

*Player discretion is advised.*

---

## 🎯 Vision

This project aims to create a deeply immersive emotional experience — not just a game, but a journey into the human psyche.

The goal is to make players question:

- Who are we beneath our social mask?
- Are we the victim… or something darker?
- Can trauma reshape identity?

---

## 🚀 Future Plans

- Multiple endings based on choices
- Hidden symbolic lore
- Expanded open-world segments
- More advanced AI behavior
- Voice acting

---

## 🏃‍♂️ How to Run Locally

To get the game running on your local machine:

1. **Navigate to the project directory** (make sure you are inside the `campfire/` folder where the `package.json` is located):
   ```bash
   cd campfire
   ```
2. **Install all dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser** and visit the local server provided (typically `http://localhost:5173/`). You may also test the other entry point by navigating to `http://localhost:5173/game.html` and the plain JS fallback `http://localhost:5173/BEYOND/index.html`.

---

## 🤝 Contributing

Contributions, feedback, and ideas are welcome!

If you'd like to contribute:

1. Fork the repository
2. Create a new branch
3. Submit a pull request

---

## ✨ Final Note

> *"The mind builds masks to survive. But what happens when the mask begins to crack?"*

<div align="center">

# Snake Game

A modern, responsive, and minimalist browser-based arcade experience crafted with pure vanilla web standards.

[![License](https://img.shields.io/github/license/ramazancetinkaya/snake-game?style=for-the-badge)](https://github.com/ramazancetinkaya/snake-game/blob/main/LICENSE)
[![Open Issues](https://img.shields.io/github/issues/ramazancetinkaya/snake-game?style=for-the-badge)](https://github.com/ramazancetinkaya/snake-game/issues)
[![Stars](https://img.shields.io/github/stars/ramazancetinkaya/snake-game?style=for-the-badge)](https://github.com/ramazancetinkaya/snake-game/stargazers)
[![Forks](https://img.shields.io/github/forks/ramazancetinkaya/snake-game?style=for-the-badge)](https://github.com/ramazancetinkaya/snake-game/network/members)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Online-10B981?style=for-the-badge)](https://ramazancetinkaya.github.io/snake-game/)

<p align="center">
  <a href="https://github.com/ramazancetinkaya/snake-game/issues/new">Report Bug</a>
  &nbsp;&bull;&nbsp;
  <a href="https://github.com/ramazancetinkaya/snake-game/issues">View Issues</a>
  &nbsp;&bull;&nbsp;
  <a href="https://github.com/ramazancetinkaya/snake-game/pulls">Submit Pull Request</a>
</p>

</div>

---

## Table of Contents

- [About The Project](#about-the-project)
- [Live Demo](#live-demo)
- [Features](#features)
- [Controls and Shortcuts](#controls-and-shortcuts)
- [Project Structure](#project-structure)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Download as ZIP](#2-download-as-zip)
- [Usage](#usage)
- [Browser Compatibility](#browser-compatibility)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About The Project

Snake Game is a zero-dependency, modern web implementation of the classic arcade title, engineered with native browser standards to deliver deterministic gameplay, zero-allocation rendering, and fluid performance without framework overhead.

---

## Live Demo

The production build is continuously deployed via GitHub Pages:

> Direct Access: [https://ramazancetinkaya.github.io/snake-game/](https://ramazancetinkaya.github.io/snake-game/)

Optimized for instant execution in any modern browser without installation or local setup.

---

## Features

- High-performance game loop utilizing `requestAnimationFrame` with precise timestamp delta calculations for deterministic tick pacing across varying refresh rate monitors.
- Double-buffered input FIFO queue preventing illegal 180-degree self-collisions when multiple directional keys are struck rapidly within a single physics cycle.
- Zero-allocation DOM entity recycling pool (`domEntities`) mutating hardware-accelerated CSS `translate3d` transforms, eliminating layout recalculations and garbage collection pauses.
- Real-time procedural audio synthesis built on the Web Audio API with a 3200Hz biquad low-pass filter (Q: 0.7) and soft gain envelopes to prevent acoustic fatigue.
- Strict `100dvh` viewport containment with dynamic CSS variable bindings (`--grid-size`, `--cell-size`) ensuring zero accidental page scrolling on touch devices.
- Dynamic scoring algorithm featuring escalating combo multiplier streaks, countdown windows, and floating point indicators.
- Special consumable foods including Golden Star (score multiplier and combo window extension) and Chill Berry (pace deceleration effect).
- Tiered progression system with 15 granular achievements tracking single-run triumphs and lifetime milestones.
- Customizable snake aesthetic palette themes (Obsidian, Emerald, Cobalt, Amber, Crimson, Sage) stored persistently in `localStorage`.
- Comprehensive session management with anti-tamper state invalidation when core gameplay difficulty parameters (speed, grid size, wall mode) are modified mid-run.

---

## Controls and Shortcuts

The game engine provides full input parity across desktop keyboards, hardware peripherals, and mobile touch surfaces.

| Action | Primary Shortcut | Secondary Key | Touch / Mobile Interface |
| :--- | :--- | :--- | :--- |
| Navigate Up | ArrowUp | W | D-Pad Up / Upward Swipe |
| Navigate Down | ArrowDown | S | D-Pad Down / Downward Swipe |
| Navigate Left | ArrowLeft | A | D-Pad Left / Leftward Swipe |
| Navigate Right | ArrowRight | D | D-Pad Right / Rightward Swipe |
| Pause / Resume | Space | P | Center Pause Button / Board Tap |
| Sound Toggle | M | - | Settings Segmented Switch |
| Settings Modal | O | - | Header Settings Button |
| Achievements Modal | T | - | Header Trophy / Sidebar Row |
| Help & Rules Guide | H | - | Header Help / Start Screen Action |
| Quick Restart | R | Enter (Game Over) | Modal Restart Button |

Note: Directional inputs are subject to an active turn buffer. Submitting a reversal command against the current velocity vector is discarded by the engine to safeguard the snake from illegal self-annihilation.

---

## Project Structure

The codebase maintains strict separation of concerns across presentation, layout styling, and game runtime logic:

```
snake-game/
├── index.html            
├── css/
│   └── style.css         
├── js/
│   └── app.js            
└── README.md             
```

---

## Installation

There are two methods to get this project up and running on your local machine.

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox, Safari, etc.)
- Download [Git](https://git-scm.com/) *(optional, if you choose to clone the repository)*

### 1. Clone the Repository

If you have Git installed, you can clone the repository by following these steps:

1. Open your **terminal** or **command prompt**.

2. Run the following command:
   
    ```bash
    git clone https://github.com/ramazancetinkaya/snake-game.git
    ```

4. Navigate into the project directory:

    ```bash
    cd snake-game
    ```

### 2. Download as ZIP

If you prefer not to use Git, you can download the project as a ZIP file:

1. Go to the GitHub repository page in your web browser.
2. Click the green **"Code"** button at the top right of the repository's file list.
3. Select **"Download ZIP"** from the dropdown menu.
4. Once the ZIP file is downloaded, extract it to your desired location.

---

## Usage

This is a standard frontend project, so you can run it directly in your web browser without any complex setup or server configuration:

1. Open the project folder on your computer.
2. Locate the `index.html` file.
3. **Double-click** the `index.html` file to launch it in your default web browser.

*Alternative Method:* You can also drag and drop the `index.html` file directly into any open browser tab (Chrome, Edge, Firefox, Safari, etc.).

---

## Browser Compatibility

Tested and working on:
- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Android Chrome)

---

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## Contact

Whether you need to report an issue, propose a new feature, require setup and integration guidance, or submit a security disclosure, please reach out directly:

📧 **Contact Email**: `ramazancetinkayasolutions@protonmail.com`

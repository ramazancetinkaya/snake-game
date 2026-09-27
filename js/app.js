/**
 * Snake Game
 *
 * @author     Ramazan Çetinkaya (https://github.com/ramazancetinkaya)
 * @repository https://github.com/ramazancetinkaya/snake-game
 * @license    MIT License
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Constants & Configuration
  // =========================================================================
  const STORAGE_KEY = 'snakegame';

  const SPEED_CONFIG = {
    relax: { label: 'Relax', baseMs: 160, comboWindow: 5500, basePoints: 10 },
    normal: { label: 'Normal', baseMs: 115, comboWindow: 4500, basePoints: 10 },
    fast: { label: 'Fast', baseMs: 80, comboWindow: 3800, basePoints: 12 },
    dynamic: { label: 'Dynamic', baseMs: 135, comboWindow: 4200, basePoints: 10 }
  };

  const SKIN_METADATA = {
    obsidian: { name: 'Obsidian Slate', head: '#1e293b', body: '#334155', tail: '#475569' },
    emerald:  { name: 'Emerald Viper',  head: '#065f46', body: '#047857', tail: '#059669' },
    cobalt:   { name: 'Cobalt Navy',    head: '#1e3a8a', body: '#1d4ed8', tail: '#2563eb' },
    amber:    { name: 'Amber Coral',    head: '#92400e', body: '#b45309', tail: '#d97706' },
    crimson:  { name: 'Crimson Ruby',   head: '#881337', body: '#9f1239', tail: '#be123c' },
    sage:     { name: 'Sage Olive',     head: '#365314', body: '#4d7c0f', tail: '#65a30d' }
  };

  const DIRECTIONS = {
    UP: { x: 0, y: -1, name: 'up' },
    DOWN: { x: 0, y: 1, name: 'down' },
    LEFT: { x: -1, y: 0, name: 'left' },
    RIGHT: { x: 1, y: 0, name: 'right' }
  };

  const OPPOSITE_DIRECTIONS = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };

  const STATES = {
    MENU: 'MENU',
    COUNTDOWN: 'COUNTDOWN',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
  };

  // 15 Tiered Achievements
  const ACHIEVEMENTS_DEF = [
    {
      id: 'first_bite',
      title: 'First Bite',
      desc: 'Eat your very first food item.',
      icon: 'fa-solid fa-utensils',
      type: 'single',
      tier: 'bronze',
      target: 1
    },
    {
      id: 'apple_lover',
      title: 'Apple Enthusiast',
      desc: 'Eat total apples across all games.',
      icon: 'fa-solid fa-apple-whole',
      type: 'tiered',
      tiers: [
        { name: 'Bronze', tier: 'bronze', target: 25 },
        { name: 'Silver', tier: 'silver', target: 75 },
        { name: 'Gold', tier: 'gold', target: 150 }
      ]
    },
    {
      id: 'score_hunter',
      title: 'High Scorer',
      desc: 'Reach a high score in a single run.',
      icon: 'fa-solid fa-bullseye',
      type: 'tiered',
      tiers: [
        { name: 'Bronze', tier: 'bronze', target: 100 },
        { name: 'Silver', tier: 'silver', target: 300 },
        { name: 'Gold', tier: 'gold', target: 600 }
      ]
    },
    {
      id: 'length_master',
      title: 'Anaconda',
      desc: 'Grow snake to impressive lengths.',
      icon: 'fa-solid fa-ruler-combined',
      type: 'tiered',
      tiers: [
        { name: 'Bronze', tier: 'bronze', target: 12 },
        { name: 'Silver', tier: 'silver', target: 25 },
        { name: 'Gold', tier: 'gold', target: 45 }
      ]
    },
    {
      id: 'combo_king',
      title: 'Combo Master',
      desc: 'Chain consecutive food pickups.',
      icon: 'fa-solid fa-fire',
      type: 'tiered',
      tiers: [
        { name: 'Bronze', tier: 'bronze', target: 3 },
        { name: 'Silver', tier: 'silver', target: 4 },
        { name: 'Gold', tier: 'gold', target: 5 }
      ]
    },
    {
      id: 'star_eater',
      title: 'Star Collector',
      desc: 'Collect bonus Golden Star apples.',
      icon: 'fa-solid fa-star',
      type: 'tiered',
      tiers: [
        { name: 'Bronze', tier: 'bronze', target: 1 },
        { name: 'Silver', tier: 'silver', target: 5 },
        { name: 'Gold', tier: 'gold', target: 12 }
      ]
    },
    {
      id: 'chill_seeker',
      title: 'Ice Cold',
      desc: 'Collect pace-slowing Chill Berries.',
      icon: 'fa-solid fa-snowflake',
      type: 'tiered',
      tiers: [
        { name: 'Bronze', tier: 'bronze', target: 1 },
        { name: 'Silver', tier: 'silver', target: 5 },
        { name: 'Gold', tier: 'gold', target: 10 }
      ]
    },
    {
      id: 'speed_demon',
      title: 'Speed Demon',
      desc: 'Score 150+ points in Fast speed mode.',
      icon: 'fa-solid fa-bolt',
      type: 'single',
      tier: 'gold',
      target: 150
    },
    {
      id: 'zen_runner',
      title: 'Zen Master',
      desc: 'Survive 90 seconds in Relax mode without crashing.',
      icon: 'fa-solid fa-spa',
      type: 'single',
      tier: 'silver',
      target: 90
    },
    {
      id: 'dynamic_ace',
      title: 'Dynamic Ace',
      desc: 'Score 200+ points in Dynamic speed mode.',
      icon: 'fa-solid fa-gauge-high',
      type: 'single',
      tier: 'gold',
      target: 200
    },
    {
      id: 'veteran_player',
      title: 'Dedicated Player',
      desc: 'Complete full games of Snake Pro.',
      icon: 'fa-solid fa-award',
      type: 'tiered',
      tiers: [
        { name: 'Bronze', tier: 'bronze', target: 5 },
        { name: 'Silver', tier: 'silver', target: 15 },
        { name: 'Gold', tier: 'gold', target: 35 }
      ]
    },
    {
      id: 'portal_traveler',
      title: 'Portal Hopper',
      desc: 'Pass through wrap edges 15 times in Portal mode.',
      icon: 'fa-solid fa-repeat',
      type: 'single',
      tier: 'bronze',
      target: 15
    },
    {
      id: 'close_call',
      title: 'Ninja Reflexes',
      desc: 'Make 5 turns right next to a wall or body without crashing.',
      icon: 'fa-solid fa-shield-halved',
      type: 'single',
      tier: 'silver',
      target: 5
    },
    {
      id: 'clean_streak',
      title: 'Rapid Feast',
      desc: 'Eat 3 foods within a single uninterrupted combo window.',
      icon: 'fa-solid fa-forward-fast',
      type: 'single',
      tier: 'bronze',
      target: 3
    },
    {
      id: 'grandmaster',
      title: 'Grandmaster',
      desc: 'Achieve a massive 500+ score in a single run.',
      icon: 'fa-solid fa-crown',
      type: 'single',
      tier: 'gold',
      target: 500
    }
  ];

  // =========================================================================
  // 2. Storage Manager (localStorage: snakegame)
  // =========================================================================
  const Storage = {
    getData() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            highScore: parsed.highScore || 0,
            totalGames: parsed.totalGames || 0,
            totalFood: parsed.totalFood || 0,
            maxCombo: parsed.maxCombo || 1,
            totalStars: parsed.totalStars || 0,
            totalBerries: parsed.totalBerries || 0,
            totalPortals: parsed.totalPortals || 0,
            totalCloseCalls: parsed.totalCloseCalls || 0,
            achievements: parsed.achievements || {},
            settings: {
              speed: (parsed.settings && parsed.settings.speed) || 'normal',
              wallMode: (parsed.settings && parsed.settings.wallMode) || 'solid',
              gridSize: (parsed.settings && parsed.settings.gridSize) || 20,
              skin: (parsed.settings && parsed.settings.skin) || 'obsidian',
              sound: (parsed.settings && parsed.settings.sound) || 'on'
            }
          };
        }
      } catch (e) {
        console.warn('Storage unavailable:', e);
      }
      return {
        highScore: 0,
        totalGames: 0,
        totalFood: 0,
        maxCombo: 1,
        totalStars: 0,
        totalBerries: 0,
        totalPortals: 0,
        totalCloseCalls: 0,
        achievements: {},
        settings: {
          speed: 'normal',
          wallMode: 'solid',
          gridSize: 20,
          skin: 'obsidian',
          sound: 'on'
        }
      };
    },

    saveData(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn('Unable to save to localStorage:', e);
      }
    },

    updateSetting(key, val) {
      const data = this.getData();
      if (!data.settings) data.settings = {};
      data.settings[key] = val;
      this.saveData(data);
    },

    saveScore(score, foodCount, combo) {
      const data = this.getData();
      let isNewHigh = false;
      if (score > (data.highScore || 0)) {
        data.highScore = score;
        isNewHigh = true;
      }
      data.totalGames = (data.totalGames || 0) + 1;
      data.totalFood = (data.totalFood || 0) + foodCount;
      if (combo > (data.maxCombo || 1)) {
        data.maxCombo = combo;
      }
      this.saveData(data);
      return { isNewHigh, highScore: data.highScore };
    },

    resetAll() {
      const defaultData = {
        highScore: 0,
        totalGames: 0,
        totalFood: 0,
        maxCombo: 1,
        totalStars: 0,
        totalBerries: 0,
        totalPortals: 0,
        totalCloseCalls: 0,
        achievements: {},
        settings: {
          speed: 'normal',
          wallMode: 'solid',
          gridSize: 20,
          skin: 'obsidian',
          sound: 'on'
        }
      };
      this.saveData(defaultData);
      return defaultData;
    }
  };

  // =========================================================================
  // 3. UI Helpers: Toasts, Modals, Confirm Dialogs
  // =========================================================================
  const Toast = {
    container: document.getElementById('toast-container'),
    achContainer: document.getElementById('achievement-toast-container'),

    show(message, iconClass = 'fa-solid fa-circle-info') {
      const container = this.container || document.getElementById('toast-container');
      if (!container) return;
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = `<i class="${iconClass} toast-icon"></i><span>${message}</span>`;
      container.appendChild(el);

      setTimeout(() => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 3100);
    },

    // Modern & Layered Achievement Unlock Toast (Upper Center)
    showAchievement(title, tierName, iconClass) {
      if (typeof SoundFX !== 'undefined') {
        SoundFX.achievement();
      }
      const container = this.achContainer || document.getElementById('achievement-toast-container') || this.container || document.getElementById('toast-container');
      if (!container) return;
      const el = document.createElement('div');
      const tierLower = tierName.toLowerCase();
      el.className = `achievement-toast tier-${tierLower}`;
      el.innerHTML = `
        <div class="achievement-toast-medal ${tierLower}">
          <i class="${iconClass}"></i>
        </div>
        <div class="achievement-toast-details">
          <div class="achievement-toast-top">
            <span class="achievement-toast-badge"><i class="fa-solid fa-trophy"></i> UNLOCKED</span>
            <span class="achievement-toast-tier">${tierName}</span>
          </div>
          <span class="achievement-toast-name">${title}</span>
        </div>
        <div class="achievement-toast-timer"></div>
      `;
      container.appendChild(el);

      setTimeout(() => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 3700);
    }
  };

  const ModalManager = {
    overlay: document.getElementById('modal-overlay'),
    startModal: document.getElementById('modal-start'),
    gameoverModal: document.getElementById('modal-gameover'),
    settingsModal: document.getElementById('modal-settings'),
    achievementsModal: document.getElementById('modal-achievements'),
    helpModal: document.getElementById('modal-help'),
    confirmOverlay: document.getElementById('confirm-dialog'),
    activeModal: null,
    returnModal: null,

    open(modalElement) {
      if (!modalElement) return;

      // Auto-pause active game session whenever ANY modal opens
      if (window.snakeGame && 
          (window.snakeGame.state === STATES.PLAYING || window.snakeGame.state === STATES.COUNTDOWN) &&
          modalElement !== this.gameoverModal) {
        window.snakeGame.pauseGame('Game paused automatically.');
      }

      // Track return target if navigating away from Start or GameOver to secondary modals
      if (this.activeModal === this.startModal || this.activeModal === this.gameoverModal) {
        if (modalElement === this.settingsModal || modalElement === this.helpModal || modalElement === this.achievementsModal) {
          this.returnModal = this.activeModal;
        }
      }

      // Toggle ambient snake canvas on start screen
      if (window.snakeGame && window.snakeGame.ambientSnake) {
        if (modalElement === this.startModal) {
          window.snakeGame.ambientSnake.start();
        } else {
          window.snakeGame.ambientSnake.stop();
        }
      }

      this.closeAllWindows();

      document.body.classList.add('modal-open');
      this.overlay.classList.add('active');
      modalElement.classList.add('active');
      this.activeModal = modalElement;
      this.overlay.setAttribute('aria-hidden', 'false');
    },

    closeAllWindows() {
      const windows = [
        this.startModal,
        this.gameoverModal,
        this.settingsModal,
        this.achievementsModal,
        this.helpModal
      ];
      windows.forEach(w => {
        if (w) w.classList.remove('active');
      });
      this.activeModal = null;
    },

    closeAll() {
      this.closeAllWindows();
      document.body.classList.remove('modal-open');
      this.overlay.classList.remove('active');
      this.overlay.setAttribute('aria-hidden', 'true');
      this.returnModal = null;
      if (window.snakeGame && window.snakeGame.ambientSnake) {
        window.snakeGame.ambientSnake.stop();
      }
    },

    dismiss() {
      if (!this.activeModal) return;

      const pendingReturn = this.returnModal;
      this.closeAll();

      if (pendingReturn) {
        this.open(pendingReturn);
        return;
      }

      if (window.snakeGame) {
        if (window.snakeGame.state === STATES.MENU) {
          this.open(this.startModal);
        } else if (window.snakeGame.state === STATES.GAMEOVER) {
          this.open(this.gameoverModal);
        } else if (window.snakeGame.state === STATES.PAUSED) {
          if (window.snakeGame.dom.pauseOverlay) {
            window.snakeGame.dom.pauseOverlay.style.display = 'flex';
          }
        }
      }
    },

    closeDismissableModal() {
      if (!this.activeModal) return;
      if (this.activeModal === this.startModal || this.activeModal === this.gameoverModal) {
        return;
      }

      const current = this.activeModal;
      if (current === this.settingsModal && window.snakeGame) {
        window.snakeGame.cancelSettings();
        return;
      }

      this.dismiss();
    },

    confirm(title, message, onConfirm) {
      if (window.snakeGame && 
          (window.snakeGame.state === STATES.PLAYING || window.snakeGame.state === STATES.COUNTDOWN)) {
        window.snakeGame.pauseGame('Game paused automatically.');
      }

      const titleEl = document.getElementById('confirm-title');
      const msgEl = document.getElementById('confirm-message');
      const btnOk = document.getElementById('confirm-btn-ok');
      const btnCancel = document.getElementById('confirm-btn-cancel');

      if (titleEl) titleEl.textContent = title;
      if (msgEl) msgEl.textContent = message;

      this.confirmOverlay.classList.add('active');
      this.confirmOverlay.setAttribute('aria-hidden', 'false');

      const cleanup = () => {
        this.confirmOverlay.classList.remove('active');
        this.confirmOverlay.setAttribute('aria-hidden', 'true');
        btnOk.onclick = null;
        btnCancel.onclick = null;
      };

      btnOk.onclick = () => {
        cleanup();
        if (typeof onConfirm === 'function') onConfirm();
      };

      btnCancel.onclick = () => {
        cleanup();
      };
    }
  };

  // =========================================================================
  // 3.5. Ear-Friendly Web Audio Sound Effects Engine (Smooth & Harmonic)
  // =========================================================================
  const SoundFX = {
    ctx: null,
    masterGain: null,
    filterNode: null,
    enabled: true,

    init() {
      if (this.ctx) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        this.ctx = new AudioCtx();

        // Master lowpass filter strips harsh, piercing frequencies ("kulak acıtmamalı")
        this.filterNode = this.ctx.createBiquadFilter();
        this.filterNode.type = 'lowpass';
        this.filterNode.frequency.setValueAtTime(3200, this.ctx.currentTime);
        this.filterNode.Q.setValueAtTime(0.7, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.enabled ? 0.22 : 0, this.ctx.currentTime);

        this.filterNode.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      } catch (e) {
        console.warn('Web Audio initialization error:', e);
      }
    },

    ensureContext() {
      if (!this.ctx) this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx && this.enabled;
    },

    setEnabled(val) {
      this.enabled = !!val;
      if (this.masterGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(this.enabled ? 0.22 : 0, now + 0.05);
      }
    },

    // 1. Classic Apple Pop (Crisp, gentle, satisfying bubble bite)
    eatApple() {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.07);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.24, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(now);
      osc.stop(now + 0.085);
    },

    // 2. Combo Streak Pitch Ping (Ascending harmonic pentatonic scale)
    combo(streak) {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;

      const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      const freq = scale[Math.min(streak - 1, scale.length - 1)] || 523.25;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(now);
      osc.stop(now + 0.17);
    },

    // 3. Special Foods (Golden Star & Chill Berry)
    eatSpecial(type) {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;

      if (type === 'star') {
        const notes = [1046.5, 1318.5, 1567.98, 2093.0];
        notes.forEach((freq, idx) => {
          const noteStart = now + idx * 0.045;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteStart);

          gain.gain.setValueAtTime(0.0001, noteStart);
          gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.22);

          osc.connect(gain);
          gain.connect(this.filterNode);

          osc.start(noteStart);
          osc.stop(noteStart + 0.23);
        });
      } else if (type === 'berry') {
        const freqs = [659.25, 987.77];
        freqs.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.95, now + 0.35);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

          osc.connect(gain);
          gain.connect(this.filterNode);

          osc.start(now);
          osc.stop(now + 0.42);
        });
      }
    },

    // 4. Countdown Ticks (3, 2, 1, GO!)
    countdown(count) {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;

      if (count > 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.09);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(gain);
        gain.connect(this.filterNode);

        osc.start(now);
        osc.stop(now + 0.13);
      } else {
        const chord = [523.25, 659.25, 783.99];
        chord.forEach((freq) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.16, now + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

          osc.connect(gain);
          gain.connect(this.filterNode);

          osc.start(now);
          osc.stop(now + 0.34);
        });
      }
    },

    // 5. Game Over / Collision (Soft bass thud, zero screeching)
    gameOver() {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(55, now + 0.18);

      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.22, now + 0.01);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc1.connect(gain1);
      gain1.connect(this.filterNode);
      osc1.start(now);
      osc1.stop(now + 0.23);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(261.63, now + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(207.65, now + 0.38);

      gain2.gain.setValueAtTime(0.0001, now + 0.06);
      gain2.gain.linearRampToValueAtTime(0.15, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);

      osc2.connect(gain2);
      gain2.connect(this.filterNode);
      osc2.start(now + 0.06);
      osc2.stop(now + 0.44);
    },

    // 6. Achievement Unlocked (Warm, triumphant royal chime)
    achievement() {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const noteStart = now + idx * 0.065;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.45);

        osc.connect(gain);
        gain.connect(this.filterNode);

        osc.start(noteStart);
        osc.stop(noteStart + 0.48);
      });
    },

    // 7. Pause & Resume Cues
    pause() {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(392, now + 0.05);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);
      osc.stop(now + 0.12);
    },

    resume() {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, now);
      osc.frequency.setValueAtTime(520, now + 0.05);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);
      osc.stop(now + 0.12);
    },

    // 8. Subtle UI Tactile Micro-Click
    click() {
      if (!this.ensureContext()) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.025);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.06, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);
      osc.stop(now + 0.035);
    }
  };

  // Browser Autoplay Unlock on First User Interaction
  const unlockAudio = () => {
    SoundFX.init();
    if (SoundFX.ctx && SoundFX.ctx.state === 'suspended') {
      SoundFX.ctx.resume().catch(() => {});
    }
  };
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });

  // =========================================================================
  // 4. Ambient Wandering Snake Background (Start Screen Only)
  // =========================================================================
  class AmbientSnakeBackground {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.animId = null;
      this.isRunning = false;

      this.numSegments = 28;
      this.segDist = 14;
      this.segments = [];
      this.angle = Math.random() * Math.PI * 2;
      this.targetAngle = this.angle;
      this.speed = 1.6;
      this.turnSpeed = 0.04;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.head = { x: this.width * 0.5, y: this.height * 0.5 };

      for (let i = 0; i < this.numSegments; i++) {
        this.segments.push({
          x: this.head.x - i * this.segDist,
          y: this.head.y
        });
      }

      this.onResize = () => this.resize();
      window.addEventListener('resize', this.onResize);
      this.resize();
    }

    resize() {
      if (!this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      if (this.ctx) {
        this.ctx.resetTransform();
        this.ctx.scale(dpr, dpr);
      }
    }

    start() {
      if (this.isRunning || !this.canvas) return;
      this.isRunning = true;
      this.resize();
      let lastTime = performance.now();

      const loop = (time) => {
        if (!this.isRunning) return;
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;
        this.update(dt);
        this.draw();
        this.animId = requestAnimationFrame(loop);
      };

      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      this.isRunning = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }

    update(dt) {
      if (Math.random() < 0.04) {
        this.targetAngle += (Math.random() - 0.5) * 1.5;
      }

      const margin = 110;
      if (this.head.x < margin) this.targetAngle = 0;
      else if (this.head.x > this.width - margin) this.targetAngle = Math.PI;
      if (this.head.y < margin) this.targetAngle = Math.PI / 2;
      else if (this.head.y > this.height - margin) this.targetAngle = -Math.PI / 2;

      let diff = this.targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.angle += diff * Math.min(1, this.turnSpeed * (dt * 60));

      const step = this.speed * (dt * 60);
      this.head.x += Math.cos(this.angle) * step;
      this.head.y += Math.sin(this.angle) * step;

      if (this.head.x < -60) this.head.x = this.width + 60;
      else if (this.head.x > this.width + 60) this.head.x = -60;
      if (this.head.y < -60) this.head.y = this.height + 60;
      else if (this.head.y > this.height + 60) this.head.y = -60;

      this.segments[0].x = this.head.x;
      this.segments[0].y = this.head.y;

      for (let i = 1; i < this.numSegments; i++) {
        const prev = this.segments[i - 1];
        const cur = this.segments[i];
        const dx = cur.x - prev.x;
        const dy = cur.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        cur.x = prev.x + (dx / dist) * this.segDist;
        cur.y = prev.y + (dy / dist) * this.segDist;
      }
    }

    draw() {
      const ctx = this.ctx;
      if (!ctx) return;
      ctx.clearRect(0, 0, this.width, this.height);
      if (this.segments.length < 2) return;

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = this.numSegments - 1; i > 0; i--) {
        const p1 = this.segments[i];
        const p0 = this.segments[i - 1];
        const t = i / this.numSegments;
        const width = (1 - t * 0.65) * 22;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p0.x, p0.y);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = width;
        ctx.stroke();
      }

      const head = this.segments[0];
      ctx.beginPath();
      ctx.arc(head.x, head.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      const eyeDist = 6;
      const eyeAngle1 = this.angle + Math.PI / 3;
      const eyeAngle2 = this.angle - Math.PI / 3;
      const eyeRadius = 2.5;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(head.x + Math.cos(eyeAngle1) * eyeDist, head.y + Math.sin(eyeAngle1) * eyeDist, eyeRadius, 0, Math.PI * 2);
      ctx.arc(head.x + Math.cos(eyeAngle2) * eyeDist, head.y + Math.sin(eyeAngle2) * eyeDist, eyeRadius, 0, Math.PI * 2);
      ctx.fill();

      const timeNow = performance.now();
      const isFlicking = (timeNow % 2600) < 650;
      if (isFlicking) {
        const tongueLen = 14;
        const tx = head.x + Math.cos(this.angle) * (11 + tongueLen);
        const ty = head.y + Math.sin(this.angle) * (11 + tongueLen);
        ctx.beginPath();
        ctx.moveTo(head.x + Math.cos(this.angle) * 11, head.y + Math.sin(this.angle) * 11);
        ctx.lineTo(tx, ty);
        const forkAngle = 0.4;
        const forkLen = 4;
        ctx.lineTo(tx + Math.cos(this.angle + forkAngle) * forkLen, ty + Math.sin(this.angle + forkAngle) * forkLen);
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + Math.cos(this.angle - forkAngle) * forkLen, ty + Math.sin(this.angle - forkAngle) * forkLen);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  // =========================================================================
  // 5. Main Game Engine
  // =========================================================================
  class SnakeGame {
    constructor() {
      window.snakeGame = this;
      const saved = Storage.getData();
      this.settings = saved.settings;
      this.highScore = saved.highScore || 0;
      SoundFX.setEnabled(this.settings.sound !== 'off');

      // Board & Mechanics
      this.gridSize = parseInt(this.settings.gridSize, 10) || 20;
      this.state = STATES.MENU;
      this.snake = [];
      this.direction = DIRECTIONS.RIGHT;
      this.inputQueue = [];
      this.currentFood = null;
      this.bonusFood = null;

      // Timers & Loops
      this.countdownTimerId = null;
      this.bonusTimerId = null;
      this.comboTimerId = null;
      this.gameTimerId = null;
      this.animationFrameId = null;

      // Powerups & Combos
      this.activeBuff = null;
      this.combo = 1;
      this.comboExpiresAt = 0;
      this.rapidStreakCount = 0;

      // Scoring & Stats in Current Run
      this.score = 0;
      this.applesEaten = 0;
      this.highestComboInRun = 1;
      this.elapsedSeconds = 0;
      this.portalsUsedInRun = 0;
      this.closeCallsInRun = 0;
      this.dynamicTick = SPEED_CONFIG[this.settings.speed].baseMs;
      this.lastTickTime = 0;

      // Session reset detection
      this.hasActiveSessionProgress = false;
      this.initialSettingsSnapshot = null;

      // Achievements Filter State
      this.currentAchievementsFilter = 'all';

      // Persistent DOM Entity Pool
      this.domEntities = {
        head: null,
        tail: null,
        bodySegments: [],
        foodApple: null,
        foodBonus: null
      };

      // Ambient Background Canvas Animation (Start Screen)
      this.ambientSnake = new AmbientSnakeBackground('start-ambient-canvas');

      // DOM Elements Cache
      this.dom = {
        board: document.getElementById('game-board'),
        countdownOverlay: document.getElementById('countdown-overlay'),
        countdownNum: document.getElementById('countdown-number'),
        buffBanner: document.getElementById('active-buff-banner'),
        buffText: document.getElementById('buff-banner-text'),
        sidebarScore: document.getElementById('sidebar-score'),
        sidebarBest: document.getElementById('sidebar-best'),
        mobileScore: document.getElementById('mobile-score-val'),
        mobileBest: document.getElementById('mobile-best-val'),
        mobileSpeed: document.getElementById('mobile-speed-val'),
        currentSpeedTag: document.getElementById('current-speed-tag'),
        statLength: document.getElementById('stat-length'),
        statApples: document.getElementById('stat-apples'),
        statTime: document.getElementById('stat-time'),
        statSpeedMs: document.getElementById('stat-speed-ms'),
        comboContainer: document.getElementById('combo-container'),
        comboMultiplier: document.getElementById('combo-multiplier'),
        comboProgress: document.getElementById('combo-progress'),
        mobileComboStat: document.getElementById('mobile-combo-stat'),
        mobileComboVal: document.getElementById('mobile-combo-val'),
        btnHeaderPause: document.getElementById('btn-header-pause'),
        btnHeaderRestart: document.getElementById('btn-header-restart'),
        btnHeaderSettings: document.getElementById('btn-header-settings'),
        btnHeaderAchievements: document.getElementById('btn-header-achievements'),
        btnHeaderHelp: document.getElementById('btn-header-help'),
        badgeAchievementsCount: document.getElementById('badge-achievements-count'),
        sidebarAchievementsVal: document.getElementById('sidebar-achievements-val'),
        rowSidebarAchievements: document.getElementById('row-sidebar-achievements'),
        rowSidebarHelp: document.getElementById('row-sidebar-help'),
        startStatBest: document.getElementById('start-stat-best'),
        startStatApples: document.getElementById('start-stat-apples'),
        startStatBadges: document.getElementById('start-stat-badges'),
        btnStartOpenHelp: document.getElementById('btn-start-open-help'),
        previewSkinTitle: document.getElementById('preview-skin-title'),
        previewHead: document.getElementById('preview-snake-head'),
        previewBody1: document.getElementById('preview-snake-body-1'),
        previewBody2: document.getElementById('preview-snake-body-2'),
        previewTail: document.getElementById('preview-snake-tail'),
        pauseOverlay: document.getElementById('pause-overlay'),
        touchCenterIcon: document.getElementById('touch-center-icon'),
        newRecordBanner: document.getElementById('new-record-banner'),
        gameoverScore: document.getElementById('gameover-score'),
        gameoverBest: document.getElementById('gameover-best'),
        gameoverApples: document.getElementById('gameover-apples'),
        gameoverCombo: document.getElementById('gameover-combo'),
        gameoverCause: document.getElementById('gameover-cause'),
        settingsResetWarning: document.getElementById('settings-reset-warning'),
        modalAchievements: document.getElementById('modal-achievements'),
        achievementsList: document.getElementById('achievements-list'),
        modalAchievementsProgressPill: document.getElementById('modal-achievements-progress-pill')
      };

      this.init();
    }

    init() {
      this.applySkinTheme();
      this.applyGridSizeCSS();
      this.initPersistentDOM();
      this.updateScoreDisplays();
      this.bindEvents();
      this.setupSettingsUI();
      this.updateAchievementsCountDisplay();

      // Show Start Game modal immediately
      this.showStartModal();
    }

    applySkinTheme() {
      const skin = this.settings.skin || 'obsidian';
      document.documentElement.setAttribute('data-snake-skin', skin);
    }

    applyGridSizeCSS() {
      document.documentElement.style.setProperty('--grid-size', this.gridSize);
    }

    // -----------------------------------------------------------------------
    // Persistent DOM Entity Architecture
    // -----------------------------------------------------------------------
    initPersistentDOM() {
      const board = this.dom.board;
      if (!board) return;
      board.innerHTML = '';

      // 1. Food: Apple
      const appleEl = document.createElement('div');
      appleEl.className = 'food-item food-apple';
      appleEl.style.display = 'none';
      board.appendChild(appleEl);
      this.domEntities.foodApple = appleEl;

      // 2. Food: Bonus Fruit
      const bonusEl = document.createElement('div');
      bonusEl.className = 'food-item food-star';
      bonusEl.style.display = 'none';
      board.appendChild(bonusEl);
      this.domEntities.foodBonus = bonusEl;

      // 3. Tail Segment
      const tailEl = document.createElement('div');
      tailEl.className = 'snake-segment snake-tail';
      board.appendChild(tailEl);
      this.domEntities.tail = tailEl;

      // 4. Head Segment with persistent Eyes and Animated Tongue
      const headEl = document.createElement('div');
      headEl.id = 'snake-head-node';
      headEl.className = 'snake-segment snake-head dir-right';

      const eyesWrap = document.createElement('div');
      eyesWrap.className = 'snake-eyes';
      eyesWrap.innerHTML = `
        <div class="snake-eye snake-eye-1"></div>
        <div class="snake-eye snake-eye-2"></div>
      `;
      headEl.appendChild(eyesWrap);

      const tongueEl = document.createElement('div');
      tongueEl.className = 'snake-tongue';
      headEl.appendChild(tongueEl);

      board.appendChild(headEl);
      this.domEntities.head = headEl;
    }

    // -----------------------------------------------------------------------
    // Game Lifecycle Management
    // -----------------------------------------------------------------------
    resetGameData() {
      const mid = Math.floor(this.gridSize / 2);
      this.snake = [
        { x: mid, y: mid },
        { x: mid - 1, y: mid },
        { x: mid - 2, y: mid }
      ];
      this.direction = DIRECTIONS.RIGHT;
      this.inputQueue = [];
      this.score = 0;
      this.applesEaten = 0;
      this.combo = 1;
      this.highestComboInRun = 1;
      this.activeBuff = null;
      this.elapsedSeconds = 0;
      this.rapidStreakCount = 0;
      this.portalsUsedInRun = 0;
      this.closeCallsInRun = 0;
      this.hasActiveSessionProgress = false;
      this.clearAllTimers();
      this.updateDynamicTick();
      this.spawnInitialFood();
      this.updateScoreDisplays();
      this.updateSessionStats();
      this.updateTimeDisplay();
      this.hideBuffBanner();
      this.render();
    }

    clearAllTimers() {
      if (this.gameTimerId) {
        clearInterval(this.gameTimerId);
        this.gameTimerId = null;
      }
      if (this.countdownTimerId) {
        clearInterval(this.countdownTimerId);
        this.countdownTimerId = null;
      }
      if (this.bonusTimerId) {
        clearTimeout(this.bonusTimerId);
        this.bonusTimerId = null;
      }
      if (this.comboTimerId) {
        clearInterval(this.comboTimerId);
        this.comboTimerId = null;
      }
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.wasInCountdown = false;
      this.remainingComboTime = 0;
      this.remainingBonusTime = 0;
      this.remainingBuffTime = 0;
    }

    isMobileLandscape() {
      return window.matchMedia('(max-width: 900px) and (max-height: 520px) and (orientation: landscape), (max-width: 767px) and (orientation: landscape)').matches;
    }

    isWebVersion() {
      return window.innerWidth >= 1025;
    }

    showStartModal() {
      this.state = STATES.MENU;
      this.resetGameData();
      this.syncStartModalSpeed();
      this.updateStartScreenStats();
      if (this.ambientSnake) {
        this.ambientSnake.start();
      }
      ModalManager.open(ModalManager.startModal);
    }

    updateStartScreenStats() {
      const data = Storage.getData();
      if (this.dom.startStatBest) this.dom.startStatBest.textContent = data.highScore || 0;
      if (this.dom.startStatApples) this.dom.startStatApples.textContent = data.totalFood || 0;

      const achMap = data.achievements || {};
      let unlockedCount = 0;
      ACHIEVEMENTS_DEF.forEach(def => {
        if (achMap[def.id] && achMap[def.id].tier) unlockedCount++;
      });
      if (this.dom.startStatBadges) this.dom.startStatBadges.textContent = `${unlockedCount}/15`;
    }

    syncStartModalSpeed() {
      const startSpeedButtons = document.querySelectorAll('.start-speed-card[data-speed]');
      startSpeedButtons.forEach(btn => {
        const isSelected = btn.getAttribute('data-speed') === this.settings.speed;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      });
    }

    openHelpModal(initialTab = null) {
      if (this.state === STATES.PLAYING || this.state === STATES.COUNTDOWN) {
        this.pauseGame('Game paused to view guide.');
      }
      if (initialTab) {
        const tabs = document.querySelectorAll('.help-tab[data-help-tab]');
        const panes = document.querySelectorAll('.help-pane');
        tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-help-tab') === initialTab));
        panes.forEach(p => p.classList.toggle('active', p.id === `help-pane-${initialTab}`));
      }
      ModalManager.open(ModalManager.helpModal);
    }

    startCountdownAndPlay() {
      if (this.isMobileLandscape()) {
        Toast.show('Please rotate your device to portrait mode to play.', 'fa-solid fa-mobile-screen-button');
        return;
      }

      if (this.ambientSnake) {
        this.ambientSnake.stop();
      }

      this.clearAllTimers();
      ModalManager.closeAll();
      if (this.dom.pauseOverlay) {
        this.dom.pauseOverlay.style.display = 'none';
      }
      this.state = STATES.COUNTDOWN;
      this.resetGameData();

      const overlay = this.dom.countdownOverlay;
      const numEl = this.dom.countdownNum;
      overlay.style.display = 'flex';

      let count = 3;
      const triggerPop = (txt) => {
        numEl.textContent = txt;
        numEl.classList.remove('anim-pop');
        void numEl.offsetWidth;
        numEl.classList.add('anim-pop');
      };

      triggerPop(count);
      SoundFX.countdown(count);

      this.countdownTimerId = setInterval(() => {
        count--;
        if (count > 0) {
          triggerPop(count);
          SoundFX.countdown(count);
        } else if (count === 0) {
          triggerPop('GO!');
          SoundFX.countdown(0);
        } else {
          clearInterval(this.countdownTimerId);
          this.countdownTimerId = null;
          overlay.style.display = 'none';
          this.beginPlaying();
        }
      }, 750);
    }

    beginPlaying() {
      if (this.isMobileLandscape()) {
        this.pauseGame('Rotate phone to portrait mode.');
        return;
      }

      this.state = STATES.PLAYING;
      this.lastTickTime = performance.now();
      this.hasActiveSessionProgress = true;

      if (!this.gameTimerId) {
        this.gameTimerId = setInterval(() => {
          if (this.state === STATES.PLAYING) {
            this.elapsedSeconds++;
            this.updateTimeDisplay();
            this.checkActiveBuffExpiry();
            this.evaluateAchievements('tick');
          }
        }, 1000);
      }

      this.updatePauseButtonIcons(false);
      this.gameLoop(performance.now());
    }

    pauseGame(reason = 'Your progress is safely held.') {
      if (this.state !== STATES.PLAYING && this.state !== STATES.COUNTDOWN) return;

      // 1. If paused during countdown, safely freeze and cancel countdown interval
      if (this.state === STATES.COUNTDOWN || this.countdownTimerId) {
        if (this.countdownTimerId) {
          clearInterval(this.countdownTimerId);
          this.countdownTimerId = null;
        }
        if (this.dom.countdownOverlay) {
          this.dom.countdownOverlay.style.display = 'none';
        }
        this.wasInCountdown = true;
      } else {
        this.wasInCountdown = false;
      }

      this.state = STATES.PAUSED;

      // 2. Cancel active animation frame loop
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }

      // 3. Freeze combo countdown and save exact remaining milliseconds
      if (this.comboTimerId) {
        clearInterval(this.comboTimerId);
        this.comboTimerId = null;
      }
      this.remainingComboTime = this.comboExpiresAt ? Math.max(0, this.comboExpiresAt - Date.now()) : 0;

      // 4. Freeze bonus fruit timer and save exact remaining milliseconds
      if (this.bonusTimerId) {
        clearTimeout(this.bonusTimerId);
        this.bonusTimerId = null;
      }
      this.remainingBonusTime = (this.bonusFood && this.bonusFood.expiresAt)
        ? Math.max(0, this.bonusFood.expiresAt - Date.now())
        : 0;

      // 5. Freeze active buff duration
      this.remainingBuffTime = (this.activeBuff && this.activeBuff.expiresAt)
        ? Math.max(0, this.activeBuff.expiresAt - Date.now())
        : 0;

      this.updatePauseButtonIcons(true);

      if (this.dom.pauseOverlay) {
        this.dom.pauseOverlay.style.display = 'flex';
      }

      SoundFX.pause();
    }

    resumeGame() {
      if (this.state !== STATES.PAUSED) return;

      // STRICT LOCK: Never unpause if ANY modal or confirmation dialog is active
      if (ModalManager.activeModal || (ModalManager.confirmOverlay && ModalManager.confirmOverlay.classList.contains('active'))) {
        return;
      }

      if (this.isMobileLandscape()) {
        Toast.show('Please rotate phone to portrait mode first.', 'fa-solid fa-mobile-screen-button');
        return;
      }

      if (this.dom.pauseOverlay) {
        this.dom.pauseOverlay.style.display = 'none';
      }

      // If paused during countdown, safely re-initiate countdown
      if (this.wasInCountdown) {
        this.wasInCountdown = false;
        this.startCountdownAndPlay();
        return;
      }

      this.state = STATES.PLAYING;
      this.lastTickTime = performance.now();

      // Restore combo timer accurately
      if (this.remainingComboTime > 0 && this.combo > 1) {
        this.comboExpiresAt = Date.now() + this.remainingComboTime;
        const totalDuration = SPEED_CONFIG[this.settings.speed].comboWindow;
        this.startComboCountdown(totalDuration);
      }

      // Restore bonus fruit timer accurately
      if (this.remainingBonusTime > 0 && this.bonusFood) {
        this.bonusFood.expiresAt = Date.now() + this.remainingBonusTime;
        this.bonusTimerId = setTimeout(() => {
          this.bonusFood = null;
          this.render();
        }, this.remainingBonusTime);
      }

      // Restore active buff expiration timestamp
      if (this.remainingBuffTime > 0 && this.activeBuff) {
        this.activeBuff.expiresAt = Date.now() + this.remainingBuffTime;
      }

      this.updatePauseButtonIcons(false);
      SoundFX.resume();

      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.gameLoop(performance.now());
    }

    togglePause() {
      // STRICT LOCK: Do not toggle pause if ANY modal or dialog is open
      if (ModalManager.activeModal || (ModalManager.confirmOverlay && ModalManager.confirmOverlay.classList.contains('active'))) {
        return;
      }
      if (this.state === STATES.PLAYING) {
        this.pauseGame();
      } else if (this.state === STATES.PAUSED) {
        this.resumeGame();
      }
    }

    gameOver(causeMessage = 'You collided!') {
      this.state = STATES.GAMEOVER;
      this.clearAllTimers();
      this.hasActiveSessionProgress = false;
      SoundFX.gameOver();

      if (this.dom.pauseOverlay) {
        this.dom.pauseOverlay.style.display = 'none';
      }

      const result = Storage.saveScore(this.score, this.applesEaten, this.highestComboInRun);
      this.highScore = result.highScore;

      this.evaluateAchievements('gameover');

      if (this.dom.gameoverScore) this.dom.gameoverScore.textContent = this.score;
      if (this.dom.gameoverBest) this.dom.gameoverBest.textContent = this.highScore;
      if (this.dom.gameoverApples) this.dom.gameoverApples.textContent = this.applesEaten;
      if (this.dom.gameoverCombo) this.dom.gameoverCombo.textContent = `x${this.highestComboInRun}`;
      if (this.dom.gameoverCause) this.dom.gameoverCause.textContent = causeMessage;

      if (this.dom.newRecordBanner) {
        this.dom.newRecordBanner.style.display = result.isNewHigh ? 'flex' : 'none';
      }

      this.updateScoreDisplays();
      ModalManager.open(ModalManager.gameoverModal);
    }

    // -----------------------------------------------------------------------
    // Game Loop & Tick Mechanics
    // -----------------------------------------------------------------------
    getCurrentInterval() {
      let interval = this.dynamicTick;
      if (this.activeBuff && this.activeBuff.type === 'chill') {
        interval = Math.round(interval * 1.25);
      }
      return interval;
    }

    updateDynamicTick() {
      const mode = this.settings.speed;
      const base = SPEED_CONFIG[mode].baseMs;

      if (mode === 'dynamic') {
        this.dynamicTick = Math.max(60, Math.round(base - (this.applesEaten * 2.0)));
      } else {
        this.dynamicTick = base;
      }

      if (this.dom.statSpeedMs) {
        this.dom.statSpeedMs.textContent = `${this.getCurrentInterval()}ms`;
      }
    }

    gameLoop(timestamp) {
      if (this.state !== STATES.PLAYING) return;

      const elapsed = timestamp - this.lastTickTime;
      const tickRate = this.getCurrentInterval();

      if (elapsed >= tickRate) {
        this.lastTickTime = timestamp;
        this.step();
      }

      this.animationFrameId = requestAnimationFrame(ts => this.gameLoop(ts));
    }

    step() {
      if (this.inputQueue.length > 0) {
        const nextDir = this.inputQueue.shift();
        this.direction = nextDir;
      }

      const head = this.snake[0];
      let newX = head.x + this.direction.x;
      let newY = head.y + this.direction.y;

      // Handle Wall Boundaries
      if (this.settings.wallMode === 'wrap') {
        let wrapped = false;
        if (newX < 0) { newX = this.gridSize - 1; wrapped = true; }
        else if (newX >= this.gridSize) { newX = 0; wrapped = true; }
        if (newY < 0) { newY = this.gridSize - 1; wrapped = true; }
        else if (newY >= this.gridSize) { newY = 0; wrapped = true; }

        if (wrapped) {
          this.portalsUsedInRun++;
          const data = Storage.getData();
          data.totalPortals = (data.totalPortals || 0) + 1;
          Storage.saveData(data);
          this.evaluateAchievements('portal');
        }
      } else {
        if (newX < 0 || newX >= this.gridSize || newY < 0 || newY >= this.gridSize) {
          this.gameOver('You crashed into the boundary wall!');
          return;
        }
      }

      // Check Self Collision
      const isSelfCollision = this.snake.some((segment, index) => {
        if (index === this.snake.length - 1) return false;
        return segment.x === newX && segment.y === newY;
      });

      if (isSelfCollision) {
        this.gameOver('You bit your own tail!');
        return;
      }

      // Check Close Call detection (turning 1 tile away from danger)
      if (this.isCloseCall(newX, newY)) {
        this.closeCallsInRun++;
        const data = Storage.getData();
        data.totalCloseCalls = (data.totalCloseCalls || 0) + 1;
        Storage.saveData(data);
        this.evaluateAchievements('close_call');
      }

      const newHead = { x: newX, y: newY };
      this.snake.unshift(newHead);

      let ateFood = false;

      // 1. Classic Apple Collision
      if (this.currentFood && newX === this.currentFood.x && newY === this.currentFood.y) {
        this.eatClassicFood();
        ateFood = true;
      }
      // 2. Bonus Fruit Collision
      else if (this.bonusFood && newX === this.bonusFood.x && newY === this.bonusFood.y) {
        this.eatBonusFood();
        ateFood = true;
      }

      if (!ateFood) {
        this.snake.pop();
      }

      this.updateDynamicTick();
      this.updateSessionStats();
      this.render();
      this.evaluateAchievements('step');
    }

    isCloseCall(x, y) {
      if (this.settings.wallMode === 'solid') {
        if (x === 0 || x === this.gridSize - 1 || y === 0 || y === this.gridSize - 1) {
          return true;
        }
      }
      return this.snake.some((seg, idx) => {
        if (idx < 2) return false;
        const dist = Math.abs(seg.x - x) + Math.abs(seg.y - y);
        return dist === 1;
      });
    }

    // -----------------------------------------------------------------------
    // Food Spawning Safeguards (Guaranteed Zero Snake Overlap)
    // -----------------------------------------------------------------------
    getVacantCoordinates() {
      const occupied = new Set();
      for (const seg of this.snake) {
        occupied.add(`${seg.x},${seg.y}`);
      }
      if (this.currentFood) {
        occupied.add(`${this.currentFood.x},${this.currentFood.y}`);
      }
      if (this.bonusFood) {
        occupied.add(`${this.bonusFood.x},${this.bonusFood.y}`);
      }

      const vacant = [];
      for (let x = 0; x < this.gridSize; x++) {
        for (let y = 0; y < this.gridSize; y++) {
          if (!occupied.has(`${x},${y}`)) {
            vacant.push({ x, y });
          }
        }
      }
      return vacant;
    }

    spawnInitialFood() {
      this.currentFood = null;
      this.bonusFood = null;
      this.spawnClassicFood();
    }

    spawnClassicFood() {
      const vacant = this.getVacantCoordinates();
      if (vacant.length === 0) {
        this.gameOver('Congratulations! You completed the entire board!');
        return;
      }
      const randomIdx = Math.floor(Math.random() * vacant.length);
      this.currentFood = {
        x: vacant[randomIdx].x,
        y: vacant[randomIdx].y,
        type: 'apple'
      };
    }

    maybeSpawnBonusFruit() {
      if (this.bonusFood) return;

      const shouldSpawn = (this.applesEaten % 5 === 0) || Math.random() < 0.18;
      if (!shouldSpawn) return;

      const vacant = this.getVacantCoordinates();
      if (vacant.length < 2) return;

      const randomIdx = Math.floor(Math.random() * vacant.length);
      const isChillBerry = Math.random() < 0.35;

      this.bonusFood = {
        x: vacant[randomIdx].x,
        y: vacant[randomIdx].y,
        type: isChillBerry ? 'berry' : 'star',
        expiresAt: Date.now() + 8000
      };

      if (this.bonusTimerId) clearTimeout(this.bonusTimerId);
      this.bonusTimerId = setTimeout(() => {
        this.bonusFood = null;
        this.render();
      }, 8000);
    }

    // -----------------------------------------------------------------------
    // Balanced Scoring, Combos & Clamped Score Badges
    // -----------------------------------------------------------------------
    eatClassicFood() {
      this.applesEaten++;
      this.rapidStreakCount++;
      this.bumpCombo();

      if (this.combo > 1) {
        SoundFX.combo(this.combo);
      } else {
        SoundFX.eatApple();
      }

      const basePts = SPEED_CONFIG[this.settings.speed].basePoints;
      const earnedPoints = basePts * this.combo;
      this.score += earnedPoints;

      const isComboHigh = this.combo >= 3;
      this.showFloatingScore(
        this.currentFood.x,
        this.currentFood.y,
        `+${earnedPoints}${isComboHigh ? ' Combo!' : ''}`,
        isComboHigh ? 'bonus' : 'normal'
      );

      this.spawnClassicFood();
      this.maybeSpawnBonusFruit();
      this.updateScoreDisplays();
      this.evaluateAchievements('eat_apple');
    }

    eatBonusFood() {
      const type = this.bonusFood.type;
      this.rapidStreakCount++;
      this.bumpCombo();
      SoundFX.eatSpecial(type);

      if (type === 'star') {
        const earnedPoints = 35 * this.combo;
        this.score += earnedPoints;
        this.extendComboWindow(2000); // Bonus fruit adds +2.0s to combo streak
        this.showFloatingScore(this.bonusFood.x, this.bonusFood.y, `+${earnedPoints} STAR!`, 'bonus');
        Toast.show(`Golden Star Eaten! +${earnedPoints} pts`, 'fa-solid fa-star text-amber');

        const data = Storage.getData();
        data.totalStars = (data.totalStars || 0) + 1;
        Storage.saveData(data);
        this.evaluateAchievements('eat_star');
      } else if (type === 'berry') {
        const earnedPoints = 20 * this.combo;
        this.score += earnedPoints;
        this.activeBuff = { type: 'chill', expiresAt: Date.now() + 6000 };
        this.showFloatingScore(this.bonusFood.x, this.bonusFood.y, 'CHILL PACE!', 'chill');
        this.showBuffBanner('Chill Berry: Pace Slowed 6s');
        Toast.show('Chill Berry: Game pace slowed for 6s', 'fa-solid fa-snowflake');

        const data = Storage.getData();
        data.totalBerries = (data.totalBerries || 0) + 1;
        Storage.saveData(data);
        this.evaluateAchievements('eat_berry');
      }

      this.bonusFood = null;
      if (this.bonusTimerId) clearTimeout(this.bonusTimerId);
      this.updateScoreDisplays();
    }

    bumpCombo() {
      this.combo = Math.min(5, this.combo + 1);
      if (this.combo > this.highestComboInRun) {
        this.highestComboInRun = this.combo;
      }
      const duration = SPEED_CONFIG[this.settings.speed].comboWindow;
      this.comboExpiresAt = Date.now() + duration;
      this.startComboCountdown(duration);
      this.updateComboUI();
      this.evaluateAchievements('combo');
    }

    extendComboWindow(ms) {
      this.comboExpiresAt = Math.min(
        Date.now() + SPEED_CONFIG[this.settings.speed].comboWindow,
        this.comboExpiresAt + ms
      );
    }

    startComboCountdown(totalDuration) {
      if (this.comboTimerId) clearInterval(this.comboTimerId);

      this.comboTimerId = setInterval(() => {
        const remaining = this.comboExpiresAt - Date.now();
        if (remaining <= 0) {
          clearInterval(this.comboTimerId);
          this.combo = 1;
          this.rapidStreakCount = 0;
          this.updateComboUI();
        } else {
          const pct = Math.max(0, (remaining / totalDuration) * 100);
          if (this.dom.comboProgress) {
            this.dom.comboProgress.style.width = `${pct}%`;
          }
        }
      }, 50);
    }

    updateComboUI() {
      const isActive = this.combo > 1;
      if (this.dom.comboContainer) {
        this.dom.comboContainer.style.opacity = isActive ? '1' : '0.4';
      }
      if (this.dom.comboMultiplier) {
        this.dom.comboMultiplier.textContent = `x${this.combo}`;
      }
      if (this.dom.comboProgress) {
        this.dom.comboProgress.className = `combo-fill combo-x${this.combo}`;
        if (!isActive) {
          this.dom.comboProgress.style.width = '0%';
        }
      }

      if (this.dom.mobileComboStat && this.dom.mobileComboVal) {
        this.dom.mobileComboStat.style.display = isActive ? 'flex' : 'none';
        this.dom.mobileComboVal.textContent = `x${this.combo}`;
      }
    }

    // High contrast, highly legible badge clamped to prevent edge cutoffs
    showFloatingScore(cellX, cellY, text, pillType = 'normal') {
      const el = document.createElement('div');
      el.className = `floating-score ${pillType === 'bonus' ? 'bonus-pill' : pillType === 'chill' ? 'chill-pill' : ''}`;
      el.textContent = text;

      // Mathematical clamping to ensure 100% visibility within borders
      const rawPctX = (cellX / this.gridSize) * 100;
      const rawPctY = (cellY / this.gridSize) * 100;
      const clampedX = Math.max(14, Math.min(86, rawPctX + (100 / this.gridSize) * 0.5));
      const clampedY = Math.max(10, Math.min(88, rawPctY + (100 / this.gridSize) * 0.5));

      el.style.left = `${clampedX}%`;
      el.style.top = `${clampedY}%`;
      this.dom.board.appendChild(el);

      setTimeout(() => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 850);
    }

    showBuffBanner(text) {
      if (this.dom.buffBanner && this.dom.buffText) {
        this.dom.buffText.textContent = text;
        this.dom.buffBanner.style.display = 'flex';
      }
    }

    hideBuffBanner() {
      if (this.dom.buffBanner) {
        this.dom.buffBanner.style.display = 'none';
      }
    }

    checkActiveBuffExpiry() {
      if (this.activeBuff && Date.now() >= this.activeBuff.expiresAt) {
        this.activeBuff = null;
        this.hideBuffBanner();
        this.updateDynamicTick();
      }
    }

    // -----------------------------------------------------------------------
    // Rendering Engine (Updates Persistent Elements Without Tearing Down DOM)
    // -----------------------------------------------------------------------
    render() {
      const board = this.dom.board;
      if (!board) return;

      const cellSizePct = 100 / this.gridSize;
      const snakeLen = this.snake.length;

      // 1. Update Head (Direction & Position)
      const headPos = this.snake[0];
      const headEl = this.domEntities.head;
      if (headEl && headPos) {
        headEl.style.left = `${headPos.x * cellSizePct}%`;
        headEl.style.top = `${headPos.y * cellSizePct}%`;
        headEl.style.width = `${cellSizePct}%`;
        headEl.style.height = `${cellSizePct}%`;
        headEl.className = `snake-segment snake-head dir-${this.direction.name}`;
      }

      // 2. Update Tail (Position)
      const tailPos = this.snake[snakeLen - 1];
      const tailEl = this.domEntities.tail;
      if (tailEl && tailPos) {
        tailEl.style.left = `${tailPos.x * cellSizePct}%`;
        tailEl.style.top = `${tailPos.y * cellSizePct}%`;
        tailEl.style.width = `${cellSizePct}%`;
        tailEl.style.height = `${cellSizePct}%`;
      }

      // 3. Update Body Segments Pool
      const bodySegmentsNeeded = snakeLen - 2;
      const currentBodySegments = this.domEntities.bodySegments;

      while (currentBodySegments.length < bodySegmentsNeeded) {
        const seg = document.createElement('div');
        seg.className = 'snake-segment snake-body';
        board.insertBefore(seg, tailEl);
        currentBodySegments.push(seg);
      }
      while (currentBodySegments.length > bodySegmentsNeeded) {
        const seg = currentBodySegments.pop();
        if (seg && seg.parentNode) seg.parentNode.removeChild(seg);
      }

      for (let i = 1; i < snakeLen - 1; i++) {
        const segPos = this.snake[i];
        const segEl = currentBodySegments[i - 1];
        if (segEl) {
          segEl.style.left = `${segPos.x * cellSizePct}%`;
          segEl.style.top = `${segPos.y * cellSizePct}%`;
          segEl.style.width = `${cellSizePct}%`;
          segEl.style.height = `${cellSizePct}%`;
        }
      }

      // 4. Update Classic Apple Food
      const appleEl = this.domEntities.foodApple;
      if (appleEl) {
        if (this.currentFood) {
          appleEl.style.display = 'flex';
          appleEl.style.left = `${this.currentFood.x * cellSizePct}%`;
          appleEl.style.top = `${this.currentFood.y * cellSizePct}%`;
          appleEl.style.width = `${cellSizePct}%`;
          appleEl.style.height = `${cellSizePct}%`;
        } else {
          appleEl.style.display = 'none';
        }
      }

      // 5. Update Bonus Food
      const bonusEl = this.domEntities.foodBonus;
      if (bonusEl) {
        if (this.bonusFood) {
          bonusEl.style.display = 'flex';
          bonusEl.className = `food-item ${this.bonusFood.type === 'star' ? 'food-star' : 'food-berry'}`;
          bonusEl.style.left = `${this.bonusFood.x * cellSizePct}%`;
          bonusEl.style.top = `${this.bonusFood.y * cellSizePct}%`;
          bonusEl.style.width = `${cellSizePct}%`;
          bonusEl.style.height = `${cellSizePct}%`;
        } else {
          bonusEl.style.display = 'none';
        }
      }
    }

    // -----------------------------------------------------------------------
    // Achievements Engine (15 Achievements with Tier Progression)
    // -----------------------------------------------------------------------
    evaluateAchievements(triggerEvent) {
      const data = Storage.getData();
      data.achievements = data.achievements || {};
      let updated = false;

      const checkUnlock = (id, targetTier, targetName, currentVal, targetVal) => {
        const userAch = data.achievements[id] || { tier: null, progress: 0 };
        const tierWeights = { null: 0, bronze: 1, silver: 2, gold: 3 };
        const currentTierWeight = tierWeights[userAch.tier] || 0;
        const newTierWeight = tierWeights[targetTier] || 0;

        // If target reached and tier is higher than current tier
        if (currentVal >= targetVal && newTierWeight > currentTierWeight) {
          userAch.tier = targetTier;
          userAch.unlockedAt = Date.now();
          data.achievements[id] = userAch;
          updated = true;

          const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
          Toast.showAchievement(def.title, targetName, def.icon);
        }
      };

      // 1. First Bite
      checkUnlock('first_bite', 'bronze', 'Bronze', data.totalFood + this.applesEaten, 1);

      // 2. Apple Enthusiast (Tiered: 25, 75, 150)
      const totalApples = (data.totalFood || 0) + this.applesEaten;
      checkUnlock('apple_lover', 'gold', 'Gold', totalApples, 150);
      checkUnlock('apple_lover', 'silver', 'Silver', totalApples, 75);
      checkUnlock('apple_lover', 'bronze', 'Bronze', totalApples, 25);

      // 3. High Scorer (Tiered: 100, 300, 600)
      checkUnlock('score_hunter', 'gold', 'Gold', this.score, 600);
      checkUnlock('score_hunter', 'silver', 'Silver', this.score, 300);
      checkUnlock('score_hunter', 'bronze', 'Bronze', this.score, 100);

      // 4. Anaconda (Tiered: 12, 25, 45)
      checkUnlock('length_master', 'gold', 'Gold', this.snake.length, 45);
      checkUnlock('length_master', 'silver', 'Silver', this.snake.length, 25);
      checkUnlock('length_master', 'bronze', 'Bronze', this.snake.length, 12);

      // 5. Combo Master (Tiered: x3, x4, x5)
      checkUnlock('combo_king', 'gold', 'Gold', this.highestComboInRun, 5);
      checkUnlock('combo_king', 'silver', 'Silver', this.highestComboInRun, 4);
      checkUnlock('combo_king', 'bronze', 'Bronze', this.highestComboInRun, 3);

      // 6. Star Collector (Tiered: 1, 5, 12)
      const totalStars = data.totalStars || 0;
      checkUnlock('star_eater', 'gold', 'Gold', totalStars, 12);
      checkUnlock('star_eater', 'silver', 'Silver', totalStars, 5);
      checkUnlock('star_eater', 'bronze', 'Bronze', totalStars, 1);

      // 7. Ice Cold (Tiered: 1, 5, 10)
      const totalBerries = data.totalBerries || 0;
      checkUnlock('chill_seeker', 'gold', 'Gold', totalBerries, 10);
      checkUnlock('chill_seeker', 'silver', 'Silver', totalBerries, 5);
      checkUnlock('chill_seeker', 'bronze', 'Bronze', totalBerries, 1);

      // 8. Speed Demon (Gold: 150+ in Fast mode)
      if (this.settings.speed === 'fast') {
        checkUnlock('speed_demon', 'gold', 'Gold', this.score, 150);
      }

      // 9. Zen Master (Silver: 90s survival in Relax mode)
      if (this.settings.speed === 'relax') {
        checkUnlock('zen_runner', 'silver', 'Silver', this.elapsedSeconds, 90);
      }

      // 10. Dynamic Ace (Gold: 200+ in Dynamic mode)
      if (this.settings.speed === 'dynamic') {
        checkUnlock('dynamic_ace', 'gold', 'Gold', this.score, 200);
      }

      // 11. Dedicated Player (Tiered: 5, 15, 35)
      const totalGames = data.totalGames || 0;
      checkUnlock('veteran_player', 'gold', 'Gold', totalGames, 35);
      checkUnlock('veteran_player', 'silver', 'Silver', totalGames, 15);
      checkUnlock('veteran_player', 'bronze', 'Bronze', totalGames, 5);

      // 12. Portal Hopper (Bronze: 15 wrap portals)
      const totalPortals = data.totalPortals || 0;
      checkUnlock('portal_traveler', 'bronze', 'Bronze', totalPortals, 15);

      // 13. Ninja Reflexes (Silver: 5 close calls)
      const totalCloseCalls = data.totalCloseCalls || 0;
      checkUnlock('close_call', 'silver', 'Silver', totalCloseCalls, 5);

      // 14. Rapid Feast (Bronze: 3 foods in single combo)
      checkUnlock('clean_streak', 'bronze', 'Bronze', this.rapidStreakCount, 3);

      // 15. Grandmaster (Gold: 500+ score in run)
      checkUnlock('grandmaster', 'gold', 'Gold', this.score, 500);

      if (updated) {
        Storage.saveData(data);
        this.updateAchievementsCountDisplay();
      }
    }

    updateAchievementsCountDisplay() {
      const data = Storage.getData();
      const achMap = data.achievements || {};
      let unlockedCount = 0;

      ACHIEVEMENTS_DEF.forEach(def => {
        if (achMap[def.id] && achMap[def.id].tier) {
          unlockedCount++;
        }
      });

      if (this.dom.badgeAchievementsCount) {
        this.dom.badgeAchievementsCount.style.display = unlockedCount > 0 ? 'inline-block' : 'none';
        this.dom.badgeAchievementsCount.textContent = unlockedCount;
      }
      if (this.dom.sidebarAchievementsVal) {
        this.dom.sidebarAchievementsVal.textContent = `${unlockedCount} / 15`;
      }
      if (this.dom.modalAchievementsProgressPill) {
        this.dom.modalAchievementsProgressPill.textContent = `${unlockedCount} / 15 Unlocked`;
      }
    }

    openAchievementsModal() {
      // Auto-pause if active game is underway
      if (this.state === STATES.PLAYING || this.state === STATES.COUNTDOWN) {
        this.pauseGame('Game paused to view achievements.');
      }
      this.renderAchievementsList();
      ModalManager.open(this.dom.modalAchievements);
    }

    renderAchievementsList() {
      const listEl = this.dom.achievementsList;
      if (!listEl) return;

      const data = Storage.getData();
      const achMap = data.achievements || {};
      const filter = this.currentAchievementsFilter;

      listEl.innerHTML = '';
      let renderedCount = 0;

      ACHIEVEMENTS_DEF.forEach(def => {
        const userAch = achMap[def.id] || { tier: null };
        const isUnlocked = !!userAch.tier;

        if (filter === 'unlocked' && !isUnlocked) return;
        if (filter === 'locked' && isUnlocked) return;

        renderedCount++;
        const card = document.createElement('div');
        card.className = `achievement-card ${isUnlocked ? 'completed' : 'locked'}`;

        const displayTier = userAch.tier || (def.type === 'tiered' ? 'bronze' : def.tier);
        const tierName = displayTier ? displayTier.charAt(0).toUpperCase() + displayTier.slice(1) : 'Bronze';

        // Calculate progress for tiered or single
        let progressTxt = '';
        let progressPct = 0;

        if (def.id === 'apple_lover') {
          const val = (data.totalFood || 0) + this.applesEaten;
          const target = userAch.tier === 'silver' ? 150 : userAch.tier === 'bronze' ? 75 : 25;
          progressTxt = `${Math.min(target, val)} / ${target}`;
          progressPct = Math.min(100, (val / target) * 100);
        } else if (def.id === 'score_hunter') {
          const val = this.score;
          const target = userAch.tier === 'silver' ? 600 : userAch.tier === 'bronze' ? 300 : 100;
          progressTxt = `${Math.min(target, val)} / ${target}`;
          progressPct = Math.min(100, (val / target) * 100);
        } else if (def.id === 'length_master') {
          const val = this.snake.length;
          const target = userAch.tier === 'silver' ? 45 : userAch.tier === 'bronze' ? 25 : 12;
          progressTxt = `${Math.min(target, val)} / ${target}`;
          progressPct = Math.min(100, (val / target) * 100);
        } else if (def.id === 'combo_king') {
          const val = this.highestComboInRun;
          const target = userAch.tier === 'silver' ? 5 : userAch.tier === 'bronze' ? 4 : 3;
          progressTxt = `x${Math.min(target, val)} / x${target}`;
          progressPct = Math.min(100, (val / target) * 100);
        } else if (def.id === 'veteran_player') {
          const val = data.totalGames || 0;
          const target = userAch.tier === 'silver' ? 35 : userAch.tier === 'bronze' ? 15 : 5;
          progressTxt = `${Math.min(target, val)} / ${target}`;
          progressPct = Math.min(100, (val / target) * 100);
        } else {
          progressTxt = isUnlocked ? 'Completed' : 'In Progress';
          progressPct = isUnlocked ? 100 : 25;
        }

        card.innerHTML = `
          <div class="achievement-medal ${displayTier}">
            <i class="${def.icon}"></i>
          </div>
          <div class="achievement-info">
            <div class="achievement-title-row">
              <span class="achievement-name">${def.title}</span>
              <span class="achievement-tier-tag ${displayTier}">${tierName}</span>
            </div>
            <p class="achievement-desc">${def.desc}</p>
            <div class="achievement-progress-wrap">
              <div class="achievement-progress-bar">
                <div class="achievement-progress-fill" style="width: ${progressPct}%;"></div>
              </div>
              <span class="achievement-progress-text">${progressTxt}</span>
            </div>
          </div>
          ${isUnlocked ? '<div class="achievement-status-badge"><i class="fa-solid fa-check"></i></div>' : ''}
        `;

        listEl.appendChild(card);
      });

      if (renderedCount === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'achievements-empty-state';

        if (filter === 'unlocked') {
          emptyState.innerHTML = `
            <div class="empty-state-icon">
              <i class="fa-solid fa-trophy text-muted"></i>
            </div>
            <h3 class="empty-state-title">No Achievements Unlocked Yet</h3>
            <p class="empty-state-desc">Slither into the arena, eat apples, and build combos to unlock your first trophy!</p>
          `;
        } else if (filter === 'locked') {
          emptyState.innerHTML = `
            <div class="empty-state-icon">
              <i class="fa-solid fa-crown text-amber"></i>
            </div>
            <h3 class="empty-state-title">All Milestones Achieved!</h3>
            <p class="empty-state-desc">You have unlocked every single achievement in the game. You are a true Grandmaster!</p>
          `;
        } else {
          emptyState.innerHTML = `
            <div class="empty-state-icon">
              <i class="fa-solid fa-trophy text-muted"></i>
            </div>
            <h3 class="empty-state-title">No Achievements Found</h3>
            <p class="empty-state-desc">Play games to view your progress.</p>
          `;
        }
        listEl.appendChild(emptyState);
      }
    }

    // -----------------------------------------------------------------------
    // Input Handling
    // -----------------------------------------------------------------------
    handleDirectionInput(newDir) {
      if (this.state !== STATES.PLAYING && this.state !== STATES.COUNTDOWN) return;

      const currentEffectiveDir = this.inputQueue.length > 0 
        ? this.inputQueue[this.inputQueue.length - 1] 
        : this.direction;

      if (OPPOSITE_DIRECTIONS[currentEffectiveDir.name] === newDir.name) return;
      if (currentEffectiveDir.name === newDir.name) return;

      if (this.inputQueue.length < 2) {
        this.inputQueue.push(newDir);
      }
    }

    bindEvents() {
      // 1. Keyboard Controls (Strictly restricted to Web version)
      window.addEventListener('keydown', (e) => {
        if (!this.isWebVersion()) {
          return;
        }

        // Prevent default scrolling for game keys if inside game or focused
        const gameKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
        if (gameKeys.includes(e.key)) {
          const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
          if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
            return;
          }
          if (activeTag === 'button' && e.key === ' ') {
            return; // Allow Space to activate focused buttons in dialogs
          }
          e.preventDefault();
        }

        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
          return;
        }

        // Escape: dismiss confirm dialog or active dismissable modal, or toggle pause/resume
        if (e.key === 'Escape') {
          if (ModalManager.confirmOverlay && ModalManager.confirmOverlay.classList.contains('active')) {
            const btnCancel = document.getElementById('confirm-btn-cancel');
            if (btnCancel) btnCancel.click();
            return;
          }
          if (ModalManager.activeModal) {
            ModalManager.closeDismissableModal();
            return;
          }
          if (this.state === STATES.PLAYING) {
            this.pauseGame();
          } else if (this.state === STATES.PAUSED) {
            this.resumeGame();
          }
          return;
        }

        // If confirm dialog is active, lock all other keyboard hotkeys
        if (ModalManager.confirmOverlay && ModalManager.confirmOverlay.classList.contains('active')) {
          if (e.key === 'Enter') {
            const btnOk = document.getElementById('confirm-btn-ok');
            if (btnOk) btnOk.click();
          }
          return;
        }

        // Space or P / p: Toggle Pause (or Quick Replay on Game Over)
        if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
          if (ModalManager.activeModal === ModalManager.gameoverModal) {
            e.preventDefault();
            this.startCountdownAndPlay();
            return;
          }
          if (ModalManager.activeModal) {
            return; // STRICT LOCK: No pause toggling while ANY modal is open!
          }
          this.togglePause();
          return;
        }

        // Enter: Quick Replay on Game Over
        if (e.key === 'Enter') {
          if (ModalManager.activeModal === ModalManager.gameoverModal) {
            e.preventDefault();
            this.startCountdownAndPlay();
            return;
          }
        }

        // H / h: Toggle Help Guide
        if (e.key === 'h' || e.key === 'H') {
          if (ModalManager.activeModal === ModalManager.helpModal) {
            ModalManager.closeDismissableModal();
          } else if (!ModalManager.activeModal || ModalManager.activeModal === ModalManager.startModal || ModalManager.activeModal === ModalManager.gameoverModal) {
            this.openHelpModal();
          }
          return;
        }

        // T / t: Toggle Achievements (Trophy)
        if (e.key === 't' || e.key === 'T') {
          if (ModalManager.activeModal === ModalManager.achievementsModal) {
            ModalManager.closeDismissableModal();
          } else if (!ModalManager.activeModal || ModalManager.activeModal === ModalManager.startModal || ModalManager.activeModal === ModalManager.gameoverModal) {
            this.openAchievementsModal();
          }
          return;
        }

        // O / o: Toggle Settings (Options)
        if (e.key === 'o' || e.key === 'O') {
          if (ModalManager.activeModal === ModalManager.settingsModal) {
            ModalManager.closeDismissableModal();
          } else if (!ModalManager.activeModal || ModalManager.activeModal === ModalManager.startModal || ModalManager.activeModal === ModalManager.gameoverModal) {
            this.openSettingsModal();
          }
          return;
        }

        // M / m: Toggle Sound Effects (Mute / Unmute)
        if (e.key === 'm' || e.key === 'M') {
          this.toggleSound();
          return;
        }

        // Direction steering keys
        switch (e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            this.handleDirectionInput(DIRECTIONS.UP);
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            this.handleDirectionInput(DIRECTIONS.DOWN);
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            this.handleDirectionInput(DIRECTIONS.LEFT);
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            this.handleDirectionInput(DIRECTIONS.RIGHT);
            break;
          case 'r':
          case 'R':
            if (ModalManager.activeModal &&
                ModalManager.activeModal !== ModalManager.gameoverModal) {
              return;
            }
            if (this.state === STATES.PLAYING || this.state === STATES.PAUSED || this.state === STATES.GAMEOVER) {
              this.startCountdownAndPlay();
            }
            break;
        }
      });

      // 2. Touch D-Pad Buttons
      const dpadUp = document.getElementById('touch-up');
      const dpadDown = document.getElementById('touch-down');
      const dpadLeft = document.getElementById('touch-left');
      const dpadRight = document.getElementById('touch-right');
      const dpadCenter = document.getElementById('touch-center-pause');

      const bindTouch = (el, dir) => {
        if (!el) return;
        const trigger = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleDirectionInput(dir);
        };
        el.addEventListener('touchstart', trigger, { passive: false });
        el.addEventListener('mousedown', trigger);
      };

      bindTouch(dpadUp, DIRECTIONS.UP);
      bindTouch(dpadDown, DIRECTIONS.DOWN);
      bindTouch(dpadLeft, DIRECTIONS.LEFT);
      bindTouch(dpadRight, DIRECTIONS.RIGHT);

      if (dpadCenter) {
        const toggleTrigger = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.togglePause();
        };
        dpadCenter.addEventListener('touchstart', toggleTrigger, { passive: false });
        dpadCenter.addEventListener('mousedown', toggleTrigger);
      }

      // 3. Swipe Detection on Board Frame
      let touchStartX = 0;
      let touchStartY = 0;
      const boardFrame = document.querySelector('.board-frame');

      if (boardFrame) {
        boardFrame.addEventListener('touchstart', (e) => {
          if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }
        }, { passive: true });

        boardFrame.addEventListener('touchend', (e) => {
          if (e.changedTouches.length === 1) {
            const diffX = e.changedTouches[0].clientX - touchStartX;
            const diffY = e.changedTouches[0].clientY - touchStartY;
            const minSwipe = 24;

            if (Math.max(Math.abs(diffX), Math.abs(diffY)) > minSwipe) {
              if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) this.handleDirectionInput(DIRECTIONS.RIGHT);
                else this.handleDirectionInput(DIRECTIONS.LEFT);
              } else {
                if (diffY > 0) this.handleDirectionInput(DIRECTIONS.DOWN);
                else this.handleDirectionInput(DIRECTIONS.UP);
              }
            }
          }
        }, { passive: true });
      }

      // 4. Header Actions
      if (this.dom.btnHeaderPause) {
        this.dom.btnHeaderPause.addEventListener('click', () => this.togglePause());
      }
      if (this.dom.btnHeaderRestart) {
        this.dom.btnHeaderRestart.addEventListener('click', () => {
          if (this.state === STATES.PLAYING) {
            ModalManager.confirm(
              'Restart Game?',
              'Your current session score will be lost.',
              () => this.startCountdownAndPlay()
            );
          } else {
            this.startCountdownAndPlay();
          }
        });
      }
      if (this.dom.btnHeaderSettings) {
        this.dom.btnHeaderSettings.addEventListener('click', () => {
          this.openSettingsModal();
        });
      }
      if (this.dom.btnHeaderAchievements) {
        this.dom.btnHeaderAchievements.addEventListener('click', () => {
          this.openAchievementsModal();
        });
      }
      if (this.dom.btnHeaderHelp) {
        this.dom.btnHeaderHelp.addEventListener('click', () => {
          this.openHelpModal();
        });
      }

      // 5. Sidebar Actions
      if (this.dom.rowSidebarAchievements) {
        this.dom.rowSidebarAchievements.addEventListener('click', () => {
          this.openAchievementsModal();
        });
      }
      if (this.dom.rowSidebarHelp) {
        this.dom.rowSidebarHelp.addEventListener('click', () => {
          this.openHelpModal();
        });
      }

      // 6. Start Modal Controls & Speed Cards
      const btnStart = document.getElementById('btn-start-game');
      if (btnStart) {
        btnStart.addEventListener('click', () => this.startCountdownAndPlay());
      }

      const startSpeedButtons = document.querySelectorAll('.start-speed-card[data-speed]');
      startSpeedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          startSpeedButtons.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-checked', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-checked', 'true');
          const chosen = btn.getAttribute('data-speed');
          this.settings.speed = chosen;
          Storage.updateSetting('speed', chosen);
          this.updateDynamicTick();
          this.updateSpeedBadges();
          this.setupSettingsUI();
          SoundFX.click();
        });
      });

      if (this.dom.btnStartOpenHelp) {
        this.dom.btnStartOpenHelp.addEventListener('click', () => {
          SoundFX.click();
          this.openHelpModal();
        });
      }

      // 7. In-Board Pause Controls (Clicking anywhere on paused board resumes)
      if (this.dom.pauseOverlay) {
        this.dom.pauseOverlay.addEventListener('click', () => {
          this.resumeGame();
        });
      }

      // 8. Game Over Modal Controls
      const btnRetry = document.getElementById('btn-gameover-retry');
      const btnMenu = document.getElementById('btn-gameover-menu');

      if (btnRetry) btnRetry.addEventListener('click', () => this.startCountdownAndPlay());
      if (btnMenu) btnMenu.addEventListener('click', () => {
        SoundFX.click();
        this.showStartModal();
      });

      // 9. Settings Modal Controls
      const btnCloseSettings = document.getElementById('btn-close-settings');
      const btnCancelSettings = document.getElementById('btn-cancel-settings');
      const btnSaveSettings = document.getElementById('btn-save-settings');
      const btnResetStorage = document.getElementById('btn-reset-storage');

      if (btnCloseSettings) btnCloseSettings.addEventListener('click', () => {
        SoundFX.click();
        this.cancelSettings();
      });
      if (btnCancelSettings) btnCancelSettings.addEventListener('click', () => {
        SoundFX.click();
        this.cancelSettings();
      });
      if (btnSaveSettings) btnSaveSettings.addEventListener('click', () => {
        SoundFX.click();
        this.saveSettingsFromUI();
      });

      if (btnResetStorage) {
        btnResetStorage.addEventListener('click', () => {
          SoundFX.click();
          ModalManager.confirm(
            'Clear All Game Data?',
            'This will permanently reset your high score, achievements and all statistics.',
            () => {
              const reset = Storage.resetAll();
              this.highScore = reset.highScore;
              this.settings = reset.settings;
              this.applySkinTheme();
              this.setupSettingsUI();
              this.updateScoreDisplays();
              this.updateAchievementsCountDisplay();
              this.updateStartScreenStats();
              Toast.show('All game statistics, scores & achievements cleared.', 'fa-solid fa-check');
            }
          );
        });
      }

      // 10. Achievements Modal Controls
      const btnCloseAchievements = document.getElementById('btn-close-achievements');
      const btnDoneAchievements = document.getElementById('btn-done-achievements');
      const filterTabs = document.querySelectorAll('.filter-tab[data-filter]');

      if (btnCloseAchievements) btnCloseAchievements.addEventListener('click', () => {
        SoundFX.click();
        ModalManager.closeDismissableModal();
      });
      if (btnDoneAchievements) btnDoneAchievements.addEventListener('click', () => {
        SoundFX.click();
        ModalManager.closeDismissableModal();
      });

      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.currentAchievementsFilter = tab.getAttribute('data-filter');
          this.renderAchievementsList();
          SoundFX.click();
        });
      });

      // 11. How to Play (Help) Modal Controls
      const btnCloseHelp = document.getElementById('btn-close-help');
      const btnDoneHelp = document.getElementById('btn-done-help');
      const helpTabs = document.querySelectorAll('.help-tab[data-help-tab]');
      const helpPanes = document.querySelectorAll('.help-pane');

      if (btnCloseHelp) btnCloseHelp.addEventListener('click', () => {
        SoundFX.click();
        ModalManager.closeDismissableModal();
      });
      if (btnDoneHelp) btnDoneHelp.addEventListener('click', () => {
        SoundFX.click();
        ModalManager.closeDismissableModal();
      });

      helpTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          helpTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const targetKey = tab.getAttribute('data-help-tab');
          helpPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === `help-pane-${targetKey}`) {
              pane.classList.add('active');
            }
          });
          SoundFX.click();
        });
      });

      // 12. Modal Backdrop Click Dismissal
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.addEventListener('click', () => {
          if (ModalManager.activeModal === ModalManager.settingsModal ||
              ModalManager.activeModal === ModalManager.helpModal ||
              ModalManager.activeModal === ModalManager.achievementsModal) {
            ModalManager.closeDismissableModal();
          }
        });
      }

      if (ModalManager.confirmOverlay) {
        ModalManager.confirmOverlay.addEventListener('click', (e) => {
          if (e.target === ModalManager.confirmOverlay) {
            const btnCancel = document.getElementById('confirm-btn-cancel');
            if (btnCancel) btnCancel.click();
          }
        });
      }

      // 13. Visibility & Window Focus Watchers (Auto-Pause Protection)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && (this.state === STATES.PLAYING || this.state === STATES.COUNTDOWN)) {
          this.pauseGame('Game paused automatically while tab was inactive.');
        }
      });

      window.addEventListener('blur', () => {
        if (this.state === STATES.PLAYING || this.state === STATES.COUNTDOWN) {
          this.pauseGame('Game paused automatically.');
        }
      });

      // 14. Window Resize & Orientation Watcher
      let prevWidth = window.innerWidth;
      let prevHeight = window.innerHeight;

      window.addEventListener('resize', () => {
        const curWidth = window.innerWidth;
        const curHeight = window.innerHeight;
        const widthDiff = Math.abs(curWidth - prevWidth);
        const heightDiff = Math.abs(curHeight - prevHeight);

        if ((widthDiff > 35 || heightDiff > 35) && (this.state === STATES.PLAYING || this.state === STATES.COUNTDOWN)) {
          this.pauseGame('Game paused automatically due to screen resolution change.');
          Toast.show('Screen resized: Game automatically paused.', 'fa-solid fa-pause');
        }

        prevWidth = curWidth;
        prevHeight = curHeight;
      });
    }

    // -----------------------------------------------------------------------
    // Settings Management & Session Fairness Reset
    // -----------------------------------------------------------------------
    updateSettingsPreview(skinKey) {
      const meta = SKIN_METADATA[skinKey] || SKIN_METADATA.obsidian;
      if (this.dom.previewSkinTitle) {
        this.dom.previewSkinTitle.textContent = meta.name;
      }
      if (this.dom.previewHead) this.dom.previewHead.style.backgroundColor = meta.head;
      if (this.dom.previewBody1) this.dom.previewBody1.style.backgroundColor = meta.body;
      if (this.dom.previewBody2) this.dom.previewBody2.style.backgroundColor = meta.body;
      if (this.dom.previewTail) this.dom.previewTail.style.backgroundColor = meta.tail;
    }

    setupSettingsUI() {
      // 1. Snake Skin swatches
      const skinSwatches = document.querySelectorAll('.skin-swatch-card[data-skin]');
      skinSwatches.forEach(swatch => {
        const skinName = swatch.getAttribute('data-skin');
        swatch.classList.toggle('active', skinName === (this.settings.skin || 'obsidian'));

        swatch.onclick = () => {
          skinSwatches.forEach(s => s.classList.remove('active'));
          swatch.classList.add('active');
          this.settings.skin = skinName;
          this.applySkinTheme();
          this.updateSettingsPreview(skinName);
          SoundFX.click();
        };
      });

      // 2. Segmented Speed buttons
      const settingsSpeedBtns = document.querySelectorAll('[data-settings-speed]');
      settingsSpeedBtns.forEach(btn => {
        const val = btn.getAttribute('data-settings-speed');
        btn.classList.toggle('active', val === this.settings.speed);

        btn.onclick = () => {
          settingsSpeedBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          SoundFX.click();
        };
      });

      // 3. Wall Mode buttons
      const wallBtns = document.querySelectorAll('[data-wall]');
      wallBtns.forEach(btn => {
        const val = btn.getAttribute('data-wall');
        btn.classList.toggle('active', val === this.settings.wallMode);

        btn.onclick = () => {
          wallBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          SoundFX.click();
        };
      });

      // 4. Grid Size buttons
      const gridBtns = document.querySelectorAll('[data-grid]');
      gridBtns.forEach(btn => {
        const val = parseInt(btn.getAttribute('data-grid'), 10);
        btn.classList.toggle('active', val === this.gridSize);

        btn.onclick = () => {
          gridBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          SoundFX.click();
        };
      });

      // 5. Sound Effects buttons
      const soundBtns = document.querySelectorAll('[data-sound]');
      const soundIcon = document.getElementById('settings-sound-icon');
      soundBtns.forEach(btn => {
        const val = btn.getAttribute('data-sound');
        const isActive = val === (this.settings.sound || 'on');
        btn.classList.toggle('active', isActive);

        btn.onclick = () => {
          soundBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.settings.sound = val;
          SoundFX.setEnabled(val === 'on');
          if (soundIcon) {
            soundIcon.className = val === 'on' ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
            soundIcon.style.color = val === 'on' ? 'var(--accent-emerald)' : 'var(--text-muted)';
          }
          if (val === 'on') {
            SoundFX.click();
          }
        };
      });
      if (soundIcon) {
        const isEnabled = (this.settings.sound || 'on') === 'on';
        soundIcon.className = isEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
        soundIcon.style.color = isEnabled ? 'var(--accent-emerald)' : 'var(--text-muted)';
      }

      this.updateSettingsPreview(this.settings.skin || 'obsidian');
      this.syncStartModalSpeed();
      this.updateSpeedBadges();
    }

    toggleSound() {
      const current = this.settings.sound || 'on';
      const next = current === 'on' ? 'off' : 'on';
      this.settings.sound = next;
      SoundFX.setEnabled(next === 'on');
      Storage.updateSetting('sound', next);
      this.setupSettingsUI();
      if (next === 'on') {
        SoundFX.click();
        Toast.show('Sound Effects: Enabled', 'fa-solid fa-volume-high');
      } else {
        Toast.show('Sound Effects: Muted', 'fa-solid fa-volume-xmark');
      }
    }

    openSettingsModal() {
      if (this.state === STATES.PLAYING || this.state === STATES.COUNTDOWN) {
        this.pauseGame('Game paused for settings.');
      }

      this.initialSettingsSnapshot = {
        speed: this.settings.speed,
        wallMode: this.settings.wallMode,
        gridSize: this.gridSize,
        skin: this.settings.skin,
        sound: this.settings.sound || 'on'
      };

      const hasActiveRun = (this.score > 0 || this.applesEaten > 0 || this.hasActiveSessionProgress);
      if (this.dom.settingsResetWarning) {
        this.dom.settingsResetWarning.style.display = hasActiveRun ? 'flex' : 'none';
      }

      this.setupSettingsUI();
      ModalManager.open(ModalManager.settingsModal);
    }

    cancelSettings() {
      if (this.initialSettingsSnapshot) {
        this.settings.skin = this.initialSettingsSnapshot.skin;
        this.settings.speed = this.initialSettingsSnapshot.speed;
        this.settings.wallMode = this.initialSettingsSnapshot.wallMode;
        this.gridSize = this.initialSettingsSnapshot.gridSize;
        this.settings.gridSize = this.initialSettingsSnapshot.gridSize;
        this.settings.sound = this.initialSettingsSnapshot.sound || 'on';
        SoundFX.setEnabled(this.settings.sound === 'on');
        Storage.updateSetting('skin', this.settings.skin);
        Storage.updateSetting('sound', this.settings.sound);
        this.applySkinTheme();
        this.updateSettingsPreview(this.settings.skin);
        this.setupSettingsUI();
        this.initialSettingsSnapshot = null;
      }
      ModalManager.dismiss();
    }

    saveSettingsFromUI() {
      const activeSpeedBtn = document.querySelector('[data-settings-speed].active');
      const activeWallBtn = document.querySelector('[data-wall].active');
      const activeGridBtn = document.querySelector('[data-grid].active');
      const activeSoundBtn = document.querySelector('[data-sound].active');

      const newSpeed = activeSpeedBtn ? activeSpeedBtn.getAttribute('data-settings-speed') : this.settings.speed;
      const newWall = activeWallBtn ? activeWallBtn.getAttribute('data-wall') : this.settings.wallMode;
      const newGrid = activeGridBtn ? parseInt(activeGridBtn.getAttribute('data-grid'), 10) : this.gridSize;
      const newSound = activeSoundBtn ? activeSoundBtn.getAttribute('data-sound') : (this.settings.sound || 'on');

      const baseSnapshot = this.initialSettingsSnapshot || this.settings;
      const gameplaySettingsChanged = (newSpeed !== baseSnapshot.speed) || 
                                      (newWall !== baseSnapshot.wallMode) || 
                                      (newGrid !== baseSnapshot.gridSize);

      this.settings.speed = newSpeed;
      this.settings.wallMode = newWall;
      this.gridSize = newGrid;
      this.settings.gridSize = newGrid;
      this.settings.sound = newSound;
      SoundFX.setEnabled(newSound === 'on');

      Storage.updateSetting('speed', newSpeed);
      Storage.updateSetting('wallMode', newWall);
      Storage.updateSetting('gridSize', newGrid);
      Storage.updateSetting('skin', this.settings.skin);
      Storage.updateSetting('sound', newSound);

      this.applySkinTheme();
      this.applyGridSizeCSS();
      this.updateDynamicTick();
      this.syncStartModalSpeed();
      this.updateSpeedBadges();

      const hasActiveRun = (this.score > 0 || this.applesEaten > 0 || this.hasActiveSessionProgress);
      if (gameplaySettingsChanged && hasActiveRun) {
        this.resetGameData();
        Toast.show('Settings updated: Active session reset for fairness.', 'fa-solid fa-arrows-rotate');
        this.initialSettingsSnapshot = null;
        ModalManager.open(ModalManager.startModal);
      } else {
        Toast.show('Settings saved successfully.', 'fa-solid fa-check');
        this.initialSettingsSnapshot = null;
        ModalManager.dismiss();
      }
    }

    // -----------------------------------------------------------------------
    // UI Helpers & Formatting
    // -----------------------------------------------------------------------
    updateScoreDisplays() {
      if (this.dom.sidebarScore) this.dom.sidebarScore.textContent = this.score;
      if (this.dom.sidebarBest) this.dom.sidebarBest.textContent = this.highScore;
      if (this.dom.mobileScore) this.dom.mobileScore.textContent = this.score;
      if (this.dom.mobileBest) this.dom.mobileBest.textContent = this.highScore;
    }

    updateSpeedBadges() {
      const label = SPEED_CONFIG[this.settings.speed].label;
      if (this.dom.currentSpeedTag) this.dom.currentSpeedTag.textContent = label;
      if (this.dom.mobileSpeed) this.dom.mobileSpeed.textContent = label;
    }

    updateSessionStats() {
      if (this.dom.statLength) this.dom.statLength.textContent = this.snake.length;
      if (this.dom.statApples) this.dom.statApples.textContent = this.applesEaten;
    }

    updateTimeDisplay() {
      if (!this.dom.statTime) return;
      const mins = Math.floor(this.elapsedSeconds / 60);
      const secs = this.elapsedSeconds % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      this.dom.statTime.textContent = formatted;
    }

    updatePauseButtonIcons(isPaused) {
      const pauseIcon = '<i class="fa-solid fa-pause"></i>';
      const playIcon = '<i class="fa-solid fa-play"></i>';

      if (this.dom.btnHeaderPause) {
        this.dom.btnHeaderPause.innerHTML = isPaused ? playIcon : pauseIcon;
        this.dom.btnHeaderPause.title = isPaused ? 'Resume Game (Space)' : 'Pause Game (Space)';
      }
      if (this.dom.touchCenterIcon) {
        this.dom.touchCenterIcon.className = isPaused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
      }
    }
  }

  // =========================================================================
  // 5. Bootstrap Engine on DOMContentLoaded
  // =========================================================================
  window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new SnakeGame();
  });

})();

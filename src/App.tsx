import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStats, GameSettings, MathQuestion, Realm } from './types/game';
import { REALMS, QUESTION_BANK } from './data/realmsData';
import { soundEngine } from './utils/audio';
import {
  loadPlayerStats,
  savePlayerStats,
  loadSettings,
  saveSettings,
  getLevelTitle,
} from './utils/storage';
import { GameCanvas, InteractiveTarget } from './components/3d/GameCanvas';
import { GameHUD } from './components/hud/GameHUD';
import { TouchJoystick } from './components/controls/TouchJoystick';
import { MainMenu } from './components/MainMenu';
import { QuestionModal } from './components/modals/QuestionModal';
import { BossModal } from './components/modals/BossModal';
import { MiniGameModal } from './components/modals/MiniGameModal';
import { StudyModal } from './components/modals/StudyModal';
import { ClassModeModal } from './components/modals/ClassModeModal';
import { TeacherDashboardModal } from './components/modals/TeacherDashboardModal';
import { LeaderboardModal } from './components/modals/LeaderboardModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { MapModal } from './components/modals/MapModal';
import { InventoryModal } from './components/modals/InventoryModal';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [stats, setStats] = useState<PlayerStats>(loadPlayerStats);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  // Subtitle toast message for accessibility
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const subtitleTimeout = useRef<number | null>(null);

  // Active Modals
  const [activeQuestion, setActiveQuestion] = useState<{
    q: MathQuestion;
    npcName?: string;
  } | null>(null);
  const [activeBossRealm, setActiveBossRealm] = useState<Realm | null>(null);
  const [isFinalBoss, setIsFinalBoss] = useState(false);

  const [showStudyModal, setShowStudyModal] = useState(false);
  const [showMiniGameModal, setShowMiniGameModal] = useState(false);
  const [showClassModeModal, setShowClassModeModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);

  // Movement & Action triggers for 3D canvas
  const [moveInput, setMoveInput] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [jumpRequested, setJumpRequested] = useState(false);
  const [interactRequested, setInteractRequested] = useState(false);

  // Audio & Subtitle Hookup
  useEffect(() => {
    soundEngine.musicEnabled = settings.musicEnabled;
    soundEngine.soundEnabled = settings.soundEnabled;
    soundEngine.subtitlesEnabled = settings.subtitlesEnabled;

    soundEngine.onSubtitle = (text: string) => {
      setSubtitle(text);
      if (subtitleTimeout.current) clearTimeout(subtitleTimeout.current);
      subtitleTimeout.current = window.setTimeout(() => setSubtitle(null), 3000);
    };

    return () => {
      if (subtitleTimeout.current) clearTimeout(subtitleTimeout.current);
    };
  }, [settings]);

  // Playtime stopwatch ticker
  useEffect(() => {
    let interval: number;
    if (inGame) {
      interval = window.setInterval(() => {
        setStats((prev) => ({
          ...prev,
          playTimeSeconds: prev.playTimeSeconds + 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [inGame]);

  // Global Keyboard shortcuts (M for Map, I for Inventory, H for Help, Esc to close modals)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!inGame) return;
      if (e.code === 'KeyM') setShowMapModal((p) => !p);
      if (e.code === 'KeyI') setShowInventoryModal((p) => !p);
      if (e.code === 'KeyH') setShowStudyModal((p) => !p);
      if (e.code === 'Escape') {
        setActiveQuestion(null);
        setActiveBossRealm(null);
        setShowMiniGameModal(false);
        setShowStudyModal(false);
        setShowMapModal(false);
        setShowInventoryModal(false);
        setShowSettingsModal(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [inGame]);

  // Current Realm
  const currentRealm = REALMS.find((r) => r.id === stats.currentRealmId) || REALMS[0];

  // XP & Level calculations
  const addXP = useCallback((amount: number) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextThreshold = prev.nextLevelXp;

      // Level threshold curve: 500, 1200, 2200, 3500
      const thresholds = [500, 1200, 2200, 3500, 99999];
      while (newLevel < 5 && newXp >= thresholds[newLevel - 1]) {
        newLevel++;
        soundEngine.playLevelUp();
      }
      nextThreshold = thresholds[newLevel - 1] || 99999;

      const updated: PlayerStats = {
        ...prev,
        xp: newXp,
        level: newLevel,
        levelTitle: getLevelTitle(newLevel),
        nextLevelXp: nextThreshold,
        score: prev.score + amount,
      };
      savePlayerStats(updated);
      return updated;
    });
  }, []);

  // Handlers for Question Modal rewards
  const handleQuestionCorrect = (xpReward: number, coinReward: number) => {
    addXP(xpReward);
    setStats((prev) => {
      const updated: PlayerStats = {
        ...prev,
        coins: prev.coins + coinReward,
        correctAnswers: prev.correctAnswers + 1,
      };
      savePlayerStats(updated);
      return updated;
    });
  };

  const handleQuestionWrong = () => {
    setStats((prev) => {
      const updated: PlayerStats = {
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1,
      };
      savePlayerStats(updated);
      return updated;
    });
  };

  // Boss Victory Handler
  const handleBossVictory = (rewardXp: number, rewardCoins: number) => {
    addXP(rewardXp);
    setStats((prev) => {
      const nextRealmId = Math.min(5, prev.currentRealmId + 1);
      const unlocked = Array.from(new Set([...prev.unlockedRealms, nextRealmId]));
      const updatedCrystals = Math.max(prev.crystals, prev.currentRealmId);

      const updated: PlayerStats = {
        ...prev,
        coins: prev.coins + rewardCoins,
        crystals: updatedCrystals,
        unlockedRealms: unlocked,
        currentRealmId: nextRealmId,
      };
      savePlayerStats(updated);
      return updated;
    });
    setActiveBossRealm(null);
  };

  // Collect Coin
  const handleCoinCollected = () => {
    setStats((prev) => {
      const updated: PlayerStats = {
        ...prev,
        coins: prev.coins + 10,
        score: prev.score + 25,
      };
      savePlayerStats(updated);
      return updated;
    });
  };

  // Collect Crystal from Pedestal
  const handleCrystalCollected = (realmId: number) => {
    soundEngine.playCrystal();
    addXP(150);
    setStats((prev) => {
      const updatedCrystals = Math.max(prev.crystals, realmId);
      const updated: PlayerStats = {
        ...prev,
        crystals: updatedCrystals,
      };
      savePlayerStats(updated);
      return updated;
    });
  };

  // 3D Canvas Interaction dispatch
  const handleWorldInteract = (target: InteractiveTarget) => {
    if (target.type === 'npc' || target.type === 'board') {
      // Pick a question from this realm
      const pool = QUESTION_BANK.filter((q) => q.realmId === target.realmId);
      const randomQ = pool[Math.floor(Math.random() * pool.length)] || QUESTION_BANK[0];
      setActiveQuestion({
        q: randomQ,
        npcName: target.title,
      });
    } else if (target.type === 'chest') {
      setShowMiniGameModal(true);
    } else if (target.type === 'crystal') {
      handleCrystalCollected(target.realmId);
    } else if (target.type === 'boss') {
      const targetRealm = REALMS.find((r) => r.id === target.realmId) || REALMS[0];
      setActiveBossRealm(targetRealm);
      setIsFinalBoss(target.realmId === 5);
    } else if (target.type === 'minigame') {
      setShowMiniGameModal(true);
    }
  };

  const handleStartAdventure = (name: string) => {
    setStats((prev) => {
      const updated: PlayerStats = { ...prev, name };
      savePlayerStats(updated);
      return updated;
    });
    setInGame(true);
    if (settings.musicEnabled) {
      soundEngine.startMusic();
    }
  };

  const fontSizeClass =
    settings.tvFontSize === 'extra-large'
      ? 'text-lg'
      : settings.tvFontSize === 'large'
      ? 'text-base'
      : 'text-sm';

  return (
    <div className={`w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none ${fontSizeClass}`}>
      {!inGame ? (
        <MainMenu
          stats={stats}
          onStartAdventure={handleStartAdventure}
          onOpenStudy={() => setShowStudyModal(true)}
          onOpenPractice={() => setShowMiniGameModal(true)}
          onOpenBossGauntlet={() => {
            setActiveBossRealm(REALMS[4]); // Final Boss: Raja Eksponen
            setIsFinalBoss(true);
          }}
          onOpenClassMode={() => setShowClassModeModal(true)}
          onOpenTeacherDashboard={() => setShowTeacherModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          fontSizeClass={fontSizeClass}
        />
      ) : (
        /* Active 3D Adventure Screen */
        <div className="relative w-full h-full">
          {/* 3D WebGL Canvas */}
          <GameCanvas
            currentRealmId={stats.currentRealmId}
            onInteract={handleWorldInteract}
            onCoinCollected={handleCoinCollected}
            onCrystalCollected={handleCrystalCollected}
            moveInput={moveInput}
            jumpRequested={jumpRequested}
            onJumpHandled={() => setJumpRequested(false)}
            interactRequested={interactRequested}
            onInteractHandled={() => setInteractRequested(false)}
          />

          {/* Heads Up Display */}
          <GameHUD
            stats={stats}
            currentRealm={currentRealm}
            soundEnabled={settings.soundEnabled}
            onToggleSound={() => {
              const next = !settings.soundEnabled;
              soundEngine.setSoundEnabled(next);
              setSettings((prev) => {
                const updated = { ...prev, soundEnabled: next };
                saveSettings(updated);
                return updated;
              });
            }}
            onOpenMenu={() => setShowSettingsModal(true)}
            subtitleText={subtitle}
            fontSizeClass={fontSizeClass}
          />

          {/* Touchscreen Virtual Joystick and Action Buttons */}
          <TouchJoystick
            onMove={setMoveInput}
            onJump={() => setJumpRequested(true)}
            onInteract={() => setInteractRequested(true)}
            onOpenMap={() => setShowMapModal(true)}
            onOpenInventory={() => setShowInventoryModal(true)}
            onOpenHelp={() => setShowStudyModal(true)}
          />
        </div>
      )}

      {/* --- ALL INTERACTIVE MODALS --- */}
      {/* 1. Math Mission & Question Modal */}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion.q}
          npcName={activeQuestion.npcName}
          onCorrect={handleQuestionCorrect}
          onWrong={handleQuestionWrong}
          onClose={() => setActiveQuestion(null)}
          fontSizeClass={fontSizeClass}
        />
      )}

      {/* 2. Boss & Guardian Battle Modal */}
      {activeBossRealm && (
        <BossModal
          realm={activeBossRealm}
          isKingExponent={isFinalBoss}
          onVictory={handleBossVictory}
          onClose={() => {
            setActiveBossRealm(null);
            setIsFinalBoss(false);
          }}
          fontSizeClass={fontSizeClass}
        />
      )}

      {/* 3. 5 Mini Games Modal */}
      {showMiniGameModal && (
        <MiniGameModal
          onReward={(xp, coins) => {
            addXP(xp);
            setStats((p) => {
              const up = { ...p, coins: p.coins + coins };
              savePlayerStats(up);
              return up;
            });
          }}
          onClose={() => setShowMiniGameModal(false)}
          fontSizeClass={fontSizeClass}
        />
      )}

      {/* 4. "BELAJAR DULU" Study & Interactive Formulas Modal */}
      {showStudyModal && (
        <StudyModal onClose={() => setShowStudyModal(false)} fontSizeClass={fontSizeClass} />
      )}

      {/* 5. Classroom Multiplayer TV Mode Modal */}
      {showClassModeModal && (
        <ClassModeModal onClose={() => setShowClassModeModal(false)} fontSizeClass={fontSizeClass} />
      )}

      {/* 6. Teacher Dashboard & Analytics Modal */}
      {showTeacherModal && (
        <TeacherDashboardModal
          currentStats={stats}
          onClose={() => setShowTeacherModal(false)}
          fontSizeClass={fontSizeClass}
        />
      )}

      {/* 7. Leaderboard Modal */}
      {showLeaderboardModal && (
        <LeaderboardModal onClose={() => setShowLeaderboardModal(false)} fontSizeClass={fontSizeClass} />
      )}

      {/* 8. Settings & Accessibility Modal */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => {
            setSettings(newSettings);
            saveSettings(newSettings);
          }}
          onSaveProgress={() => {
            savePlayerStats(stats);
            soundEngine.playCoin();
          }}
          onRestartLevel={() => {
            setShowSettingsModal(false);
            // Reload realm
          }}
          onReturnToMainMenu={() => {
            setShowSettingsModal(false);
            setInGame(false);
            soundEngine.stopMusic();
          }}
          onClose={() => setShowSettingsModal(false)}
          fontSizeClass={fontSizeClass}
        />
      )}

      {/* 9. Realm Map Modal */}
      {showMapModal && (
        <MapModal
          currentRealmId={stats.currentRealmId}
          unlockedRealms={stats.unlockedRealms}
          crystalsCount={stats.crystals}
          onSelectRealm={(realmId) => {
            setStats((prev) => {
              const updated = { ...prev, currentRealmId: realmId };
              savePlayerStats(updated);
              return updated;
            });
          }}
          onClose={() => setShowMapModal(false)}
          fontSizeClass={fontSizeClass}
        />
      )}

      {/* 10. Inventory Modal */}
      {showInventoryModal && (
        <InventoryModal stats={stats} onClose={() => setShowInventoryModal(false)} fontSizeClass={fontSizeClass} />
      )}
    </div>
  );
}

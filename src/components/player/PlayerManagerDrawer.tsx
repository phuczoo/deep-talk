'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  X,
  Plus,
  Trash2,
  Dice5,
  Sparkles,
  Shuffle,
  Crown,
} from 'lucide-react';
import { playDiceRollSound, playSuccessFanfare, vibrateLight, vibrateSuccess } from '@/lib/sound';

interface PlayerManagerDrawerProps {
  isOpen: boolean;
  players: string[];
  currentPlayerIndex: number;
  onClose: () => void;
  onUpdatePlayers: (players: string[]) => void;
  onSelectPlayerIndex?: (index: number) => void;
}

const DEFAULT_SUGGESTIONS = ['Nam', 'Trang', 'Huy', 'Linh', 'Đức', 'Phương', 'Hoàng', 'Thảo'];

export function PlayerManagerDrawer({
  isOpen,
  players,
  currentPlayerIndex,
  onClose,
  onUpdatePlayers,
  onSelectPlayerIndex,
}: PlayerManagerDrawerProps) {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [luckyWinner, setLuckyWinner] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddPlayer = (nameToAdd?: string) => {
    const name = (nameToAdd || newPlayerName).trim();
    if (!name) return;
    if (!players.includes(name)) {
      onUpdatePlayers([...players, name]);
      vibrateLight();
    }
    setNewPlayerName('');
  };

  const handleRemovePlayer = (nameToRemove: string) => {
    onUpdatePlayers(players.filter((p) => p !== nameToRemove));
    vibrateLight();
  };

  // Lucky picker / Bottle spin replacement
  const handleLuckySpin = () => {
    if (players.length === 0) return;
    setIsRolling(true);
    setLuckyWinner(null);
    playDiceRollSound();

    let rollCount = 0;
    const maxRolls = 15;
    const interval = setInterval(() => {
      rollCount++;
      const randomIdx = Math.floor(Math.random() * players.length);
      setLuckyWinner(players[randomIdx]);

      if (rollCount >= maxRolls) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * players.length);
        const winner = players[finalIdx];
        setLuckyWinner(winner);
        setIsRolling(false);
        playSuccessFanfare();
        vibrateSuccess();
        if (onSelectPlayerIndex) {
          onSelectPlayerIndex(finalIdx);
        }
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch {
          // ignore
        }
      }
    }, 80);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Tap backdrop to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div className="relative w-full max-w-lg mx-auto max-h-[85vh] bg-zinc-950 text-white border-t border-zinc-800 rounded-t-[32px] p-5 pb-8 shadow-2xl flex flex-col gap-5 overflow-y-auto animate-in slide-in-from-bottom duration-300 scrollbar-thin">
        {/* Grab indicator */}
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto -mt-1 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-zinc-100 tracking-tight flex items-center gap-1.5">
                <span>Danh Sách Người Chơi</span>
                <span className="px-1.5 py-0.2 rounded text-xs bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30">
                  {players.length} người
                </span>
              </h3>
              <p className="text-xs text-zinc-400">App tự gọi tên & điều phối lượt chơi</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lucky Spin / Bottle Wheel Button */}
        {players.length >= 2 && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <Dice5 className="w-4 h-4 text-amber-400 animate-spin" />
                Vòng Xoay May Mắn (Ai Bị Phạt / Ai Làm Dare?)
              </span>
              <button
                type="button"
                onClick={handleLuckySpin}
                disabled={isRolling}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>{isRolling ? 'Đang quay...' : 'Quay Ngay 🎲'}</span>
              </button>
            </div>

            {luckyWinner && (
              <div className="text-center py-2 px-3 rounded-xl bg-black/40 border border-amber-500/40 text-amber-300 font-black text-sm flex items-center justify-center gap-1.5 animate-bounce">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Người được chọn: </span>
                <span className="text-white bg-amber-500/40 px-2 py-0.5 rounded-lg border border-amber-500/50">
                  {luckyWinner} 👑
                </span>
              </div>
            )}
          </div>
        )}

        {/* Input Add Player */}
        <div className="space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPlayer();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nhập tên người chơi (VD: Nam, Trang...)"
              maxLength={20}
              className="flex-1 px-3.5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!newPlayerName.trim()}
              className={`px-4 py-3 rounded-2xl font-bold text-sm flex items-center gap-1 transition-all ${
                newPlayerName.trim()
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 active:scale-95 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Thêm</span>
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-zinc-500 font-medium">Gợi ý nhanh:</span>
            {DEFAULT_SUGGESTIONS.filter((s) => !players.includes(s))
              .slice(0, 5)
              .map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleAddPlayer(name)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors active:scale-95 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-zinc-500" />
                  <span>{name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span>Thứ tự lượt chơi</span>
            {players.length > 0 && (
              <button
                type="button"
                onClick={() => onUpdatePlayers([])}
                className="text-rose-400 hover:text-rose-300 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Xóa tất cả
              </button>
            )}
          </div>

          {players.length === 0 ? (
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 text-center space-y-1">
              <p className="text-xs text-zinc-400 font-medium">
                Chưa có tên người chơi nào.
              </p>
              <p className="text-[11px] text-zinc-500">
                App sẽ chơi theo chế độ <strong>Chuyền tay tự do</strong>. Hãy thêm tên nếu muốn app tự điều phối lượt!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players.map((player, idx) => {
                const isCurrent = idx === currentPlayerIndex % players.length;
                return (
                  <div
                    key={player}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-indigo-500/80 bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/40'
                        : 'border-zinc-800/90 bg-zinc-900/60 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isCurrent
                            ? 'bg-indigo-500 text-white shadow-sm'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {isCurrent ? <Crown className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className="font-bold text-sm truncate">{player}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                          Lượt này
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(player)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Xóa người chơi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Done Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-zinc-100 hover:bg-white text-zinc-950 font-black text-sm transition-all shadow-md active:scale-98 cursor-pointer mt-1"
        >
          Xong & Tiếp Tục Chơi
        </button>
      </div>
    </div>
  );
}

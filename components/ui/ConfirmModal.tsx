'use client';

import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'amber';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'amber',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700';
      case 'warning':
        return 'from-amber-500 to-yellow-600 text-black hover:from-amber-400 hover:to-yellow-500';
      default:
        return 'from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-amber-200 text-base">{title}</h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800/80">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="text-xs border-zinc-800 px-4 py-2"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            className={`text-xs font-bold px-5 py-2 uppercase tracking-wider bg-gradient-to-r ${getVariantStyles()}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
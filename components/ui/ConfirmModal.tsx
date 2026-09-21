'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-amber-500/30 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl text-center space-y-4">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div>
          <h3 className="text-lg font-serif font-bold text-amber-200">{title}</h3>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1 text-xs py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 text-xs py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
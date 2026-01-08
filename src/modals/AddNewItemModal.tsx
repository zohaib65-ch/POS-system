import React from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-400 text-2xl">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

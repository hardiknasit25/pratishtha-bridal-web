import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "delete" | "warning" | "info";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  type = "delete",
}) => {
  const getIcon = () => {
    switch (type) {
      case "delete":
        return <Trash2 className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-blue-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "delete":
        return "bg-red-500 hover:bg-red-600 focus:ring-red-500";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500";
      default:
        return "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-50 border border-red-200">
              {getIcon()}
            </div>
          </div>
          <AlertDialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2">
          <AlertDialogCancel className="w-full sm:w-auto order-2 sm:order-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`w-full sm:w-auto order-1 sm:order-2 text-white font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

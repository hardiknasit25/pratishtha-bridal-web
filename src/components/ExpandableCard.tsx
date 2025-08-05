import { useState } from "react";
import { ChevronDown, ChevronUp, Edit, Trash2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpandableCardProps {
  title: string;
  subtitle: string;
  price: string;
  children?: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onDownloadPDF?: () => void;
}

export const ExpandableCard = ({
  title,
  subtitle,
  price,
  children,
  onEdit,
  onDelete,
  onDownloadPDF,
}: ExpandableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="w-full bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer rounded-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              <p className="text-gray-600 text-sm">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-pink-600 font-semibold text-lg">
                ₹{price}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {children}

                  {(onEdit || onDelete || onDownloadPDF) && (
                    <div className="flex gap-2 mt-4">
                      {onDownloadPDF && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadPDF();
                          }}
                          className="flex items-center justify-center gap-2 px-3 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          PDF
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

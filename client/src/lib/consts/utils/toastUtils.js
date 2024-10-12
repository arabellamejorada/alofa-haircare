// toastUtils.js (or place this in your component file if you prefer)
import { toast } from "sonner";

// Define default styles for different types of toasts
const toastStyles = {
  success: {
    backgroundColor: "#4ade80", // Tailwind class equivalent: bg-green-400
    color: "#ffffff",
  },
  error: {
    backgroundColor: "#f87171", // Tailwind class equivalent: bg-red-400
    color: "#ffffff",
  },
  warning: {
    backgroundColor: "#facc15", // Tailwind class equivalent: bg-yellow-400
    color: "#000000",
  },
  info: {
    backgroundColor: "#60a5fa", // Tailwind class equivalent: bg-blue-400
    color: "#ffffff",
  },
};

// Helper function to show a toast with predefined styles
export const showToast = (type, message) => {
  toast(message, {
    style: toastStyles[type] || toastStyles.info,
  });
};

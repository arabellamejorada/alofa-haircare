import React from "react";

const Button = ({ children, variant = "default", ...props }) => {
  return (
    <button
      className={`px-4 py-1 rounded-xl ${
        variant === "outline"
          ? "border border-gray-700"
          : "bg-alofa-pink text-white"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

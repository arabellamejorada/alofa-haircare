import React from "react";

const Button = ({ children, variant = "default", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded ${
        variant === "outline"
          ? "border border-gray-700"
          : "bg-blue-500 text-white"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

import React from "react";

const AccountCard = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-2xl w-[26rem]">{children}</div>
    </div>
  );
};

export default AccountCard;

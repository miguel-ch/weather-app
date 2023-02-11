import React, { memo } from "react";

const GenericCard = ({ logo, title, text }) => {
  return (
    <div className="bg-slate-700 flex flex-row rounded-xl shadow-lg mb-6 sm:mb-0 bg-secondary-light dark:bg-ternary-dark">
      <div className="flex-auto p-6">
        <img className="w-28 h-28 mx-auto" src={logo} alt="logo" />
      </div>

      <div className="flex-auto flex flex-col justify-center items-center p-6 text-white">
        <b className="text-xl opacity-50">{title}</b>
        <p className="text-3xl opacity-80">{text}</p>
      </div>
    </div>
  );
};

export default memo(GenericCard);

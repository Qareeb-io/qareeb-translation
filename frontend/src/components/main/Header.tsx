import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-light-primary dark:bg-dark-primary text-light-surface py-4 px-6 shadow-md flex items-center justify-between">
      <h1 className="flex flex-col md:flex-row font-bold">
        <span className="text-3xl mr-2">Qareeb</span>
        <span className="text-1xl md:text-2xl mt-1">Translation Manager</span>
      </h1>
    </header>
  );
};

export default Header;

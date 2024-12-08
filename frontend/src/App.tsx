import React from "react";
import Header from "./components/main/Header";
import Main from "./components/main/Main";
import ProjectHeader from "./components/main/ProjectHeader";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light-background dark:bg-dark-background">
      <Header />
      <div className="mt-4">
        <ProjectHeader />
      </div>
      <Main />
    </div>
  );
};

export default App;

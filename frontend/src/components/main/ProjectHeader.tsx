import React from "react";

const ProjectHeader: React.FC = () => {
  const project = {
    name: "Wizabot",
  };

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text-primary dark:text-dark-text-primary py-4 px-6 shadow-md">
      <h1 className="text-4xl font-bold">{project.name}</h1>
    </div>
  );
};

export default ProjectHeader;

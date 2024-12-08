import React from "react";

interface CustomButtonProps {
  onClick: () => void;
  text: string;
  icon: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onClick,
  text,
  icon,
  className,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-11 w-40 items-center justify-center gap-2 rounded-lg p-6 py-5 text-center transition-colors dark:bg-dark-primary dark:text-dark-text-primary dark:hover:bg-dark-accentPrimary
          bg-light-primary text-light-surface hover:bg-light-accentPrimary" ${className}`}
    >
      {icon}
      <span className="mb-1"> {text}</span>
    </button>
  );
};

export default CustomButton;

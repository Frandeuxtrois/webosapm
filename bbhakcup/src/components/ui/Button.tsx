import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300";
  
  const variants = {
    primary: "border-transparent text-white bg-celeste hover:bg-azul focus:ring-celeste",
    secondary: "border-transparent text-white bg-azul hover:bg-opacity-90 focus:ring-azul",
    outline: "border-celeste text-celeste bg-transparent hover:bg-celeste hover:text-white focus:ring-celeste",
    white: "border-white text-celeste bg-white hover:bg-gray-100 focus:ring-white",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
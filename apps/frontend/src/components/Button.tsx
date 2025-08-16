import React from 'react';

// Define las propiedades (props) que el componente Button puede recibir
interface ButtonProps {
  /**
   * Texto que se mostrará dentro del botón.
   */
  label: string;
  /**
   * Manejador de eventos que se ejecuta al hacer clic en el botón.
   */
  onClick: () => void;
  /**
   * Estilo del botón, por ejemplo 'primary' o 'secondary'.
   */
  styleType?: 'primary' | 'secondary' | 'danger';
  /**
   * Estado deshabilitado del botón.
   */
  disabled?: boolean;
}

/**
 * Componente de botón reutilizable.
 */
export const Button: React.FC<ButtonProps> = ({ label, onClick, styleType = 'primary', disabled = false }) => {
  const baseClasses = "py-2 px-4 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-colors duration-200";

  const styleClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  const disabledClasses = "bg-gray-200 text-gray-500 cursor-not-allowed";

  const finalClasses = disabled
    ? `${baseClasses} ${disabledClasses}`
    : `${baseClasses} ${styleClasses[styleType]}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={finalClasses}
    >
      {label}
    </button>
  );
};
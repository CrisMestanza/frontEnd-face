import React from 'react';
import styles from './extraccion.module.css'; // Asegúrate de tener los estilos personalizados aquí

const ModalLimpieza = ({ isOpen, closeModal }) => {
  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada.

  return (
    <div className={`${styles.modalOverlay} fixed inset-0 flex justify-center items-center`}>
      <div className={`${styles.modalContent} bg-white w-96 p-8 rounded-lg shadow-2xl relative transform transition-all duration-500`}>

        <h2 className="text-3xl font-bold text-center text-teal-500 mb-4 animate__animated animate__fadeIn">¡Operación Exitosa!</h2>
        <p className="text-gray-700 text-lg mb-6 text-center animate__animated animate__fadeIn">La extraccion de las personas se hizo correctamente</p>

        <div className="flex justify-center">
          <button
            onClick={closeModal}
            className={`${styles.buttonAddModal} py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors duration-300`}
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLimpieza;

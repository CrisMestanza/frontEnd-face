import React from "react";

const ModalEliminar = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div style={{
                background: 'white', padding: '2rem', borderRadius: '8px', textAlign: 'center'
            }}>
                <h2>¿Estás seguro de eliminar?</h2>
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={onConfirm}
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            marginRight: '10px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#3498db'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
                    >
                        Sí
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                        No
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ModalEliminar;

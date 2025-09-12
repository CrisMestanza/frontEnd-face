// hooks/useAlertas.js
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function useAlertas() {
  const [alertas, setAlertas] = useState([]);
  const prevAlertasRef = useRef([]);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get('https://alerta-serenazgo-mpsm.onrender.com/api/alertas/listar/')
        .then(res => {
          if (isFirstLoad.current) {
            // Primera vez: solo guarda y no notifica
            prevAlertasRef.current = res.data;
            setAlertas(res.data);
            isFirstLoad.current = false;
            return;
          }

          const nuevas = res.data.filter(nueva =>
            !prevAlertasRef.current.some(existente => existente.id === nueva.id)
          );

          if (nuevas.length > 0) {
            nuevas.forEach(nueva => {
              toast.info(`🚨 Nueva alerta: ${nueva.emergency_type}`, {
                position: "top-right",
                autoClose: 5000
              });

              const audio = new Audio('/sounds/alert.mp3');
              audio.play().catch(() => console.log("Autoplay bloqueado"));
            });

            prevAlertasRef.current = [...nuevas, ...prevAlertasRef.current];
            setAlertas(prev => [...nuevas, ...prev]);
          }
        })
        .catch(err => console.error("Error revisando nuevas alertas:", err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return alertas;
}

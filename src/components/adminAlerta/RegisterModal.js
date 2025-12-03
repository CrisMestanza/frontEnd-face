import React, { useState, useEffect, useCallback } from "react";
import FloatingLabelInput from "./FloatingLabelInput";
import "./RegisterModal.css";

// Definir constantes para roles y zonas para mejor legibilidad y mantenimiento
const USER_ROLES = {
  SERENO: "sereno",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
};

const ZONAS = ["Tarapoto", "Morales", "Banda"];

const RegisterModal = ({
  isOpen,
  onClose,
  userRole,
  preselectedRole,
  adminZona,
}) => {
  const [formData, setFormData] = useState({
    dni: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: preselectedRole || USER_ROLES.SERENO,
    numero: "",
    zona: "",
  });

  const [errors, setErrors] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado de carga
  const token = localStorage.getItem("token");

  // Función para obtener una cookie por nombre
  // const getCookie = (name) => {
  //   let cookieValue = null;
  //   if (document.cookie && document.cookie !== "") {
  //     const cookies = document.cookie.split(";");
  //     for (let i = 0; i < cookies.length; i++) {
  //       const cookie = cookies[i].trim();
  //       if (cookie.substring(0, name.length + 1) === name + "=") {
  //         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
  //         break;
  //       }
  //     }
  //   }
  //   return cookieValue;
  // };

  // Función de validación memoizada para campos individuales
  // Esta función ahora solo devuelve el mensaje de error, no actualiza el estado `errors` directamente
  const validateField = useCallback((field, value) => {
    let message = "";
    switch (field) {
      case "dni":
        if (!value.trim()) {
          message = "DNI es requerido";
        } else if (!/^\d{8,10}$/.test(value)) {
          message = "DNI debe tener solo números (8 a 10 dígitos)";
        }
        break;
      case "first_name":
        if (!value.trim()) {
          message = "Nombre(s) es requerido";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          message = "Solo letras y espacios permitidos";
        }
        break;
      case "last_name":
        if (!value.trim()) {
          message = "Apellido(s) es requerido";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          message = "Solo letras y espacios permitidos";
        }
        break;
      case "email":
        if (!value.trim()) {
          message = "Correo electrónico es requerido";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          message = "Correo electrónico inválido";
        }
        break;
      case "password":
        if (!value.trim()) {
          message = "Contraseña es requerida";
        } else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value)) {
          message = "Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo";
        }
        break;
      case "numero":
        if (!value.trim()) {
          message = "Número de teléfono es requerido";
        } else if (!/^\d{9}$/.test(value)) {
          message = "Número debe tener 9 dígitos";
        }
        break;
      case "zona":
        if (!value.trim()) {
          message = "Zona es requerida";
        }
        break;
      case "role":
        if (!value.trim()) {
          message = "Rol es requerido";
        }
        break;
      default:
        break;
    }
    return message;
  }, []); // Dependencias vacías, ya que las regex y strings estáticos no cambian

  // Efecto para obtener CSRF token y para inicializar el rol y la zona del formulario
  useEffect(() => {
    const fetchCsrfInitial = async () => {
      try {
        const response = await fetch(
          "https://alerta-serenazgo-mpsm.onrender.com/api/get-csrf/",
          { method: "GET", credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.csrfToken) {
            setCsrfToken(data.csrfToken); // úsalo desde el JSON
            // console.log("CSRF token recibido:", data.csrfToken);
          } else {
            console.warn("Respuesta sin csrfToken en JSON");
          }
        }
      } catch (error) {
        console.error("Error obteniendo CSRF token inicialmente:", error);
      }
    };
    fetchCsrfInitial();

    let initialRole = preselectedRole || USER_ROLES.SERENO;
    let initialZona = "";

    if (userRole === USER_ROLES.ADMIN && initialRole === USER_ROLES.SERENO) {
      initialZona = adminZona || "";
    } else {
      initialZona = "";
    }

    setFormData((prev) => ({
      ...prev,
      role: initialRole,
      zona: initialZona,
    }));
    setErrors({});
    setSubmissionError(""); // Limpiar errores al abrir
  }, [preselectedRole, isOpen, userRole, adminZona]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, [field]: value };
      const fieldError = validateField(field, value, updatedFormData);

      let confirmPasswordError = prev.confirmPassword; // Mantener el error previo de confirmación

      // Lógica de validación para contraseñas, que afecta a ambos campos
      if (field === "password" || field === "confirmPassword") {
        if (
          updatedFormData.password &&
          updatedFormData.confirmPassword &&
          updatedFormData.password !== updatedFormData.confirmPassword
        ) {
          confirmPasswordError = "Las contraseñas no coinciden";
        } else {
          confirmPasswordError = ""; // Limpiar si ahora coinciden
        }
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: fieldError,
        confirmPassword: confirmPasswordError, // Siempre actualizar confirmPassword
      }));

      return updatedFormData;
    });
  };

  const validateForm = () => {
    let formErrors = {};
    const {
      dni,
      first_name,
      last_name,
      email,
      password,
      confirmPassword,
      numero,
      zona,
      role,
    } = formData;

    // Validar todos los campos usando la función auxiliar
    formErrors.dni = validateField("dni", dni, formData);
    formErrors.first_name = validateField("first_name", first_name, formData);
    formErrors.last_name = validateField("last_name", last_name, formData);
    formErrors.email = validateField("email", email, formData);
    formErrors.password = validateField("password", password, formData);
    formErrors.numero = validateField("numero", numero, formData);
    formErrors.zona = validateField("zona", zona, formData);
    formErrors.role = validateField("role", role, formData);

    // Validación específica para la confirmación de contraseña
    if (password !== confirmPassword) {
      formErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Filtrar mensajes de error vacíos
    const filteredErrors = Object.keys(formErrors).reduce((acc, key) => {
      if (formErrors[key]) {
        acc[key] = formErrors[key];
      }
      return acc;
    }, {});

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();

    setSubmissionError(""); // Limpiar errores de envío previos

    if (!validateForm()) {
      setSubmissionError(
        "Por favor, corrige los errores en el formulario antes de enviar."
      );
      return;
    }

    // if (!csrfToken) {
    //   setSubmissionError(
    //     "No se pudo obtener el token CSRF. Recarga la página y vuelve a intentar."
    //   );
    //   return;
    // }

    setIsLoading(true); // Activar estado de carga

    // Determinar el endpoint de la API basado en el rol a registrar
    let apiEndpoint = "";
    if (formData.role === USER_ROLES.ADMIN) {
      apiEndpoint = "crear-admin/";
    } else if (formData.role === USER_ROLES.SERENO) {
      apiEndpoint = "crear-sereno/";
    } else if (formData.role === USER_ROLES.SUPERADMIN) {
      apiEndpoint = "crear-superadmin/"; // Asumiendo que este endpoint existe en tu backend
    } else {
      setSubmissionError("Rol de usuario no válido para registrar.");
      setIsLoading(false);
      return;
    }

    // Generar un username básico (ej. concatenación de nombre y apellido sin espacios)
    // ADVERTENCIA: Asegúrate de que esta lógica de generación de username sea única y consistente con tu backend.
    // Si tu backend espera un username estrictamente único, podrías necesitar una verificación adicional
    // o que el usuario ingrese un username explícitamente.
    const generatedUsername =
      `${formData.first_name.toLowerCase()}${formData.last_name.toLowerCase()}`.replace(
        /\s/g,
        ""
      );

    const dataToSend = {
      dni: formData.dni,
      username: generatedUsername, // Usar el username generado
      first_name: formData.first_name, // Enviar first_name
      last_name: formData.last_name, // Enviar last_name
      email: formData.email,
      password: formData.password,
      role: formData.role,
      numero: formData.numero,
      zona: formData.zona,
    };

    try {
      const response = await fetch(
        `https://alerta-serenazgo-mpsm.onrender.com/api/${apiEndpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(dataToSend),
          credentials: "include",
        }
      );
      console.log("Usando endpoint:", apiEndpoint);

      const contentType = response.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(
          `Respuesta no JSON del servidor: ${errorText.substring(0, 200)}...`
        );
      }

      if (response.ok) {
        alert("✅ Usuario registrado correctamente."); // Considera una notificación UI más amigable
        handleClose();
      } else {
        if (response.status === 400) {
          const backendErrors = {};
          for (const key in responseData) {
            // Mapea errores de backend a nombres de campos de frontend
            if (
              key === "username" &&
              responseData[key][0].includes(
                "may contain only letters, numbers, and"
              )
            ) {
              // Si el error es sobre el formato del username y no un problema de unicidad,
              // significa que la generación del username puede no ser compatible con el backend.
              // Podrías mostrar un mensaje genérico o ajustar la lógica de generación.
              backendErrors.email =
                "El nombre de usuario generado no es válido para el sistema.";
            } else {
              backendErrors[key] = responseData[key][0]; // Toma el primer error
            }
          }
          setErrors((prev) => ({ ...prev, ...backendErrors }));
          setSubmissionError("Por favor, revisa los errores en el formulario.");
        } else if (response.status === 403) {
          setSubmissionError(
            "Acceso denegado. No tienes permisos para realizar esta acción o el token CSRF es inválido."
          );
        } else {
          setSubmissionError(
            responseData.detail || "Error al registrar el usuario."
          );
        }
        console.error("Error al registrar:", responseData);
      }
    } catch (error) {
      console.error("Error de red o servidor:", error);
      setSubmissionError(
        `Error al conectar con el servidor: ${error.message}. Inténtalo de nuevo.`
      );
    } finally {
      setIsLoading(false); // Desactivar estado de carga
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setFormData({
        dni: "",
        first_name: "", // Reiniciar nombres
        last_name: "", // Reiniciar apellidos
        email: "",
        password: "",
        confirmPassword: "",
        role: preselectedRole || USER_ROLES.SERENO, // Restablecer a rol preseleccionado o sereno
        numero: "",
        zona: "",
      });
      setErrors({});
      setSubmissionError("");
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const isRoleSelectorDisabled = userRole !== USER_ROLES.SUPERADMIN;

  const isZonaSelectorDisabled =
    userRole === USER_ROLES.ADMIN && formData.role === USER_ROLES.SERENO;

  return (
    <div className="modal-overlay">
      <div
        className={`modal-container ${isClosing ? "slide-out" : "slide-in"}`}
      >
        <button className="close-icon" onClick={handleClose}>
          ×
        </button>
        <h2>Crear Cuenta de Usuario</h2>
        {submissionError && (
          <p className="error-text server-error-message">{submissionError}</p>
        )}
        <form onSubmit={handleRegistrar}>
          <div className="form-field">
            <FloatingLabelInput
              label="DNI"
              value={formData.dni}
              onChange={(e) => handleChange("dni", e.target.value)}
              type="text"
              maxLength="10"
            />
            {errors.dni && <p className="error-text">{errors.dni}</p>}
          </div>

          <div className="form-field">
            <FloatingLabelInput
              label="Nombre(s)"
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              type="text"
            />
            {errors.first_name && (
              <p className="error-text">{errors.first_name}</p>
            )}
          </div>
          <div className="form-field">
            <FloatingLabelInput
              label="Apellido(s)"
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              type="text"
            />
            {errors.last_name && (
              <p className="error-text">{errors.last_name}</p>
            )}
          </div>

          <div className="form-field">
            <FloatingLabelInput
              label="Correo Electrónico"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          <div className="form-field">
            <FloatingLabelInput
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>
          <div className="form-field">
            <FloatingLabelInput
              label="Confirmar Contraseña"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="form-field">
            <FloatingLabelInput
              label="Número de Teléfono"
              value={formData.numero}
              onChange={(e) => handleChange("numero", e.target.value)}
              type="tel"
              maxLength="9"
            />
            {errors.numero && <p className="error-text">{errors.numero}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="role-select" className="floating-label active">
              Rol
            </label>
            <select
              id="role-select"
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className="select-input"
              disabled={isRoleSelectorDisabled}
            >
              {userRole === USER_ROLES.SUPERADMIN ? (
                <>
                  <option value="">Selecciona un Rol</option>
                  <option value={USER_ROLES.SERENO}>Sereno</option>
                  <option value={USER_ROLES.ADMIN}>Administrador</option>
                  <option value={USER_ROLES.SUPERADMIN}>SuperAdmin</option>
                </>
              ) : (
                <option value={USER_ROLES.SERENO}>Sereno</option>
              )}
            </select>
            {errors.role && <p className="error-text">{errors.role}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="zona-select" className="floating-label active">
              Zona
            </label>
            <select
              id="zona-select"
              value={formData.zona}
              onChange={(e) => handleChange("zona", e.target.value)}
              className="select-input"
              disabled={isZonaSelectorDisabled}
            >
              <option value="">Selecciona una Zona</option>
              {ZONAS.map((zona) => (
                <option key={zona} value={zona}>
                  {zona}
                </option>
              ))}
            </select>
            {errors.zona && <p className="error-text">{errors.zona}</p>}
          </div>
          <button type="submit" className="send-btn" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar Usuario"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;

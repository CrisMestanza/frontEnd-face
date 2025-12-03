import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "../aside/aside";

import {
  Users,
  Bell,
  Camera,
  Settings,
  PlusCircle,
  Trash2,
  Edit,
  UserPlus,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  FileText,
  Search,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import RegisterModal from "./RegisterModal";
import ConfirmationModal from "./ConfirmationModal";
import DashboardCard from "./DashboardCard";
import ConvertUsersModal from "./ConvertUsersModal";
import CameraRegisterModal from "./CameraRegisterModal";
import "./SuperAdminDashboard.css";
import "./CommonDashboardStyles.css";

const SuperAdmin = ({ userRole, adminZona }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const actualUserRole = userRole || user?.rol;
  console.log("🔑 Props recibidos - userRole:", userRole, "adminZona:", adminZona);
  console.log("🔑 localStorage user:", user);
  console.log("🔑 actualUserRole final:", actualUserRole);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [serenos, setSerenos] = useState([]);
  const [generalUsers, setGeneralUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [appVersions, setAppVersions] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState(null);
  const [alertSummary, setAlertSummary] = useState(null);
  const [alertSummaryDash, setAlertSummaryDash] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);

  const [selectedGeneralUsers, setSelectedGeneralUsers] = useState([]);

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isSticky, setSticky] = useState(false);
  const tabsRef = useRef(null);
  const initialOffset = useRef(0);
  const [placeholderHeight, setPlaceholderHeight] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const SCROLL_BUFFER = 10;
  const [visibleDescriptionId, setVisibleDescriptionId] = useState(null);
  const [showAllAdmins, setShowAllAdmins] = useState(false);
  const [showAllSerenosT, setShowAllSerenosT] = useState(false);
  const [showAllSerenosM, setShowAllSerenosM] = useState(false);
  const [showAllSerenosB, setShowAllSerenosB] = useState(false);
  const [showAllGeneral, setShowAllGeneral] = useState(false);

  // Filtra los serenos por zona
  const serenosTarapoto = serenos.filter((user) => user.zona === "Tarapoto");
  const serenosMorales = serenos.filter((user) => user.zona === "Morales");
  const serenosBanda = serenos.filter((user) => user.zona === "Banda");

  // Filtra todos los usuarios por el término de búsqueda
  const filteredAdmins = admins.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSerenosT = serenosTarapoto.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSerenosM = serenosMorales.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSerenosB = serenosBanda.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredGeneralUsers = generalUsers.filter((user) =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDescription = (id) => {
    if (visibleDescriptionId === id) {
      setVisibleDescriptionId(null);
    } else {
      setVisibleDescriptionId(id);
    }
  };

  // Determina qué usuarios mostrar según el estado "ver más"
  const visibleAdmins = showAllAdmins
    ? filteredAdmins
    : filteredAdmins.slice(0, 10);
  const visibleSerenosT = showAllSerenosT
    ? filteredSerenosT
    : filteredSerenosT.slice(0, 10);
  const visibleSerenosM = showAllSerenosM
    ? filteredSerenosM
    : filteredSerenosM.slice(0, 10);
  const visibleSerenosB = showAllSerenosB
    ? filteredSerenosB
    : filteredSerenosB.slice(0, 10);
  const visibleGeneralUsers = showAllGeneral
    ? [...filteredGeneralUsers].sort((a, b) => b.dni - a.dni)
    : [...filteredGeneralUsers].sort((a, b) => b.dni - a.dni).slice(0, 10);

  const [loading, setLoading] = useState({
    serenos: false,
    generalUsers: false,
    alerts: false,
    cameras: false,
    appVersions: false,
    delete: false,
    admins: false,
    convert: false,
    dashboardStats: false,
    alertSummary: false,
  });
  const [error, setError] = useState({
    serenos: null,
    generalUsers: null,
    alerts: null,
    cameras: null,
    appVersions: null,
    delete: null,
    admins: null,
    convert: null,
    dashboardStats: null,
    alertSummary: null,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const handleScroll = () => {
    if (initialOffset.current === 0 && tabsRef.current) {
      const rect = tabsRef.current.getBoundingClientRect();
      initialOffset.current = rect.top + window.scrollY;
      setPlaceholderHeight(rect.height);
    }
    const shouldBeSticky = window.scrollY >= initialOffset.current;
    setSticky(shouldBeSticky);
  };

  useEffect(() => {
    const updateOffsetAndHeight = () => {
      if (tabsRef.current) {
        requestAnimationFrame(() => {
          const rect = tabsRef.current.getBoundingClientRect();
          const newOffset = rect.top + window.scrollY;
          initialOffset.current = newOffset;
          setPlaceholderHeight(rect.height);
        });
      }
    };

    updateOffsetAndHeight();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateOffsetAndHeight);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateOffsetAndHeight);
    };
  }, []);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [preselectedRole, setPreselectedRole] = useState("");
  const [, setSelectedUserToEdit] = useState(null);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const csrfToken = getCookie("csrftoken");

  const fetchData = useCallback(
  async (endpoint, stateSetter, loadingKey, errorKey, queryParams = {}) => {
    setLoading((prev) => ({ ...prev, [loadingKey]: true }));
    setError((prev) => ({ ...prev, [errorKey]: null }));
    const token = localStorage.getItem("tokenalerta");
    
    console.log(`🔵 Iniciando fetch de ${endpoint}`);
    console.log(`   Token disponible:`, token ? "✅ Sí" : "❌ No");
    
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `https://alerta-serenazgo-mpsm.onrender.com/api/${endpoint}${
        queryString ? `?${queryString}` : ""
      }`;

      console.log(`   URL: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          "X-CSRFToken": csrfToken,
          Authorization: `Token ${token}`,
        },
        credentials: "include",
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: response.statusText }));
        console.error(`❌ Error en ${endpoint}:`, errorData);
        throw new Error(
          `Error al obtener ${loadingKey}: ${
            errorData.detail || response.statusText
          }`
        );
      }
      const data = await response.json();
      console.log(`✅ ${endpoint} cargado exitosamente:`, data);
      stateSetter(data);
    } catch (err) {
      console.error(`❌ Error al obtener ${loadingKey}:`, err);
      setError((prev) => ({ ...prev, [errorKey]: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }));
    }
  },
  [csrfToken]
);

  const fetchCameras = useCallback(async () => {
    setLoading((prev) => ({ ...prev, cameras: true }));
    const tokenalerta = localStorage.getItem("tokenalerta");
    try {
      const res = await fetch(
        "https://alerta-serenazgo-mpsm.onrender.com/api/camaras/",
        {
          headers: {
            Authorization: `Token ${tokenalerta}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error al obtener cámaras");
      const data = await res.json();
      setCameras(data);
    } catch (err) {
      setError((prev) => ({ ...prev, cameras: err.message }));
    } finally {
      setLoading((prev) => ({ ...prev, cameras: false }));
    }
  }, []);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  useEffect(() => {
  const tokenalerta = localStorage.getItem("tokenalerta");
  console.log("🟢 useEffect de carga ejecutado");
  console.log("   actualUserRole:", actualUserRole);
  console.log("   tokenalerta:", tokenalerta);
  console.log("   Condición cumplida:", actualUserRole === "superadmin" && !!tokenalerta);
  
  if (actualUserRole === "superadmin" && tokenalerta) {
    console.log("🚀 Iniciando todas las peticiones...");
    fetchData("listar-admins/", setAdmins, "admins", "admins");
    fetchData("listarsereno/", setSerenos, "serenos", "serenos");
    fetchData("listar/", setGeneralUsers, "generalUsers", "generalUsers");
    fetchData(
      "alertas/listar/",
      (data) => {
        const sortedAlerts = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setAlerts(sortedAlerts);
      },
      "alerts",
      "alerts"
    );
    fetchData("camaras/", setCameras, "cameras", "cameras");
    fetchData("app-version/", setAppVersions, "appVersions", "appVersions");
    fetchData(
      "dashboard-stats/",
      setDashboardStats,
      "dashboardStats",
      "dashboardStats"
    );
    fetchData(
      "alertas/resumen/",
      setAlertSummary,
      "alertSummary",
      "alertSummary"
    );
    fetchData(
      "alertas/dashboard/",
      (data) => {
        setDashboardStats((prevStats) => ({
          ...prevStats,
          ...data.resumen,
        }));
        setAlertSummaryDash(data.estadisticas);
      },
      "dashboard",
      "dashboard"
    );
  } else {
    console.warn("⚠️ No se cumplen las condiciones para cargar datos");
    if (!actualUserRole) console.warn("   - actualUserRole no disponible");
    if (actualUserRole !== "superadmin") console.warn("   - Rol no es superadmin, es:", actualUserRole);
    if (!tokenalerta) console.warn("   - tokenalerta no disponible");
  }
}, [actualUserRole, fetchData]);

  const handleOpenRegisterModal = (roleToPreselect) => {
    setPreselectedRole(roleToPreselect);
    setSelectedUserToEdit(null);
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
    setPreselectedRole("");
    setSelectedUserToEdit(null);
    if (userRole === "superadmin") {
      fetchData("listar-admins/", setAdmins, "admins", "admins");
      fetchData("listarsereno/", setSerenos, "serenos", "serenos");
      fetchData("listar/", setGeneralUsers, "generalUsers", "generalUsers");
      fetchData(
        "dashboard-stats/",
        setDashboardStats,
        "dashboardStats",
        "dashboardStats"
      );
    }
  };

  const handleSelectGeneralUser = (dni, isChecked) => {
    setSelectedGeneralUsers((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, dni];
      } else {
        return prevSelected.filter((selectedDni) => selectedDni !== dni);
      }
    });
  };

  const handleOpenConvertModal = () => {
    if (selectedGeneralUsers.length === 0) {
      alert("Por favor, selecciona al menos un usuario para convertir.");
      return;
    }
    setIsConvertModalOpen(true);
  };

  const handleCloseConvertModal = () => {
    setIsConvertModalOpen(false);
  };

  const handleConfirmConversion = async (zona) => {
    setLoading((prev) => ({ ...prev, convert: true }));
    setError((prev) => ({ ...prev, convert: null }));
    handleCloseConvertModal();

    const usersToConvert = selectedGeneralUsers.map((dni) => ({ dni, zona }));
    const tokenalerta = localStorage.getItem("tokenalerta");

    try {
      const response = await fetch(
        "https://alerta-serenazgo-mpsm.onrender.com/api/convertir-a-sereno/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            Authorization: `Token ${tokenalerta}`,
          },
          body: JSON.stringify(usersToConvert),
          credentials: "include",
        }
      );

      const responseData = await response
        .json()
        .catch(() => ({ detail: response.statusText }));

      if (response.ok) {
        alert("✅ Proceso de conversión completado.");
        console.log("Resultados de conversión:", responseData);
        fetchData("listar-admins/", setAdmins, "admins", "admins");
        fetchData("listarsereno/", setSerenos, "serenos", "serenos");
        fetchData("listar/", setGeneralUsers, "generalUsers", "generalUsers");
        fetchData(
          "dashboard-stats/",
          setDashboardStats,
          "dashboardStats",
          "dashboardStats"
        );
        setSelectedGeneralUsers([]);
      } else {
        setError((prev) => ({
          ...prev,
          convert: responseData.detail || "Error en la conversión.",
        }));
        alert(
          `❌ Error al convertir: ${responseData.detail || "Error desconocido"}`
        );
        console.error("Error en la conversión:", responseData);
      }
    } catch (err) {
      console.error("Error de red o servidor durante la conversión:", err);
      setError((prev) => ({
        ...prev,
        convert: `Error al conectar con el servidor: ${err.message}.`,
      }));
      alert(`❌ Error de red: ${err.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, convert: false }));
    }
  };

  const handleDeleteUser = (dni, userType) => {
    setItemToDelete({ id: dni, type: userType, messageType: "user" });
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsConfirmationModalOpen(false);
    const dni = itemToDelete.id;
    const userType = itemToDelete.type;

    setLoading((prev) => ({ ...prev, delete: true }));
    setError((prev) => ({ ...prev, delete: null }));
    const tokenalerta = localStorage.getItem("tokenalerta");

    try {
      let endpoint = "";
      if (userType === "sereno") {
        endpoint = `eliminar-sereno/${dni}/`;
      } else if (userType === "admin") {
        endpoint = `eliminar-admin/${dni}/`;
      } else if (userType === "general_user") {
        endpoint = `eliminar-usuario/${dni}/`;
      } else {
        throw new Error("Tipo de usuario no válido para eliminación.");
      }

      const response = await fetch(
        `https://alerta-serenazgo-mpsm.onrender.com/api/${endpoint}`,
        {
          method: "DELETE",
          headers: {
            "X-CSRFToken": csrfToken,
            Authorization: `Token ${tokenalerta}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `Error al eliminar ${userType}`);
      }

      alert(`✅ ${userType} eliminado correctamente.`);
      if (userType === "sereno") {
        fetchData("listarsereno/", setSerenos, "serenos", "serenos");
      } else if (userType === "admin") {
        fetchData("listar-admins/", setAdmins, "admins", "admins");
      } else if (userType === "general_user") {
        fetchData("listar/", setGeneralUsers, "generalUsers", "generalUsers");
      }
      fetchData(
        "dashboard-stats/",
        setDashboardStats,
        "dashboardStats",
        "dashboardStats"
      );
    } catch (err) {
      console.error(`Error al eliminar ${userType}:`, err);
      setError((prev) => ({ ...prev, delete: err.message }));
      alert(`❌ Error al eliminar: ${err.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmationModalOpen(false);
    setItemToDelete(null);
  };

  // if (userRole !== "superadmin") {
  //   return (
  //     <div className="access-denied-container">
  //       Acceso Denegado: Solo SuperAdmin puede acceder a este panel.
  //     </div>
  //   );
  // }

  const handleDeleteCameraInitiate = (id) => {
    setItemToDelete({
      id: id,
      type: "cámara",
      messageType: "camera",
    });
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmCameraDelete = async () => {
    setIsConfirmationModalOpen(false);
    const { id } = itemToDelete;
    const tokenalerta = localStorage.getItem("tokenalerta");
    try {
      const res = await fetch(
        `https://alerta-serenazgo-mpsm.onrender.com/api/camaras/${id}/delete/`,
        {
          method: "DELETE",
          headers: { Authorization: `Token ${tokenalerta}` },
        }
      );
      if (!res.ok) throw new Error("Error al eliminar cámara");
      setCameras((prev) => prev.filter((c) => c.id !== id));
      alert(`✅ Se elimino correctamente la cámara con ID: ${id}`);
    } catch (err) {
      console.error("Error al eliminar cámara:", err);
      alert(`❌ Error al eliminar cámara: ${err.message}`);
    } finally {
      setItemToDelete(null);
    }
  };

  const handleSaveCameras = async (newCams) => {
    const tokenalerta = localStorage.getItem("tokenalerta");
    try {
      await Promise.all(
        newCams.map((cam) =>
          fetch("https://alerta-serenazgo-mpsm.onrender.com/api/camaras/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${tokenalerta}`,
            },
            body: JSON.stringify({
              nombre: cam.nombre,
              latitud: cam.latitud,
              longitud: cam.longitud,
            }),
          })
        )
      );
      await fetchCameras();
    } catch (error) {
      console.log(error);
      alert("Error al registrar cámaras.");
    }
  };

  const handleOpenCameraRegisterModal = () => {
    setShowModal(true);
  };

  const handleUpdateCamera = async (cam) => {
    const tokenalerta = localStorage.getItem("tokenalerta");
    try {
      const res = await fetch(
        `https://alerta-serenazgo-mpsm.onrender.com/api/camaras/${cam.id}/update/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${tokenalerta}`,
          },
          body: JSON.stringify({
            nombre: cam.nombre,
            latitud: cam.latitud,
            longitud: cam.longitud,
          }),
        }
      );
      if (!res.ok) throw new Error("Error al actualizar cámara");
      await fetchCameras();
    } catch (err) {
      alert(err.message);
    }
  };

  // const filteredGeneralUsers = generalUsers
  //   .filter((user) => !serenos.some((sereno) => sereno.dni === user.dni))
  //   .filter((user) =>
  //     user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  const ZONAS = ["Tarapoto", "Morales", "Banda"];

  const PIE_COLORS_STATUS = ["#ef4444", "#22c55e", "#6b7280"];
  const BAR_COLORS_TYPE = [
    "#3b82f6",
    "#f97316",
    "#8b5cf6",
    "#eab308",
    "#10b981",
  ];

  const getDayName = (dayNumber) => {
    const dayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    return dayNames[dayNumber - 1] || "N/A";
  };

  return (
  <div className={`mainContainer ${isSidebarOpen ? "" : "sidebarClosed"}`}>
    <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

    <div className="content">
      <h1 className="super-admin-dashboard-title">
        Panel de SuperAdministrador
      </h1>
      <div
        className={`tabs-navigation-wrapper ${
          isSticky ? "sticky-wrapper" : ""
        }`}
        style={{
          height: isSticky ? placeholderHeight : "auto",
        }}
      >
        <div
          ref={tabsRef}
          className={`tabs-navigation ${isSticky ? "sticky" : ""}`}
        >
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="tab-icon-text">
              <Settings size={20} className="icon-margin" /> Visión General
            </span>
          </button>
          <button
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            <span className="tab-icon-text">
              <Users size={20} className="icon-margin" /> Gestión de Usuarios
            </span>
          </button>
          <button
            className={`tab-button ${activeTab === "alerts" ? "active" : ""}`}
            onClick={() => setActiveTab("alerts")}
          >
            <span className="tab-icon-text">
              <Bell size={20} className="icon-margin" /> Historial de Alertas
            </span>
          </button>
          <button
            className={`tab-button ${activeTab === "cameras" ? "active" : ""}`}
            onClick={() => setActiveTab("cameras")}
          >
            <span className="tab-icon-text">
              <Camera size={20} className="icon-margin" /> Cámaras
            </span>
          </button>
          <button
            className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span className="tab-icon-text">
              <Settings size={20} className="icon-margin" /> App Config
            </span>
          </button>
        </div>
      </div>
      <div className="content-wrapper">
        {activeTab === "overview" && (
          <div>
            <div className="section-header-with-button">
              <h3 className="section-title">Estadísticas Clave</h3>
            </div>
            {loading.dashboardStats || loading.alertSummary ? (
              <p className="loading-message-text">
                Cargando estadísticas del dashboard...
              </p>
            ) : error.dashboardStats || error.alertSummary ? (
              <p className="error-message-text">
                Error al cargar estadísticas:{" "}
                {error.dashboardStats || error.alertSummary}
              </p>
            ) : (
              <>
                <div className="overview-grid">
                  <DashboardCard
                    title="Total de Serenos"
                    value={dashboardStats?.total_serenos || 0}
                    icon={<Users />}
                    textColor="text-blue"
                  />
                  <DashboardCard
                    title="Total de Administradores"
                    value={dashboardStats?.total_administradores || 0}
                    icon={<Users />}
                    textColor="text-blue"
                  />
                  <DashboardCard
                    title="Total de SuperAdmin"
                    value={dashboardStats?.total_superadmins || 0}
                    icon={<Users />}
                    textColor="text-blue"
                  />
                  <DashboardCard
                    title="Total de Usuarios (App)"
                    value={dashboardStats?.total_usuarios_app || 0}
                    icon={<Users />}
                    textColor="text-blue"
                  />
                  <DashboardCard
                    title="Alertas Activas"
                    value={dashboardStats?.total_alertas_activas || 0}
                    icon={<Bell />}
                    textColor="text-blue"
                  />
                  <DashboardCard
                    title="Total de Alertas"
                    value={dashboardStats?.total_alertas || 0}
                    icon={<Bell />}
                    textColor="text-blue"
                  />
                  <DashboardCard
                    title="Cámaras Registradas"
                    value={dashboardStats?.total_camaras || 0}
                    icon={<Camera />}
                    textColor="text-blue"
                  />
                  <DashboardCard
                    title="Versión Android"
                    value={appVersions?.android_version || "N/A"}
                    icon={<Settings />}
                    textColor="text-blue"
                  />
                </div>
                <h4 className="subsection-title">Análisis de Alertas</h4>
                <div className="charts-grid">
                  {" "}
                  <div className="chart-container">
                    <h5>Alertas por Estado</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={alertSummary?.resumen_por_estado || []}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={(entry) => `${entry.status} (${entry.count})`}
                        >
                          {alertSummary?.resumen_por_estado?.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-status-${index}`}
                                fill={
                                  PIE_COLORS_STATUS[
                                    index % PIE_COLORS_STATUS.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-container">
                    <h5>Alertas por Tipo de Emergencia</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={alertSummary?.resumen_por_tipo || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="emergency_type"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8">
                          {alertSummary?.resumen_por_tipo?.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-type-${index}`}
                                fill={
                                  BAR_COLORS_TYPE[
                                    index % BAR_COLORS_TYPE.length
                                  ]
                                }
                              />
                            )
                          )}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                ...
                <h4 className="subsection-title">
                  Análisis de Alertas Adicional
                </h4>
                <div className="charts-grid-extra">
                  <div className="chart-container">
                    <h5>Alertas por Zona</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={alertSummaryDash?.emergencias_por_zona || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="zona" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-container">
                    <h5>Alertas por Hora del Día</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={alertSummaryDash?.emergencias_por_hora || []}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hora" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-container">
                    <h5>Día de la Semana con Más Alertas</h5>
                    <p className="chart-info-text">
                      El día con más alertas es el{" "}
                      <b>
                        {getDayName(
                          alertSummaryDash?.dia_semana_top?.dia_semana
                        )}
                      </b>{" "}
                      con un total de{" "}
                      <b>{alertSummaryDash?.dia_semana_top?.count}</b> alertas.
                    </p>
                  </div>
                  <div className="chart-container">
                    <h5>Estadísticas Diarias</h5>
                    <p className="chart-info-text">
                      Promedio diario de alertas:{" "}
                      <b>{alertSummaryDash?.promedio_diario}</b>
                    </p>
                    <p className="chart-info-text">
                      Día con menos alertas:{" "}
                      <b>{alertSummaryDash?.minimo_dia?.fecha}</b> con{" "}
                      <b>{alertSummaryDash?.minimo_dia?.count}</b> alertas.
                    </p>
                    <p className="chart-info-text">
                      Día con más alertas:{" "}
                      <b>{alertSummaryDash?.maximo_dia?.fecha}</b> con{" "}
                      <b>{alertSummaryDash?.maximo_dia?.count}</b> alertas.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            {/* BUSCADOR GENERAL MOVido Arriba */}
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <Search size={20} className="search-icon" />
            </div>

            <h3 className="section-title">
              Gestión de Usuarios
              <div className="action-buttons-group">
                <button
                  className="action-button green"
                  onClick={() => handleOpenRegisterModal("admin")}
                >
                  <PlusCircle size={18} className="icon-margin" />
                  Registrar Administrador
                </button>
                <button
                  className="action-button blue"
                  onClick={() => handleOpenRegisterModal("sereno")}
                >
                  <PlusCircle size={18} className="icon-margin" />
                  Registrar Sereno
                </button>
                <button
                  className="action-button orange"
                  onClick={handleOpenConvertModal}
                  disabled={
                    selectedGeneralUsers.length === 0 || loading.convert
                  }
                >
                  {loading.convert ? (
                    "Convirtiendo..."
                  ) : (
                    <>
                      <UserPlus size={18} className="icon-margin" />
                      Convertir a Sereno ({selectedGeneralUsers.length})
                    </>
                  )}
                </button>
              </div>
            </h3>

            {error.delete && (
              <p className="error-message-text">{error.delete}</p>
            )}
            {loading.delete && (
              <p className="loading-message-text">Eliminando usuario...</p>
            )}
            {error.convert && (
              <p className="error-message-text">{error.convert}</p>
            )}
            {loading.convert && (
              <p className="loading-message-text">
                Convirtiendo usuarios a serenos...
              </p>
            )}

            {/* TABLA DE ADMINISTRADORES */}
            <h4 className="subsection-title">Usuarios Administradores</h4>
            {loading.admins ? (
              <p className="loading-message-text">
                Cargando administradores...
              </p>
            ) : error.admins ? (
              <p className="error-message-text">Error: {error.admins}</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>DNI</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Zona</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleAdmins.length > 0 ? (
                      visibleAdmins.map((user) => (
                        <tr key={user.dni}>
                          <td>{user.dni}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.zona || "N/A"}</td>
                          <td className="actions-cell">
                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteUser(user.dni, "admin")
                              }
                              disabled={loading.delete}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data-message">
                          No hay administradores registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Botón Ver Más */}
                {filteredAdmins.length > 10 && !showAllAdmins && (
                  <button
                    onClick={() => setShowAllAdmins(true)}
                    className="ver-mas-button"
                  >
                    Ver más administradores
                  </button>
                )}
              </div>
            )}

            {/* TABLA DE SERENOS TARAPOTO */}
            <h4 className="subsection-title">Usuarios de Serenazgo Tarapoto</h4>
            {loading.serenos ? (
              <p className="loading-message-text">Cargando serenos...</p>
            ) : error.serenos ? (
              <p className="error-message-text">Error: {error.serenos}</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>DNI</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Zona</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSerenosT.length > 0 ? (
                      visibleSerenosT.map((user) => (
                        <tr key={user.dni}>
                          <td>{user.dni}</td>
                          <td>{user.username}</td>
                          <td>{user.role}</td>
                          <td>{user.zona || "N/A"}</td>
                          <td className="actions-cell">
                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteUser(user.dni, "sereno")
                              }
                              disabled={loading.delete}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data-message">
                          No hay serenos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Botón Ver Más */}
                {filteredSerenosT.length > 10 && !showAllSerenosT && (
                  <button
                    onClick={() => setShowAllSerenosT(true)}
                    className="ver-mas-button"
                  >
                    Ver más serenos de Tarapoto
                  </button>
                )}
              </div>
            )}

            {/* TABLA DE SERENOS MORALES */}
            <h4 className="subsection-title">Usuarios de Serenazgo Morales</h4>
            {loading.serenos ? (
              <p className="loading-message-text">Cargando serenos...</p>
            ) : error.serenos ? (
              <p className="error-message-text">Errore: {error.serenos}</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>DNI</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Zona</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSerenosM.length > 0 ? (
                      visibleSerenosM.map((user) => (
                        <tr key={user.dni}>
                          <td>{user.dni}</td>
                          <td>{user.username}</td>
                          <td>{user.role}</td>
                          <td>{user.zona || "N/A"}</td>
                          <td className="actions-cell">
                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteUser(user.dni, "sereno")
                              }
                              disabled={loading.delete}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data-message">
                          No hay serenos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Botón Ver Más */}
                {filteredSerenosM.length > 10 && !showAllSerenosM && (
                  <button
                    onClick={() => setShowAllSerenosM(true)}
                    className="ver-mas-button"
                  >
                    Ver más serenos de Morales
                  </button>
                )}
              </div>
            )}

            {/* TABLA DE SERENOS BANDA DE SHILCAYO */}
            <h4 className="subsection-title">
              Usuarios de Serenazgo Banda de Shilcayo
            </h4>
            {loading.serenos ? (
              <p className="loading-message-text">Cargando serenos...</p>
            ) : error.serenos ? (
              <p className="error-message-text">Error: {error.serenos}</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>DNI</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Zona</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSerenosB.length > 0 ? (
                      visibleSerenosB.map((user) => (
                        <tr key={user.dni}>
                          <td>{user.dni}</td>
                          <td>{user.username}</td>
                          <td>{user.role}</td>
                          <td>{user.zona || "N/A"}</td>
                          <td className="actions-cell">
                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteUser(user.dni, "sereno")
                              }
                              disabled={loading.delete}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data-message">
                          No hay serenos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Botón Ver Más */}
                {filteredSerenosB.length > 10 && !showAllSerenosB && (
                  <button
                    onClick={() => setShowAllSerenosB(true)}
                    className="ver-mas-button"
                  >
                    Ver más serenos de Banda de Shilcayo
                  </button>
                )}
              </div>
            )}

            {/* TABLA DE USUARIOS GENERALES */}
            <h4 className="subsection-title">Usuarios de Aplicación General</h4>
            {loading.generalUsers ? (
              <p className="loading-message-text">
                Cargando usuarios generales...
              </p>
            ) : error.generalUsers ? (
              <p className="error-message-text">Error: {error.generalUsers}</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="checkbox-th"></th>
                      <th>DNI</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleGeneralUsers.length > 0 ? (
                      visibleGeneralUsers.reverse().map((user) => (
                        <tr key={user.dni}>
                          <td className="checkbox-td">
                            <input
                              type="checkbox"
                              checked={selectedGeneralUsers.includes(user.dni)}
                              onChange={(e) =>
                                handleSelectGeneralUser(
                                  user.dni,
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                          <td>{user.dni}</td>
                          <td>{user.nombre}</td>
                          <td>{user.correo}</td>
                          <td className="actions-cell">
                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteUser(user.dni, "general_user")
                              }
                              disabled={loading.delete}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data-message">
                          No hay usuarios generales registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {/* Botón Ver Más */}
                {filteredGeneralUsers.length > 10 && !showAllGeneral && (
                  <button
                    onClick={() => setShowAllGeneral(true)}
                    className="ver-mas-button"
                  >
                    Ver más usuarios generales
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="alerts-section">
            <h3 className="section-title">Historial de Alertas</h3>
            {loading.alerts ? (
              <p className="loading-message-text">Cargando alertas...</p>
            ) : error.alerts ? (
              <p className="error-message-text">Error: {error.alerts}</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fecha/Hora</th>
                      <th>Tipo</th>
                      <th>Descripcion</th>
                      <th>Zona</th>
                      <th>Usuario</th>
                      <th>Número</th>
                      <th>Estado</th>
                      <th>Sereno</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.length > 0 ? (
                      alerts.map((alert) => (
                        <tr key={alert.id}>
                          <td>{new Date(alert.timestamp).toLocaleString()}</td>
                          <td>{alert.emergency_type}</td>
                          <td>
                            <div style={{ position: "relative" }}>
                              <button
                                className="description-icon-button"
                                onClick={() => toggleDescription(alert.id)}
                              >
                                <FileText size={18} />
                              </button>
                              {visibleDescriptionId === alert.id && (
                                <div className="description-popover">
                                  <p className="popover-text">
                                    {alert.description || "Sin Descripción"}
                                  </p>
                                  <button
                                    className="popover-close-button"
                                    onClick={() =>
                                      setVisibleDescriptionId(null)
                                    }
                                  >
                                    &times;
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>{alert.zona}</td>
                          <td>{alert.user_nombre}</td>
                          <td>{alert.user_numero}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                alert.status === "Pendiente"
                                  ? "status-active"
                                  : alert.status === "Atendida"
                                  ? "status-resolved"
                                  : "status-default"
                              }`}
                            >
                              {alert.status}
                            </span>
                          </td>
                          <td>{alert.sereno_nombre}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data-message">
                          No hay alertas registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "cameras" && (
          <div className="cameras-section">
            <h3 className="section-title">Gestión de Cámaras</h3>
            <button
              className="action-button blue"
              onClick={handleOpenCameraRegisterModal}
            >
              <PlusCircle size={18} className="icon-margin" /> Registrar Cámara
            </button>
            {loading.cameras ? (
              <p className="loading-message-text">Cargando cámaras...</p>
            ) : error.cameras ? (
              <p className="error-message-text">Error: {error.cameras}</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>IP</th>
                      <th>Latitud</th>
                      <th>Longitud</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cameras.length > 0 ? (
                      cameras.map((camera) => (
                        <tr key={camera.id}>
                          <td>{camera.idcamara}</td>
                          <td>{camera.nombrecamara}</td>
                          <td>{camera.ipcamara}</td>
                          <td>{camera.corFinal}</td>
                          <td>{camera.corInicial}</td>
                          <td>
                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteCameraInitiate(camera.id)
                              }
                              disabled={loading.delete}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="no-data-message">
                          No hay cámaras registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-section">
            <h3 className="section-title">Configuración de la Aplicación</h3>
            {loading.appVersions ? (
              <p className="loading-message-text">
                Cargando versiones de la app...
              </p>
            ) : error.appVersions ? (
              <p className="error-message-text">Error: {error.appVersions}</p>
            ) : appVersions ? (
              <div className="app-version-info">
                <p className="version-text">
                  <span className="version-label">Versión Android:</span>{" "}
                  {appVersions.android_version}
                </p>
                <p className="version-text">
                  <span className="version-label">Versión iOS:</span>{" "}
                  {appVersions.ios_version}
                </p>
                <p className="version-note">
                  (Estas versiones se obtienen del backend para la gestión de
                  actualizaciones.)
                </p>
              </div>
            ) : (
              <p className="no-data-message">
                No hay información de versión disponible.
              </p>
            )}
          </div>
        )}
      </div>
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        userRole={userRole}
        preselectedRole={preselectedRole}
        adminZona={adminZona}
        csrfToken={csrfToken}
      />
      <ConvertUsersModal
        isOpen={isConvertModalOpen}
        onClose={handleCloseConvertModal}
        onConfirmConversion={handleConfirmConversion}
        selectedUserCount={selectedGeneralUsers.length}
        ZONAS={ZONAS}
      />

      <CameraRegisterModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCamera(null);
        }}
        onSave={handleSaveCameras}
        editingCamera={editingCamera}
        onUpdate={handleUpdateCamera}
      />
      {itemToDelete && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={handleCancelDelete}
          onConfirm={
            itemToDelete.messageType === "user"
              ? handleConfirmDelete
              : handleConfirmCameraDelete
          }
          title={`Confirmar Eliminación de ${itemToDelete.type}`}
          message={
            itemToDelete.messageType === "user"
              ? `¿Estás seguro de que quieres eliminar al ${itemToDelete.type} con DNI ${itemToDelete.id}? Esta acción no se puede deshacer.`
              : `¿Estás seguro de que quieres eliminar la ${itemToDelete.type} con ID ${itemToDelete.id} permanentemente? Esta acción no se puede deshacer.`
          }
        />
      )}
    </div>
    </div>
  );
};

export default SuperAdmin;

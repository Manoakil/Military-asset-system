import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.params = config.params || {};
    config.params.token = token;
  }
  return config;
});

// -------- AUTH --------
export const loginUser = (data) => API.post("/api/auth/token", data);

// -------- DASHBOARD --------
export const getDashboardData = (filters) => API.get("/api/dashboard", { params: filters });

// -------- BASES --------
export const getBases = () => API.get("/api/bases");

// -------- EQUIPMENT --------
export const getEquipment = () => API.get("/api/equipment");

// -------- PURCHASES --------
export const createPurchase = (data) => API.post("/api/purchases", data);
export const getPurchases = (filters) => API.get("/api/purchases", { params: filters });

// -------- TRANSFERS --------
export const createTransfer = (data) => API.post("/api/transfers", data);
export const getTransfers = (filters) => API.get("/api/transfers", { params: filters });

// -------- ASSIGNMENTS --------
export const createAssignment = (data) => API.post("/api/assignments", data);
export const getAssignments = (filters) => API.get("/api/assignments", { params: filters });

// -------- EXPENDITURES --------
export const createExpenditure = (data) => API.post("/api/expenditures", data);
export const getExpenditures = (filters) => API.get("/api/expenditures", { params: filters });

// -------- STOCK --------
export const getStock = (baseId) => API.get(`/api/stock?base_id=${baseId}`);

export default API;

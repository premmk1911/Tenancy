import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Authentication
export const login = (email, password) => axios.post(`${API_URL}/auth/login`, { email, password });

// Tenant API
export const getTenants = () => axios.get(`${API_URL}/tenants`);
export const addTenant = (tenantData) => axios.post(`${API_URL}/tenant/register`, tenantData);

// User API
export const getUsers = () => axios.get(`${API_URL}/users`);
export const addUser = (userData, tenantId) => axios.post(`${API_URL}/tenant/${tenantId}/user`, userData);

import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Sessions
export const getSessions = () => api.get("/sessions/active").then(r => r.data.sessions);
export const getMyRecentSessions = () => api.get("/sessions/my-recent").then(r => r.data.sessions);
export const getSessionById = (id) => api.get(`/sessions/${id}`).then(r => r.data.session);
export const createSession = (data) => api.post("/sessions", data).then(r => r.data.session);
export const joinSession = (id) => api.post(`/sessions/${id}/join`).then(r => r.data.session);
export const endSession = (id) => api.post(`/sessions/${id}/end`).then(r => r.data);

// Chat token
export const getStreamToken = () => api.get("/chat/token").then(r => r.data);
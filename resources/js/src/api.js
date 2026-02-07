import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


/* =======================
   DNEVNIK ISHRANE
======================= */

export const getDnevnikByDate = (datum) =>
  api.get(`/dnevnici_ishrane-datum/${datum}`).then((r) => r.data);

export const addStavkaIshrane = (payload) =>
  api.post(`/stavke_ishrane`, payload).then((r) => r.data);

export const deleteStavkaIshrane = (id) =>
  api.delete(`/stavke_ishrane/${id}`).then((r) => r.data);

export const getNamirnice = () =>
  api.get(`/namirnice`).then((r) => r.data);

/* =======================
   
======================= */

export const offSearch = (q) =>
  api.get(`/off/search?q=${encodeURIComponent(q)}`).then(r => r.data);

export const offImport = (payload) =>
  api.post(`/off/import`, payload).then(r => r.data);
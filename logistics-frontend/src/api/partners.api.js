import api from "./axios";

export const fetchPartners = (params) => {
  return api.get("/delivery-partners", { params });
};

export const fetchPartnerById = (id) => {
  return api.get(`/delivery-partners/${id}`);
};

export const fetchAvailablePartners = (city) => {
  return api.get("/delivery-partners/available", {
    params: { city },
  });
};

export const createPartner = (data) => {
  return api.post("/delivery-partners", data);
};

export const updatePartnerStatus = (partnerId, status) => {
  return api.put(`/delivery-partners/${partnerId}/status`, { status });
};

import APIService from "../APIService";
const apiService = new APIService();

export const getCompaniesExcludingUserWithSearch = async (
  page,
  limit,
  searchTerm
) =>
  await apiService.get(
    `/partnership/getCompanies?page=${page}&limit=${limit}&searchTerm=${searchTerm}`
  );

export const addPartnershipAPI = async (inputData) =>
  await apiService.post("/partnership/addPartnership", inputData);

export const getPendingPartnershipsAPI = async (inputData) =>
  await apiService.get(`/partnership/getPendingPartnerships`, inputData);

export const getApprovedPartnershipsAPI = async (inputData) =>
  await apiService.get("/partnership/getApprovedPartnerships", inputData);

export const getIncomingRequestsAPI = async (inputData) =>
  await apiService.get("/partnership/getIncomingRequests", inputData);

export const acceptIncomingRequestAPI = async (inputData) =>
  await apiService.post("/partnership/acceptIncomingRequest", inputData);

export const rejectIncomingRequestAPI = async (inputData) =>
  await apiService.post("/partnership/rejectIncomingRequest", inputData);

export const deletePartnershipAPI = async (partnershipId) =>
  await apiService.delete(
    `/partnership/deletePartnership?partnershipId=${partnershipId}`
  );

export const cancelPartnershipAPI = async (inputData) =>
  await apiService.post("/partnership/cancelPartnership", inputData);

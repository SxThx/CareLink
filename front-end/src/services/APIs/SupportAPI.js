import APIService from "../APIService";
const apiService = new APIService();


export const addSupportAPI = async (inputData) =>
  await apiService.post("/support/addSupport", inputData);


export const getUserSupportAPI = async (status, page, limit) =>
    await apiService.get(`/support/getUserSupport?status=${status}&page=${page}&limit=${limit}`);

export const getAdminSupportAPI = async (status, page, limit) =>
    await apiService.get(`/support/getAllSupport?status=${status}&page=${page}&limit=${limit}`);

export const changeSupportMessageStatusAPI = async (id, status) =>
  await apiService.put(`/support/changeSupportMessageStatus?id=${id}&status=${status}`);
import APIService from "../APIService";
const apiService = new APIService();


export const getTransactionsAPI = async (page, limit) =>
  await apiService.get(`/transaction/getTransactions?page=${page}&limit=${limit}`);


export const addPointsToCompanyAPI = async (inputData) => {
  return await apiService.post("/transaction/addPointsToCompany", inputData);
};

export const deductPointsFromCompanyAPI = async (inputData) => {
  return await apiService.post("/transaction/deductPointsFromCompany", inputData);
};

export const addPointsToCompanyPartnershipAPI = async (inputData) => {
  return await apiService.post("/transaction/addPointsToCompanyPartnership", inputData);
};

export const deductPointsFromCompanyPartnershipAPI = async (inputData) => {
  return await apiService.post("/transaction/deductPointsFromCompanyPartnership", inputData);
}
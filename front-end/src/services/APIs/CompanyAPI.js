import APIService from "../APIService";
const apiService = new APIService();

export const updateCompanyAPI = async (inputData) =>
  await apiService.put("/company/updateCompany", inputData);

export const editCompanyDetailsAPI = async (inputData) =>
  await apiService.put("/company/editCompanyDetails", inputData);

export const updateCompanyLogoAPI = async (inputData) =>
  await apiService.put("/company/updateCompanyLogo", inputData);
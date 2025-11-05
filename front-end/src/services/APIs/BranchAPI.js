import APIService from "../APIService";
const apiService = new APIService();

export const getCompanyBranchesAPI = async (inputData) =>
  await apiService.get("/branch/getCompanyBranches", inputData);

export const addBranchAPI = async (inputData) =>
  await apiService.post("/branch/addBranch", inputData);

export const updateBranchAPI = async (inputData) =>
  await apiService.put("/branch/updateBranch", inputData);

export const deleteBranchAPI = async (inputData) =>
  await apiService.delete(`/branch/deleteBranch?id=${inputData}`);

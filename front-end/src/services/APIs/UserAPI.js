import APIService from "../APIService";
const apiService = new APIService();

export const registerAPI = async (inputData) =>
  await apiService.post("/user/register", inputData);

export const verifyOtpAPI = async (inputData) =>
  await apiService.post("/user/verifyUser", inputData);

export const loginAPI = async (inputData) =>
  await apiService.post("/user/login", inputData);

export const forgotPasswordAPI = async (inputData) =>
  await apiService.post("/user/forgotPassword", inputData);

export const resetPasswordAPI = async (inputData) =>
  await apiService.post("/user/resetPassword", inputData);

export const getUserDataAPI = async (inputData) =>
  await apiService.get("/user/userData", inputData);

export const getAllUsersAPI = async (page, limit, searchTerm) => 
  await apiService.get(`/user/getAllUsers?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);

export const getPendingUsersAPI = async (page, limit, searchTerm) => 
  await apiService.get(`/user/getPendingUsers?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);

export const getApprovedUsersAPI = async (page, limit, searchTerm) => 
  await apiService.get(`/user/getApprovedUsers?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);

export const getRejectedUsersAPI = async (page, limit, searchTerm) => 
  await apiService.get(`/user/getRejectedUsers?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);


export const approveUserAPI = async (inputData) =>
  await apiService.post("/user/approveUser", inputData);

export const rejectUserAPI = async (inputData) =>
  await apiService.post("/user/rejectUser", inputData);

export const ChangePasswordAPI = async (inputData) =>
  await apiService.post("/user/changePassword", inputData);

export const updateProfileImageAPI = async (inputData) =>
  await apiService.post("/user/updateProfileImage", inputData);

export const getCompanyMembersAPI = async (inputData) =>
  await apiService.get("/user/getCompanyMembers", inputData);

export const addCompanyMemberAPI = async (inputData) =>
  await apiService.post("/user/addCompanyMember", inputData);

export const deleteCompanyMemberAPI = async (inputData) =>
  await apiService.post("/user/deleteCompanyMember", inputData);

export const getAllCompanyDataAPI = async (page, limit, searchTerm) =>
  await apiService.get(`/user/getAllCompanyData?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);

export const getApprovedCompaniesAPI = async (page, limit, searchTerm) =>
  await apiService.get(`/user/getApprovedCompanies?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);

export const getRejectedCompaniesAPI = async (page, limit, searchTerm) =>
  await apiService.get(`/user/getRejectedCompanies?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);

export const getPendingCompaniesAPI = async (page, limit, searchTerm) =>
  await apiService.get(`/user/getPendingCompanies?page=${page}&limit=${limit}&searchTerm=${searchTerm}`);


// export const searchCompaniesAPI = async (searchTerm, page, limit) =>
//   await apiService.get(`/user/searchCompanies?searchTerm=${searchTerm}&page=${page}&limit=${limit}`);

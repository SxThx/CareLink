import APIService from "../APIService";
const apiService = new APIService();

export const addSingleAPI = async (inputData) =>
  await apiService.post("/coupon/addCouponSingle", inputData); 

export const getAllCampaignDetailsAPI = async (page , limit) =>
  await apiService.get(`/coupon/getAllCampaignDetails?page=${page}&limit=${limit}`);

export const getReusableCampaignDetailsAPI = async (page , limit) =>
  await apiService.get(`/coupon/getAllCampaignDetailsReusable?page=${page}&limit=${limit}`);

export const publishCampaignAPI = async (campaign_id , new_status) =>
  await apiService.put(`/coupon/updateCampaignStatus?campaign_id=${campaign_id}&new_status=${new_status}`);


export const updateCouponSingleAPI = async (inputData, campaign_id) =>
  await apiService.put(`/coupon/updateCouponSingle?campaign_id=${campaign_id}`, inputData);

export const updateCouponReusableAPI = async (inputData, campaign_id) =>
  await apiService.put(`/coupon/updateCouponReusable?campaign_id=${campaign_id}`, inputData);


export const addReusableAPI = async (inputData) =>
  await apiService.post("/coupon/addCouponReusable", inputData); 

export const deleteCampaignAPI = async (campaign_id) =>
  await apiService.delete(`/coupon/deleteCampaign?campaign_id=${campaign_id}`); 

export const rerunCampaignAPI = async (campaign_id) =>
  await apiService.post(`/coupon/rerun?campaign_id=${campaign_id}`); 

export const redeemAPI = async (inputData) =>
  await apiService.post(`/coupon/redeem?code=${inputData}`); 


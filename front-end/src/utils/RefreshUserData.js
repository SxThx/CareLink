import { getUserDataAPI } from "../services/APIs/UserAPI";

export async function RefreshUserData(){
    console.log("refreshUserData function is running...")
    try {
        const response = await getUserDataAPI();
        console.log(response.status, "userdata status")
        if (response.status === 200) {
            localStorage.removeItem("userData");
            localStorage.setItem("userData", JSON.stringify(response.data));
        } else {
            console.log(response.message)
        }
    } catch (error) {
        console.log(response.message)
    }

}
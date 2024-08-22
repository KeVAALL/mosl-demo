import AxiosInstance from "../utils/axios";

//API call
export async function ApiService(data, endPoint) {
  try {
    const response = await AxiosInstance.post(`${endPoint}`, data);
    return response;
  } catch (error) {
    console.log(error?.response?.data?.message);
    if (
      error?.response?.data?.message === "Account Locked" ||
      error?.response?.message === "Account Locked"
    ) {
      // alert("Account Locked");
      localStorage.clear();
      sessionStorage.clear();

      window.location.replace("/");
    }
    console.log(error);
    throw error;
  }
}

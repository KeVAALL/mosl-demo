import AxiosInstance from "./axios";

//API call
export async function ApiService(data, endPoint) {
  try {
    const response = await AxiosInstance.post(`${endPoint}`, data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

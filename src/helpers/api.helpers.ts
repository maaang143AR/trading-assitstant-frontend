import axios from "axios";


export const postRequest = async <T>(
  apiPath: string,
  data: unknown,
  token?: string | null
): Promise<T> => {
  try {
    const response = await axios.post(apiPath,data,{
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
    const result = response.data;
    return result;
  } catch (error) {
    console.log("Error in Posting Data");
    throw error;
  }
};

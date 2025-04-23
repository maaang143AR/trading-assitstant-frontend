import axios from "axios";


interface TLogin {
  username: string;
  password: string;
}

export const postRequest = async <T>(
  apiPath: string,
  data: TLogin,
): Promise<T> => {
  try {
    const response = await axios.post(apiPath,data);
    const result = response.data;
    return result;
  } catch (error) {
    console.log("Error in Posting Data");
    throw error;
  }
};

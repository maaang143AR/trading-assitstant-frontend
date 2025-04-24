import { postRequest } from "../../helpers/api.helpers";

const BASE_URL = import.meta.env.VITE_BACKEND_API;
const prefix = 'dashboard/api';

export const postImage = async (data: FormData,token:string | null) => {
    return await postRequest(`${BASE_URL}/${prefix}/upload`, data,token)
}
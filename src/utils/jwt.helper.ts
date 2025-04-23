import {jwtDecode} from 'jwt-decode'

interface TokenPayLoad {
    exp: number
}

export const isTokenExpired = (token: string): boolean => {
    try {
        const decodedToken = jwtDecode<TokenPayLoad>(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decodedToken.exp < currentTime;
    } catch (error) {
        return true; // If decoding fails, consider the token expired
    }

}

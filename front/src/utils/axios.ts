import axios from 'axios';
import { BASE_URL } from 'src/utils/constants/paths';

const axiosConfig = {
  baseURL: BASE_URL,
  timeout: 0
};

const axiosInstance = axios.create(axiosConfig);

// const redirect = (redirectUrl: any) => {
//   window.location = redirectUrl;
// };

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      //if (error.response.status === 401) {
      //  return redirect('/');
      //}
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    );
  }
);

export default axiosInstance;

import axios from 'axios';
import { url } from '../utils/constants/url';

export const secureApi = axios.create({
  baseURL: url.DEV_URL,
  timeout: 60 * 1000,
});

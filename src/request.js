import axios from 'axios';
import { ElMessage } from 'element-plus';
// 创建一个axios实例
const service = axios.create({
    baseURL: 'http://127.0.0.1:8888', // 设置基本的URL
    timeout: 5000, // 设置请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        config.headers['Authorization'] = localStorage.getItem('LOGIN_TOKEN');
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        return response.data;
    },
    error => {
        // 对响应错误做点什么
        return Promise.reject(error);
    }
);

const fetchData = (url, options = {}) => {
    let method = options.method || 'get';
    let params = options.params || {};

    if (method === 'get' || method === 'GET') {
        return new Promise((resolve, reject) => {
            service
                .get(url, {
                    params: params,
                })
                .then(res => {
                    if (res.status === 0) {
                        ElMessage.success(res.message)
                        resolve(res);
                    } else {
                        ElMessage.error(res.message)
                        reject(res)
                    }
                })
                .catch(err => {
                    ElMessage.error(err.message)
                    reject(err);
                });
        });
    } else {
        return new Promise((resolve, reject) => {
            service
                .post(url, params)
                .then(res => {
                    if (res.status === 0) {
                        ElMessage.success(res.message)
                        resolve(res);
                    } else {
                        ElMessage.error(res.message)
                        reject(res)
                    }
                })
                .catch(err => {
                    console.log('postErr:',err)
                    ElMessage.error(err.message)
                    reject(err);
                });
        });
    }
};
export default fetchData
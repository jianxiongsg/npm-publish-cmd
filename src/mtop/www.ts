import axios, { AxiosInstance } from "axios";
import { getGswlConfig } from "../utils";

let instance:AxiosInstance;
function initServer(){
    let config = getGswlConfig();
    instance = axios.create({ 
        timeout: 10000, 
        baseURL: config.url
    })
    // 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
    instance.defaults.headers.post['Content-Type'] = 'application/json'
    
    // let httpCode: { [num: number]: string } = {
    //     400: '请求参数错误',
    //     401: '权限不足, 请重新登录',
    //     403: '服务器拒绝本次访问',
    //     404: '请求资源未找到',
    //     500: '内部服务器错误',
    //     501: '服务器不支持该请求中使用的方法',
    //     502: '网关错误',
    //     504: '网关超时'
    // }

    /** 添加请求拦截器 **/
    instance.interceptors.request.use(config => {
        // if (config.data instanceof FormData) {
        //     let data = config.data as any;
        //     Object.assign(config.headers, data.getHeaders());
        // }
        // console.log('...........header',config.headers)
        return config
    }, error => {
        // 对请求错误做些什么
        console.log("request error",error)
        return Promise.reject(error)
    })

    /** 添加响应拦截器  **/
    instance.interceptors.response.use(response => {
        if (response.status === 200) {
            return Promise.resolve(response.data)
        } else {
            return Promise.reject(response.data.msg)
        }
    }, error => {
        console.log("response error",error)
        // if (error.response) {
        
        //     if (error.response.status === 401) {  
                
        //     }
        //     return Promise.reject(error)
        // } else {
            
        //     return Promise.reject('请求超时, 请刷新重试')
        // }
    })
}

export default function getInstance(){
    if(!instance){
        initServer();
    }
    return instance;
}

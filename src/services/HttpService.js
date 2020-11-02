import axios from "axios";
import StorageService from "./StorageService";
import { notification, Modal } from "antd";
import { API_URL } from "../Utils/constants";

const { confirm } = Modal;

class HttpService {
  constructor() {
    this.provider = axios.create({
      baseURL: API_URL
    });
    // this.provider.defaults.headers.post['Content-Type'] = 'application/json';
    this.provider.defaults.headers.post["Accept"] = "application/json";
    // Add a request interceptor
    this.provider.interceptors.request.use(function (config) {
      // Do something before request is sent
      const user = StorageService.getItem("user");
      if (user && user.token) {
        config.headers.common["Authorization"] =
          "Bearer " + user.token;
      }
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });
  }

  async request(url, method = "get", data = {}, notify = true) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    let options = {
      method,
      url,
      data,
      cancelToken: source.token
    };
    if (method === 'get') {
      options.params = data;
      delete options.data;
    }

    // if (data instanceof FormData) {
    //     options.headers['Content-Type'] = 'multipart/form-data';
    // }
    if (window.pendingXHR) {
      // cancel the request (the message parameter is optional)
      window.pendingXHR.cancel("Operation canceled by the user.");
    }
    window.pendingXHR = source;

    return this.provider(options).catch(function (error) {
      if (axios.isCancel(error)) {
        throw error;
      } else {
        // handle error
        let msg = "Something went wrong";
        try {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (typeof error.response.data === 'object') {
              if ("msg" in error.response.data) {
                msg = error.response.data.msg;
              } else if ("errors" in error.response.data) {
                msg = Array.from(Object.values(error.response.data.errors))
                  .map(value => value.toLocaleLowerCase())
                  .join(", ");
              }
            } else if (typeof error.response.data === 'string') {
              msg = error.response.data;
            }
            if (error.response.status === 403) {
              confirm({
                title: msg,
                content: "Want to connect right now?",
                onOk: () => {
                  window.location.href = "https://api.zerodha.com/market/redirect";
                }
              });
            }
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            msg = "Response not received";
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            msg = error.message;
          }
          if (notify) {
            notification.error({
              message: error.message,
              description: msg
            });
          }
          return Promise.reject(msg);
        } catch (e) {
          console.log(e);
        }
        // console.log(error.toJSON());
      }
    });
  }
}

export default HttpService;

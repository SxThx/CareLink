const BASE_URL = "http://localhost:8081/api";

class APIService {
  async request(endpoint, method, body = null) {
    const token = localStorage.getItem("token"); // Retrieve the token from local storage
    const requestOptions = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
      body: body ? JSON.stringify(body) : null,
    };
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, "GET");
  }

  post(endpoint, body) {
    return this.request(endpoint, "POST", body);
  }

  put(endpoint, body) {
    return this.request(endpoint, "PUT", body);
  }

  delete(endpoint) {
    return this.request(endpoint, "DELETE");
  } 
}

export default APIService;

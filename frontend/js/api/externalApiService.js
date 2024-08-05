const MEAL_API_URL = 'http://localhost:3000/proxy?';

const apiService = {
  fetchData: (endpoint, method = 'GET', data = {}) => {
    return $.ajax({
      url: `${MEAL_API_URL}/${endpoint}`,
      method: method,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
    });
  },

  get: (endpoint) => {
    return apiService.fetchData(endpoint, 'GET');
  },

  post: (endpoint, data) => {
    return apiService.fetchData(endpoint, 'POST', data);
  },

  patch: (endpoint, data) => {
    return apiService.fetchData(endpoint, 'PATCH', data);
  },

  delete: (endpoint) => {
    return apiService.fetchData(endpoint, 'DELETE');
  },
};

export default apiService;

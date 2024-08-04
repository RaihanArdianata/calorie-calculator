import apiService from './api/apiService.js';

$(document).ready(() => {
    $('#login-form').on('submit', (event) => {
        event.preventDefault();

        const bodyRequest = {
            username: $('#username').val(),
            password: $('#password').val()
        }

        apiService.post('api/auth/login', bodyRequest)
            .done(response => {
                alert('Login successfully:', response);
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                alert('Error Login:', textStatus, errorThrown);
            });
    });
});

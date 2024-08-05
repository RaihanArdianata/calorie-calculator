import apiService from './api/apiService.js';
import { modalOnClick} from './search-modal.js';

$(document).ready(() => {
    $("a#search-meals").on("click", modalOnClick);
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

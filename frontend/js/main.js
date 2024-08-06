import apiService from './api/apiService.js';
import { modalOnClick } from './search-modal.js';
import * as user from './user.main.js';
import * as meals from './meals.main.js';

$(document).ready(() => {
    const keyToken = "tokenAuth"
    const storeToken = localStorage.getItem(keyToken)

    user.whenLoaded();
    meals.whenLoaded();
    $("a#search-meals").on("click", modalOnClick);
    $('#login-form').on('submit', (event) => {
        event.preventDefault();

        const bodyRequest = {
            username: $('#username').val(),
            password: $('#password').val()
        }

        apiService.post('api/auth/login', bodyRequest)
            .done(response => {
                const { token } = response.authoritation
                localStorage.setItem(keyToken, token)
                location.replace('index.html')
                alert("Login Successfully")
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                alert('Error Login', textStatus, errorThrown);
            });
    });
});

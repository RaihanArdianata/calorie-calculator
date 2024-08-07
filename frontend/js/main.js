import apiService from './api/apiService.js';
import { keyToken, keyRole } from './constant/constant.js';
import { modalOnClick } from './search-modal.js';
import * as user from './user.main.js';
import * as meals from './meals.main.js';
import * as profile from './profile.main.js';

$(document).ready(() => {
  user.whenLoaded();
  meals.whenLoaded();
  profile.whenLoaded();
  $('a#search-meals').on('click', modalOnClick);

  const showLoader = () => {
    $('#loader-wrapper').removeClass('is-hidden');
  };

  const hideLoader = () => {
    $('#loader-wrapper').addClass('is-hidden');
  };

  const resetFormLogin = () => {
    $('#login-form')[0].reset();
    $('#register-form')[0].reset();
    $('#message').addClass('is-hidden').empty();
  };

  $('#show-register').click((e) => {
    e.preventDefault();
    resetFormLogin();
    $('#login-form').addClass('is-hidden');
    $('#register-form').removeClass('is-hidden');
    $('#form-title').text('Register');
  });

  $('#show-login').click((e) => {
    e.preventDefault();
    resetFormLogin();
    $('#register-form').addClass('is-hidden');
    $('#login-form').removeClass('is-hidden');
    $('#form-title').text('Login');
  });

  // Handle login form submission
  $('#login-form').on('submit', (event) => {
    event.preventDefault();

    $('#message').addClass('is-hidden').empty();

    showLoader();

    const bodyRequest = {
      username: $('#login-username').val(),
      password: $('#login-password').val(),
    };

    apiService
      .post('api/auth/login', bodyRequest)
      .done((response) => {
        hideLoader();
        const { token } = response.authoritation;
        $('#message').removeClass('is-hidden').addClass('is-success').text('Login successful!');
        localStorage.setItem(keyToken, token);
        localStorage.setItem(keyRole, response.authoritation.role_name);
        setTimeout(() => {
          location.replace('index.html');
        }, 500);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 400) {
          $('#message')
            .removeClass('is-hidden')
            .addClass('is-danger')
            .text('Login failed. Invalid username or password.');
        } else {
          $('#message')
            .removeClass('is-hidden')
            .addClass('is-danger')
            .text('Login failed. Please try again.');
        }
      });
  });

  $('#logout').on('click', () => {
    localStorage.clear();
    location.replace('login.html');
  });

  // Handle register form submission
  $('#register-form').on('submit', (event) => {
    event.preventDefault();

    $('#message').addClass('is-hidden').empty();

    showLoader();

    const password = $('#register-password').val();
    const confirmPassword = $('#register-confirm-password').val();
    if (password !== confirmPassword) {
      hideLoader();
      $('#message')
        .removeClass('is-hidden')
        .addClass('is-danger')
        .text('Passwords does not match.');
      return;
    }

    // Gather form data
    const bodyRequest = {
      email: $('#register-email').val(),
      firstName: $('#register-firstname').val(),
      lastName: $('#register-lastname').val(),
      phone: $('#register-phone').val(),
      password: password,
    };

    // Send AJAX request
    apiService
      .post('api/auth/register', bodyRequest)
      .done((response) => {
        hideLoader();
        $('#message')
          .removeClass('is-hidden')
          .addClass('is-success')
          .text('Registration successful!');
        resetFormLogin();
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.responseJSON && jqXHR.responseJSON.details) {
          const errors = jqXHR.responseJSON.details;
          let errorMessage = 'Registration failed due to the following errors:';
          errors.map((error) => {
            errorMessage += '<br>' + error.message;
          });
          $('#message')
            .removeClass('is-hidden')
            .removeClass('is-success')
            .addClass('is-danger')
            .html(errorMessage);
        } else {
          const errorMessage = jqXHR.responseJSON
            ? jqXHR.responseJSON.error
            : 'Registration failed. Please try again.';
          $('#message')
            .removeClass('is-hidden')
            .removeClass('is-success')
            .addClass('is-danger')
            .text(errorMessage);
        }
      });
  });
});

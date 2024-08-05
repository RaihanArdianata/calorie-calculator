import externalApiService from './api/externalApiService.js';

$(document).ready(() => {
  $('#search-button').on('click', (event) => {
    event.preventDefault();

    const bodyRequest = {
      query: $('#search-input').val(),
    };

    console.log(bodyRequest);

    externalApiService
      .get(`search.php?s=${bodyRequest.query}`)
      .done((response) => {
        alert('Fetch successfully:', response);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        alert('Error fetch:', textStatus, errorThrown);
      });
  });
});

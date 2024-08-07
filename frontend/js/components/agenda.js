import apiService from '../api/apiService.js';

$(document).on('click', '.btn-add-agenda', function () {
  const meal_id = $(this).find('.hidden-id').text().trim();
  console.log(meal_id);

  $(`.content-input-agenda-${meal_id?.toLowerCase()}`).slideToggle('fast');
});

$(document).on('click', '.submit-button', function () {
  const $cardWrapper = $(this).closest('.card-content'); // Find the closest parent card-wrapper
  const mealType = $cardWrapper.find('.meal-type').val();
  const targetCalorie = $cardWrapper.find('.target-calorie').val();
  const mealId = $cardWrapper.find('.meal-id').val();

  apiService
    .post(`api/agenda`, {
      agenda_name: mealType,
      meal_id: mealId,
      target_calorie: targetCalorie,
    })
    .done((response) => {
      console.log(response);
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      if (jqXHR.status === 401) {
        location.replace('login.html');
        alert('Unauthorized');
      } else {
        alert('Error Fetch', textStatus, errorThrown);
      }
    });
});

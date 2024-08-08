import apiService from '../api/apiService.js';

$(document).on('click', '.btn-add-agenda', function () {
  const meal_id = $(this).find('.hidden-id').text().trim();
  console.log(meal_id);

  $(`.content-input-agenda-${meal_id?.toLowerCase()}`).slideToggle('fast');
});

$(document).on('click', '.submit-button', function () {
  const $cardWrapper = $(this).closest('.card-content');
  const mealType = $cardWrapper.find('.meal-type').val();
  const targetCalorie = $cardWrapper.find('.target-calorie').val();
  const mealId = $cardWrapper.find('.meal-id').val();

  const disableScroll = () => {
    $(window).on('scroll.disableScroll', function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.scrollTo(0, 0);
    });
  };

  const enableScroll = () => {
    $(window).off('scroll.disableScroll');
  };

  $('#loader-wrapper').removeClass('is-hidden');
  disableScroll();

  apiService
    .get(`api/meals/${mealId}`)
    .done((response) => {
      apiService
        .post(`api/agenda`, {
          agenda_name: mealType,
          meal_id: mealId,
          target_calorie: targetCalorie,
        })
        .done((response) => {
          $('#loader-wrapper').addClass('is-hidden');
          enableScroll();
          console.log(response);
          toastr.success(`Success`);
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          $('#loader-wrapper').addClass('is-hidden');

          const errors = jqXHR?.responseJSON?.details;
          let errorMessage = '';

          if (Array.isArray(errors)) {
            errors.forEach((error) => {
              errorMessage += '<br>' + error.message;
            });
          }
          toastr.error(`${errorMessage}`);
          enableScroll();
          if (jqXHR.status === 401) {
            location.replace('login.html');
          }
        });
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      $('#loader-wrapper').addClass('is-hidden');
      enableScroll();
      const errors = jqXHR?.responseJSON?.details;
      let errorMessage = '';

      if (Array.isArray(errors)) {
        errors.forEach((error) => {
          errorMessage += '<br>' + error.message;
        });
      }
      toastr.error(`${errorMessage}`);
      if (jqXHR.status === 401) {
        location.replace('login.html');
      }
    });

  // apiService
  //   .post(`api/agenda`, {
  //     agenda_name: mealType,
  //     meal_id: mealId,
  //     target_calorie: targetCalorie,
  //   })
  //   .done((response) => {
  //     console.log(response);
  //   })
  //   .fail((jqXHR, textStatus, errorThrown) => {
  //     if (jqXHR.status === 401) {
  //       location.replace('login.html');
  //       alert('Unauthorized');
  //     } else {
  //       alert('Error Fetch', textStatus, errorThrown);
  //     }
  //   });
});

$(document).on('click', '.delete-button', function () {
  console.log('deleted');
});

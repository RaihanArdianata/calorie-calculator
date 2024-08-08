import externalApiService from './api/externalApiService.js';
import { areaToISOCode } from './api/listArea.js';

$(document).ready(() => {
  toastr.options = {
    closeButton: true,
    newestOnTop: false,
    progressBar: true,
    positionClass: 'toast-bottom-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };
  // state
  const mealsContainer = $('#meals');
  const categoriesContainer = $('#categories');
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

  const showLoader = () => {
    $('#loader-wrapper').removeClass('is-hidden');
    disableScroll();
  };

  const hideLoader = () => {
    $('#loader-wrapper').addClass('is-hidden');
    enableScroll();
  };

  const fetchCategories = () => {
    showLoader();
    externalApiService
      .get(`list.php?a=list`)
      .done((response) => {
        hideLoader();
        const { meals } = response;
        categoriesContainer.empty();

        if (Array.isArray(meals)) {
          meals.forEach(({ strArea }) => {
            const button = $('<button></button>')
              .attr('id', strArea)
              .addClass('button')
              .text(strArea)
              .on('click', () => searchMeals(strArea, 'a'));

            categoriesContainer.append(button);
          });
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          location.replace('login.html');
        }
      });
  };

  const searchMeals = (params, type = 's') => {
    showLoader();
    externalApiService
      .get(`${type === 's' ? 'search' : 'filter'}.php?${type}=${params || 'a'}`)
      .done((response) => {
        hideLoader();
        const { meals } = response;
        mealsContainer.empty();

        if (Array.isArray(meals)) {
          meals.forEach(({ strMeal, strInstructions, strArea, idMeal }) => {
            mealsContainer.append(`
            <div id="accordion" class="card shadow-none">
              <header class="card-header">
                <p class="card-header-title">${strMeal || '-'}</p>
                <button class="card-header-icon" aria-label="more options">
                  <span class="icon">
                   <span class="fi fi-${areaToISOCode[strArea || params]?.toLowerCase()}"></span>
                  </span>
                </button>
              </header>
              ${
                strInstructions
                  ? `<div class="card-content">
                      <div class="content elipsis">
                        ${strInstructions || '-'}
                      </div>
                    </div>`
                  : ``
              }
              <footer class="card-footer">
                <div class="btn-add-favorite card-footer-item" style="cursor: pointer">
                  <i class="fa fa-heart" aria-hidden="true"></i>
                  <i class="fa fa-heart hidden-id" aria-hidden="true" style="display: none">${idMeal}</i>
                </div>
                <div class="btn-add-agenda card-footer-item" style="cursor: pointer">
                  <i class="fa fa-tasks" aria-hidden="true"></i>
                  <i class="fa fa-tasks hidden-id" aria-hidden="true" style="display: none">${idMeal}</i>
                </div>
                <div class="card-footer-item" style="cursor: pointer">
                <a href="/meals.html?id=${idMeal}">
                <i class="fa fa-eye" aria-hidden="true"></i>
                </a>
                </div>
              </footer>
              <div class="content-input-agenda-${idMeal} d-none"  style="border-top:solid 1px #1f2229">
                <div class="card-content">
                  <p class="my-5 is-size-4">
                    Diet record
                  </p>
                  <div class="select mb-5" style="width: 100%">
                    <select id="meal-type" class="meal-type" style="width: 100%">
                      <option value="BREAKFAST">BREAKFAST</option>
                      <option value="LUNCH">LUNCH</option>
                      <option value="DINNER">DINNER</option>
                      <option value="SNACK">SNACK</option>
                    </select>
                  </div>
                  <input
                    id="target-calorie"
                    class="input mb-5 target-calorie"
                    type="number"
                    placeholder="Target Calorie"
                  />
                  <input
                    class="meal-id d-none"
                    value="${idMeal}"
                  />
                  <div class="buttons" style="width: 100%">
                    <button id='submit-button' class="button is-primary submit-button" style="width: 100%">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          `);
          });
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        hideLoader();
        if (jqXHR.status === 401) {
          location.replace('login.html');
        }
      });
  };

  $('#search-button').on('click', (event) => {
    event.preventDefault();

    const bodyRequest = {
      query: $('#search-input').val(),
    };

    searchMeals(bodyRequest.query);
  });

  // generate first
  fetchCategories();
  searchMeals();
});

import externalApiService from './api/externalApiService.js';
import { areaToISOCode } from './api/listArea.js';

$(document).ready(() => {
  // state
  const mealsContainer = $('#meals');
  const categoriesContainer = $('#categories');

  const fetchCategories = () => {
    externalApiService
      .get(`list.php?a=list`)
      .done((response) => {
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
        if (jqXHR.status === 401) {
          location.replace('login.html');
          alert('Unauthorized');
        } else {
          alert('Error Fetch', textStatus, errorThrown);
        }
      });
  };

  const searchMeals = (params, type = 's') => {
    externalApiService
      .get(`${type === 's' ? 'search' : 'filter'}.php?${type}=${params || 'a'}`)
      .done((response) => {
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
                <div class="card-footer-item" style="cursor: pointer">
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </div>
              </footer>
            </div>
          `);
          });
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        if (jqXHR.status === 401) {
          location.replace('login.html');
          alert('Unauthorized');
        } else {
          alert('Error Fetch', textStatus, errorThrown);
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

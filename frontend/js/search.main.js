import externalApiService from './api/externalApiService.js';

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
          meals.forEach(({ strMeal, strInstructions }) => {
            mealsContainer.append(`
            <div id="accordion" class="card shadow-none">
              <header class="card-header">
                <p class="card-header-title">${strMeal || '-'}</p>
                <button class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
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
                <a href="#" class="card-footer-item">View</a>
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

import externalApiService from './api/externalApiService.js';

$(document).ready(() => {
  const mealsContainer = $('#meals');
  const categoriesContainer = $('#categories');

  const fetchCategories = () => {
    externalApiService
      .get(`list.php?c=list`)
      .done((response) => {
        const { meals } = response;
        categoriesContainer.empty();

        if (Array.isArray(meals)) {
          meals.forEach(({ strCategory }) => {
            const button = $('<button></button>')
              .attr('id', strCategory)
              .addClass('button')
              .text(strCategory)
              .on('click', () => searchMeals(strCategory));

            categoriesContainer.append(button);
          });
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        alert('Error fetch:', textStatus, errorThrown);
      });
  };

  const searchMeals = (params) => {
    externalApiService
      .get(`search.php?s=${params}`)
      .done((response) => {
        const { meals } = response;
        mealsContainer.empty();

        if (Array.isArray(meals)) {
          meals.forEach(({ strMeal, strInstructions }) => {
            mealsContainer.append(`
            <div class="card">
              <header class="card-header">
                <p class="card-header-title">${strMeal || '-'}</p>
                <button class="card-header-icon" aria-label="more options">
                  <span class="icon">
                    <i class="fas fa-angle-down" aria-hidden="true"></i>
                  </span>
                </button>
              </header>
              <div class="card-content">
                <div class="content">
                  ${strInstructions || '-'}
                </div>
              </div>
              <footer class="card-footer">
                <a href="#" class="card-footer-item">View</a>
              </footer>
            </div>
          `);
          });
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        alert('Error fetch:', textStatus, errorThrown);
      });
  };

  $('#search-button').on('click', (event) => {
    event.preventDefault();

    const bodyRequest = {
      query: $('#search-input').val(),
    };

    searchMeals(bodyRequest.query);
  });

  // fetch first
  fetchCategories();
});

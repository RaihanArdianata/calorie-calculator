import externalApiService from './api/externalApiService.js';
import apiService from './api/apiService.js';

$(document).ready(() => {
  // state
  const agenda = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
  const nutritionRecord = { calories: 0, fat: 0, protein: 0, sugar: 0 };

  // selector
  const mealsContainer = $('#meals');
  const categoriesContainer = $('#categories');
  const agendaContainer = $('#agenda');

  const generateAgenda = () => {
    agenda.forEach((item) => {
      agendaContainer.append(`
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">${item?.toLowerCase()}</p>
              <button class="card-header-icon" aria-label="more options">
                <span class="icon">
                  <i class="fas fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </header>
            <div class="card-content">
              <div class="content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis
                mauris.
                <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
                <br />
                <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
              </div>
            </div>
            <footer class="card-footer">
              <a href="#" class="card-footer-item">View</a>
            </footer>
          </div>  
        `);
    });
  };

  const fetchCalories = () => {
    const bodyRequest = {
      username: '',
      password: '',
    };

    apiService
      .get(`api/agenda?startDate=${new Date()}&endDate=${new Date()}`)
      .done((response) => {
        const { data } = response;

        console.log(response);

        if (Array.isArray(data)) {
          data.forEach(({ meal }) => {
            const { tr_ingredients } = meal;
            if (Array.isArray(tr_ingredients)) {
              tr_ingredients.forEach(({ ingredient }) => {
                console.log(ingredient?.calories);

                nutritionRecord.calories += ingredient?.calories || 0;
                nutritionRecord.fat += ingredient?.fat_total_g || 0;
                nutritionRecord.protein += ingredient?.protein_g || 0;
                nutritionRecord.sugar += ingredient?.sugar_g || 0;
              });
            }
          });
        }

        $('#p-calories').attr('value', nutritionRecord.calories);
        $('#p-fat').attr('value', nutritionRecord.fat);
        $('#p-protein').attr('value', nutritionRecord.protein);
        $('#p-sugar').attr('value', nutritionRecord.sugar);
        $('#t-calories').text(`${nutritionRecord.calories.toFixed(0)} / 2000`);
        $('#t-fat').text(`${nutritionRecord.fat.toFixed(0)} / 78`);
        $('#t-protein').text(`${nutritionRecord.protein.toFixed(0)} / 175`);
        $('#t-sugar').text(`${nutritionRecord.sugar.toFixed(0)} / 50`);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        alert('Error Login', textStatus, errorThrown);
      });
  };

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

  // generate first
  fetchCategories();
  fetchCalories();
  generateAgenda();
});

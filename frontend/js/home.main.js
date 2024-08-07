import externalApiService from './api/externalApiService.js';
import apiService from './api/apiService.js';

$(document).ready(() => {
  // state
  const agenda = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
  const nutritionRecord = {
    calories: 0,
    fat: 0,
    protein: 0,
    sugar: 0,
  };

  let agendaData = {
    breakfast: { total_calorie: 0, target_calorie: 0 },
    lunch: { total_calorie: 0, target_calorie: 0 },
    dinner: { total_calorie: 0, target_calorie: 0 },
    snack: { total_calorie: 0, target_calorie: 0 },
  };

  // selector
  const mealsContainer = $('#meals');
  const categoriesContainer = $('#categories');
  const agendaContainer = $('#agenda');

  const generateAgenda = () => {
    agendaContainer.empty();

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
                <div
                  class="is-flex is-flex-direction-Rrow is-justify-content-space-between is-align-items-center"
                  style="text-align: right">
                  <p class="">calories</p>
                  <p class="" id="t-card">${agendaData?.[item?.toLowerCase()]?.total_calorie.toFixed(0) || 0
        } / ${agendaData?.[item?.toLowerCase()]?.target_calorie.toFixed(0) || 0}</p>
                </div>
                <progress class="progress is-small is-primary" value="${agendaData?.[item?.toLowerCase()]?.total_calorie.toFixed(0) || 0
        }" max="${agendaData?.[item?.toLowerCase()]?.target_calorie.toFixed(0) || 0
        }">15%</progress>
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
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setDate(startDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    apiService
      .get(`api/agenda?startDate=${startDate}&endDate=${endDate}`)
      .done((response) => {
        const { data } = response;

        if (Array.isArray(data)) {
          data.forEach(
            ({
              meal,
              total_calorie: total_calorie_db,
              target_calorie: target_calorie_db,
              agenda_name,
            }) => {
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

              if (agendaData?.[agenda_name?.toLowerCase()]) {
                const { total_calorie, target_calorie } = agendaData?.[agenda_name?.toLowerCase()];
                agendaData = {
                  ...agendaData,
                  [agenda_name?.toLowerCase()]: {
                    total_calorie: total_calorie + total_calorie_db,
                    target_calorie: target_calorie + target_calorie_db,
                  },
                };
              }
            },
          );
        }

        $('#p-calories').attr('value', nutritionRecord.calories);
        $('#p-fat').attr('value', nutritionRecord.fat);
        $('#p-protein').attr('value', nutritionRecord.protein);
        $('#p-sugar').attr('value', nutritionRecord.sugar);
        $('#t-calories').text(`${nutritionRecord.calories.toFixed(0)} / 2000`);
        $('#t-fat').text(`${nutritionRecord.fat.toFixed(0)} / 78`);
        $('#t-protein').text(`${nutritionRecord.protein.toFixed(0)} / 175`);
        $('#t-sugar').text(`${nutritionRecord.sugar.toFixed(0)} / 50`);

        generateAgenda();
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        if (jqXHR.status === 401) {
          location.replace('login.html')
          alert('Unauthorized')
        } else {
          alert('Error Fetch', textStatus, errorThrown);
        }
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
        if (jqXHR.status === 401) {
          location.replace('login.html')
          alert('Unauthorized')
        } else {
          alert('Error Fetch', textStatus, errorThrown);
        }
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
        if (jqXHR.status === 401) {
          location.replace('login.html')
          alert('Unauthorized')
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
  fetchCalories();
  generateAgenda();
});

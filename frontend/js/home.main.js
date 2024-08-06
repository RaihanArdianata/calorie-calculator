import externalApiService from './api/externalApiService.js';
import apiService from './api/apiService.js';
import { areaToISOCode } from './api/listArea.js';

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
    breakfast: { total_calorie: 0, target_calorie: 0, data: [] },
    lunch: { total_calorie: 0, target_calorie: 0, data: [] },
    dinner: { total_calorie: 0, target_calorie: 0, data: [] },
    snack: { total_calorie: 0, target_calorie: 0, data: [] },
  };

  const groupAgendaData = {};

  // selector
  const mealsContainer = $('#meals');
  const categoriesContainer = $('#categories');
  const agendaContainer = $('#agenda');

  const generateAgenda = () => {
    agendaContainer.empty();

    agenda.forEach((item) => {
      agendaContainer.append(`
          <div id="accordion" class="card accordion">
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
                  <p class="" id="t-card">${
                    agendaData?.[item?.toLowerCase()]?.total_calorie.toFixed(0) || 0
                  } / ${agendaData?.[item?.toLowerCase()]?.target_calorie.toFixed(0) || 0}</p>
                </div>
                <progress class="progress is-small is-primary" value="${
                  agendaData?.[item?.toLowerCase()]?.total_calorie.toFixed(0) || 0
                }" max="${
        agendaData?.[item?.toLowerCase()]?.target_calorie.toFixed(0) || 0
      }">15%</progress>
              </div>
            </div>
            <footer class="card-footer" id="btn-view-${item}">
            </footer>
            <div id="content-accordion" class="content-${item?.toLowerCase()} card-content">
              <div id="list-${item?.toLowerCase()}" class="is-flex is-flex-direction-column" style="gap: 4px">

              </div>
              <div></div>
            </div>
          </div>  
        `);

      groupAgendaData[item?.toLowerCase()]?.forEach((data) => {
        console.log(data);
        $(`#list-${item?.toLowerCase()}`).append(`
            <input id="${data?.meal?.external_id}" value="${
          data?.meal?.external_id
        }" style="visibility: hidden"/>
            <div class="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between hover" style="gap: 4px">
              <div>
                <div class="is-flex is-flex-direction-row is-align-items-center" style="gap: 4px">
                  <p>${data?.meal?.name}</p>
                  <span class="fi fi-${areaToISOCode[data?.meal?.area].toLowerCase()}"></span>
                </div>
                <span class="tag is-primary">${data?.total_calorie?.toFixed(0)} Kcal</span>
              </div>
              <div class="is-flex is-flex-direction-row is-align-items-center" style="gap: 4px">
                <button class="delete" aria-label="close"></button>
              </div>
            </div>
          `);
      });
      const button = $('<button></button>')
        .attr('id', `view-button-${item}`)
        .addClass('card-footer-item view-modal')
        .text('View')
        .on('click', () => $(`.content-${item?.toLowerCase()}`).slideToggle('fast'));

      $(`#btn-view-${item}`).append(button);
    });

    // $('.accordion').click(function () {
    //   const lowerCaseItem = $(this).find('.card-header-title').text();
    //   $(this).find(`.content-${lowerCaseItem}`).slideToggle('slow');
    // });
  };

  const fetchCalories = () => {
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
          data.forEach((item) => {
            const {
              meal,
              total_calorie: total_calorie_db,
              target_calorie: target_calorie_db,
              agenda_name,
            } = item;
            const { tr_ingredients } = meal;

            if (groupAgendaData.hasOwnProperty(`${agenda_name?.toLowerCase()}`)) {
              groupAgendaData[`${agenda_name?.toLowerCase()}`].push(item);
            } else {
              groupAgendaData[`${agenda_name?.toLowerCase()}`] = [item];
            }

            if (Array.isArray(tr_ingredients)) {
              tr_ingredients.forEach(({ ingredient }) => {
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

        generateAgenda();
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
          location.replace('login.html');
          alert('Unauthorized');
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
  fetchCalories();
  generateAgenda();
});

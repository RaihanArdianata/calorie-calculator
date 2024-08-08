import externalApiService from './api/externalApiService.js';
import apiService from './api/apiService.js';
import { areaToISOCode } from './api/listArea.js';

$(document).ready(() => {
  // state
  const agenda = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'];
  let nutritionRecord = {
    calories: 0,
    fat: 0,
    protein: 0,
    sugar: 0,
    total_portions: 0,
  };

  let agendaData = {
    breakfast: { total_calorie: 0, target_calorie: 0, total_portions: 0 },
    lunch: { total_calorie: 0, target_calorie: 0, total_portions: 0 },
    dinner: { total_calorie: 0, target_calorie: 0, total_portions: 0 },
    snack: { total_calorie: 0, target_calorie: 0, total_portions: 0 },
  };

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

  let groupAgendaData = {};

  // function
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

  // selector
  const mealsContainer = $('#meals');
  const categoriesContainer = $('#categories');
  const agendaContainer = $('#agenda');

  const generateAgenda = async () => {
    await agendaContainer.empty();

    agenda.forEach((item) => {
      console.log(agendaData, '-----agendaData-----');

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
                    agendaData?.[item?.toLowerCase()]?.total_calorie?.toFixed(0) || 0
                  } / ${agendaData?.[item?.toLowerCase()]?.target_calorie.toFixed(0) || 0}</p>
                </div>
                <progress class="progress is-small is-primary" value="${
                  (
                    Math.floor(agendaData?.[item?.toLowerCase()]?.total_calorie || 0) /
                      agendaData?.[item?.toLowerCase()]?.total_portions || 0
                  )?.toFixed(0) || 0
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
        console.log(data, ' -----data-----');

        $(`#list-${item?.toLowerCase()}`).append(`
            <div class="item-wrapper">
              <input id="${data?.id}" class="input-agenda-id" value="${
          data?.id
        }" style="visibility: hidden"/>
              <div class="is-flex is-flex-direction-row is-align-items-center is-justify-content-space-between hover" style="gap: 4px">
                <div>
                  <div class="is-flex is-flex-direction-row is-align-items-center" style="gap: 4px">
                    <p>${data?.meal?.name}</p>
                    <span class="fi fi-${areaToISOCode[data?.meal?.area].toLowerCase()}"></span>
                  </div>
                  <span class="tag is-primary">${(
                    data?.total_calorie / data?.meal?.total_portions
                  ).toFixed(0)} Kcal</span>
                </div>
                <div class="is-flex is-flex-direction-row is-align-items-center" style="gap: 4px">
                  <button id="delete-agenda" class="delete delete-agenda" aria-label="close"></button>
                </div>
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
    $('.delete-agenda').on('click', function async() {
      showLoader();
      const $agendaId = $(this).closest('.item-wrapper').find('.input-agenda-id');
      const id = $agendaId.val();

      apiService
        .delete(`api/agenda/${id}`)
        .done((response) => {
          hideLoader();
          fetchCalories();
          toastr.success('Success!');
        })
        .fail((jqXHR, textStatus, errorThrown) => {
          hideLoader();
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
    });
  };

  const fetchCalories = () => {
    showLoader();
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setDate(startDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    groupAgendaData = {};
    agendaData = {
      breakfast: { total_calorie: 0, target_calorie: 0, total_portions: 0 },
      lunch: { total_calorie: 0, target_calorie: 0, total_portions: 0 },
      dinner: { total_calorie: 0, target_calorie: 0, total_portions: 0 },
      snack: { total_calorie: 0, target_calorie: 0, total_portions: 0 },
    };
    nutritionRecord = {
      calories: 0,
      fat: 0,
      protein: 0,
      sugar: 0,
      total_portions: 0,
    };

    $('#p-calories').attr('value', nutritionRecord.calories);
    $('#p-fat').attr('value', nutritionRecord.fat);
    $('#p-protein').attr('value', nutritionRecord.protein);
    $('#p-sugar').attr('value', nutritionRecord.sugar);
    $('#t-calories').text(`${nutritionRecord.calories.toFixed(0)} / 2000`);
    $('#t-fat').text(`${nutritionRecord.fat.toFixed(0)} / 78`);
    $('#t-protein').text(`${nutritionRecord.protein.toFixed(0)} / 175`);
    $('#t-sugar').text(`${nutritionRecord.sugar.toFixed(0)} / 50`);

    apiService
      .get(`api/agenda?startDate=${startDate}&endDate=${endDate}`)
      .done((response) => {
        hideLoader();
        const { data } = response;

        if (Array.isArray(data)) {
          data.forEach((item) => {
            const {
              meal,
              total_calorie: total_calorie_db,
              target_calorie: target_calorie_db,
              agenda_name,
            } = item;
            const { tr_ingredients, total_portions: total_portions_db } = meal;

            let tmpNutritionRecord = {
              calories: 0,
              fat: 0,
              protein: 0,
              sugar: 0,
              total_portions: 0,
            };

            tmpNutritionRecord.total_portions += total_portions_db;

            if (groupAgendaData.hasOwnProperty(`${agenda_name?.toLowerCase()}`)) {
              groupAgendaData[`${agenda_name?.toLowerCase()}`].push(item);
            } else {
              groupAgendaData[`${agenda_name?.toLowerCase()}`] = [item];
            }

            if (Array.isArray(tr_ingredients)) {
              tr_ingredients.forEach(({ ingredient }) => {
                tmpNutritionRecord.calories += ingredient?.calories || 0;
                tmpNutritionRecord.fat += ingredient?.fat_total_g || 0;
                tmpNutritionRecord.protein += ingredient?.protein_g || 0;
                tmpNutritionRecord.sugar += ingredient?.sugar_g || 0;
              });
            }

            if (agendaData?.[agenda_name?.toLowerCase()]) {
              const { total_calorie, target_calorie, total_portions } =
                agendaData?.[agenda_name?.toLowerCase()];

              agendaData = {
                ...agendaData,
                [agenda_name?.toLowerCase()]: {
                  total_calorie:
                    total_calorie_db / tmpNutritionRecord.total_portions + total_calorie,
                  target_calorie: target_calorie + target_calorie_db,
                  total_portions: total_portions + total_portions_db,
                },
              };
              console.log(
                total_calorie_db,
                '-----total_calorie_db-----',
                tmpNutritionRecord.total_portions,
                '----res---',
                total_calorie_db / tmpNutritionRecord.total_portions,
              );
            }

            nutritionRecord.calories +=
              tmpNutritionRecord.calories / tmpNutritionRecord.total_portions;
            nutritionRecord.fat += tmpNutritionRecord.fat / tmpNutritionRecord.total_portions;
            nutritionRecord.protein +=
              tmpNutritionRecord.protein / tmpNutritionRecord.total_portions;
            nutritionRecord.sugar += tmpNutritionRecord.sugar / tmpNutritionRecord.total_portions;
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
        hideLoader();
        if (jqXHR.status === 401) {
          location.replace('login.html');
        }
      });
  };

  const fetchCategories = () => {
    showLoader();
    externalApiService
      .get(`list.php?c=list`)
      .done((response) => {
        hideLoader();
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
        hideLoader();
        if (jqXHR.status === 401) {
          location.replace('login.html');
        }
      });
  };

  const searchMeals = (params) => {
    showLoader();
    externalApiService
      .get(`search.php?s=${params}`)
      .done((response) => {
        hideLoader();
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
  fetchCalories();
  generateAgenda();
});

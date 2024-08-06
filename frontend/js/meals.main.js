import externalApiService from "./api/externalApiService.js";
import internalApiService from "./api/apiService.js";

const getMealId = () => new URL(location.href).searchParams.get("id");

const renderMealTags = x => {
  try {
    const container = $(`
      <div class="tags">
        <span class="tag is-primary">${x.strCategory}</span>
      </div>
    `);
    for (const tag of x.strTags.split(",")) container.append($(`<span class="tag">${tag}</span>`));
    return $(`<div></div>`).append(container).html();
  } catch {
    return "<p>No tags</p>"
  }
}

const renderIngridients = x => {
  try {
    const container = $(`
      <ul style="list-style: none; margin-inline: 0;">
      </ul>
    `);

    for(let i = 1; i <= 20; i++) {
      const ingridient = Reflect.get(x, 'strIngredient' + i);
      const measure = Reflect.get(x, 'strMeasure' + i);
      if (!ingridient || !measure) continue;
      container.append(
        $(`<li><span class="tag">${measure}</span> <span>${ingridient}</span></li>`)
      );
    }
  return $(`<div></div>`).append(container).html();
  } catch {
    return "<p>No ingridients</p>";
  }
}

const renderSteps = x => x.strInstructions.split(/\r\n|\n/).map(y => `<p>${y}</p>`).join("\n");

const renderMeal = x => `
<h3>${x.strMeal}</h3>
${renderMealTags(x)}
<div class="is-flex is-flex-direction-row is-align-items-center" style="gap: 1em">
  <h4 style="margin: 0">Ingridients</h4>
  <button class="button is-small has-text-info" id="calc">
    <span class="icon">
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="1.25"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-flask"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 3l6 0" /><path d="M10 9l4 0" /><path d="M10 3v6l-4 11a.7 .7 0 0 0 .5 1h11a.7 .7 0 0 0 .5 -1l-4 -11v-6" /></svg>
    </span>
      <span>Calc</span>
</button>
</div>
${renderIngridients(x)}
<h4>Steps</h4>
${renderSteps(x)}
<figure class="image is-16by9">
<iframe class="has-ratio" width="640" height="360" frameborder="0" allowfullscreen src="${x.strYoutube}"></iframe>
</figure>
`;

const percent = (x, total) => {
  const calc = `${((x/total) * 100).toFixed(2)}%`;
  return calc;
};

const renderCalcCell = (x, total) => {
  const cells = [];
  for (const k in x) if (k !== "calories") cells.push(`
    <div class="cell">
      <div class="progress-box">
        <div class="progress-bar" style="height: ${percent(x[k], total)}"></div>
        <h3 class="is-size-4 is-size-6-mobile">${k}</h3>
      </div>
      <div class="block is-flex is-justify-content-center has-text-primary mt-2 has-text-weight-bold">${x[k].toFixed(2)}mg</div>
    </div>
  `);
  return cells.join("\n");
}
/**
 * @typedef {Object} Calculation
 * @property {number} sugar
 * @property {number} fiber
 * @property {number} sodium
 * @property {number} potassium
 * @property {number} fat
 * @property {number} calories
 * @property {number} cholesterol
 * @property {number} protein
 * @property {number} carbo
 *
 * @function renderCalc
 * @param {Calculation} x
 * @param {number} total
 */
const renderCalc = (x, total) => `
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Calculation</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          <div class="fixed-grid has-4-cols">
            <div class="grid">
              ${renderCalcCell(x, total)}
            </div>
          </div>
        </section>
        <div class="modal-card-foot is-flex is-justify-content-center">
          <div class="content has-text-centered">
          <h1 class="has-text-primary">Calories</h1> <h2>${x.calories.toFixed(2)}</h2>
        </div>
        </div>
      </div>
`;

const calc = id => {
  $("button#calc").addClass("is-loading");
  internalApiService.get(`api/meals/${id}`).done(({ data }) => {
    $("button#calc").removeClass("is-loading");
    const calculation = {
      sugar: 0,
      fiber: 0,
      sodium: 0,
      potassium: 0,
      fat: 0,
      calories: 0,
      cholesterol: 0,
      protein: 0,
      carbo: 0,
    }
    for (const { ingredient } of data.tr_ingredients) {
      calculation.sugar += ingredient.sugar_g;
      calculation.fiber += ingredient.fiber_g;
      calculation.sodium += ingredient.sodium_mg / 1_000;
      calculation.potassium += ingredient.potassium_mg / 1_000;
      calculation.fat += ingredient.fat_total_g;
      calculation.calories += ingredient.calories;
      calculation.cholesterol += ingredient.cholesterol_mg / 1_000;
      calculation.protein += ingredient.protein_g;
      calculation.carbo+= ingredient.carbohydrates_total_g;
    }
    let total = 0;
    for (const k in calculation) if(k !== "calories") total += calculation[k];
    console.log(total);
    $("#modal-calc")
      .addClass("is-active")
      .html(renderCalc(calculation, total));
    $("#modal-calc")
      .find(".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button")
      .on("click", _ => $("#modal-calc").removeClass("is-active"));
    console.log(calculation);
  });
}

export const whenLoaded = () => {
  if (window.location.pathname !== "/meals.html") return;
  externalApiService.get(`lookup.php?i=${getMealId()}`)
    .done(x => {
      $("#meal-image").attr("src", x.meals[0].strMealThumb);
      $("#meal-detail").html(renderMeal(x.meals[0]));
      $("button#calc").on("click", calc.bind(this, x.meals[0].idMeal));
    });
}

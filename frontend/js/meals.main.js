import apiService from "./api/externalApiService.js";

const getMealId = () => new URL(location.href).searchParams.get("id");

const renderMealTags = x => {
  const container = $(`
    <div class="tags">
      <span class="tag is-primary">${x.strCategory}</span>
    </div>
  `);
  for (const tag of x.strTags.split(",")) container.append($(`<span class="tag">${tag}</span>`));
  return $(`<div></div>`).append(container).html();
}

const renderIngridients = x => {
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
}

const renderSteps = x => x.strInstructions.split(/\r\n|\n/).map(y => `<p>${y}</p>`).join("\n");

const renderMeal = x => `
<h3>${x.strMeal}</h3>
${renderMealTags(x)}
<h4>Ingridients</h4>
${renderIngridients(x)}
<h4>Steps</h4>
${renderSteps(x)}
<figure class="image is-16by9">
<iframe class="has-ratio" width="640" height="360" frameborder="0" allowfullscreen src="${x.strYoutube}"></iframe>
</figure>
`;

export const whenLoaded = () => {
  apiService.get(`lookup.php?i=${getMealId()}`)
    .done(x => {
      $("#meal-image").attr("src", x.meals[0].strMealThumb);
      $("#meal-detail").html(renderMeal(x.meals[0]));
    });
}

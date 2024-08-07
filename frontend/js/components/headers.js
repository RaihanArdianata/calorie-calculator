$(document).ready(function () {
  const randomVariant = Math.floor(Math.random() * 3) + 1;
  const randomVariantMany = Math.floor(Math.random() * 9) + 1;
  const glassesProbability = Math.floor(Math.random() * 100) + 1;
  const seedNumber = Math.floor(Math.random() * 2) + 1;

  const variant = {
    brows: `variant0${randomVariantMany}`,
    eyes: `variant0${randomVariant}`,
    glasses: `variant0${randomVariantMany}`,
    nose: `variant0${randomVariantMany}`,
    lips: `variant0${randomVariantMany}`,
    glassesProbability: `${glassesProbability}`,
  };

  const seed = ['Felix', 'Aneka'];

  $('#image-avatar').attr(
    'src',
    `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${seed[seedNumber - 1]}&brows=${
      variant.brows
    }&eyes=${variant.eyes}&glasses=${variant.glasses}&glassesProbability=${
      variant.glassesProbability
    }&nose=${variant.nose}&lips=${variant.lips}`,
  );
  $('.image-avatar').attr(
    'src',
    `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${seed[seedNumber - 1]}&brows=${
      variant.brows
    }&eyes=${variant.eyes}&glasses=${variant.glasses}&glassesProbability=${
      variant.glassesProbability
    }&nose=${variant.nose}&lips=${variant.lips}`,
  );
});

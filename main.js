const elList = document.querySelector(".movies-list");
const elTempMovie = document.querySelector(".item-temp").content;
const elTemplateFragment = document.createDocumentFragment();
const moviess = movies.slice(0,100)
for (const film of moviess) {
  const tempfrag = elTempMovie.cloneNode(true);
  tempfrag.querySelector(".js-title").textContent = film.Title;
  tempfrag.querySelector(".js-runtime").textContent = Math.floor(film.runtime/60) + "h. " + film.runtime%60 + "min.";
  tempfrag.querySelector(".js-language").textContent = film.language;
  tempfrag.querySelector(".js-categories").textContent = film.Categories;
  tempfrag.querySelector(".js-year").textContent = film["movie_year"];
  elTemplateFragment.appendChild(tempfrag);
  const jd = film.runtime/60
  console.log(Math.floor(film.runtime/60));
}

elList.appendChild(elTemplateFragment);
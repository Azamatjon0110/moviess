
const elForm = document.querySelector(".js-form");
const elInput = elForm.querySelector(".js-input");
const elInputStart = document.querySelector(".js-input-start");
const elInputEnd = document.querySelector(".js-input-end");
const elFormSelect = document.querySelector(".form-select");
const elMovieList = document.querySelector(".list");
const elMovieTemp = document.querySelector(".js-movie-template").content;
const elMovieFragment = document.createDocumentFragment();

const elModal = document.querySelector(".modal");
const modalTitle = elModal.querySelector(".modal-title");
const modalIframe = elModal.querySelector(".modal-iframe");
const modalRating = elModal.querySelector(".modal-rating");
const modalYear = elModal.querySelector(".modal-year");
const modalRuntime = elModal.querySelector(".modal-runtime");
const modalCategories = elModal.querySelector(".modal-categories");
const modalSummary = elModal.querySelector(".modal-summary");
const modalLink = elModal.querySelector(".modal-imdb-link");
// const moviess = movies.slice(0, 20);
// const cat =[]
// movies.forEach(item => {
//   item.Categories.split("|").forEach(function(title){
//     if(!genres.includes(title)){
//       genres.push(title);
//       const selectOption = document.createElement("option");
//       selectOption.textContent = title;
//       elFormSelect.appendChild(selectOption);
//     }
//   })
// });

function getDuration (time){
  const hours = Math.floor(time / 60 );
  const minuts = Math.floor(time % 60 );
  return `${hours} hrs ${minuts} min  `
}

function renderMovies(kino){
  elMovieList.innerHTML = "";
  kino.forEach(item => {
    const elCloneMovie = elMovieTemp.cloneNode(true);
    elCloneMovie.querySelector(".movie-img").src = `https://i3.ytimg.com/vi/${item.ytid}/mqdefault.jpg `;
    elCloneMovie.querySelector(".movie-title").textContent = item.Title;
    elCloneMovie.querySelector(".movie-rating").textContent = item.imdb_rating;
    elCloneMovie.querySelector(".movie-year").textContent = item.movie_year;
    elCloneMovie.querySelector(".movie-runtime").textContent =  getDuration(item.runtime);
    elCloneMovie.querySelector(".movie-categories").textContent = item.Categories.split("|").join(", ");
    elCloneMovie.querySelector(".movie-btn").dataset.id = item.imdb_id;
    elMovieFragment.appendChild(elCloneMovie);
  });
  elMovieList.appendChild(elMovieFragment)
};

function genresFunction (genresArray){
  const genres = [];
  const genresFrag  = new DocumentFragment();
  genresArray.forEach(item => {
    item.Categories.split("|").forEach(element => {
      if(!genres.includes(element)){
        genres.push(element);
      }
    })
  })
  genres.forEach(function(title){
    const selectOption = document.createElement("option");
    selectOption.textContent = title;
    genresFrag.appendChild(selectOption);
    elFormSelect.appendChild(genresFrag)
  })
}

function renderModalInfo(kino){
  modalTitle.textContent = kino.Title;
  modalIframe.src = `https://www.youtube-nocookie.com/embed/${kino.ytid}`;
  modalRating.textContent = kino.imdb_rating;
  modalYear.textContent = kino.movie_year;
  modalRuntime.textContent = getDuration(kino.runtime);
  modalCategories.textContent = kino.Categories.split("|").join(", ");
  modalSummary.textContent = kino.summary;
  modalLink.href = `https://www.imdb.com/title/${kino.imdb_id}`;
}


// event delegation
elMovieList.addEventListener("click",(evt)=>{
  const targetElement = evt.target
  if(targetElement.matches(".movie-btn")){
    const btnId = targetElement.dataset.id
    const foundMovie = movies.find(movie => movie.imdb_id === btnId);
    renderModalInfo(foundMovie);
  }
});

elModal.addEventListener("hide.bs.modal", function(){
  modalIframe.src = "";
})

elForm.addEventListener("submit" , function(evt){
  evt.preventDefault();

  const inputValue = elInput.value.trim();
  const selectValue = elFormSelect.value;
  const elInputNumberStart = Number(elInputStart.value);
  const elInputNumberEnd = Number(elInputEnd.value);
  const regexTitle = new RegExp(inputValue, "gi");
  const regexGenres = new RegExp(elFormSelect, "gi");
  const searchMovie = movies.filter (item => String(item.Title).match(regexTitle) && (item.Categories.match(regexGenres) || selectValue === "All") && (elInputNumberStart >= item.movie_year && elInputNumberEnd <= item.movie_year)|| (elInputNumberStart == "" && elInputNumberEnd <= item.movie_year) || (elInputNumberStart >= item.movie_year && elInputNumberEnd == "") );

  if(searchMovie.length > 0 ){
    renderMovies(searchMovie);
  }else{
    elMovieList.innerHTML = "Movie not found !!!"
  }
});
genresFunction(movies)
renderMovies(movies.slice(0,12));
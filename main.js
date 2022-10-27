
const elForm = document.querySelector(".js-form");
const elInput = elForm.querySelector(".js-input");
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
const moviess = movies.slice(0, 20);


function getDuration (time){

  const hours = Math.floor(time / 60 );
  const minuts = Math.floor(time % 60 );
  return `${hours} hrs ${minuts} min  `

}

function renderMovies(kino){

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

}

function renderModalInfo(topilganKino){
  modalTitle.textContent = topilganKino.Title;
  modalIframe.src = `https://www.youtube-nocookie.com/embed/${topilganKino.ytid}`;
  modalRating.textContent = topilganKino.imdb_rating;
  modalYear.textContent = topilganKino.movie_year;
  modalRuntime.textContent = getDuration(topilganKino.runtime);
  modalCategories.textContent = topilganKino.Categories.split("|").join(", ");
  modalSummary.textContent = topilganKino.summary;
  modalLink.href = `https://www.imdb.com/title/${topilganKino.imdb_id}`;
}


// event delegation
elMovieList.addEventListener("click",(evt)=>{
  const targetElement = evt.target
  if(targetElement.matches(".movie-btn")){
    const btnId = targetElement.dataset.id
    const foundMovie = moviess.find(movie => movie.imdb_id === btnId);
    renderModalInfo(foundMovie);
  }
});

elModal.addEventListener("hide.bs.modal", function(){
  modalIframe.src = "";
})

elForm.addEventListener("submit" , function(evt){
  evt.preventDefault();
});



renderMovies(moviess);

const elForm = document.querySelector(".js-form");
const elInput = elForm.querySelector(".js-input");
const elInputStart = document.querySelector(".js-input-start");
const elInputEnd = document.querySelector(".js-input-end");
const elFormSelect = document.querySelector(".formselect");
const elSortSelect = document.querySelector(".sort-select");
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

const bookmarkList = document.querySelector(".bookmark-list")
const bookmarkTemp = document.querySelector(".bookmark-template").content;

const localBookmark = JSON.parse(localStorage.getItem("bookmark"));
const bookmarkArray = localBookmark || [];

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
    elCloneMovie.querySelector(".add-bookmark").dataset.id = item.imdb_id;
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
    });
    genres.sort();
  });
  genres.forEach(function(title){
    const selectOption = document.createElement("option");
    selectOption.textContent = title;
    genresFrag.appendChild(selectOption);
    elFormSelect.appendChild(genresFrag);
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

function sortMovie( arr,formSelectValue){
  if(formSelectValue === "a-z"){
   arr.sort((a,b)=>{
      if (a.Title > b.Title){
        return 1
      }
      else if(a.Title < b.Title){
        return -1
      }else{
        return 0
      }
    })
  };
  if(formSelectValue === "z-a"){
   arr.sort((a,b)=>{
      if (a.Title > b.Title){
        return -1
      }
      else if(a.Title < b.Title){
        return 1
      }else{
        return 0
      }
    })
  };
  if(formSelectValue === "oldyear-newyear"){
   arr.sort((a,b)=>{
      if (a.movie_year > b.movie_year){
        return 1
      }
      else if(a.movie_year < b.movie_year){
        return -1
      }else{
        return 0
      }
    })
  };
  if(formSelectValue === "newyear-oldyear"){
   arr.sort((a,b)=>{
      if (a.movie_year > b.movie_year){
        return -1
      }
      else if(a.movie_year < b.movie_year){
        return 1
      }else{
        return 0
      }
    })
  };
  if(formSelectValue === "0-10"){
   arr.sort((a,b)=>{
      if (a.imdb_rating > b.imdb_rating){
        return 1
      }
      else if(a.imdb_rating < b.imdb_rating){
        return -1
      }else{
        return 0
      }
    })
  };
  if(formSelectValue === "10-0"){
   arr.sort((a,b)=>{
      if (a.imdb_rating > b.imdb_rating){
        return -1
      }
      else if(a.imdb_rating < b.imdb_rating){
        return 1
      }else{
        return 0
      }
    })
  };
}


function addBookmark (arr,list){
  list.innerHTML = null;
  const frag = new DocumentFragment();
  arr.forEach(item => {
    const template = bookmarkTemp.cloneNode(true);
    template.querySelector(".movie-img").src = `https://i3.ytimg.com/vi/${item.ytid}/mqdefault.jpg `;
    template.querySelector(".movie-title").textContent = item.Title;
    template.querySelector(".delete-btn").dataset.id = item.imdb_id;
    frag.appendChild(template);
  });
  window.localStorage.setItem("bookmark", JSON.stringify(bookmarkArray))
  list.appendChild(frag);
};

addBookmark(bookmarkArray,bookmarkList)
// event delegation
elMovieList.addEventListener("click",(evt)=>{
  const targetElement = evt.target
  if(targetElement.matches(".movie-btn")){
    const btnId = targetElement.dataset.id
    const foundMovie = movies.find(movie => movie.imdb_id === btnId);
    renderModalInfo(foundMovie);
  }
  if(targetElement.matches(".add-bookmark")){
    const addBtnId = targetElement.dataset.id;
    const addObj =  movies.find(item => item.imdb_id === addBtnId);
    if(!bookmarkArray.includes(addObj)){
      bookmarkArray.push(addObj);
    }
    window.localStorage.setItem("bookmark", JSON.stringify(bookmarkArray));
    addBookmark(bookmarkArray,bookmarkList);
  }
});

elModal.addEventListener("hide.bs.modal", function(){
  modalIframe.src = "";
});

function filterArray(inVal, selcVal ){
  return movies.filter (item =>{
    return (item.Title.toString().match(inVal)) && (selcVal == "All" ||  item.Categories.includes(selcVal)) && (elInputStart.value == "" || item.movie_year >= Number(elInputStart.value)) && (elInputEnd.value == "" || item.movie_year <= Number(elInputEnd.value))});
}


elForm.addEventListener("submit" , function(evt){
  evt.preventDefault();

  const inputValue = elInput.value.trim();
  const selectValue = elFormSelect.value;
  const regexTitle = new RegExp(inputValue, "gi");
  const searchMovie = filterArray(regexTitle, selectValue);

  if(searchMovie.length > 0 ){
    sortMovie(searchMovie,elSortSelect.value)
    renderMovies(searchMovie);

  }else{
    elMovieList.innerHTML = "Movie not found !!!"
  }
});

bookmarkList.addEventListener("click", function(evt){
  evt.preventDefault();
  if(evt.target.matches(".delete-btn")){
    const delBtnId = evt.target.dataset.id;
    const delMovie = bookmarkArray.find(item => item.imdb_id === delBtnId);
    bookmarkArray.splice(delMovie,1);
    window.localStorage.setItem("bookmark", JSON.stringify(bookmarkArray))
    addBookmark(bookmarkArray,bookmarkList);
  }
})

genresFunction(movies)
renderMovies(movies.slice(0,12));

"use strict";

const API_BASE_URL = "https://balkaninsight.com/wp-json/wp/v2/posts";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const c = urlParams.get("category");

const contentArticles = document.querySelector(".content__articles");
const loadBtn = document.querySelector(".content__btn-wrapper");
const loader = document.querySelector(".content__loader");
const loader2 = document.querySelector(".content__loader2");

const alb = document.querySelector(".albania");
const albId = alb.getAttribute("value");

let currentCategory = albId;
let currentPage = 1;

const lists = document.querySelectorAll("li");
let currentActive = document.querySelector(".active");

const rememberCountry = (country_id) => {
  const url = new URL(window.location.href);
  url.searchParams.set("category", country_id);
  window.history.replaceState({}, "", url);
};

lists.forEach((list) => {
  list.addEventListener("click", function () {
    if (currentActive) {
      currentActive.classList.remove("active");
    }
    currentActive = this;
    currentActive.classList.add("active");
    fetchNews(currentActive.getAttribute("value"));
  });
});

if (c) {
  const currentList = document.querySelector(
    `.main-header__categories[value="${c}"]`
  );
  if (currentActive) {
    currentActive.classList.remove("active");
  }
  currentActive = currentList;
  currentActive.classList.add("active");
}

const renderNews = function (data) {
  data.forEach((news) => {
    let html = `
        <a href="single.html?id=${news.id}&countryId=${currentCategory}">
            <article class="content__article"  id="article-${news.id}">
                    <img src="${
                      news.yoast_head_json.og_image[0].url
                    }" alt="" class="content__img" style="width: 500px; max-width: 100%; height: 300px; object-fit: cover;></img>
                    <p class="content__title">${news.title.rendered}</p>
                    <p class="content__content">${news.excerpt.rendered}</p>
                    <h6 class="content__publisheddate">${news.yoast_head_json.article_published_time.substring(
                      0,
                      10
                    )}</h6>
            </article>
        </a>
        `;
    contentArticles.insertAdjacentHTML("beforeend", html);
  });
};

const showLoader = function (loaderName) {
  if (loaderName == "loader1") {
    loadBtn.style.display = "none";
    contentArticles.innerHTML = "";
    contentArticles.classList.add("loading");
  } else if (loaderName == "loader2") {
    loader2.style.display = "block";
    loadBtn.style.display = "none";
  }
};

const hideLoader = function (loaderName) {
  if (loaderName == "loader1") {
    contentArticles.classList.remove("loading");
    loadBtn.style.display = "block";
  } else if (loaderName == "loader2") {
    loader2.style.display = "none";
    loadBtn.style.display = "block";
  }
};

const fetchNews = async function (country_id = c || albId) {
  try {
    rememberCountry(country_id);
    currentCategory = country_id;
    showLoader("loader1");

    let data = await fetch(
      `${API_BASE_URL}?per_page=10&categories=${country_id}`
    );
    data = await data.json();

    renderNews(data);
    hideLoader("loader1");
  } catch (err) {
    console.error("Something went wrong", err);
  }
};

const fetchMoreNews = async function () {
  try {
    currentPage++;
    showLoader("loader2");

    let data = await fetch(
      `${API_BASE_URL}?per_page=10&page=${currentPage}&categories=${currentCategory}`
    );
    data = await data.json();
    renderNews(data);

    hideLoader("loader2");
  } catch (err) {
    console.log("Something went wrong", err);
  }
};

loadBtn.addEventListener("click", fetchMoreNews);

fetchNews();

"use strict";

const API_BASE_URL = "https://balkaninsight.com/wp-json/wp/v2/posts";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const categoryFromSp = urlParams.get("category");
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


const urlParamss = new URLSearchParams(window.location.search);
const categoryFromURL = urlParams.get('category');
const isValidCategory = Number.isInteger(parseInt(categoryFromURL));


if (!isValidCategory) {
  const url = new URL(window.location.href);
  url.searchParams.set('category', '206');
  window.location.href = url.toString();
}

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

if (categoryFromSp) {
  const currentList = document.querySelector(
    `.main-header__categories[value="${categoryFromSp}"]`
  );
  if (currentActive) {
    currentActive.classList.remove("active");
  }
  currentActive = currentList;
  currentActive.classList.add("active");
}

const renderNews = (data) => {
  data.forEach((news) => {
    let html = `
        <a href="single.html?id=${
          news.id
        }&countryId=${currentCategory}" class="content__link">
            <article class="content__article"  id="article-${news.id}">
                    <img src="${
                      news.yoast_head_json.og_image[0].url
                    }" alt="No image found" class="content__img" style="width: 500px; max-width: 100%; height: 300px; object-fit: cover;"/>
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


const toggleLoader = (loaderName, show) => {
  if (loaderName === "loader1") {
    if (show) {
      loadBtn.style.display = "none";
      contentArticles.innerHTML = "";
      contentArticles.classList.add("loading");
    } else {
      contentArticles.classList.remove("loading");
      loadBtn.style.display = "block";
    }
  } else if (loaderName === "loader2") {
    if (show) {
      loader2.style.display = "block";
      loadBtn.style.display = "none";
    } else {
      loader2.style.display = "none";
      loadBtn.style.display = "block";
    }
  }
};


const fetchNews = async (
  country_id = categoryFromSp || albId,
  per_page = 10,
  page = 1
) => {
  try {
    rememberCountry(country_id);
    currentCategory = country_id;
    const loader = page === 1 ? "loader1" : "loader2";
    toggleLoader(loader,true);
    
    let data = await fetch(
      `${API_BASE_URL}?per_page=${per_page}&page=${page}&categories=${country_id}`
    );
    data = await data.json();

    renderNews(data);
    toggleLoader(loader,false);
  } catch (err) {
    console.error("Something went wrong", err);
  }
};

let pageNext = 1;
loadBtn.addEventListener("click", () => {
  pageNext++;
  fetchNews(currentCategory, 10, pageNext);
});

fetchNews();

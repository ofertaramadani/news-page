const API_BASE_URL = "https://balkaninsight.com/wp-json/wp/v2/posts";

const queryParams = new URLSearchParams(window.location.search);
const articleId = queryParams.get("id");
const c = queryParams.get("countryId");

const singleArticles = document.querySelector(".single__articles");
const loader = document.querySelector(".loader");
const gobackbtn = document.querySelector(".single__btn");

const renderSingleNews = (data) => {
  let html = `
        <article class="single__article"  id="article-${data.id}">
                    <h2 class="single__title">${data.title.rendered}</h2>
                    <img src="${
                      data.yoast_head_json.og_image[0].url
                    }" alt="No image found" class="single__img">
                    <p class="single__content">${data.content.rendered}</p>
                    <h6 class="single__publisheddate">${data.yoast_head_json.article_published_time.substring(
                      0,
                      10
                    )}</h6>
        </article>
    `;
  singleArticles.insertAdjacentHTML("afterbegin", html);
};

const showLoader = () => {
  gobackbtn.style.display = "none";
  singleArticles.innerHTML = "";
  singleArticles.classList.add("loading");
};
const hideLoader = () => {
  singleArticles.classList.remove("loading");
  gobackbtn.style.display = "block";
};
const fetchSingleNews = async (articleId) => {
  try {
    showLoader();
    let data = await fetch(`${API_BASE_URL}/${articleId}?_embed=1`);
    data = await data.json();
    renderSingleNews(data);
    hideLoader();
  } catch (err) {
    console.error("Something went wrong", err);
    alert("Something went wrong");
  }
};

fetchSingleNews(articleId);

gobackbtn.addEventListener("click", () => {
  window.location.href = `/index.html?category=${c}`;
});


import { logout, LoginStatus } from "../module/func.mjs";


const posts = document.querySelector(".post");

const logInLink = document.querySelector("#lo");
const signInLink = document.querySelector("#si");
const logOutBtn = document.querySelector(".logout");

const pageButtons = document.querySelector(".pageButtons");

let numOfContent = 12;
const showContent = 9;
const showButton = 10;
let maxContent = 9;
let maxButton = 10;
const maxPage = Math.ceil(numOfContent / maxContent);


window.addEventListener("load", LoginStatus(logInLink, signInLink, logOutBtn));
logOutBtn.addEventListener("click", logout);

// function fetchData(){
//   return axios
//     .get("http://localhost:8080/api/v1/posts?sort=createdAt,desc", {
//       headers: { Authorization: "Bearer" + localStorage.getItem("token") },
//     })
//     .then((res) => {
//       res.data
//     })
//     .catch((err) => {
//       console.log(err);
//     });

// } promise 방법.

async function fetchData() {
  try {
    const response = await axios.get("http://localhost:8080/api/v1/posts?sort=createdAt,desc");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


const sortSelectEl = document.getElementById('sort');
async function sortData(sortType) {
  const data = await fetchData();
  if (sortType === '최신순') {
    data.sort((a, b) => b.createdAt - a.createdAt)
    render(1, data);
  } else if (sortType === "오래된순") {
    data.sort((a, b) => a.createdAt - b.createdAt)
    render(1, data);
  } else {
    data.sort((a, b) => b.recommendCnt - a.rrecommendCnt);
    render(1, data);
  }

}


sortSelectEl.addEventListener('change', (event) => {
  const sortType = event.target.value;
  sortData(sortType);
})
sortData("최신순");




function makeContents(
  id,
  img,
  hashtag,
  location,
  postOption,
  title,
  postContents,
  profilePhoto,
  profileName,
  userLook
) {
  const content = document.createElement("li");
  content.classList.add("box");
  content.innerHTML = `
    <img src=${img} alt="" class="thumbnail" id=${id}>
    <div class="hashTag">${hashtag}</div>
    <div class="blackBox">
        <i class="fa-solid fa-location-dot"></i>
        <p>${location}</p></div>

    <div id="title" >
        <span>${postOption}</span>
        <span>${title}</span>
    </div>
    <div id="postContents" >${postContents}</div>
    <div class="userAndLook" >
        <div id="user">
            <img src=${profilePhoto} alt="">
            <span>${profileName}</span>
        </div>
        
        <div id="look">
            <i class="fa-regular fa-eye"></i>
            <span>${userLook}</span>
        </div>
    </div>`;
  posts.appendChild(content);
}

//밑에 페이지 태그
const makeButton = (id) => {
  const button = document.createElement("Button");
  button.classList.add("button");
  button.dataset.num = id;
  button.innerText = id;
  //button이라는 버튼을 만들고 클래스는 button, num은 id값, html에 id값을 넣어줌
  button.addEventListener("click", (e) => {
    //Array.prototype.forEach.call(pageButtons.children, (button) => {
    [].forEach.call(pageButtons.children, (button) => {
      // pageButtons.forEach((button) => {
      if (button.dataset.num) button.classList.remove("active");
    }); // 콜백함수 사용이유가
    e.target.classList.add("active");
    renderContent(parseInt(e.target.dataset.num));
  }); //버튼 클릭 시 페이지버튼의 자식요소들마다 콜백함수 실행,
  // 콜백함수는 버튼의 num이 0이 아니면() 버튼의 클래스 active지움.
  // 이때 클래스 active는 색깔 빨갛게 변하는 것.
  // e.target은 특정 이벤트가 발생하는 태그 가져옴.->버튼 클릭 시 active 클래스 됨.(빨게짐)
  //renderContent함수 실행(클릭한 버튼의 num을 renderContent함수에 전달.)
  //                                 ->
  return button;
};
//위에 button -> buttons 로 바꾸고 buttons.forEach(button넣기) 로
///////////////////////////////////////////////////

const goPrevPage = () => {
  page -= maxButton;
  render(page);
};

const goNextPage = () => {
  page += maxButton;
  render(page);
};

const prev = document.createElement("button");
prev.classList.add("button", "prev");
prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
prev.addEventListener("click", goPrevPage);

const next = document.createElement("button");
next.classList.add("button", "next");
next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
next.addEventListener("click", goNextPage);

///////////////////////////////////////////////////////////

const renderContent = (page, dataarr) => {
  // 목록 리스트 초기화
  while (posts.hasChildNodes()) {
    posts.removeChild(posts.lastChild);
  }

  // 글의 최대 개수를 넘지 않는 선에서, 화면에 최대 10개의 글 생성
  // for (let id = (page - 1) * maxContent + 1; id <= page * maxContent && id <= numOfContent; id++) {
  //   makeContents(dataarr[id].imageUrl,dataarr[id].postMapList.keyword, dataarr[id].category, dataarr[id].title, dataarr[id].content, "https://placeimg.com/25/25", dataarr[id].writer, dataarr[id].viewCnt);
  // }

  dataarr.forEach((data) =>
    makeContents(
      data.id,
      data.imageUrl,
      data.hashTag,
      data.postMapList[0].keyword,
      data.category,
      data.title,
      data.content,
      "https://placeimg.com/25/25",
      data.writer,
      data.viewCnt
    )
  );
};

const renderButton = (page) => {
  // 버튼 리스트 초기화
  while (pageButtons.hasChildNodes()) {
    pageButtons.removeChild(pageButtons.lastChild);
  }

  // 화면에 최대 10개의 페이지 버튼 생성
  for (let id = page; id < page + maxButton && id <= maxPage; id++) {
    pageButtons.appendChild(makeButton(id));
  }
  // 첫 버튼 활성화(class="active")
  pageButtons.children[0].classList.add("active");

  pageButtons.prepend(prev);
  pageButtons.append(next);

  // 이전, 다음 페이지 버튼이 필요한지 체크
  if (page - maxButton < 1) pageButtons.removeChild(prev);
  if (page + maxButton > maxPage) pageButtons.removeChild(next);
};

const render = (page, dataarr) => {
  renderContent(page, dataarr);
  renderButton(page);
};





const mainButton = document.querySelector(".mainButton");
mainButton.addEventListener("click", function () {
  window.location = "/contentPage";
});

const searchIcon = document.querySelector("#searchIcon");
searchIcon.addEventListener("click", function () {
  window.location = "/research";
});


const postsClicks = document.querySelectorAll(".thumbnail");
function transPost(id) {
  window.location = `/contentLook/${id}`;
}
console.log(postsClicks);
postsClicks.forEach((postClick) =>
  postClick.addEventListener("click", (e) => {
    transPost(e.target.id);
  })
);








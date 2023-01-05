if (sessionStorage.getItem("userId") !== null) {
  const userName = document.getElementById("user-name");
  console.log(sessionStorage.getItem('firstname'))
  userName.setAttribute('value', sessionStorage.getItem('firstname'))
  getUserComments();
  console.log("hit userComments");
} else {
  getAllComments();
  console.log("hit AllComments");
}

const form = document.querySelector("form");
const seAll = document.getElementById("see-all");
const nameInput = document.querySelector("#presidents-name");
const presidentComment = document.getElementById("president-comment");
const seePres = document.getElementById("all-pres");
const presContainer = document.querySelector("#pres-container");
const userName = document.getElementById("user-name");
const seeAllComments = document.getElementById("see-all-comments");
const userComments = document.getElementById("user-comments");
const allComments=document.getElementById('allComments')


var modal = document.getElementById("myModal");
var btn = document.getElementById("modalButton");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};




function getPresidentsSecond() {
  axios.get("http://localhost:4004/presidentsSecond").then((res) => {
    res.data.forEach((presidents) => {
      const secondPres = document.createElement("option");
      secondPres.setAttribute("value", presidents["id"]);
      //console.log(presidents)

      const info = `<h1></h1>
              <div class="president-card">
             <h3>${presidents.name}</h3>
             <img src="${presidents.image_url}" alt="president's picture">
            <p>Term: ${presidents.term_start} - ${presidents.term_end}</p>
            <p>Party: ${presidents.party}</p>
            <p>Rating: ${presidents.rating}</p>
           
           </div>
          `;
      seePres.innerHTML += info;
    });
  });
}




function seeCard(arr) {
  
  arr.forEach((comments) => {
    const allComments = document.createElement("option");
    allComments.setAttribute("value", comments["id"]);
    //console.log(presidents)

    const info = `<h1></h1>
    <div class="comments-card">
    <h3>${comments.firstname} here is your ratings</h3>
  <p>President's Name: ${comments.name}</p>
  <p>Comment: ${comments.comment}</p>
  <p>Rating: ${comments.rating}</p>
 </div>
 <button onclick="deleteComments(${comments.commentsid})">Delete</button>
 
`

seeAllComments.innerHTML += info;

  });
  seeAllComments.innerHTML += `<button  class="allCom" onclick="getAllComments()">See All Comments</button>`;

}





function getUserComments() {
  const userId = sessionStorage.getItem("userId");
console.log('getUserComments')
  axios.get(`http://localhost:4004/userComments/${userId}`).then((res) => {
    if (res.status === 200) {
      const userComments = res.data;
      seeCard(userComments);
      
    }
    
  });
}



function getAllComments() {
  

console.log('getUserCommentsall')
  axios.get("http://localhost:4004/allComments").then((res) => {
    //seeCard(res.data);
    const container = document.getElementById('comments-container');
      const comments = res.data;

      // Display the comments on the page
      comments.forEach((comments) => {
        
        const info = `
          <div class="comments-card">
            <h3>${comments.firstname}'s rating</h3>
            <p>President's Name: ${comments.name}</p>
            <p>Comment: ${comments.comment}</p>
            <p>Rating: ${comments.rating}</p>
          </div>
        `
        container.innerHTML += info;
      });
    });

  
}
//window.onload = getAllComments;


function createPresidentDropDown() {
  const selectTag = document.getElementById("presidents-name");
  axios.get("http://localhost:4004/presidentsSecond").then((res) => {
    res.data.forEach((presidents) => {
      const secondPres = document.createElement("option");
      secondPres.setAttribute("value", presidents["id"]);
      secondPres.textContent = presidents.name;
      selectTag.appendChild(secondPres);
    });
  });
}



function deleteComments(id) {
  axios
    .delete(`http://localhost:4004/allComments/${id}`)
    .then(() => getAllComments())

    .catch((err) => console.log("err here delete"));

  window.location.href = "Rating.html";
}




function handleSubmit(e) {
  e.preventDefault();

  if (presidentComment.value.length <= 0 || userName.value.length <= 0) {
    alert("Please fill out the required field");
  } else {
    let userRating = document.querySelector(
      'input[name="rating"]:checked'
    ).value;
    
    
    let body = {
      presidentsId: nameInput.value,
      userName: userName.value,
      rating: +userRating,
      comment: presidentComment.value,
      vote_user_id: sessionStorage.getItem("userId"),
    };

    axios
      .post(
        `http://localhost:4004/presidents/${nameInput.value}/comments`,body)
      .then((res) => {
        nameInput.value = "";
        document.querySelector("#rating-one").checked = true;
        //getPresidentsSecond()
        if (res.status == 200) {
          alert("Your comment is saved!");
        } else {
          alert("There was a problem try again later!!!");
        }

        const commentElement = document.createElement("div");
        commentElement.innerText = presidentComment.value;
        document.body.appendChild(commentElement);
        presidentComment.innerHTML += commentElement;
        console.log(commentElement);
        window.location.href = "Rating.html";
      });
  }
}





createPresidentDropDown();
getPresidentsSecond();

form.addEventListener("submit", handleSubmit);

const userId = window.location.pathname.split("/")[2];
const followBtn = document.getElementById("followBtn");

function addFollow() {
  axios.post(`http://localhost:3000/users/${userId}/follow`)
    .then(res => {
      if(res.status === 200) {// OK
        followBtn.innerText = "Unfollow";
        followBtn.classList.remove("btn-primary");
        followBtn.classList.add("btn-light");
      }
    })
    .catch(err => console.log(err));
}

function deleteFollow() {
  axios.delete(`http://localhost:3000/users/${userId}/follow`)
    .then(res => {
      if(res.status === 200) {// OK
        followBtn.innerText = "Follow";
        followBtn.classList.remove("btn-light");
        followBtn.classList.add("btn-primary");
      }
    })
    .catch(err => console.log(err));
}

// addFollow();
followBtn.addEventListener("click", function() {
  if (followBtn.innerText.toLowerCase() === "follow") {
    addFollow();
  } else {
    deleteFollow();
  }
});

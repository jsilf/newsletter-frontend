window.addEventListener("load", async () => {
  if (localStorage.getItem("loggedIn")) {
    loggedInPage();
  } else {
    loggedInView.style.display = "none";
  }
});
//knappar
let loginBtn = document.getElementById("loginBtn");
let saveChanged = document.getElementById("saveChange");
let addBtn = document.getElementById("addBtn");
//input
let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let subscribe = document.getElementById("subscribe");
let loggedInsubscribe = document.getElementById("loggedInsubscribe");
let changeSubscription = document.getElementById("changeSubscription");
//vyer
let loggedInView = document.getElementById("loggedinPage");
let welcomePage = document.getElementById("welcomePage");
let loginWrap = document.getElementById("loginWrap");
let loginContainer = document.getElementById("loginContainer");
//respons från server
let responseWrap = document.getElementById("errormsg");
let msg = document.createElement("p");
responseWrap.append(msg);

////////////////
/* INLOGGNING */
////////////////
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    usernameVal = usernameInput.value;
    passwordVal = passwordInput.value;

    let body = {
      username: usernameVal,
      password: passwordVal,
    };
    //POST autentisering inlogg
    let response = await makeRequest(
      "http://localhost:3000/api/users/login",
      "POST",
      body
    );
    // console.log(response);
    localStorage.setItem("userId", response);
  } catch (err) {
    msg.innerText = "Fel inlogg, försök igen";
  }
  //spara id i localstorage
  let savedUserId = localStorage.getItem("userId");

  if (savedUserId) {
    console.log("Inloggning stämmer");
    loggedInPage();
  } else {
    msg.innerText = "Fel användarnamn eller lösen, försök igen";
  }
});

////////////////////////////
/* REGISTRERA NY ANVÄNDARE*/
////////////////////////////
addBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  addNewUser();
});

async function addNewUser() {
  try {
    //Inputvärdet
    usernameVal = usernameInput.value;
    passwordVal = passwordInput.value;
    let subscribeVal;
    if (subscribe.checked === true) {
      subscribeVal = true;
    } else {
      subscribeVal = false;
    }
    let body = {
      username: usernameVal,
      password: passwordVal,
      subscribed: subscribeVal,
    };
    //POST ny användare
    let response = await makeRequest(
      "http://localhost:3000/api/users/add",
      "POST",
      body
    );
    // console.log(response);
    msg.innerText = response;
  } catch (err) {
    console.log(err);
    msg.innerText = response;
  }
}

/////////////////
/* INLOGGAD VY */
/////////////////
function loggedInPage() {
  localStorage.setItem("loggedIn", true);

  welcomePage.style.display = "none";
  loggedInView.style.display = "block";
  loginWrap.style.display = "none";
  //skapar utloggningsknapp i inloggad vy
  let logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutBtn";
  logoutBtn.innerText = "Logga ut";
  loginContainer.prepend(logoutBtn);
  loginBtn.style.display = "none";
  addBtn.style.display = "none";
  usernameInput.value.innerHTML = "";

  //Logga ut
  logoutBtn.addEventListener("click", async (e) => {
    // console.log("Loggar ut");
    e.preventDefault();
    logoutBtn.remove();
    location.reload();
    localStorage.clear();
  });
}
//////////////////////////////////////////////
/* ÄNDRA PRENUMERATIONSSTATUS I INLOGGAD VY */
//////////////////////////////////////////////
saveChanged.addEventListener("click", async (e) => {
  e.preventDefault();
  changeUserSubscription();
});

async function changeUserSubscription() {
  try {
    let userId = localStorage.getItem("userId");
    let usernameVal = usernameInput.value;
    let passwordVal = passwordInput.value;
    let subscribeVal;

    if (loggedInsubscribe.checked === true) {
      subscribeVal = true;
    } else {
      subscribeVal = false;
    }
    let body = {
      _id: userId,
      username: usernameVal,
      password: passwordVal,
      subscribed: subscribeVal,
    };
    //PUT ändra prenumeration
    let response = await makeRequest(
      "http://localhost:3000/api/users/",
      "PUT",
      body
    );
    // console.log(response);
    changeSubscription.innerText = response;
  } catch (err) {
    console.log(err);
    alert("Kunde inte ändra prenumeration");
  }
}
///////////////////////////////////////////
/* FUNKTION ASYNC MAKE REQUEST FÖR FETCH */
///////////////////////////////////////////
async function makeRequest(url, method, body) {
  //try, catch error hantering
  try {
    let response = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(response);
    if (response.status != 200) {
      throw response;
    }
    return await response.json();
  } catch (error) {
    throw new Error("Not found");
  }
}

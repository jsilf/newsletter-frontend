window.addEventListener("load", async () => {
  //kolla om redan inloggad, annars utloggad
  if (localStorage.getItem("loggedIn")) {
    loggedInPage();
  } else {
    loggedInView.style.display = "none";
  }
});

let loginBtn = document.getElementById("loginBtn");
let saveChanged = document.getElementById("saveChange");
let addBtn = document.getElementById("addBtn");
//inputs
let usernameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
let subscribe = document.getElementById("subscribe");
let loggedInsubscribe = document.getElementById("loggedInsubscribe");
//loginwrapper och meddelande "fel inlogg"
let loginWrap = document.getElementById("loginWrap");
let loginContainer = document.getElementById("loginContainer");
let errorMsg = document.getElementById("errormsg");
//views
let loggedInView = document.getElementById("loggedinPage");
let welcomePage = document.getElementById("welcomePage");

let msg = document.createElement("p");
errorMsg.append(msg);

//////////////
/* LOGGA IN */
//////////////
loginBtn.addEventListener("click", async (e) => {
  let userStorage = localStorage.getItem("userId");
  //errorMsg.innerHTML = "";

  usernameVal = usernameInput.value;
  passwordVal = passwordInput.value;

  //Hämta användare för att kolla så användaren finns, jämför och logga in
  let data = await makeRequest("http://localhost:5000/api/users", "GET");
  // console.log(data);
  let checkUser = data.find((user) => user.username === usernameVal);

  console.log(checkUser);

  if (checkUser) {
    console.log("check user: ", checkUser.username);

    if (
      checkUser.username === usernameVal &&
      checkUser.password === passwordVal
    ) {
      //SPARA USERID TILL LOCALSTORAGE
      if (userStorage) {
        userStorage = JSON.parse(userStorage);
      } else {
        userStorage = [];
      }
      localStorage.setItem("userId", JSON.stringify(checkUser._id));
      console.log("Inloggning stämmer");
      loggedInPage();
    }
  } else {
    console.log("Användarnamnet eller lösen finns inte");
    msg.innerText = "Fel användarnamn eller lösen, försök igen";
  }
});

///////////////////////////////////////////
/* REGISTRERA NY ANVÄNDARE + PRENUMERERA */
///////////////////////////////////////////
async function addNewUser() {
  //validering användarnamn finns redan??
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

    //POST
    let body = {
      username: usernameVal,
      password: passwordVal,
      subscribed: subscribeVal,
    };
    let status = await makeRequest(
      "http://localhost:5000/api/users/add",
      "POST",
      body
    );
    msg.innerText = "Sparad användare";
    console.log(status);
  } catch (err) {
    msg.innerText = "Kunde inte spara ny användare, försök igen";
  }
}
/* LÄGGA TILL NY ANVÄNDARE KNAPP */
addBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  addNewUser();
});

/////////////////
/* INLOGGAD VY */
/////////////////
function loggedInPage() {
  welcomePage.style.display = "none";
  loggedInView.style.display = "block";
  loginWrap.style.display = "none";
  //skapa utloggningsknapp i inloggad vy
  let logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutBtn";
  logoutBtn.innerText = "Logga ut";
  loginContainer.prepend(logoutBtn);
  loginBtn.style.display = "none";
  addBtn.style.display = "none";
  usernameInput.value.innerHTML = "";

  /* ÄNDRA PRENUMERATION */
  saveChanged.addEventListener("click", async (e) => {
    e.preventDefault();
    changeUserSubscription();
  });

  //Logga ut
  logoutBtn.addEventListener("click", async (e) => {
    //ladda om sidan och rensa localstorage
    logoutBtn.remove();
    location.reload();
    localStorage.clear();
  });
  // sparar inloggadsida tills man klickar loggar ut och localstorage rensas
  localStorage.setItem("loggedIn", true);
}

/* ÄNDRA PRENUMERATIONSSTATUS I INLOGGAD VY */
async function changeUserSubscription() {
  try {
    let userId = JSON.parse(localStorage.getItem("userId"));
    let usernameVal = usernameInput.value;
    let passwordVal = passwordInput.value;
    let subscribeVal;

    if (loggedInsubscribe.checked === true) {
      subscribeVal = true;
    } else {
      subscribeVal = false;
    }

    //PUT
    let body = {
      _id: userId,
      username: usernameVal,
      password: passwordVal,
      subscribed: subscribeVal,
    };

    let status = await makeRequest(
      "http://localhost:5000/api/users/",
      "PUT",
      body
    );
    console.log(status);
  } catch (err) {
    alert("Kunde inte ändra prenumeration");
  }
}

/* FUNKTION ASYNC MAKE REQUEST FÖR FETCH */
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
    console.log(response);
    if (response.status != 200) {
      throw response;
    }
    return await response.json();
  } catch (error) {
    throw new Error("Not found");
  }
}

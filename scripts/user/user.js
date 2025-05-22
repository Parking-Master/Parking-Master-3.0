(async () => {
  await import("https://unpkg.com/parse@3.4.4/dist/parse.min.js");
  Parse.initialize("sixz0SUXueXB5ag6LNjX7RcHk3KAQI8UCA3shKwh","09yqaddyyjykuIyeBHlNyTTnnXTS73ZryQNaB0vp"),Parse.serverURL="https://parseapi.back4app.com/";
  Parse.serverURL = "https://parseapi.back4app.com/";
  userMan = {};
  userMan.isLoggedIn = false;
  if (!!localStorage["userman-username"] && !!localStorage["userman-password"]) {
    userMan.isLoggedIn = true;
  }
  setInterval(() => {
    if (!!localStorage["userman-username"] && !!localStorage["userman-password"]) {
      userMan.isLoggedIn = true;
    }
  }, 1000);
  userMan.errorCodes = {
    101: "Information is wrong",
    200: "Error parsing input",
    201: "Values are missing"
  };
  userMan.logIn = function logIn(username, password, callback, err, additionalRows = null, redirectTo = null) {
    callback("Hold on, we're working on it...");
    let user = Parse.User.logIn(username, password).then(function(user) {
      callback("Logged in. Redirecting...");
      localStorage.setItem("userman-username", username);
      localStorage.setItem("userman-password", password);
      if (additionalRows) {
        additionalRows.forEach(x => {
          localStorage.setItem("userman-" + x.trim(), (typeof user.get(x) == "object" ? JSON.stringify(user.get(x)) : user.get(x)) + "." + typeof user.get(x));
        });
      }
      setTimeout(() => {
        if (redirectTo) return location.replace(redirectTo.toString());
        parent.postMessage("reload", "*");
        parent.document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      }, 1000);
    }).catch(function(error) {
      console.log(error);
      err("Error: Failed to login. Check your password and try again.\n\nError Code: " + error.code + " (" + userMan.errorCodes[error.code] + ")");
    });
  }
  userMan.logOut = function logOut(reload = true) {
    Parse.User.logOut();
    Object.keys(localStorage).forEach(x => x.startsWith("u-") && localStorage.removeItem(x));
    sessionStorage.clear();
    reload && location.reload(true);
  }
  userMan.signUp = async function signUp(username, password, extraRows, callback, err, loginPath) {
    if (!username) {
      return err("Please enter a username.");
    }
    if (!password) {
      return err("Please enter a password.");
    }
    if (password.length < 8) {
      return err("Please enter a password longer than 7 characters.");
    }
    if (password.length > 20) {
      return err("Please enter a password shorter than 20 characters.");
    }
    if (username.length < 3) {
      return err("Please enter a username longer than 2 characters.");
    }
    if (username.length > 12) {
      return err("Please enter a username shorter than 12 characters.");
    }
    if (/[\ \#\$\%\^\*\(\)\+\=\[\]\{\}\;\:\'\"\\\/\.\,]|[^\u0000-\u00ff]/.test(password)) {
      return err("Password contains invalid characters!");
    }
    if (/[\#\%\*\(\)\+\=\[\]\{\}\;\:\'\"\\\/\,]|[^\u0000-\u00ff]/.test(username)) {
      return err("Username contains invalid characters!");
    }
    let user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    Object.keys(extraRows).forEach(x => {
      user.set(x.toString().trim(), extraRows[x]);
    });
    try {
      user = await user.save();
      if (user !== null) {
        callback("Success! You will need to log in now.");
      }
    } catch (error) {
      error.code == 202 ? err("Error: A user already exists with that username.") : err(error.message);
      console.log(error);
    }
  }
  userMan.get = function(row) {
    if (!localStorage["userman-" + row.trim()]) return null;
    let type = localStorage["userman-" + row.trim()].split(".").pop();
    let data = localStorage["userman-" + row.trim()].split(".").reverse().splice(1).reverse().join(".");
    let parsed = type == "object" ? JSON.parse(data) : type == "number" ? data - 0 : type == "boolean" ? (data == "true") : data;
    return parsed;
  }
  userMan.set = function(key, value, callback, colums = ["username", "password"], error = () => {}) {
    if (key == "password") {
      return;
    }
    let username = userMan.get(colums[0]);
    let password = userMan.get(colums[1]);
    Parse.User.logOut();
    let user = Parse.User.logIn(username, password).then(function(user) {
      user.set(key.toString().trim(), value);
      user.save().then(() => {}).catch(err => {
        error(err.code);
        callback = () => {};
      });
      Object.keys(localStorage).forEach(x => {
        if (!x.startsWith("userman")) return;
        localStorage.setItem("userman-" + x.split("-")[1].trim(), (typeof user.get(x.split("-")[1]) == "object" ? JSON.stringify(user.get(x.split("-")[1])) : user.get(x.split("-")[1])) + "." + typeof user.get(x.split("-")[1]));
        setTimeout(() => callback(), 200);
      });
    });
  }
  userMan.update = function(columns = ["username", "password"], callback = null) {
    let username = userMan.get(columns[0]);
    let password = userMan.get(columns[1]);
    Parse.User.logOut();
    let user = Parse.User.logIn(username, password).then(function(user) {
      Object.keys(localStorage).forEach(key => {
        if (!key.startsWith("userman")) return;
        localStorage[key] = (key.includes("password") ? password : typeof user.get(key.split("-")[1]) == "object" ? JSON.stringify(user.get(key.split("-")[1])) : user.get(key.split("-")[1])) + "." + typeof user.get(key.split("-")[1]);
        callback && callback(key.split("-")[1], userMan.get(key.split("-")[1]));
      });
    });
  }
})();
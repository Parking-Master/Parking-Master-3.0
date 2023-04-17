InfoVerifier = function(type, info, err, success) {
  if (type == "username") {
    let username = info;
    if (!username) {
      return err("Please enter a username.");
    } else if (username.length < 3) {
      return err("Please enter a username longer than 2 characters.");
    } else if (username.length > 12) {
      return err("Please enter a username shorter than 12 characters.");
    } else if (/[\#\%\*\(\)\+\=\[\]\{\}\;\:\'\"\\\/\,]|[^\u0000-\u00ff]/.test(username)) {
      return err("Username contains invalid characters!");
    } else success();
  } else if (type == "password") {
    let password = info;
    if (!password) {
      return err("Please enter a password.");
    } else if (password.length < 8) {
      return err("Please enter a password longer than 7 characters.");
    } else if (password.length > 20) {
      return err("Please enter a password shorter than 20 characters.");
    } else if (/[\ \#\$\%\^\*\(\)\+\=\[\]\{\}\;\:\'\"\\\/\.\,]|[^\u0000-\u00ff]/.test(password)) {
      return err("Password contains invalid characters!");
    } else success();
  }
};
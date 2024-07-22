document.getElementById("password").addEventListener("input", function () {
  var password = this.value;
  var result = owaspPasswordStrengthTest.test(password);
  var feedback = document.getElementById("feedback");

  if (result.strong) {
    feedback.textContent = "Your password is strong!";
    feedback.className = "feedback success";
  } else {
    feedback.textContent = "Your password is weak: " + result.errors.join(" ");
    feedback.className = "feedback error";
  }
});

document
  .getElementById("show-password")
  .addEventListener("change", function () {
    var passwordField = document.getElementById("password");
    if (this.checked) {
      passwordField.type = "text";
    } else {
      passwordField.type = "password";
    }
  });

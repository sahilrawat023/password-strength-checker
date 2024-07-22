(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.owaspPasswordStrengthTest = factory();
  }
})(this, function () {
  var owasp = {};

  owasp.configs = {
    allowPassphrases: true,
    maxLength: 128,
    minLength: 10,
    minPhraseLength: 20,
    minOptionalTestsToPass: 4,
  };

  owasp.config = function (params) {
    for (var prop in params) {
      if (params.hasOwnProperty(prop) && this.configs.hasOwnProperty(prop)) {
        this.configs[prop] = params[prop];
      }
    }
  };

  owasp.tests = {
    required: [
      function (password) {
        if (password.length < owasp.configs.minLength) {
          return (
            "The password must be at least " +
            owasp.configs.minLength +
            " characters long."
          );
        }
      },
      function (password) {
        if (password.length > owasp.configs.maxLength) {
          return (
            "The password must be fewer than " +
            owasp.configs.maxLength +
            " characters."
          );
        }
      },
      function (password) {
        if (/(.)\1{2,}/.test(password)) {
          return "The password may not contain sequences of three or more repeated characters.";
        }
      },
    ],
    optional: [
      function (password) {
        if (!/[a-z]/.test(password)) {
          return "The password must contain at least one lowercase letter.";
        }
      },
      function (password) {
        if (!/[A-Z]/.test(password)) {
          return "The password must contain at least one uppercase letter.";
        }
      },
      function (password) {
        if (!/[0-9]/.test(password)) {
          return "The password must contain at least one number.";
        }
      },
      function (password) {
        if (!/[^A-Za-z0-9]/.test(password)) {
          return "The password must contain at least one special character.";
        }
      },
    ],
  };

  owasp.test = function (password) {
    var result = {
      errors: [],
      failedTests: [],
      passedTests: [],
      requiredTestErrors: [],
      optionalTestErrors: [],
      isPassphrase: false,
      strong: true,
      optionalTestsPassed: 0,
    };

    var i = 0;
    this.tests.required.forEach(function (test) {
      var err = test(password);
      if (typeof err === "string") {
        result.strong = false;
        result.errors.push(err);
        result.requiredTestErrors.push(err);
        result.failedTests.push(i);
      } else {
        result.passedTests.push(i);
      }
      i++;
    });

    if (
      this.configs.allowPassphrases === true &&
      password.length >= this.configs.minPhraseLength
    ) {
      result.isPassphrase = true;
    }

    if (!result.isPassphrase) {
      var j = this.tests.required.length;
      this.tests.optional.forEach(function (test) {
        var err = test(password);
        if (typeof err === "string") {
          result.errors.push(err);
          result.optionalTestErrors.push(err);
          result.failedTests.push(j);
        } else {
          result.optionalTestsPassed++;
          result.passedTests.push(j);
        }
        j++;
      });
    }

    if (
      !result.isPassphrase &&
      result.optionalTestsPassed < this.configs.minOptionalTestsToPass
    ) {
      result.strong = false;
    }

    return result;
  };

  return owasp;
});

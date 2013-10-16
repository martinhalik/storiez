/* TODOS
  1 - Login se nedokáže provést znovu, při zadání špatných údajů
  2 - E-mail hint
  3 - Ask MarekH how to animate all background transitions

  need real API not apiary.io
    A - sign up
        Aa. - connect with FB
    B - login
        Ba. - wrong password
    C - List people via their IDs not names, because now it's vurnerable with duplicates
    D - photoupload

NOW

*/
//ShortCuts
var companions = function() {
  slide = 2;
  nextStep();
  document.getElementById('companions_title').innerHTML = 'This is title';
  whoWasThereWithYou();
};
var photo = function() {
  slide = 3;
  nextStep();
};

// API adress
var api = 'http://orwen.apiary.io/python/api/',
    token = null,
    friendsWhoWereThere = {},
    title = null;
var console;

//Some functions needed via process
//Show enter option to continue via sections
var sections = document.getElementsByTagName('section'), //creates an array of sections
    slide = -1;

var showEnterHint = function() {
  var press_enter = sections[slide].getElementsByTagName('button')[0];
  press_enter.className = 'block';
};
// Move to next Style
var nextStep = function() {
    slide = slide + 1;
    sections[slide].className += 'block' + ' ' + 'reveal';
    if (slide > 1) {
      showActualLabel();
    }
  document.body.className = '';
};

// Get Personal details
var apiGetUserInfo = function(token, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api + 'userinfo');
  xhr.setRequestHeader('X-Auth-Token', token);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.status === 200);
    }
  };
  xhr.send();
};

// Find out if user is logged in or need to login
var loggedOrNot = function () {
  var token = window.localStorage.token;
  if (token) {
    apiGetUserInfo(token, function(loggedIn) {
      console.log('a');
      if (loggedIn) {
        nextStep();
        nextStep();
      } else {
        nextStep();
        setTimeout(function () {
          document.getElementById('login_mail').focus();
        }, 100);
      }
    })
  } else {
    nextStep();
    setTimeout(function () {
      document.getElementById('login_mail').focus();
    }, 100);
  }
}

// Login
var apiLogIn = function(username,password) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api + 'user?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password));
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText);
      token = json.token;
      window.localStorage.token = token;
      //Get userInfo
      apiGetUserInfo(token);
      // and move to next slide
      nextStep();
      setTimeout(function () {
        document.getElementById('title_textarea').focus();
      }, 100);
    } else if (xhr.readyState === 4 ) {
      console.log('Někde je problem (mozna blby mail), ale vse je stazeno.');
      showEnterHint();
    }
  };
  xhr.send();
};

// Sign up user
var apiSignUp = function(email) {
  var usernameInput = document.getElementById('login_username'),
    username = usernameInput.value,
    password = document.getElementById('login_pass');
  usernameInput.className = 'block';
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api + 'adduser?username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password) + '&usermail=' + email);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText);
      token = json.token;
      console.log(json);
      console.log('TOKEN z registrace:' + token);
    } else if (xhr.readyState === 4){
          console.log('Někde je problem (mozna blby mail), ale vse je stazeno.');
    }
  };
  xhr.send();
};

// LogIn and Sign up process
var apiMailExists = function(email) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api + 'mailExists?email=' + email);
  xhr.onreadystatechange = function() {
      //4 === everything has been downloaded, 200  ==== everything is allright
      if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText),
            username = json.name,
            profile_pic = json.profile_pic,
            login_userClass = document.getElementById('login_user');
          // so it wouldn't cycle
          if (login_userClass.className.indexOf('block') > -1 || login_userClass !== 'block') {
            login_userClass.className = 'block' + ' ' + 'reveal';
            document.getElementById("login_mail").className = 'none';
            document.getElementById("login_name").innerHTML = username;
            document.getElementById('login_name_split').innerHTML = username;
            document.getElementById('profile_pic').src = profile_pic;

            // not a Martin?
            document.getElementById('not_a_user').addEventListener('click', function() {
              login_userClass.className = 'none';
              document.getElementById("login_mail").className = 'block';
            } );
            // Move next
            var login_pass = document.getElementById('login_pass');
            var password = login_pass.value;
            var processToLogin = function() {
              login_pass.addEventListener('keypress', function (ev) {
                if(ev.keyCode === 13) {
                  apiLogIn(username,password);
                }
              });
            };
            processToLogin();
            setTimeout(showEnterHint, 300);
          }
      } else if (xhr.readyState === 4 && xhr.status === 404) {
          console.log('E-mail is not found');
          apiSignUp(email);
      } else if (xhr.readyState === 4) {
          console.log('ERROR');
      }
  };
  xhr.send();
};

// Get FB friends
var apiFbFriends = function(callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', api + 'fb-friends');
  xhr.setRequestHeader('X-Auth-Token', token);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText),
        friends = json.results.friends.data;
      // window.friends = friends; not working :(
      callback(friends);
    }
  };
  xhr.send();
};
// Who was with You?
var whoWasThereWithYou = function () {
  apiFbFriends(function (friends) {
    var friendsDiv = document.getElementById('friends'),
      tag_friends = document.getElementById('tag_friends'),
      tag_friends_input = document.getElementById('companions_input');
    tag_friends_input.focus();
    // 'Cause these are friends and you can skip it
    document.getElementById('companions_next').addEventListener('click', nextStep);
    // List your FB friends
    for (var i = 0; i < friends.length; i++) {
      friendsDiv.innerHTML += '<img src="' + friends[i].profile_pic + '" alt="' + friends[i].name + '" id="' + friends[i].id + '"></a>';
    }

    // Type whoWereThere
    var tagFriends = function () {
      tag_friends.innerHTML = '';
      for (var id in friendsWhoWereThere) {
        tag_friends.innerHTML += '<span id="' + id + '" class="tag_friend">' + id + '</span> ';
      }
    };

    // Add or remove friends from story via images
    friendsDiv.addEventListener('click', function(event) {
      if (event.target.tagName === 'IMG') {
        if (friendsWhoWereThere.hasOwnProperty(event.target.alt) === true) {
          delete friendsWhoWereThere[event.target.alt];
        } else {
          friendsWhoWereThere[event.target.alt] = true;
        }
        tagFriends();
      }
    });
    // Add or remove friends via input
    tag_friends_input.addEventListener('keypress', function(event) {
      if (event.keyCode === 13 ) {
        if (tag_friends_input.value === '') {
          nextStep();
        } else {
          friendsWhoWereThere[tag_friends_input.value] = true;
          tag_friends_input.value = '';
          tagFriends();
        }
      }
    });
  });
};

// Create a story
var createStory = function() {
  // Write a title
  var textarea = document.getElementById('title_textarea');
  textarea.addEventListener('keypress', function (ev) {
    title = textarea.value;
    document.getElementById('companions_title').innerHTML = title;
    if (title.length > 7) {
      console.log('It is long enough');
      showEnterHint();
      var alreadySubmitted = false;
      if (ev.keyCode === 13 && !alreadySubmitted) {
        nextStep();
        whoWasThereWithYou();
        alreadySubmitted = true;
      }
    } else {
      console.log('Not enough');
    }
  });
};

//SHow the right icon
var showActualLabel = function () {
  var label = document.getElementById('all_label');
  label.className = 'visible' + ' ' + sections[slide].id + '_label';
};

// Move to the first slide
window.onload = function () {
  nextStep();
  var loadAnimationForFirstSlide = function() {
    document.getElementById('landing_page').className = 'fade-in';
  };
  setTimeout(loadAnimationForFirstSlide,0);
  createStory();
};

//Get from logo to next step
document.getElementById("logo").addEventListener("click", function() {
  loggedOrNot();
});

// LOGIN or SIGN UP
// login info
var mailExists = function() {
  var email = document.getElementById('login_mail').value;
  apiMailExists(email);
  };
document.getElementById('login_pass').addEventListener('focus', mailExists);

// Upload Photo
document.getElementById('upload_span').addEventListener('click', function() {
  var body = document.body;
  body.className = 'app-loading';
  document.getElementById('story_background').style.backgroundImage = 'url("img/photo.jpg")';
  setTimeout(function() {
    nextStep();
    chooseFilter();
  },1400);
});

// switch filters menu ON / OFF
var showFilters = function(onoff) {
  var filtersDiv = document.getElementById('filter');
  if (onoff === true){
    setTimeout(function() {
      filtersDiv.className = 'show_filters';
    }, 300);
  } else if (onoff === false) {
    filtersDiv.className = '';
  }
};
// switch Label ON / OFF
var showLabel = function (onoff) {
  var label = document.getElementById('all_label');
  label.className = 'dismiss';
};

// Choose a Filter
var chooseFilter = function () {
  var filters = ['normal', 'grayscale', 'graypia', 'sepia' ],
    list_filtersDiv = document.getElementById('list_filters'),
    backgroundPic = document.getElementById('story_background');

  // No label this time
  showLabel(false);
  //If you want to skip/continue
  document.getElementById('story_next').addEventListener('click', function () {
    nextStep();
    writeYourStory();
  });
  // Time to show you filters
  showFilters(true);

  // Lets choose a filter
  var listFilters = function() {
    for (var i = 0; i < filters.length; i++) {
      list_filtersDiv.innerHTML += '<img src="img/photo_thumbnail.png" class="filter_' + filters[i] + '" />';
    }
  };
  listFilters();
  list_filtersDiv.addEventListener('click', function (event) {
    if (event.target.tagName === 'IMG') {
      backgroundPic.className = event.target.className;
    }
  });
};

// Write your story
var writeYourStory = function() {
  var backgroundPic = document.getElementById('story_background'),
    textOfStory = document.getElementById('story_text'),
    publishStory = document.getElementById('publish_button'),
    filter = backgroundPic.className;
  // title is defined
  // friendsWhoWereThere {} too
  showFilters(false);
  showLabel(false);

  /* Do I have all data I need?
  console.log(title + filter);
  for (var friend in friendsWhoWereThere) {
    console.log(friend);
  }*/
  // Testing version
  title = 'This is my adorable title';
  friendsWhoWereThere = {
    Martina: true,
    Marek: true
  }

  //Now lets get Real Writing
  document.getElementById('story_title').innerHTML = title;
  for (var friend in friendsWhoWereThere) {
    withWho = document.getElementById('story_with_edit');
    withWho.innerHTML += friend + ' ';
  }
  textOfStory.focus();
  textOfStory.addEventListener('keypress', function (event) {
    if (textOfStory.innerHTML.length !== '') {
      textOfStory.setAttribute('data-placeholder', ' ' );
    } else {
      textOfStory.setAttribute('data-placeholder', 'Type your text here.' );
    }
  });
  publishStory.addEventListener('click', function() {
    document.body.className = 'app-loading';
  });
};



//Login and signup form
/* TODO email hint
var allFilled = function () {
  document.getElementById("login_mail").addEventListener("input", function() {
  // How to make it easier for 98% people
  var mailSites = ["gmail.com",
        "yahoo.com",
        "hotmail.com",
        "seznam.cz",
        "yandex.ru",
        "me.com",
        "live.com",
        "msn.com"];
    if(this.value !== '') {
      var mailName = this.value.split('@')[0];
      var mailAddr = this.value.split('@')[1];
      for (var i = 0; i < mailSites.length; i++) {
        if(mailAddr === mailSites[i].substring(0, mailAddr.length)) {
          document.getElementById('login_mail').value = mailName + '@' + mailSites[i];
          break;
        } else {
          document.getElementById('login_mail').innerHTML = '';
        }
      }
    }
});
}
allFilled();
*/

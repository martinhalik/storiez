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

*///ShortCuts
var companions=function(){slide=2;nextStep();document.getElementById("companions_title").innerHTML="This is title";whoWasThereWithYou()},photo=function(){slide=3;nextStep()},api="http://orwen.apiary.io/python/api/",token=null,friendsWhoWereThere={},title=null,console,sections=document.getElementsByTagName("section"),slide=-1,showEnterHint=function(){var e=sections[slide].getElementsByTagName("button")[0];e.className="block"},nextStep=function(){slide+=1;sections[slide].className+="block reveal";slide>1&&showActualLabel();document.body.className=""},apiGetUserInfo=function(e,t){var n=new XMLHttpRequest;n.open("GET",api+"userinfo");n.setRequestHeader("X-Auth-Token",e);n.onreadystatechange=function(){n.readyState===4&&t(n.status===200)};n.send()},loggedOrNot=function(){var e=window.localStorage.token;if(e)apiGetUserInfo(e,function(e){console.log("a");if(e){nextStep();nextStep()}else{nextStep();setTimeout(function(){document.getElementById("login_mail").focus()},100)}});else{nextStep();setTimeout(function(){document.getElementById("login_mail").focus()},100)}},apiLogIn=function(e,t){var n=new XMLHttpRequest;n.open("GET",api+"user?username="+encodeURIComponent(e)+"&password="+encodeURIComponent(t));n.onreadystatechange=function(){if(n.readyState===4&&n.status===200){var e=JSON.parse(n.responseText);token=e.token;window.localStorage.token=token;apiGetUserInfo(token);nextStep();setTimeout(function(){document.getElementById("title_textarea").focus()},100)}else if(n.readyState===4){console.log("Někde je problem (mozna blby mail), ale vse je stazeno.");showEnterHint()}};n.send()},apiSignUp=function(e){var t=document.getElementById("login_username"),n=t.value,r=document.getElementById("login_pass");t.className="block";var i=new XMLHttpRequest;i.open("GET",api+"adduser?username="+encodeURIComponent(n)+"&password="+encodeURIComponent(r)+"&usermail="+e);i.onreadystatechange=function(){if(i.readyState===4&&i.status===200){var e=JSON.parse(i.responseText);token=e.token;console.log(e);console.log("TOKEN z registrace:"+token)}else i.readyState===4&&console.log("Někde je problem (mozna blby mail), ale vse je stazeno.")};i.send()},apiMailExists=function(e){var t=new XMLHttpRequest;t.open("GET",api+"mailExists?email="+e);t.onreadystatechange=function(){if(t.readyState===4&&t.status===200){var n=JSON.parse(t.responseText),r=n.name,i=n.profile_pic,s=document.getElementById("login_user");if(s.className.indexOf("block")>-1||s!=="block"){s.className="block reveal";document.getElementById("login_mail").className="none";document.getElementById("login_name").innerHTML=r;document.getElementById("login_name_split").innerHTML=r;document.getElementById("profile_pic").src=i;document.getElementById("not_a_user").addEventListener("click",function(){s.className="none";document.getElementById("login_mail").className="block"});var o=document.getElementById("login_pass"),u=o.value,a=function(){o.addEventListener("keypress",function(e){e.keyCode===13&&apiLogIn(r,u)})};a();setTimeout(showEnterHint,300)}}else if(t.readyState===4&&t.status===404){console.log("E-mail is not found");apiSignUp(e)}else t.readyState===4&&console.log("ERROR")};t.send()},apiFbFriends=function(e){var t=new XMLHttpRequest;t.open("GET",api+"fb-friends");t.setRequestHeader("X-Auth-Token",token);t.onreadystatechange=function(){if(t.readyState===4&&t.status===200){var n=JSON.parse(t.responseText),r=n.results.friends.data;e(r)}};t.send()},whoWasThereWithYou=function(){apiFbFriends(function(e){var t=document.getElementById("friends"),n=document.getElementById("tag_friends"),r=document.getElementById("companions_input");r.focus();document.getElementById("companions_next").addEventListener("click",nextStep);for(var i=0;i<e.length;i++)t.innerHTML+='<img src="'+e[i].profile_pic+'" alt="'+e[i].name+'" id="'+e[i].id+'"></a>';var s=function(){n.innerHTML="";for(var e in friendsWhoWereThere)n.innerHTML+='<span id="'+e+'" class="tag_friend">'+e+"</span> "};t.addEventListener("click",function(e){if(e.target.tagName==="IMG"){friendsWhoWereThere.hasOwnProperty(e.target.alt)===!0?delete friendsWhoWereThere[e.target.alt]:friendsWhoWereThere[e.target.alt]=!0;s()}});r.addEventListener("keypress",function(e){if(e.keyCode===13)if(r.value==="")nextStep();else{friendsWhoWereThere[r.value]=!0;r.value="";s()}})})},createStory=function(){var e=document.getElementById("title_textarea");e.addEventListener("keypress",function(t){title=e.value;document.getElementById("companions_title").innerHTML=title;if(title.length>7){console.log("It is long enough");showEnterHint();var n=!1;if(t.keyCode===13&&!n){nextStep();whoWasThereWithYou();n=!0}}else console.log("Not enough")})},showActualLabel=function(){var e=document.getElementById("all_label");e.className="visible "+sections[slide].id+"_label"};window.onload=function(){nextStep();var e=function(){document.getElementById("landing_page").className="fade-in"};setTimeout(e,0);createStory()};document.getElementById("logo").addEventListener("click",function(){loggedOrNot()});var mailExists=function(){var e=document.getElementById("login_mail").value;apiMailExists(e)};document.getElementById("login_pass").addEventListener("focus",mailExists);document.getElementById("upload_span").addEventListener("click",function(){var e=document.body;e.className="app-loading";document.getElementById("story_background").style.backgroundImage='url("img/photo.jpg")';setTimeout(function(){nextStep();chooseFilter()},1400)});var showFilters=function(e){var t=document.getElementById("filter");e===!0?setTimeout(function(){t.className="show_filters"},300):e===!1&&(t.className="")},showLabel=function(e){var t=document.getElementById("all_label");t.className="dismiss"},chooseFilter=function(){var e=["normal","grayscale","graypia","sepia"],t=document.getElementById("list_filters"),n=document.getElementById("story_background");showLabel(!1);document.getElementById("story_next").addEventListener("click",function(){nextStep();writeYourStory()});showFilters(!0);var r=function(){for(var n=0;n<e.length;n++)t.innerHTML+='<img src="img/photo_thumbnail.png" class="filter_'+e[n]+'" />'};r();t.addEventListener("click",function(e){e.target.tagName==="IMG"&&(n.className=e.target.className)})},writeYourStory=function(){var e=document.getElementById("story_background"),t=document.getElementById("story_text"),n=document.getElementById("publish_button"),r=e.className;showFilters(!1);showLabel(!1);title="This is my adorable title";friendsWhoWereThere={Martina:!0,Marek:!0};document.getElementById("story_title").innerHTML=title;for(var i in friendsWhoWereThere){withWho=document.getElementById("story_with_edit");withWho.innerHTML+=i+" "}t.focus();t.addEventListener("keypress",function(e){t.innerHTML.length!==""?t.setAttribute("data-placeholder"," "):t.setAttribute("data-placeholder","Type your text here.")});n.addEventListener("click",function(){document.body.className="app-loading"})};
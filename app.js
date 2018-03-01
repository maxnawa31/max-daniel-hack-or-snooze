/////////////////////////////////////////////////////////
// Variables and startup
var arrayOfData = [];
var $list = $("#posts")
var $form = $("#submit-story-form");
var $favorites = $("#favorites");
var $submit = $("#submit");
var $all = $("#all");
var $lastFiftyStories = [];

userLoginCheck();
renderStories();

//////////////////////////////////////////////////////////
// Render stories in the main screen
function renderStories(){
    let $arrayOfData=[];
    var $objOfIds= {}
   
    if(localStorage.token) {
        let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
        $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/users/" + $username,
            headers: {
                Authorization: "Bearer " + localStorage.token
            }
        }).then(function(val){
            
            for(var i =0; i<val.data.favorites.length; i++){
                $objOfIds[val.data.favorites[i].storyId] = 1;
            }
           
            $.ajax({
                method: "GET",
                url: "https://hack-or-snooze.herokuapp.com/stories",
                
            }).then(function(val) {
                arrayOfData = [].concat(val.data);
                $lastFiftyStories = [].concat(val.data);
               
                for(var i =0; i<10; i++){
                    
                    createAndAppendItem(arrayOfData[i], "#posts");
                    if($objOfIds[$("#posts > li").last().attr("id")]){
                        $("#posts > li").last().children().eq(0).removeClass("far fa-star");
                        $("#posts > li").last().children().eq(0).addClass("fas fa-star");
                    }
                }
            })
        })
    } else {
        $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/stories",
            
        }).then(function(val) {
            arrayOfData = [].concat(val.data);
            $lastFiftyStories = [].concat(val.data);
            
            for(var i =0; i<10; i++){
                createAndAppendItem(arrayOfData[i], "#posts");
            }
        })
    } 
}

// Helper function for rendering stories


function createAndAppendItem(obj, target){
    let $post = $("<li>");
     $post.attr("id", obj.storyId);

     let $star = $("<i>").addClass("far fa-star");
     $post.append($star);
     
     let $titleText = $("<span>");
     $titleText.addClass("larger-text").text(obj.title);
    
     let $author = $("<span>");

     if(obj.author){
        $author.addClass("author-text").text("By: " + obj.author) 
     }else{
        $author.addClass("author-text").text("By: anonymous") 
     }
     
     let $fullUrl = obj.url;
     let $parsedLink = getRootUrl($fullUrl);
     let $displayUrl = $parsedLink.split(/[.,\/ ]/).splice(-2).join('.');
     
     let $urlSpan = $("<span>");
    //  $urlA.attr("href", $fullUrl).text($displayUrl);
     $urlSpan.html('<a class="li__url" target="_blank" href=' + $fullUrl + '>'+ "(" + $displayUrl + ")"+ '</a>');
     $post.append($star).append($titleText).append($author).append($urlSpan);
     
     $(target).append($post);
}

function getRootUrl(url) {
    return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
}

////////////////////////////////////////////////////////////
// INFINITE SCROLL
$("body").on("scroll", function() {
    console.log("you scrolled!")
});

////////////////////////////////////////////////////////////
//SIGNUP -- LOGIN FIELD
// Functions and eventlisteners related to sign-up or login
$("#screen-cover").on("click", function() {
    $("#screen-cover").fadeToggle();
    $("#signup-login-field").fadeOut();
    $("#user-info").fadeOut();
    $("#update-story-field").fadeOut();
});

$("#sign-up-login").on("click", function() {
    $("#screen-cover").fadeToggle();
    $("#signup-login-field").fadeToggle();
});
$("#login-toggle-btn").on("click", function(){
    $("#name-input").parent().fadeOut();
    $("#submit-signup-btn").hide();
    $(this).attr("disabled", true);
    $("#signup-toggle-btn").attr("disabled", false);
    $("#submit-login-btn").show();
});

$("#signup-toggle-btn").on("click", function(){
    $("#name-input").parent().fadeIn();
    $("#submit-signup-btn").show();
    $(this).attr("disabled", true);
    $("#login-toggle-btn").attr("disabled", false);
    $("#submit-login-btn").hide();
});

$("#logout-btn").on("click", function(){
    localStorage.clear();
    $(".flex-container").children().eq(5).children().eq(0).text("Sign Up/Login");
    $("#profile-btn").hide();
    $("#favorites").hide();
    $("#my-stories-btn").hide();
    $("#submit").hide()
    $("#posts").fadeIn();
    $("#favorite-stories").fadeOut();
    $("#my-stories").fadeOut();
    $(this).hide();


})
$("#submit-signup-btn").click(function() {
    let $name = $("#name-input").val() || "anonymus";
    let $username = $("#username-input").val();
    let $password = $("#password-input").val();
    
    
    $.ajax({
        method: "POST",
        url: "https://hack-or-snooze.herokuapp.com/users",
        data: {
            data: {
                name: $name,
                username: $username,
                password: $password
            }
        }
    }).then(function(val) {
        console.log(val);
    })
    $("#signup-login-field form").trigger("reset");
    $("#screen-cover").fadeOut();
    $("#signup-login-field").fadeOut();
});

$("#submit-login-btn").click(function(){
    let $username = $("#username-input").val();
    let $password = $("#password-input").val();
    
    $.ajax({
        method: "POST",
        url: "https://hack-or-snooze.herokuapp.com/auth",
        data: {
            data: {
                username: $username,
                password: $password,  
            }
        }
    }).then(function(val) {
        localStorage.setItem("token", val.data.token);
        localStorage.setItem("username", $username);
        $(".flex-container").children().eq(3).children().eq(0).text("Favorites");
        $(".flex-container").children().eq(4).children().eq(0).text("My stories");
        $(".flex-container").children().eq(5).children().eq(0).text("Logged In");
        $("#profile-btn").show();
        $("#favorites").show();
        $("#my-stories-btn").show();
        $("#submit").show();
        $("#logout-btn").show();
    })
    $("#signup-login-field form").trigger("reset");
    $("#screen-cover").fadeToggle();
    $("#signup-login-field").fadeToggle();
})

///////////////////////////////////////////////////////////////
// SUBMIT STORIES
// Functions and eventlisteners related to submitting form
$form.on("submit", function(){
    let $title = $("#title").val();
    // let $story = $("#story-text").val();
    let $link = $("#link").val();
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
    
    getAuthorName().then(function(data) {
        let $author = data.data.name;
        $.ajax({
            headers:{
             Authorization:"Bearer " + localStorage.token
        },
            method: "POST",
            url: "https://hack-or-snooze.herokuapp.com/stories",
            data: {
                data: {
                    title: $title,
                    author: $author,
                    url: $link,
                    username: $username,
                    
                }
            }
        }).then(function(val) {
            $list.html("");
            renderStories();
        
        })
    })
})

$submit.on("click", function(){
    if(localStorage.token){
        $form.toggle("hide");
    }
    
});



//////////////////////////////////////////////////////
// FAVORITES
// Functions and event listener related to favorites
$list.on("click", "i", function(event){
    
    let $storyId = $(event.target).parent().attr("id");
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;

    if($(event.target).hasClass("fas")){
        $.ajax({
            headers:{
                Authorization: "Bearer " + localStorage.token
            },
            data:{
                data:{
                    username: $username
                }
            },
            method:"DELETE",
            url:"https://hack-or-snooze.herokuapp.com/users/" + $username+ "/favorites/" + $storyId
        }).then(function(val){
            $(event.target).removeClass("fas fa-star");
            $(event.target).addClass("far fa-star")
        })
    }else{
        $.ajax({
            headers:{
                Authorization: "Bearer " + localStorage.token
            },
            data:{
                data:{
                    username: $username
                }
            },
            method:"POST",
            url:"https://hack-or-snooze.herokuapp.com/users/" + $username+ "/favorites/" + $storyId
        }).then(function(val){
            $(event.target).removeClass("far fa-star");
            $(event.target).addClass("fas fa-star")
        })
    }
})

$favorites.on("click", function(){
    let $arrayOfData=[];
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
    let $storyForm = $("#submit-story-form");
    let $listOfStories = $("#posts");
   
    if($all.text() === "Favorites") {
        $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/users/" + $username,
            headers: {
                Authorization: "Bearer " + localStorage.token
            }
        }).then(function(val) {
            $("#all").text("All");
            $arrayOfData = [].concat(val.data.favorites);
            $("#favorite-stories").html("");

            $("#favorite-stories").fadeIn();
            $storyForm.hide();
            $listOfStories.hide();
            $("#my-stories").hide();
            $("#my-stories-btn").children().eq(0).text("My stories");
            
            for(var i =0; i<arrayOfData.length; i++){
                createAndAppendItem($arrayOfData[i], "#favorite-stories");
                $("#favorite-stories > li").last().children().eq(0).removeClass("far fa-star");
                $("#favorite-stories > li").last().children().eq(0).addClass("fas fa-star");
            }
        })
    } else {
        $("#posts").html("");
        renderStories();
        $("#favorite-stories").fadeOut();
        $("#all").text("Favorites");
        $list.fadeIn();
    }
});

$("#favorite-stories").on("click", "i", function(event) {
    let $storyId = $(event.target).parent().attr("id");
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
    
    $.ajax({
        headers:{
            Authorization: "Bearer " + localStorage.token
        },
        data:{
            data:{
                username: $username
            }
        },
        method:"DELETE",
        url:"https://hack-or-snooze.herokuapp.com/users/" + $username+ "/favorites/" + $storyId
    }).then(function(val){
        $(event.target).parent().fadeOut();
    })
});

/////////////////////////////////////////////////////////////
// OWN STORIES
var $ownStories = [];
var $tempStoryId;

$("#my-stories-btn").on("click", function(){
    if($("#my-stories-btn").text() === "My stories") {
        renderMyStories();
    } else {
        $("#posts").html("");
        renderStories();
        $("#my-stories").fadeOut();
        $("#my-stories-btn").children().eq(0).text("My stories");
        $list.fadeIn();
        
    }
});

function renderMyStories() {
    let $arrayOfData=[];
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
    let $storyForm = $("#submit-story-form");
    let $listOfStories = $("#posts");
    let $favStories = $("#favorite-stories");

    $.ajax({
        method: "GET",
        url: "https://hack-or-snooze.herokuapp.com/users/" + $username,
        headers: {
            Authorization: "Bearer " + localStorage.token
        }
    }).then(function(val) {
        $("#my-stories-btn").children().eq(0).text("All");
        $arrayOfData = [].concat(val.data.stories);
        $ownStories = [].concat(val.data.stories);
        $("#my-stories").html("");

        $("#my-stories").fadeIn();
        $storyForm.hide();
        $listOfStories.hide();
        $favStories.hide();
        $("#all").text("Favorites");
        $("#update-story-field").fadeOut();
        $("#screen-cover").fadeOut();

        for(var i =0; i<arrayOfData.length; i++){
            createAndAppendItem($arrayOfData[i], "#my-stories");
            $("#my-stories > li").last().children().eq(0).remove();
            let $editBtn = $("<button>").attr("type", "button").addClass("btn btn-warning btn-sm").text("Edit");
            $("#my-stories > li").last().append($editBtn);
            let $deleteBtn = $("<button>").attr("type", "button").addClass("btn btn-danger btn-sm").text("Delete");
            $("#my-stories > li").last().append($deleteBtn);
        }
    })
}

$("#my-stories").on("click", ".btn-danger", function(event) {
    let $elementToDelete = $(event.target).parent();
    let $storyId = $elementToDelete.attr("id");
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;

    $.ajax({
        headers:{
         Authorization:"Bearer " + localStorage.token
        },
        method: "DELETE",
        url: "https://hack-or-snooze.herokuapp.com/stories/" + $storyId,
        data: {
            data: {
                username: $username,
                storyId: $storyId,
            }
        }
    }).then(function(val) {
        $elementToDelete.fadeOut();
    })
});

$("#my-stories").on("click", ".btn-warning", function(event) {
    let $storyId = $(event.target).parent().attr("id");

    for(let i = 0; i < $ownStories.length; i++) {
        if($storyId === $ownStories[i].storyId) {
            $("#update-title").val($ownStories[i].title);
            $("#update-link").val($ownStories[i].url);
            $tempStoryId = $storyId;
        }
    }
    $("#screen-cover").fadeIn();
    $("#update-story-field").fadeIn();
});

$("#update-story-btn").on("click", function() {
    let $updatedTitle = $("#update-title").val();
    let $updatedUrl = $("#update-link").val();

    $.ajax({
        headers:{
         Authorization:"Bearer " + localStorage.token
        },
        method: "PATCH",
        url: "https://hack-or-snooze.herokuapp.com/stories/" + $tempStoryId,
        data: {
            data: {
                title: $updatedTitle,
                url: $updatedUrl,
            }
        }
    }).then(function(val) {
        renderMyStories();
    })
});

function userLoginCheck(){
    if(localStorage.token){
        $(".flex-container").children().eq(5).children().eq(0).text("Logged In");
        $("#profile-btn").show();
        $("#favorites").show();
        $("#my-stories-btn").show();
        $("#submit").show();
        $("#logout-btn").show();
    }
}

$("#profile-btn").click(function(){
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
    $("#screen-cover").fadeToggle();
   

    $.ajax({
        method: "GET",
        url: "https://hack-or-snooze.herokuapp.com/users/" + $username,
        headers: {
            Authorization: "Bearer " + localStorage.token
        }
    }).then(function(val){
        $("#user-info-name").text(val.data.name);
        $("#user-info-username").text($username);
        $("#user-info").fadeToggle();
    })
});

/////////////////////////////////////////////////////////////////
// OTHER STUFF
function getAuthorName() {
    return $.ajax({
        method: "GET",
        url: "https://hack-or-snooze.herokuapp.com/users/test123",
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxMjMiLCJpYXQiOjE1MTk3NTk4NTR9.XKcHy-O5wxrjkZBbEubETDXX8g2x1mSO67J16Od9MRA",
        }
    })
}
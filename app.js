// Variables
var arrayOfData = [];
var $list = $("#posts")
var $form = $("#submit-story-form");
var $favorites = $("#favorites");
var $submit = $("#submit");
var $all = $("#all");

// Rendrer stories in the main screen
function renderStories(){
    $.ajax({
        method: "GET",
        url: "https://hack-or-snooze.herokuapp.com/stories",
        
    }).then(function(val) {
        arrayOfData = [].concat(val.data);
        
        for(var i =0; i<10; i++){
            createAndAppendItem(arrayOfData[i], "#posts");
        }
    })
}

// Helper function for rendering stories
renderStories();

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
     
     let $url = $("<span>")
     var parsedLink = getRootUrl(obj.url);
     $url.text("(" + parsedLink + ")");

     $post.append($star).append($titleText).append($author).append($url);
     
     $(target).append($post);
}

////////////////////////////////////////////////////////////
//SIGNUP -- LOGIN FIELD
// Functions and eventlisteners related to sign-up or login
$("#screen-cover").on("click", function() {
    $("#screen-cover").fadeToggle();
    $("#signup-login-field").fadeToggle();
});

$("#sign-up-login").on("click", function() {
    $("#screen-cover").fadeToggle();
    $("#signup-login-field").fadeToggle();
});

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
    $("#screen-cover").fadeToggle();
    $("#signup-login-field").fadeToggle();
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
        token4test123 = val.data.token;
        localStorage.setItem("token", token4test123);
        localStorage.setItem("username", $username);
    })
    $("#signup-login-field form").trigger("reset");
    $("#screen-cover").fadeToggle();
    $("#signup-login-field").fadeToggle();
})

///////////////////////////////////////////////////////////////
// SUBMIT STORIES
// Functions and eventlisteners related to submitting form
function getRootUrl(url) {
    return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
}

$form.on("submit", function(){
    let $title = $("#title").val();
    let $story = $("#story-text").val();
    let $link = $("#link").val();
    let $AuthToken = "Bearer " + localStorage.token;
    console.log($AuthToken)
    $.ajax({
        headers:{
         Authorization:$AuthToken //"Bearer " + localStorage.token
    },
        method: "POST",
        url: "https://hack-or-snooze.herokuapp.com/stories",
        data: {
            data: {
                title: $title,
                author: localStorage.username,
                url: $link,
                username: localStorage.username,
                
            }
        }
    }).then(function(val) {
        $list.html("");
        renderStories();
    
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
            $(event.target).toggleClass("fas");
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
            $(event.target).toggleClass("fas");
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
            $storyForm.fadeOut();
            $listOfStories.fadeOut();
            $("#my-stories").fadeOut();
            $("#my-stories-btn").children().eq(0).text("My stories");
            
            for(var i =0; i<arrayOfData.length; i++){
                createAndAppendItem($arrayOfData[i], "#favorite-stories");
                $("#favorite-stories > li").last().children().eq(0).removeClass("far fa-star");
                $("#favorite-stories > li").last().children().eq(0).addClass("fas fa-star");
            }
        })
    } else {
        $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/stories",
            
        }).then(function(val) {
            arrayOfData = [].concat(val.data);
            $list.html("");

            for(var i =0; i<10; i++){
                createAndAppendItem(arrayOfData[i], "#posts");
            }
            $("#favorite-stories").fadeOut();
            $("#all").text("Favorites");
            $list.fadeIn();
        })
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
$("#my-stories-btn").on("click", function(){
    let $arrayOfData=[];
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
    let $storyForm = $("#submit-story-form");
    let $listOfStories = $("#posts");
    let $favStories = $("#favorite-stories");

    if($("#my-stories-btn").text() === "My stories") {
        $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/users/" + $username,
            headers: {
                Authorization: "Bearer " + localStorage.token
            }
        }).then(function(val) {
            $("#my-stories-btn").children().eq(0).text("All");
            $arrayOfData = [].concat(val.data.stories);
            $("#my-stories").html("");

            $("#my-stories").fadeIn();
            $storyForm.fadeOut();
            $listOfStories.fadeOut();
            $favStories.fadeOut();
            $("#all").text("Favorites");
            
            for(var i =0; i<arrayOfData.length; i++){
                createAndAppendItem($arrayOfData[i], "#my-stories");
                $("#my-stories > li").last().children().eq(0).remove();
            }
        })
    } else {
        $.ajax({
            method: "GET",
            url: "https://hack-or-snooze.herokuapp.com/stories",
            
        }).then(function(val) {
            arrayOfData = [].concat(val.data);
            $list.html("");

            for(var i =0; i<10; i++){
                createAndAppendItem(arrayOfData[i], "#posts");
            }
            $("#my-stories").fadeOut();
            $("#my-stories-btn").children().eq(0).text("My stories");
            $list.fadeIn();
        })
    }
});


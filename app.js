var arrayOfData = [];

function renderStories(){
    $.ajax({
        method: "GET",
        url: "https://hack-or-snooze.herokuapp.com/stories",
        
    }).then(function(val) {
        arrayOfData = arrayOfData.concat(val.data);
        for(var i =0; i<10; i++){
            createAndAppendItem(arrayOfData[i]);
        }
        console.log(arrayOfData);
    })
}

renderStories();

function createAndAppendItem(obj){
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
     
     $("#posts").append($post);
     



    // $post.append($titleText);
    
    // $list.append($post.append($url));
}

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























var $list = $("#posts")

var $form = $("#submit-story-form");
var $favorites = $("#favorites");
var $submit = $("#submit");
var $all = $("#all");
function getRootUrl(url) {
    return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
  }
$(document).ready(function(){
    console.log("hello")
    $form.hide();   
})
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

    // $title.val();
    // let $post = $("<li>");
    // let $star = $("<i>").addClass("far fa-star")
    // let $titleText = $("<span>");
    // let $url = $("<span>")
    // $post.append($star);
    // $titleText.addClass("larger-text").text($title.val());
    // $post.append($titleText);
    // var parsedLink = getRootUrl($link.val())
    // $url.text("(" + parsedLink + ")");
    // $list.append($post.append($url));
    // $form.toggle("hide");



$list.on("click", "i", function(event){
    $(event.target).toggleClass("far fa-star fas fa-star");
    
});


$submit.on("click", function(){
    if(localStorage.token){
        $form.toggle("hide");
    }
    
});

$favorites.on("click", function(){
    if($all.text() === "Favorites"){
        $all.text("All");
        $(".far").parent().hide();
    }else{
        $all.text("Favorites");
        $(".far").parent().show();
    }
    
});
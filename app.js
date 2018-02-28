// Variables
var arrayOfData = [];
var $list = $("#posts")
var $form = $("#submit-story-form");
var $favorites = $("#favorites");
var $submit = $("#submit");
var $all = $("#all");

// Rendrer stories in the main screen
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
     $urlSpan.html('(<a class="li__url" target="_blank" href=' + $fullUrl + '>' + $displayUrl + '</a>)');
     $post.append($star).append($titleText).append($author).append($urlSpan);
     console.log($urlSpan)
     
     $(target).append($post);
}

function getRootUrl(url) {
    return url.toString().replace(/^(.*\/\/[^\/?#]*).*$/,"$1");
}

// var inputText = $('input').eq(0).val();
//         var inputUrl = $('input').eq(1).val();
//         var displayUrl = inputUrl.split(/[.,\/ ]/).splice(-2).join('.');
        
//         function isUrlValid(url) {
//             return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
//         }

//         if(inputText !== '' && isUrlValid(inputUrl)) {
//             $form.trigger('reset');

//             var newListItem = $('<li>');
//             var favStar = $('<span>').addClass('far fa-star fa-xs');
//             var newListItemText = $('<span>').addClass('item-text').text(' ' + inputText + ' ');
//             // var inputUrlA = $('<a>').addClass('li__url').attr('href', inputUrl).attr('target', '_blank').text(displayUrl);
//             var inputUrlSpan = $('<span>').addClass('li__link--grey-and-small').html('(<a class="li__url" target="_blank" href=' + inputUrl + '>' + displayUrl + '</a>)');
            
//             newListItem.append(favStar);
//             newListItem.append(newListItemText);
//             newListItem.append(inputUrlSpan);
            
//             $ol.append(newListItem);
//             $form.slideUp();
// isSubmissionFormOpen = !isSubmissionFormOpen;

////////////////////////////////////////////////////////////
//SIGNUP -- LOGIN FIELD
// Functions and eventlisteners related to sign-up or login
$("#screen-cover").on("click", function() {
    $("#screen-cover").fadeToggle();
    $("#signup-login-field").fadeOut();
    $("#user-info").fadeOut();
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
$form.on("submit", function(){
    let $title = $("#title").val();
    let $story = $("#story-text").val();
    let $link = $("#link").val();
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
    
    $.ajax({
        headers:{
         Authorization:"Bearer " + localStorage.token
    },
        method: "POST",
        url: "https://hack-or-snooze.herokuapp.com/stories",
        data: {
            data: {
                title: $title,
                author: $username,
                url: $link,
                username: $username,
                
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
        // $.ajax({
        //     method: "GET",
        //     url: "https://hack-or-snooze.herokuapp.com/stories",
            
        // }).then(function(val) {
        //     arrayOfData = [].concat(val.data);
        //     $list.html("");

        //     for(var i =0; i<10; i++){
        //         createAndAppendItem(arrayOfData[i], "#posts");
        //     }
        $("#posts").html("");
        renderStories();
            $("#favorite-stories").fadeOut();
            $("#all").text("Favorites");
            $list.fadeIn();
        // })
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
        $("#posts").html("");
        renderStories();
            $("#my-stories").fadeOut();
            $("#my-stories-btn").children().eq(0).text("My stories");
            $list.fadeIn();
        
    }
});

$("#my-stories").on("click", "li", function(event) {
    if($(event.target).attr("id")) {
        var $elementToDelete = $(event.target);
    } else {
        var $elementToDelete = $(event.target).parent();
    }
    let $storyId = $elementToDelete.attr("id");
    let $username = JSON.parse(atob(localStorage.token.split(".")[1])).username;
    console.log($elementToDelete);

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


function userLoginCheck(){
    if(localStorage.token){
        $(".flex-container").children().eq(5).children().eq(0).text("Logged In");
        $("#profile-btn").show();
    }
}

userLoginCheck();


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
})

renderStories();
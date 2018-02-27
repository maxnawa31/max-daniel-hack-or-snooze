var $title = $("#title");
var $list = $("#posts")
var $link = $("#link");
var $form = $("form");
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
$form.on("submit", function(event){
    event.preventDefault();
    let $post = $("<li>");
    let $star = $("<i>").addClass("far fa-star")
    let $titleText = $("<span>");
    let $url = $("<span>")
    $post.append($star);
    $titleText.addClass("larger-text").text($title.val());
    $post.append($titleText);
    var parsedLink = getRootUrl($link.val())
    $url.text("(" + parsedLink + ")");
    $list.append($post.append($url));
    $form.toggle("hide");
})


$list.on("click", "i", function(event){
    $(event.target).toggleClass("far fa-star fas fa-star");
    
});


$submit.on("click", function(){
    $form.toggle("hide");
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
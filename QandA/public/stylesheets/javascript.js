 /* global $ */
var i;
var num;
$(function(){
    $(".lo").on("click",function(){
        num = Number($(this).children("#vaa").text());
        if ($(this).find(".x").hasClass("tc")) {
            num = num-1;
        }else{
            num=num+1;
        }
        $(this).find(".x").toggleClass("c");
        $(this).children("#vaa").text(num);
    });
    
    $(".cf").on("submit",function(){
        event.preventDefault();
        i = $(this).attr('data-id');
        $.ajax({
            url: "/mo",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ likes : num , lid: i}),
            success: function(response){
                window.location.reload();
            }
        });
    });
});

$("#file").change(function(){
        $(".tar").submit();
 });

$(".sel").on("click",function(){
    $(this).find(".more").css("display","none");
   $(this).find(".show_full").removeClass("show_full");
});

//POPUP
function check_empty() {
if (document.getElementById('name').value == "" ) {
alert("Fill All Fields !");
} else {
document.getElementById('form').submit();
}
}
//Function To Display Popup
function div_show() {
document.getElementById('abc').style.display = "block";
}
//Function to Hide Popup
function div_hide(){
document.getElementById('abc').style.display = "none";
}
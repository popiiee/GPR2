crushFTP.defaultRequestType = "GET";
$(document).ready(function(){
    $(".tabs").tabs();
    crushFTP.UI.initLoadingIndicator();
    crushFTP.userLogin.bindUserName(function (response, username) {
        crushFTP.UI.showLoadingIndicator({});
        $("#adminPanel").form();
        css_browser_selector(navigator.userAgent);
        $(".button").button();
        if (response == "failure") {
            window.location = "/WebInterface/login.html?link=/WebInterface/admin/letsEncrypt.html";
        } else {
            letsEncrypt.initGUI();
        }
    });
});

function doLogout()
{
    $.ajax({type: "POST",url: "/WebInterface/function/",data: {command: "logout",random: Math.random(),c2f:crushFTP.getCrushAuth()},
        error: function (XMLHttpRequest, textStatus, errorThrown)
        {
            $.cookie("currentAuth", "", {path: '/',expires: -1});
            document.location = "/WebInterface/login.html";
        },
        success: function (msg)
        {
            $.cookie("currentAuth", "", {path: '/',expires: -1});
            document.location = "/WebInterface/login.html";
        }
    });
    return false;
}
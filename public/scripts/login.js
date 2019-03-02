$(document).ready(function () {
    $("#submit").click(function() {
        $.ajax({
            data: { username: $("#username").val(), password: $("#password").val() },
            url: "/login",
            method: "POST",
        });
    });
}); 
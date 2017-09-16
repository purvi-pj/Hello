var baseURL = "http://dev.onedataindex.in:4567";
var devBaseURL = baseURL + "/dev";
var DataBaseName = "CompanyInfo";
var RelationName = "Employee";

function getConnectionToken() {
    var token_dev = localStorage.getItem('token_dev');
    if (token_dev == null) {
        var email = "purvi.jain@login2explore.com";
        var password = "purvijain";
        $.ajaxSetup({async: false});
        $.post(devBaseURL + "/login",
                {
                    email: email,
                    password: password
                },
                function (result) {
                    var obj = jQuery.parseJSON(result);
                    var status = obj['status'];
                    var message = obj['message'];
                    if (status === 200) {
                        token_dev = obj['token'];
                        localStorage.setItem('token_dev', token_dev);
                    } else if (status === 400) {
                        $("#response_message").html('<div class="alert alert-block alert-info fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();
                    }
                });
        $.ajaxSetup({async: true});
    }
    return token_dev;
}


function closeConnection() {
    var tempTokenConn = getConnectionToken();
    localStorage.removeItem('token_dev');
    if (tempTokenConn != null) {
        $.ajaxSetup({async: false});
        $.post(devBaseURL + "/logout",
                {
                    token: tempTokenConn
                },
                function (result) {
                    var obj = jQuery.parseJSON(result);
                    var status = obj['status'];
                });
        $.ajaxSetup({async: true});
    }
}

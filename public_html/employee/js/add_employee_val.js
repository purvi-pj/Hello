window.onload = function ()
{
    closeConnection();
    getConnectionToken();
};

var Script = function () {

    $.validator.setDefaults({
        submitHandler: function () {
            var token_dev = getConnectionToken();
            var data = {
                emp_id: $("#emp_id").val(),
                emp_name: $("#emp_name").val(),
                emp_sex: $("#emp_sex").val(),
                emp_dsg: $("#emp_dsg").val(),
                emp_basic: $("#emp_basic").val()
            };
//            alert(JSON.stringify(data));
            var templateStr = {
                emp_id: $("#emp_id").val()
            };
            var jsonObj = {
                token: token_dev,
                dbName: "CompanyInfo",
                rel: "Employee",
                cmd: "PUT",
                templateStr: templateStr,
                jsonStr: data
            };
            var jsonData = JSON.stringify(jsonObj);
            $.post(baseURL + "/api/iml",
                    jsonData,
                    function (result) {
                        var obj = jQuery.parseJSON(result);
                        var status = obj['status'];
                        var message = obj['message'];
                        if (status === 200) {
                            $("#response_message").html('<div class="alert alert-block alert-info fade in"> Record added to Employee Table</div>').fadeIn().delay(4000).fadeOut();
                        } else if (status === 400) {
                            $("#response_message").html('<div class="alert alert-block alert-info fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();
                        }
                    });
        }
    });

    $().ready(function () {

        // validate signup form on keyup and submit
        $("#register_form").validate({
            rules: {
                emp_id: {
                    required: true,
                    minlength: 2
                },
                emp_name: {
                    required: true,
                    minlength: 2
                },
                emp_sex: {
                    required: true
                },
                emp_dsg: {
                    required: true
                },
                emp_basic: {
                    required: true
                }
            },
            messages: {
                emp_id: {
                    required: "Please enter Employee-Id.",
                    minlength: "Department-Id must consist of at least 2 characters long."
                },
                emp_name: {
                    required: "Please enter Employee Name.",
                    minlength: "Employee Name must consist of at least 2 characters long."
                },
                emp_sex: {
                    required: "Please enter Employee Sex (m/f)."
                },
                emp_dsg: {
                    required: "Please enter Employee Designation."
                },
                emp_basic: {
                    required: "Please enter Employee Basic Salary"
                }
            }
        });

    });


}();
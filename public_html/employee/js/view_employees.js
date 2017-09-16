window.onload = function ()
{
    closeConnection();
    localStorage.removeItem('record_number');
    loadlastData();
    loadfirstData();
};


function loadNextData() {
    document.getElementById('prevData').disabled = false;
    document.getElementById('firstData').disabled = false;
    var token_dev = getConnectionToken();
    var record_number = parseInt(localStorage.getItem('record_number', record_number));
    var jsonObj = {
        token: token_dev,
        dbName: DataBaseName,
        rel: "Employee",
        record: record_number,
        cmd: "NEXT_RECORD"
    };
    var jsonData = JSON.stringify(jsonObj);
    var recNo = dataLoadServerCall(jsonData);
    if(recNo == parseInt(localStorage.getItem('lastRecNo'))){
        document.getElementById('nextData').disabled = true;
        document.getElementById('lastData').disabled = true;
    }
}

function loadPrevData() {

    document.getElementById('nextData').disabled = false;
    document.getElementById('lastData').disabled = false;
    var token_dev = getConnectionToken();
    var record_number = parseInt(localStorage.getItem('record_number', record_number));
    var jsonObj = {
        token: token_dev,
        dbName: DataBaseName,
        rel: "Employee",
        record: record_number,
        cmd: "PREV_RECORD"
    };
    var jsonData = JSON.stringify(jsonObj);
    var recNo = dataLoadServerCall(jsonData);
    if(recNo == parseInt(localStorage.getItem('firstRecNo'))){
        document.getElementById('prevData').disabled = true;
        document.getElementById('firstData').disabled = true;
    }
}

function loadfirstData() {
    document.getElementById('nextData').disabled = false;
    document.getElementById('lastData').disabled = false;

    var token_dev = getConnectionToken();

    var jsonObj = {
        token: token_dev,
        dbName: DataBaseName,
        cmd: "FIRST_RECORD",
        rel: "Employee"
    };
    var jsonData = JSON.stringify(jsonObj);
    var firstRecNo = dataLoadServerCall(jsonData);
    localStorage.setItem('firstRecNo', firstRecNo);
    document.getElementById('prevData').disabled = true;
    document.getElementById('firstData').disabled = true;
}


function loadlastData() {
    document.getElementById('prevData').disabled = false;
    document.getElementById('firstData').disabled = false;
    var token_dev = getConnectionToken();
    var jsonObj = {
        token: token_dev,
        dbName: DataBaseName,
        rel: "Employee",
        cmd: "LAST_RECORD"
    };
    var jsonData = JSON.stringify(jsonObj);
    var lastRecNo = dataLoadServerCall(jsonData);
    localStorage.setItem('lastRecNo', lastRecNo);
    document.getElementById('nextData').disabled = true;
    document.getElementById('lastData').disabled = true;
}

function dataLoadServerCall(jsonData) {
    var record_number;
    jQuery.ajaxSetup({async : false});
    $.post(baseURL + "/api/irl",
            jsonData,
            function (result) {
//                alert(result);
                var obj = jQuery.parseJSON(result);
                var status = obj['status'];
                var message = obj['message'];
                var jsonData = obj['data'];
                var jsonDataElement = jQuery.parseJSON(jsonData);
                if (status === 200) {
                    record_number = jsonDataElement['record_number'];
                    localStorage.setItem('record_number', record_number);
                    var record = jsonDataElement['record'];
                    var emp_id = record['emp_id'];
                    var emp_name = record['emp_name'];
                    var emp_sex = record['emp_sex'];
                    var emp_dsg = record['emp_dsg'];
                    var emp_basic = record['emp_basic'];
                    $('#emp_id').val(emp_id);
                    $('#emp_name').val(emp_name);
                    $('#emp_sex').val(emp_sex);
                    $('#emp_dsg').val(emp_dsg);
                    $('#emp_basic').val(emp_basic);
                } else if (status === 400) {
                    $("#response_message").html('<div class="alert alert-block alert-info fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();
                }
            });
    return record_number;
    jQuery.ajaxSetup({async : true});
}
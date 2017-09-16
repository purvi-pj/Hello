function editData()
{
    document.getElementById('prevData').disabled = true;
    document.getElementById('lastData').disabled = true;
    document.getElementById('nextData').disabled = true;
    document.getElementById('firstData').disabled = true;
    sendToLocal();
    enableAllInputs();
    document.getElementById('edit').disabled = true;
    document.getElementById('remove').disabled = true;
    document.getElementById('save').disabled = false;
    document.getElementById('cancel').disabled = false;
}

function cancelEdit() {
//    alert(localStorage.getItem('recordData'));
    var recordData = JSON.parse(localStorage.getItem('recordData'));
    document.getElementById('emp_id').value = recordData.emp_id;
    document.getElementById('emp_name').value = recordData.emp_name;
    document.getElementById('emp_sex').value = recordData.emp_sex;
    document.getElementById('emp_dsg').value = recordData.emp_dsg;
    document.getElementById('emp_basic').value = recordData.emp_basic;
    disableAllInputs();
    enableNavigators();
    document.getElementById('edit').disabled = false;
    document.getElementById('remove').disabled = false;
    document.getElementById('save').disabled = true;
    document.getElementById('cancel').disabled = true;
}

function enableAllInputs()
{
//    document.getElementById('emp_id').disabled = false;
    document.getElementById('emp_name').disabled = false;
    document.getElementById('emp_sex').disabled = false;
    document.getElementById('emp_dsg').disabled = false;
    document.getElementById('emp_basic').disabled = false;
}

function disableAllInputs()
{
    document.getElementById('emp_id').disabled = true;
    document.getElementById('emp_name').disabled = true;
    document.getElementById('emp_sex').disabled = true;
    document.getElementById('emp_dsg').disabled = true;
    document.getElementById('emp_basic').disabled = true;
}

function enableNavigators()
{
    enableFirstPrev();
    enableLastNext();
}

function sendToLocal()
{
    var emp_id = document.getElementById('emp_id').value;
    var emp_name = document.getElementById('emp_name').value;
    var emp_sex = document.getElementById('emp_sex').value;
    var emp_dsg = document.getElementById('emp_dsg').value;
    var emp_basic = document.getElementById('emp_basic').value;
    var recordData = {
        emp_id: emp_id,
        emp_name: emp_name,
        emp_sex: emp_sex,
        emp_dsg: emp_dsg,
        emp_basic: emp_basic
    };
    localStorage.setItem('recordData', JSON.stringify(recordData));
}

window.onload = function ()
{
    closeConnection();
    localStorage.removeItem('record_number');
    loadfirstData();
    disableAllInputs();
    document.getElementById('save').disabled = true;
    document.getElementById('cancel').disabled = true;
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
    if (recNo == parseInt(localStorage.getItem('lastRecNo'))) {
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
    if (recNo == parseInt(localStorage.getItem('firstRecNo'))) {
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
    jQuery.ajaxSetup({async: false});
    $.post(baseURL + "/api/irl",
            jsonData,
            function (result) {
//                            alert(result);
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
                    document.getElementById("emp_id").value = emp_id;
//                    $('#emp_id').val(emp_id);
                    $('#emp_name').val(emp_name);
                    $('#emp_sex').val(emp_sex);
                    $('#emp_dsg').val(emp_dsg);
                    $('#emp_basic').val(emp_basic);
                    $('#record_number').html(record_number);
                } else if (status === 400) {
                    if (message == "EOF")
                    {
                        document.getElementById('nextData').disabled = true;
                        document.getElementById('lastData').disabled = true;
                    } else if (message == "BOF")
                    {
                        document.getElementById('firstData').disabled = true;
                        document.getElementById('prevData').disabled = true;
                    }
                    $("#response_message").html('<div class="alert alert-block alert-info fade in">' + message + '</div>').fadeIn().delay(4000).fadeOut();
                }
            });
    return record_number;
    jQuery.ajaxSetup({async: true});
}

function removeRecord()
{
    if (!confirm("Are you sure you want to delete record?"))
    {
        return;
    }

    var token_dev = getConnectionToken();
    var record_number = parseInt(localStorage.getItem('record_number'));
    var jsonObj = {
        token: token_dev,
        dbName: DataBaseName,
        rel: "Employee",
        cmd: "REMOVE",
        record: record_number
    };
    var jsonData = JSON.stringify(jsonObj);
    $.post(baseURL + "/api/iml",
            jsonData,
            function (result) {
                alert(result);
            });
    loadNextData();
}

function updateRecord()
{
    var data = {
        emp_id: $("#emp_id").val(),
        emp_name: $("#emp_name").val(),
        emp_sex: $("#emp_sex").val(),
        emp_dsg: $("#emp_dsg").val(),
        emp_basic: $("#emp_basic").val()
    };
    var record_number = parseInt(localStorage.getItem('record_number'));
    var jsonStr = {
        [record_number] : data
    }
    var dataObj = JSON.stringify(jsonStr);
    alert(dataObj);
    var jsonObj = {
        token: token_dev,
        dbName: DataBaseName,
        rel: "Employee",
        cmd: "UPDATE",
        jsonStr: dataObj
    };
    var jsonReq = JSON.stringify(jsonObj);
    alert(jsonReq);

    $.post(baseURL + "/api/iml",
            jsonReq,
            function (result) {
                alert(result);
            });
}

function enableFirstPrev()
{
    var recNo = parseInt(localStorage.getItem('record_number'));
    if (recNo == parseInt(localStorage.getItem('firstRecNo'))) {
        document.getElementById('prevData').disabled = true;
        document.getElementById('firstData').disabled = true;
    } else {
        document.getElementById('prevData').disabled = false;
        document.getElementById('firstData').disabled = false;
    }
}

function enableLastNext()
{
    var recNo = parseInt(localStorage.getItem('record_number'));
    if (recNo == parseInt(localStorage.getItem('lastRecNo'))) {
        document.getElementById('nextData').disabled = true;
        document.getElementById('lastData').disabled = true;
    } else {
        document.getElementById('nextData').disabled = false;
        document.getElementById('lastData').disabled = false;
    }
}


$(document).ready(function () {
    var vehicleTypeViewModelDtos;
    // View Button click Call Api
    $(document).on("click", "#viewButton", function () {
        FetchVehicleTypes();
        $("#addVehicleTypeDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    });

    // Check Form Validation
    $("#txtVehicleType").on("change", function () {
        if (!ValidateTextbox("#txtVehicleType")) {
            $("#txtVehicleType").val('');
            return;
        }
    });

    // Set Token in Global Class
    GetAndSetToken("AuthToken");

    // On form submit
    $("#btnSaveVehicleType").click(function (event) {
        event.preventDefault();
        SaveAndSaveNew();
    });

    // Reset form fields on button click
    $('#SavenewButton').on('click', function () {
        SaveAndSaveNew();
        $('#VehicleTypeForm')[0].reset();
    });

    $('#backButton').click(function () {
        window.location.reload(true);
        // $("#addVehicleTypeDiv").css('display', 'Block')
        // $("#backButton").css('display', 'none');
        //  $('#tableDiv').hide();
    });

    $("#cancleButton").on('click', function () {
        FetchVehicleTypes();
        $("#addVehicleTypeDiv").css('display', 'none')
        $("#backButton").css('display', 'Block');
    })
});
function GetAndSetToken(cookieName) {
    var globalUrl = '/api/global/set-token';
    let match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
    let token = match ? match[2] : null;
    if (token) {
        fetch(globalUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token }) // Proper JSON format
        })
            .then(response => {
                if (!response.ok) {
                    console.error("Failed to set token");
                } else {
                }
            })
            .catch(error => console.error("Error:", error));
    } else {
        console.warn("Token not found in cookies");
    }
}
function FetchVehicleTypes() {
    $('#tableDiv').show();
    var fetchVehicleTypesUrl = '/Vehicle/ViewVehicleType';
    $.ajax({
        url: fetchVehicleTypesUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            let trlist = response;
            vehicleTypeViewModelDtos = response;
            // Destroy existing DataTable if exists
            if ($.fn.DataTable.isDataTable('#tableVehicleType')) {
                $('#tableVehicleType').DataTable().clear().destroy();
            }

            $('#tableVehicleType').DataTable({
                "processing": true,
                "serverSide": false,
                "paging": true,
                "pageLength": 10,
                "lengthChange": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "info": true,
                "responsive": true,
                "data": trlist,
                "columns": [

                    { "data": "companyName" },
                    { "data": "vehicleTypeName" },
                    { "data": "minimumKms" },
                    {
                        "data": "vehicleTypeId",
                        "render": function (data) {
                            return `
    <div class="btn-group" role="group">
        <button type="button" class="btn btn-sm btn-primary"
            onclick="EditVehicleType(${data})">
            <i class="ti ti-edit"></i> Edit
        </button>
        <button type="button" class="btn btn-sm btn-danger"
            onclick="DeleteVehicleType(${data})">
            <i class="ti ti-trash"></i> Delete
        </button>
    </div>`;
                        }
                    },
                ],
                "columnDefs": [
                    {
                        "targets": "_all",
                        "className": "text-center"
                    }
                ]
            });


        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function DeleteVehicleType(vehicleTypeId) {
    var deleteVehicleTypesUrl = '/Vehicle/DeleteVehicleType/' + vehicleTypeId
    $.ajax({
        url: deleteVehicleTypesUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(vehicleTypeId),
        success: function (response) {
            FetchVehicleTypes();
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });
}
function SaveAndSaveNew() {
    var vehicleTypeName = $("#txtVehicleType").val()
    var txtminKmsPerDay = $("#txtminKmsPerDay").val()

    if (IsNullOrEmpty(vehicleTypeName)) {
        toastr.warning("Please enter a valid Vehicle Type", "Warning");
        return;
    }

    if (!isNumeric(txtminKmsPerDay)) {
        toastr.warning("Please enter Min Km/Day", "Warning");
        return;
    }
    var saveUrl = '/Vehicle/VehicleTypeSave';
    var formData = {
        VehicleTypeName: vehicleTypeName,
        MinimumKms: txtminKmsPerDay
    };

    $.ajax({
        url: saveUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            toastr.success("Vehicle Type submitted successfully!");

        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to submit Vehicle Type", "Error");
        }
    });
}
function EditVehicleType(vehicleTypeId) {
    var data = vehicleTypeViewModelDtos.filter(x => x.vehicleTypeId == vehicleTypeId);

    $('#tableDiv').hide();
    $("#backButton").css('display', 'none');
    $("#addVehicleTypeDiv").css('display', 'Block');
    $("#updateButton").css('display', 'Block');
    $("#btnSaveVehicleType").css('display', 'none');
    $("#SavenewButton").css('display', 'none');
    $("#viewButton").css('display', 'none');
    $("#cancleButton").removeClass("d-none");
    $("#txtVehicleType").val(data[0].vehicleTypeName);
    $("#txtminKmsPerDay").val(data[0].minimumKms);

    // Using one-time event binding with .one()
    $('#updateButton').one('click', function () {
        UpdateVechileType(vehicleTypeId);
    });
}
function UpdateVechileType(vehicleTypeId) {
    var vehicleTypeName = $("#txtVehicleType").val()
    var txtminKmsPerDay = $("#txtminKmsPerDay").val()
    if (IsNullOrEmpty(vehicleTypeName)) {
        toastr.warning("Please enter a valid Vehicle Type", "Warning");
        return;
    }

    if (!isNumeric(txtminKmsPerDay)) {
        toastr.warning("Please enter Min Km/Day", "Warning");
        return;
    }

    var updateUrl = '/Vehicle/UpdateVehicleType';
    var formData = {
        VehicleTypeId: vehicleTypeId,
        VehicleTypeName: vehicleTypeName,
        MinimumKms: txtminKmsPerDay
    };

    $.ajax({
        url: updateUrl,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            toastr.success("Vehicle Type submitted successfully!");
            $("#addVehicleTypeDiv").css('display', 'none'); //hide form
            $("#backButton").show();
            FetchVehicleTypes();
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to submit Vehicle Type", "Error");
        }
    });
}

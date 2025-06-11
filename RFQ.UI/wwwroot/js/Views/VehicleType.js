
var getDataUrl = '/Vehicle/ViewVehicleType';

$(document).ready(function () {
    var vehicleTypeViewModelDtos;
    var EditVehicleTypeModelDtos;

    $("#txtVehicleType").on("blur", function () {
        if (!ValidateTextbox("#txtVehicleType")) {
            toastr.warning("Please Enter a valid Vehicle Type!", "Validation Error");
            return;
        }
    });

    $("#txtminKmsPerDay").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please Enter a valid Minimum Kms/Day!", "Validation Error");
            return;
        }
    });

    $("#btnSaveVehicleType, #SavenewButton").on('click', function () {
        var action = $(this).data('action');
        SaveVehicleType(action);
    });

    $('#btnAddVehicleType').on('click', function () {
        $('#btnAddVehicleType').addClass('d-none');
        $('#tableDiv').hide();
        $('#addVehicleTypeDiv').removeClass('d-none');
        $('#viewButton').addClass('d-none');
        $('#btnCancel').removeClass('d-none');
        $('#btnSaveVehicleType').removeClass('d-none');
        $('#SavenewButton').removeClass('d-none')
        $('#updateButton').addClass('d-none');
        $('#VehicleTypeForm')[0].reset();
    });

    $("#btnCancel").on('click', function () {
        //FetchVehicleTypes();
        FetchDataForTable('vehicleTypesTable', getDataUrl);
        $("#addVehicleTypeDiv").addClass('d-none');
        $("#btnAddVehicleType").removeClass('d-none');
        $('#btnSaveVehicleType').removeClass('d-none');
        $('#SavenewButton').removeClass('d-none')
        $('#updateButton').addClass('d-none');
    })

    UpdateVechileType();
    FetchDataForTable('vehicleTypesTable', getDataUrl);
});
function OnSubmitValidation() {
    if (IsNullOrEmpty($("#txtVehicleType").val()) || !ValidateTextbox("#txtVehicleType")) {
        toastr.warning("Please enter a valid Vehicle Type!", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtminKmsPerDay").val())) {
        toastr.warning("Please Enter a valid Minimum Kms/Day!", "Validation Error");
        return false;
    }
    return true;
}

$('#vehicleTypesTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchDataForTable('vehicleTypesTable', getDataUrl);
});

// Bind events
$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchDataForTable('vehicleTypesTable', getDataUrl);
});
function SaveVehicleType(action) {
    if (OnSubmitValidation()) {
        var vehicleTypeName = $("#txtVehicleType").val()
        var txtminKmsPerDay = $("#txtminKmsPerDay").val()

        var saveUrl = '/Vehicle/VehicleTypeSave';
        var formData = {
            VehicleTypeName: vehicleTypeName,
            MinimumKms: txtminKmsPerDay
        };

        if (action === "save") {
            $.ajax({
                url: saveUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (response) {
                    toastr.success("Vehicle Type Details Submitted Successfully!");
                    window.location.href = "../Dashboard/Dashboard";
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Submit Vehicle Type Details!", "Error");
                }
            });

        } else if (action === "saveNew") {
            $.ajax({
                url: saveUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (response) {
                    toastr.success("Vehicle Type Details Submitted Successfully!");
                    $('#VehicleTypeForm')[0].reset();
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Submit Vehicle Type Details!", "Error");
                }
            });
        }
    }
}
function EditVehicleType(vehicleTypeId) {
    //var data = vehicleTypeViewModelDtos.filter(x => x.vehicleTypeId == vehicleTypeId);
    var data = viewModelDto.filter(x => x.vehicleTypeId == vehicleTypeId);
    EditVehicleTypeModelDtos = data[0];
    $('#tableDiv').hide();
    $('#btnAddVehicleType').addClass('d-none');
    $('#addVehicleTypeDiv').removeClass('d-none');
    $("#updateButton").removeClass('d-none');
    $("#btnSaveVehicleType").addClass('d-none');
    $("#SavenewButton").addClass('d-none');
    $("#viewButton").addClass('d-none');
    $("#btnCancel").removeClass("d-none");
    $("#txtVehicleType").val(data[0].vehicleTypeName);
    $("#txtminKmsPerDay").val(data[0].minimumKms);

}
function UpdateVechileType() {
    $("#updateButton").on("click", function (e) {
        if (OnSubmitValidation()) {
            var vehicleTypeName = $("#txtVehicleType").val()
            var txtminKmsPerDay = $("#txtminKmsPerDay").val()

            var updateUrl = '/Vehicle/UpdateVehicleType';
            var formData = {
                VehicleTypeId: EditVehicleTypeModelDtos.vehicleTypeId,
                VehicleTypeName: vehicleTypeName,
                MinimumKms: txtminKmsPerDay
            };

            $.ajax({
                url: updateUrl,
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (response) {
                    toastr.success("Vehicle Type Details Submitted Successfully!");
                    $("#addVehicleTypeDiv").addClass("d-none");
                    $('#btnAddVehicleType').removeClass('d-none');
                    //FetchVehicleTypes();
                    FetchDataForTable('vehicleTypesTable', getDataUrl);
                },
                error: function (xhr, status, error) {

                    toastr.error("Failed to Update Vehicle Type Details!", "Error");
                }
            });
        }
    })
}
function DeleteVehicleType(vehicleTypeId) {
    var deleteVehicleTypesUrl = '/Vehicle/DeleteVehicleType/' + vehicleTypeId
    $.ajax({
        url: deleteVehicleTypesUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(vehicleTypeId),
        success: function (response) {
            $("#addVehicleTypeDiv").addClass("d-none");
            //FetchVehicleTypes();
            FetchDataForTable('vehicleTypesTable', getDataUrl);
        },
        error: function (xhr, status, error) {

            toastr.error("Failed to Delete Vehicle Type Details!", "Error");
        }
    });
}


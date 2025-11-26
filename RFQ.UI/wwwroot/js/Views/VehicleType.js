var orderColumn = '';
var orderDir = '';

$(document).ready(function () {

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

    $('#btnAdd').on('click', function () {
        $('#btnAdd').addClass('d-none');
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
        FetchVehicleTypes();
        $("#addVehicleTypeDiv").addClass('d-none');
        $("#btnAdd").removeClass('d-none');
        $('#btnSaveVehicleType').removeClass('d-none');
        $('#SavenewButton').removeClass('d-none')
        $('#updateButton').addClass('d-none');
    })
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('vehicleTypesTable', '/Vehicle/ViewVehicleType', orderColumn, orderDir.toUpperCase(), 'EditVehicleType', 'DeleteVehicleType', 'vehicleTypeId');
    });
    UpdateVechileType();
    FetchVehicleTypes();
});
function OnSubmitValidation() {
    if (IsNullOrEmpty($("#txtVehicleType").val())) {
        toastr.warning("Please enter a valid Vehicle Type!", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtminKmsPerDay").val())) {
        toastr.warning("Please Enter a valid Minimum Kms/Day!", "Validation Error");
        return false;
    }
    return true;
}
function FetchVehicleTypes() {
    $('#tableDiv').show();
    $("#addVehicleTypeDiv").addClass("d-none");
    $('#btnAdd').removeClass('d-none');
    FetchDataForTable('vehicleTypesTable', '/Vehicle/ViewVehicleType', orderColumn, orderDir.toUpperCase(), 'EditVehicleType', 'DeleteVehicleType', 'vehicleTypeId');
}

$('#vehicleTypesTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchDataForTable('vehicleTypesTable', '/Vehicle/ViewVehicleType', orderColumn, orderDir.toUpperCase(), 'EditVehicleType', 'DeleteVehicleType', 'vehicleTypeId');
})

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchDataForTable('vehicleTypesTable', '/Vehicle/ViewVehicleType', orderColumn, orderDir.toUpperCase(), 'EditVehicleType', 'DeleteVehicleType', 'vehicleTypeId');
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
                    if (response.statusCode == 200) {
                        toastr.success(response.message, "Success");
                        addMasterUserActivityLog(0, LogType.Create, "VehicleType Details Submitted Successfully!", 0);
                        if (typeof this.completeOnSuccess === "function") {
                            this.completeOnSuccess();
                        }
                    }
                    else {
                        toastr.warning(response.message, "warning");
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Submit Vehicle Type Details!", "Error");
                },
                completeOnSuccess: function () {
                    FetchVehicleTypes();
                }
            });

        } else if (action === "saveNew") {
            $.ajax({
                url: saveUrl,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (response) {
                    if (response.statusCode == 200) {
                        toastr.success(response.message, "Success");
                        addMasterUserActivityLog(0, LogType.Create, "VehicleType Details Submitted Successfully!", 0);
                        $('#VehicleTypeForm')[0].reset();
                    }
                    else {
                        toastr.warning(response.message, "warning");
                    }
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
    $("#updateButton").removeClass('d-none')
    var data = viewModelDto.filter(x => x.vehicleTypeId == vehicleTypeId);
    EditVehicleTypeModelDtos = data[0];
    $('#tableDiv').hide();
    $('#btnAdd').addClass('d-none');
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
                    if (response) {
                        toastr.success("Vehicle Type Details Updated Successfully!");
                        addMasterUserActivityLog(0, LogType.Update, "VehicleType Details Updated Successfully!", 0);
                        $("#addVehicleTypeDiv").addClass("d-none");
                        $('#btnAdd').removeClass('d-none');
                        FetchVehicleTypes();
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.responseText && xhr.responseText.includes("409")) {
                        toastr.warning("Vehicle Type", "Already Exsist.");
                    }
                    else {
                        toastr.error("Failed to Update Vehicle Type Details!");
                    }
                }
            });
        }
    })
}
function DeleteVehicleType(vehicleTypeId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This action cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var deleteVehicleTypesUrl = '/Vehicle/DeleteVehicleType/' + vehicleTypeId;
            $.ajax({
                url: deleteVehicleTypesUrl,
                type: "DELETE",
                contentType: "application/json", // Optional but included for completeness
                dataType: "json",
                success: function (response) {
                    $("#addVehicleTypeDiv").addClass("d-none");
                    $('#currentPage').val(1);
                    FetchVehicleTypes();
                    toastr.success("Vehicle Type has been deleted successfully!");
                    addMasterUserActivityLog(0, LogType.Delete, "Vehicle Type has been deleted successfully!", 0);
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to delete Vehicle Type details!", "Error");
                }
            });
        }
    });
}
function ViewVehicleType(vehicleTypeId) {
    EditVehicleType(vehicleTypeId);
    $('#VehicleTypeForm').find('input, select, textarea, button, a').prop('disabled', true);
    $("#updateButton").addClass('d-none');
}
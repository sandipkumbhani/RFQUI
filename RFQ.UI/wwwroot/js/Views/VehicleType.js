
$(document).ready(function () {
    var vehicleTypeViewModelDtos;
    var EditVehicleTypeModelDtos;
    
    $("#txtVehicleType").on("blur", function () {
        if (!ValidateTextbox("#txtVehicleType")){
            toastr.warning("Please Enter a valid Vehicle Type!", "Validation Error");
            return;
        }
    });
    $("#txtminKmsPerDay").on("blur", function () {
        if (IsNullOrEmpty($(this).val())){
            toastr.warning("Please Enter a valid Minimum Kms/Day!", "Validation Error");
            return;
        }
    });

    //$(document).on("click", "#viewButton", function () {
    //    FetchVehicleTypes();
    //    $("#addVehicleTypeDiv").css('display', 'none')
    //    $("#backButton").css('display', 'Block');
    //});

    $("#btnSaveVehicleType, #SavenewButton").on('click', function () {
        var action = $(this).data('action'); 
        SaveVehicleType(action);
    });

    $('#btnAddVehicleType').on('click',function () {
        $('#btnAddVehicleType').addClass('d-none');
        $('#tableDiv').hide();
        $('#addVehicleTypeDiv').removeClass('d-none');
        $('#viewButton').addClass('d-none');
        $('#btnCancel').removeClass('d-none');
    });

    $("#btnCancel").on('click', function () {
        FetchVehicleTypes();
        $("#addVehicleTypeDiv").addClass('d-none');
        $("#btnAddVehicleType").removeClass('d-none');
    })
    UpdateVechileType();
    FetchVehicleTypes();
});
function OnSubmitValidation() {
    if (IsNullOrEmpty($("#txtVehicleType").val()) || !ValidateTextbox("#txtVehicleType")) {
        toastr.warning("Please enter a valid Vehicle Type!", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtminKmsPerDay").val())){
        toastr.warning("Please Enter a valid Minimum Kms/Day!", "Validation Error");
        return false;
    }
    return true;
}
function FetchVehicleTypes() {
    $('#tableDiv').show();
    var fetchVehicleTypesUrl = '/Vehicle/ViewVehicleType';
    $.ajax({
        url: fetchVehicleTypesUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let trlist = response;
            vehicleTypeViewModelDtos = response;
            if ($.fn.DataTable.isDataTable('#vehicleTypesTable')) {
                $('#vehicleTypesTable').DataTable().clear();
            }

            const table = $("#vehicleTypesTable").DataTable();
            trlist.forEach(item => {
                table.row.add([
                    item.companyName,
                    item.vehicleTypeName,
                    item.minimumKms,
                    `
           <div class="action-items" style="cursor:pointer;">
                    <a class="icon-btn" onclick="EditVehicleType(${item.vehicleTypeId})"><i class="ri-edit-2-line"></i></a>
                    <a class="icon-btn" onclick="DeleteVehicleType(${item.vehicleTypeId})"><i class="ri-delete-bin-3-line"></i></a>
            </div>
            `
                ]);
            });
            // Redraw table with new data
            table.draw();
            // Update total list count
            $('#totalList').text(`Total List: ${trlist.length}`);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
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
    var data = vehicleTypeViewModelDtos.filter(x => x.vehicleTypeId == vehicleTypeId);
    EditVehicleTypeModelDtos = data[0];
    debugger;
    $('#tableDiv').hide();
    $('#btnAddVehicleType').addClass('d-none');
    $('#addVehicleTypeDiv').removeClass('d-none');
    $("#updateButton").css('display', 'Block');
    $("#btnSaveVehicleType").css('display', 'none');
    $("#SavenewButton").css('display', 'none');
    $("#viewButton").css('display', 'none');
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
                    FetchVehicleTypes();
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
            FetchVehicleTypes();
        },
        error: function (xhr, status, error) {
          
            toastr.error("Failed to Delete Vehicle Type Details!", "Error");
        }
    });
}


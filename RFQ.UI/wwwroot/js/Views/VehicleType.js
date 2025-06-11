
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
        FetchVehicleTypes();
        $("#addVehicleTypeDiv").addClass('d-none');
        $("#btnAddVehicleType").removeClass('d-none');
        $('#btnSaveVehicleType').removeClass('d-none');
        $('#SavenewButton').removeClass('d-none')
        $('#updateButton').addClass('d-none');
    })

    UpdateVechileType();
    FetchVehicleTypes();
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

function FetchVehicleTypes() {
    $('#tableDiv').show();
    FetchDataForTable('vehicleTypesTable', '/Vehicle/ViewVehicleType');
    //$('#vehicleTypesTable tbody').empty();
    //$('#totalList').text('Total List: 0');
    //$('#customvehicleTypesPagination').empty();

    //const pageLength = Number($('#pageLength').val()) || 10;
    //let pageNumber = Number($('#currentPage').val()) || 1;
    //if (pageNumber < 1) pageNumber = 1;

    //const searchValue = $('#vehicleTypesTableSearch').val() || '';

    //$.ajax({
    //    url: '/Vehicle/ViewVehicleType',
    //    type: 'POST',
    //    contentType: 'application/json',
    //    data: JSON.stringify({
    //        Draw: pageNumber,
    //        start: (pageNumber - 1) * pageLength,
    //        length: pageLength,
    //        searchValue: searchValue,
    //        orderColumn: 'companyName',
    //        orderDir: 'asc'
    //    }),
    //    success: function (response) {

    //        if (!response || !response.data || response.data.length === 0) {

    //            $('#vehicleTypesTable tbody').html('<tr><td colspan="4" class="text-center">No records found</td></tr>');
    //            $('#totalList').text('Total List: 0');
    //            $('#customvehicleTypesPagination').empty();
    //            return;
    //        }
    //        vehicleTypeViewModelDtos = response.data;
    //        let rowsHtml = '';
    //        response.data.forEach(item => {
    //            rowsHtml += `
    //                <tr>
    //                    <td>${item.companyName}</td>
    //                    <td>${item.vehicleTypeName}</td>
    //                    <td>${item.minimumKms}</td>
    //                    <td class="text-center action-items" style="cursor:pointer;">
    //                        <a class="icon-btn" onclick="EditVehicleType(${item.vehicleTypeId})"><i class="ri-edit-2-line"></i></a>
    //                        <a class="icon-btn" onclick="DeleteVehicleType(${item.vehicleTypeId})"><i class="ri-delete-bin-3-line"></i></a>
    //                    </td>
    //                </tr>`;
    //        });
    //        $('#vehicleTypesTable tbody').html(rowsHtml);
    //        $('#totalList').text(`Total List: ${response.recordsTotal}`);
    //        generatePagination(response.recordsTotal, pageLength, pageNumber);
    //    },
    //    error: function () {
    //        $('#vehicleTypesTable tbody').html('<tr><td colspan="4" class="text-center text-danger">Error loading data</td></tr>');
    //        $('#customvehicleTypesPagination').empty();
    //    }
    //});
}


$('#vehicleTypesTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchVehicleTypes();
});

// Bind events
$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchVehicleTypes();
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


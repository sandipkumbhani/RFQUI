var companyId;
const linkId = GetQueryParam("LinkId");
var orderColumn = '';
var orderDir = '';
var fetchVehicleUrl = '/Vehicle/ViewVehicle';

$(document).ready(function () {
    companyId = getCookieValue('companyid');

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('vehicleTable', fetchVehicleUrl, orderColumn, orderDir.toUpperCase());
    });

    $("#btnSaveVehicle, #btnSaveNewVehicle").on('click', function () {
        var action = $(this).data('action');
        SaveVehicle(action);
    });

    $('#btnAddVehicle').click(function () {
        $('#btnAddVehicle').addClass('d-none');
        $('#tableDiv').addClass('d-none')
        $('#addVehicleDiv').removeClass('d-none');
        $('#btnCancel').removeClass('d-none');
        $('#vehicleNo').prop('disabled', false);
        $('#btnSaveVehicle').show();
        $('#btnSaveNewVehicle').removeClass('d-none')
        $('#btnUpdateVehicle').addClass('d-none');
        $('#vehicleForm')[0].reset();
        $('#ddlOwnerName').val(null).trigger('change');
        $('#ddlCity').val(null).trigger('change');
        $('#ddlVehicleCategory').val(null).trigger('change');
        $('#ddlVehicleType').val(null).trigger('change');
        $('#vehicleCapacity').val(null).trigger('change');
        $('#ddlTrackingProvider').val(null).trigger('change');
    });

    $("#btnCancel").on('click', function () {
        FetchVehicleList();
        $("#addVehicleDiv").addClass('d-none');
        $("#tableDiv").removeClass('d-none')
        $("#btnAddVehicle").removeClass('d-none');
    });
    FetchVehicleList();
    GetAllOwnerOrVendor();
    GetAllVehicleCategory();
    GetAllVehicleType("ddlVehicleType", companyId);
    CheckValidation();
    VehicleEKycClick();
    UpdateVehicle();


});
function SaveVehicle(action) {

    var isValid = OnSubmitValidation();
    if (!isValid) {
        return;
    }

    var vehicleNo = $("#vehicleNo").val();
    var vehicleCategory = $("#ddlVehicleCategory").val();
    var vehicleType = $("#ddlVehicleType").val();
    var vehicleCapacity = $("#vehicleCapacity").val();
    var ownerName = $("#ddlOwnerName").val();
    //var trackingProvider = $("#ddlTrackingProvider").val();
    var trackingProvider = 1;
    var vehicleStatus = $("#vehicleStatusInput").val();
    var blacklistStatus = $("#blacklistStatusInput").val();
    var regdOwner = $("#regdOwnerInput").val();
    var engineNo = $("#engineNoInput").val();
    var chasisNo = $("#chasisNoInput").val();
    var makeModel = $("#makeModelInput").val();
    var pucExpDate = $("#pucExpiryInput").val();
    var financer = $("#financerInput").val();
    var ownerSerialNo = $("#ownerSerialNoInput").val();
    var npNo = $("#npNoInput").val();
    var insuranceNo = $("#insuranceCoInput").val();
    var verifiedOn = $("#verifiedOnInput").val();

    var rtoRegistration = $("#rtoRegistrationInput").val();
    var registrationDate = $("#registrationDateInput").val();
    var permanentAddress = $("#permanentAddressInput").val();
    var grossWeight = $("#grossWeightInput").val();
    var unladenWeight = $("#unladenWeightInput").val();
    var fitnessExpDate = $("#fitnessExpiryInput").val();
    var taxExpDate = $("#taxExpiryInput").val();
    var permitNo = $("#permitNoInput").val();
    var permitExpDate = $("#permitExpiryInput").val();
    var npExpDate = $("#npExpiryInput").val();
    var policyNo = $("#policyNoInput").val();
    var policyExpDate = $("#policyExpiryInput").val();

    var saveUrl = '/Vehicle/VehicleSave';
    var formData = {
        VehicleNo: vehicleNo,
        VehicleCategoryId: vehicleCategory,
        VehicleTypeId: vehicleType,
        VehicleCapacity: vehicleCapacity,
        OwnerVendorId: ownerName,
        TrackingProviderId: trackingProvider,
        VehicleStatus: vehicleStatus,
        BlacklistStatus: blacklistStatus,
        RegdOwner: regdOwner,
        EngineNo: engineNo,
        ChassisNo: chasisNo,
        MakeModel: makeModel,
        PUCExpiryDate: pucExpDate ? new Date(pucExpDate).toISOString() : null,
        Financer: financer,
        OwnerSerialNo: ownerSerialNo,
        NPNo: npNo,
        InsuranceCo: insuranceNo,
        VerifiedOn: verifiedOn ? new Date(verifiedOn).toISOString() : null,
        RTORegistration: rtoRegistration,
        RegistrationDate: registrationDate ? new Date(registrationDate).toISOString() : null,
        PermanentAddress: permanentAddress,
        GrossWeight: parseFloat(grossWeight).toFixed(2),
        UnladenWeight: parseFloat(unladenWeight).toFixed(2),
        FitnessExpiryDate: fitnessExpDate ? new Date(fitnessExpDate).toISOString() : null,
        TaxExpiryDate: taxExpDate ? new Date(taxExpDate).toISOString() : null,
        PermitNo: permitNo,
        PermitExpiryDate: permitExpDate ? new Date(permitExpDate).toISOString() : null,
        NPExpiryDate: npExpDate ? new Date(npExpDate).toISOString() : null,
        PolicyNo: policyNo,
        PolicyExpiryDate: policyExpDate ? new Date(policyExpDate).toISOString() : null,
        LinkId: linkId
    };
    if (action === "save") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.result == "success") {
                    window.location.href = "../Dashboard/Dashboard";
                } else {
                    toastr.error("Something went wrong!");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Details", "Error");
            }
        });
    } else {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.result == "success") {
                    toastr.success("Vehicle Details Submitted Successfully!");
                    $("#vehicleForm")[0].reset();
                    $("#ddlVehicleCategory").val("");
                    $("#ddlVehicleType").val("");
                    $("#ddlOwnerName").val("");
                    $("#ddlTrackingProvider").val("");
                } else {
                    toastr.error("Something went wrong!");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Details", "Error");
            }
        });
    }
}
function EditVehicle(vehicleId) {
    var data = viewModelDto.filter(x => x.vehicleId === vehicleId);
    var formData = data[0];

    $('#tableDiv').hide();
    $('#btnAddVehicle').addClass('d-none');
    $("#addVehicleDiv").removeClass('d-none');
    $("#btnSaveVehicle").hide();
    $("#btnUpdateVehicle").removeClass('d-none')
    $("#btnCancel").removeClass('d-none');
    $("#btnSaveNewVehicle").addClass('d-none')

    $("#vehicleNo").val(formData.vehicleNo).prop("disabled", true);
    $("#hdVehicleId").val(formData.vehicleId);
    $('#ddlVehicleCategory').val(formData.vehicleCategoryId).trigger('change');
    $('#ddlVehicleType').val(formData.vehicleTypeId).trigger('change');
    $("#vehicleCapacity").val(formData.vehicleCapacity);
    $('#ddlOwnerName').val(formData.ownerVendorId).trigger('change');
    //$('#ddlTrackingProvider').val(formData.trackingProviderId).trigger('change');
    $("#vehicleStatusInput").val(formData.vehicleStatus);
    $("#blacklistStatusInput").val(formData.blacklistStatus);
    $("#regdOwnerInput").val(formData.regdOwner);
    $("#engineNoInput").val(formData.engineNo);
    $("#chasisNoInput").val(formData.chassisNo);
    $("#makeModelInput").val(formData.makeModel);
    var pucExpiryDate = new Date(formData.pucExpiryDate).toLocaleDateString('en-CA');
    $("#pucExpiryInput").val(pucExpiryDate);
    $("#financerInput").val(formData.financer);
    $("#ownerSerialNoInput").val(formData.ownerSerialNo);
    $("#npNoInput").val(formData.npNo);
    $("#insuranceCoInput").val(formData.insuranceCo);
    var verifiedOnDate = new Date(formData.verifiedOn).toLocaleDateString('en-CA');
    $("#verifiedOnInput").val(verifiedOnDate);
    $("#rtoRegistrationInput").val(formData.rtoRegistration);
    var regDate = new Date(formData.registrationDate).toLocaleDateString('en-CA');
    $("#registrationDateInput").val(regDate);
    $("#permanentAddressInput").val(formData.permanentAddress);
    $("#grossWeightInput").val(formData.grossWeight);
    $("#unladenWeightInput").val(formData.unladenWeight);
    var fitExpDate = new Date(formData.fitnessExpiryDate).toLocaleDateString('en-CA');
    $("#fitnessExpiryInput").val(fitExpDate);
    var taxxExpDate = new Date(formData.taxExpiryDate).toLocaleDateString('en-CA');
    $("#taxExpiryInput").val(taxxExpDate);
    $("#permitNoInput").val(formData.permitNo);
    var perExpDate = new Date(formData.permitExpiryDate).toLocaleDateString('en-CA');
    $("#permitExpiryInput").val(perExpDate);
    var npermitExpDate = new Date(formData.npExpiryDate).toLocaleDateString('en-CA');
    $("#npExpiryInput").val(npermitExpDate);
    $("#vehicleCapacityInput").val(formData.vehicleCapacity);
    $("#policyNoInput").val(formData.policyNo);
    var poliExpDate = new Date(formData.policyExpiryDate).toLocaleDateString('en-CA');
    $("#policyExpiryInput").val(poliExpDate);
}
function UpdateVehicle() {
    $("#btnUpdateVehicle").on('click', function (e) {
        e.preventDefault();
        var isvalid = OnSubmitValidation();
        if (!isvalid) {
            return;
        }

        //var formData = {
        //    VehicleId: $("#hdVehicleId").val(),
        //    VehicleNo: $("#vehicleNo").val(),
        //    VehicleCategoryId: $("#ddlVehicleCategory").val(),
        //    VehicleTypeId: $("#ddlVehicleType").val(),
        //    VehicleCapacity: $("#vehicleCapacity").val(),
        //    OwnerVendorId: $("#ddlOwnerName").val(),
        //    TrackingProviderId: 1,
        //    VehicleStatus: $("#vehicleStatusInput").val(),
        //    BlacklistStatus: $("#blacklistStatusInput").val(),
        //    RegdOwner: $("#regdOwnerInput").val(),
        //    EngineNo: $("#engineNoInput").val(),
        //    ChassisNo: $("#chasisNoInput").val(),
        //    MakeModel: $("#makeModelInput").val(),
        //    PUCExpiryDate: $("#pucExpiryInput").val(),
        //    Financer: $("#financerInput").val(),
        //    OwnerSerialNo: $("#ownerSerialNoInput").val(),
        //    NPNo: $("#npNoInput").val(),
        //    InsuranceCo: $("#insuranceCoInput").val(),
        //    VerifiedOn: $("#verifiedOnInput").val(),
        //    RTORegistration: $("#rtoRegistrationInput").val(),
        //    RegistrationDate: $("#registrationDateInput").val(),
        //    PermanentAddress: $("#permanentAddressInput").val(),
        //    GrossWeight: $("#grossWeightInput").val(),
        //    UnladenWeight: $("#unladenWeightInput").val(),
        //    FitnessExpiryDate: $("#fitnessExpiryInput").val(),
        //    TaxExpiryDate: $("#taxExpiryInput").val(),
        //    PermitNo: $("#permitNoInput").val(),
        //    PermitExpiryDate: $("#permitExpiryInput").val(),
        //    NPExpiryDate: $("#npExpiryInput").val(),
        //    PolicyNo: $("#policyNoInput").val(),
        //    PolicyExpiryDate: $("#policyExpiryInput").val()
        //};
        var formData = {
            VehicleId: $("#hdVehicleId").val(),
            VehicleNo: $("#vehicleNo").val(),
            VehicleCategoryId: $("#ddlVehicleCategory").val(),
            VehicleTypeId: $("#ddlVehicleType").val(),
            VehicleCapacity: $("#vehicleCapacity").val(),
            OwnerVendorId: $("#ddlOwnerName").val(),
            TrackingProviderId: 1,
            VehicleStatus: $("#vehicleStatusInput").val(),
            BlacklistStatus: $("#blacklistStatusInput").val(),
            RegdOwner: $("#regdOwnerInput").val(),
            EngineNo: $("#engineNoInput").val(),
            ChassisNo: $("#chasisNoInput").val(),
            MakeModel: $("#makeModelInput").val(),
            PUCExpiryDate: $("#pucExpiryInput").val() ? new Date($("#pucExpiryInput").val()).toISOString() : null,
            Financer: $("#financerInput").val(),
            OwnerSerialNo: $("#ownerSerialNoInput").val(),
            NPNo: $("#npNoInput").val(),
            InsuranceCo: $("#insuranceCoInput").val(),
            VerifiedOn: $("#verifiedOnInput").val() ? new Date($("#verifiedOnInput").val()).toISOString() : null,
            RTORegistration: $("#rtoRegistrationInput").val(),
            RegistrationDate: $("#registrationDateInput").val() ? new Date($("#registrationDateInput").val()).toISOString() : null,
            PermanentAddress: $("#permanentAddressInput").val(),
            GrossWeight: parseFloat($("#grossWeightInput").val()).toFixed(2),
            UnladenWeight: parseFloat($("#unladenWeightInput").val()).toFixed(2),
            FitnessExpiryDate: $("#fitnessExpiryInput").val() ? new Date($("#fitnessExpiryInput").val()).toISOString() : null,
            TaxExpiryDate: $("#taxExpiryInput").val() ? new Date($("#taxExpiryInput").val()).toISOString() : null,
            PermitNo: $("#permitNoInput").val(),
            PermitExpiryDate: $("#permitExpiryInput").val() ? new Date($("#permitExpiryInput").val()).toISOString() : null,
            NPExpiryDate: $("#npExpiryInput").val() ? new Date($("#npExpiryInput").val()).toISOString() : null,
            PolicyNo: $("#policyNoInput").val(),
            PolicyExpiryDate: $("#policyExpiryInput").val() ? new Date($("#policyExpiryInput").val()).toISOString() : null,
            LinkId: linkId
        };
        var editVehicle = '/Vehicle/UpdateVehicle';
        $.ajax({
            type: "PUT",
            url: editVehicle,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result === "success") {
                    toastr.success("Vehicle Details Updated Successfully!");
                    $("#addVehicleDiv").addClass('d-none');
                    $('#btnAddVehicle').removeClass('d-none');
                    FetchVehicleList();
                } else {
                    toastr.error("Failed to Update Vehicle Details", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Vehicle Details", "Error");
            }
        });
    });
}
function DeleteVehicle(vehicleId) {
    var deleteVehicle = `/Vehicle/DeleteVehicle/${vehicleId}`;

    $.ajax({
        url: deleteVehicle,
        type: "DELETE",
        dataType: "json",
        success: function (response) {
            if (response && response.result === "success") {
                toastr.success("Vehicle Details Deleted Successfully!");
                $("#addVehicleDiv").addClass('d-none');
                $('#currentPage').val(1);
                FetchVehicleList();
            } else {
                toastr.error("Failed to Delete Vehicle Details!", "Error");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Delete Vehicle Details!", "Error");
        }
    });
}

function FetchVehicleList() {
    $("#tableDiv").show();
    FetchDataForTable('vehicleTable', fetchVehicleUrl, orderColumn, orderDir.toUpperCase());
}


//Bind events
$('#vehicleTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchVehicleList();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchVehicleList();
});

function IsValidVehicleNumber(vehicleNumber) {
    var pattern = /^([A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4})$/;
    return pattern.test(vehicleNumber);
}
function VehicleEKycClick() {
    $("#btnVehicleKyc").on("click", function () {
        var getUrl = '/Vehicle/GetVehicleKycDetails';
        var vehicleNo = $("#vehicleNo").val();

        if (!IsValidVehicleNumber(vehicleNo)) {
            toastr.warning("Please enter a valid Vehicle No", "Validation Error");
            ClearFields();
            return false;
        }

        var Body = {
            VehicleNo: vehicleNo,
        }
        $.ajax({
            url: getUrl,
            type: "Post",
            contentType: "application/json charset=utf-8",
            data: JSON.stringify(Body),
            success: function (response) {
                var rcModel = response.vehicleRCModel;
                if (rcModel != null) {
                    $("#vehicleNo").val(rcModel.vehicleNo);
                    $("#vehicleStatusInput").val(rcModel.vehicleRCStatus);
                    $("#blacklistStatusInput").val(rcModel.nonUseStatus);
                    $("#regdOwnerInput").val(rcModel.ownerName);
                    $("#engineNoInput").val(rcModel.vehicleEngineNumber);
                    $("#chasisNoInput").val(rcModel.vehicleChassisNumber);
                    $("#makeModelInput").val(rcModel.vehicleMakerModel);
                    rcModel.pucExpiryDate ? $("#pucExpiryInput").val(new Date(rcModel.pucExpiryDate).toISOString().split('T')[0]) : "";
                    $("#financerInput").val(rcModel.financier);
                    $("#ownerSerialNoInput").val(rcModel.ownerSerialNo);
                    $("#npNoInput").val(rcModel.nationalPermitNumber);
                    $("#insuranceCoInput").val(rcModel.insuranceCompany);
                    rcModel.issueDate ? $("#verifiedOnInput").val(new Date(rcModel.issueDate).toISOString().split('T')[0]) : "";
                    $("#rtoRegistrationInput").val(rcModel.registeredAt);
                    rcModel.issueDate ? $("#registrationDateInput").val(new Date(rcModel.issueDate).toISOString().split('T')[0]) : "";
                    $("#permanentAddressInput").val(rcModel.permanentAddress);
                    $("#grossWeightInput").val(rcModel.vehicleGrossWeight);
                    $("#unladenWeightInput").val(rcModel.vehicleUnladenWeight);
                    rcModel.expiryDate ? $("#fitnessExpiryInput").val(new Date(rcModel.expiryDate).toISOString().split('T')[0]) : "";
                    rcModel.taxEndDate ? $("#taxExpiryInput").val((([d, m, y]) => new Date(y, m - 1, d, 12))(rcModel.taxEndDate.split("-")).toISOString().split('T')[0]) : "";
                    $("#permitNoInput").val(rcModel.permitNumber);
                    rcModel.permitExpiryDate ? $("#permitExpiryInput").val(new Date(rcModel.permitExpiryDate).toISOString().split('T')[0]) : "";
                    rcModel.nationalPermitExpiryDate ? $("#npExpiryInput").val(new Date(rcModel.nationalPermitExpiryDate).toISOString().split('T')[0]) : "";
                    $("#vehicleCapacityInput").val(rcModel.vehicleCubicCapacity);
                    $("#policyNoInput").val(rcModel.pucNumber);
                    rcModel.insuranceExpiryDate ? $("#policyExpiryInput").val(new Date(rcModel.insuranceExpiryDate).toISOString().split('T')[0]) : "";
                }
                else {
                    toastr.warning("Vehicle kyc Details Not Available!", "Warning");
                    ClearFields();
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Fetch Vehicle kyc Details!", "Error");
                ClearFields();
            }
        });
    });
}
function GetAllVehicleCategory() {
    var GetUrl = '/Vehicle/GetAllVehicleCategory';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const dropdown = document.getElementById("ddlVehicleCategory");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a VehicleCategory";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            dropdown.appendChild(placeholderOption);

            response.forEach(category => {
                const option = document.createElement("option");
                option.value = category.internalMasterId;
                option.textContent = category.internalMasterName;
                dropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Vehicle Category!", "Error");
        }
    });
}
function GetAllOwnerOrVendor() {
    var getAllOwnerOrVendorUrl = "/Vehicle/GetAllOwnerOrVendor";

    $.ajax({
        url: getAllOwnerOrVendorUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const ownerdropdown = document.getElementById("ddlOwnerName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a OwnerName";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            ownerdropdown.appendChild(placeholderOption);


            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                ownerdropdown.appendChild(option);
            });

        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch Owner/Vendor Data!", "Error");
        }
    });
}
function CheckValidation() {

    $("#vehicleNo").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid VehicleNo", "Validation Error");
            return;
        }
    });
    $("#vehicleCapacity").on("blur", function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter a valid VehicleCapacity", "Validation Error");
            return;
        }
    });

}
function OnSubmitValidation() {

    if (IsNullOrEmpty($("#vehicleNo").val()) || !IsValidVehicleNumber($("#vehicleNo").val())) {
        toastr.warning("Please enter a valid VehicleNo", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlVehicleType").val())) {
        toastr.warning("Please select a valid VehicleType", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlOwnerName").val())) {
        toastr.warning("Please select a valid OwnerName", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlVehicleCategory").val())) {
        toastr.warning("Please select a valid VehicleCategory", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#vehicleCapacity").val())) {
        toastr.warning("Please enter a valid VehicleCapacity", "Validation Error");
        return false;
    }
    //if (IsNullOrEmpty($("#ddlTrackingProvider").val())) {
    //    toastr.warning("Please select a valid TrackingProvider", "Validation Error");
    //    return false;
    //}

    return true;
}
function ClearFields() {
    $("#vehicleStatusInput").val("");
    $("#blacklistStatusInput").val("");
    $("#regdOwnerInput").val("");
    $("#engineNoInput").val("");
    $("#chasisNoInput").val("");
    $("#makeModelInput").val("");
    $("#pucExpiryInput").val("");
    $("#financerInput").val("");
    $("#ownerSerialNoInput").val("");
    $("#npNoInput").val("");
    $("#insuranceCoInput").val("");
    $("#verifiedOnInput").val("");
    $("#rtoRegistrationInput").val("");
    $("#registrationDateInput").val("");
    $("#permanentAddressInput").val("");
    $("#grossWeightInput").val("");
    $("#unladenWeightInput").val("");
    $("#fitnessExpiryInput").val("");
    $("#taxExpiryInput").val("");
    $("#permitNoInput").val("");
    $("#permitExpiryInput").val("");
    $("#npExpiryInput").val("");
    $("#vehicleCapacityInput").val("");
    $("#policyNoInput").val("");
    $("#policyExpiryInput").val("");
}
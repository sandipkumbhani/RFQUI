var companyId;
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

        FetchDataForTable('vehicleTable', fetchVehicleUrl, orderColumn, orderDir.toUpperCase(), 'EditVehicle', 'DeleteVehicle', vehicleId);
    });

    $("#btnSaveVehicle, #btnSaveNewVehicle").on('click', function () {
        var action = $(this).data('action');
        SaveVehicle(action);
    });
    $('#tableDivLink').on('click', function (e) {
        e.preventDefault();
        FetchVehicleList();
    });
    $("#btnAdd").on("click", function () {
        $("#tableDiv").css('display', 'none ');
        $("#addVehicleDiv").css('display', 'block');
    });

    $("#btnCancel").on('click', function () {
        FetchVehicleList();
    });
    FetchVehicleList();
    GetAllOwnerOrVendor();
    GetAllVehicleCategory();
    GetAllVehicleType("ddlVehicleType", companyId);
    CheckValidation();
    VehicleEKycClick();
    UpdateVehicle();
});

$("#ddlVehicleCategory").on('change', function () {
    if ($(this).val() == null) {
        return;
    }
    if ($(this).find('option:selected').text() === "OWNED") {
        $("#ddlOwnerName").val(0).trigger('change');
        $("#ddlOwnerName").prop('disabled', true);
    }
    else {
        $("#ddlOwnerName").prop('disabled', false);
    }
})
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
    var trackingProvider = $("#ddlTrackingProvider").val();
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
        VehicleCapacity: vehicleCapacity ? vehicleCapacity : null,
        OwnerVendorId: ownerName ? ownerName : 0,
        TrackingProviderId: trackingProvider ? trackingProvider : null,
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
        GrossWeight: grossWeight ? parseFloat(grossWeight).toFixed(2) : null,
        UnladenWeight: unladenWeight ? parseFloat(unladenWeight).toFixed(2) : null,
        FitnessExpiryDate: fitnessExpDate ? new Date(fitnessExpDate).toISOString() : null,
        TaxExpiryDate: taxExpDate ? new Date(taxExpDate).toISOString() : null,
        PermitNo: permitNo,
        PermitExpiryDate: permitExpDate ? new Date(permitExpDate).toISOString() : null,
        NPExpiryDate: npExpDate ? new Date(npExpDate).toISOString() : null,
        PolicyNo: policyNo,
        PolicyExpiryDate: policyExpDate ? new Date(policyExpDate).toISOString() : null,
        LinkId: GetQueryParam("LinkId")
    };
    if (action === "save") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                response = JSON.parse(response);
                if (response.success === false) {
                    toastr.warning(response.message, "Warning");
                } else {
                    toastr.success("Vehicle Details Submitted Successfully!");
                    addMasterUserActivityLog(0, LogType.Create, "Vehicle Details Submitted Successfully!", 0);

                    if (typeof this.completeOnSuccess === "function") {
                        this.completeOnSuccess();
                    }
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Details", "Error");
            },
            completeOnSuccess: function () {
                FetchVehicleList();
            }
        });
    } else {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                response = JSON.parse(response);
                if (response.success === false) {
                    toastr.warning(response.message, "Warning");
                } else {
                    toastr.success("Vehicle Details Submitted Successfully!");
                    addMasterUserActivityLog(0, LogType.Create, "Vehicle Details Submitted Successfully!", 0);
                    $("#vehicleForm")[0].reset();
                    $("#ddlOwnerName").prop('disabled', false);
                    $("select.select2-custom").each(function () {
                        $(this).val(0).trigger('change');
                    });
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Details", "Error");
            }
        });
    }
}
function EditVehicle(vehicleId) {
    if ($("#btnUpdateVehicle").hasClass('d-none')) {
        $("#btnUpdateVehicle").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.vehicleId === vehicleId);
    var formData = data[0];
    $('#tableDiv').css('display', 'none');
    $("#addVehicleDiv").css('display', 'block');
    $("#btnSaveVehicle").hide();
    $("#btnUpdateVehicle").removeClass('d-none')
    $("#btnSaveNewVehicle").hide();
    $("#vehicleNo").val(formData.vehicleNo).prop("disabled", true);
    $("#hdVehicleId").val(formData.vehicleId);
    $('#ddlVehicleCategory').val(formData.vehicleCategoryId).trigger('change');
    $('#ddlVehicleType').val(formData.vehicleTypeId).trigger('change');
    $("#vehicleCapacity").val(formData.vehicleCapacity ? formData.vehicleCapacity : "");
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
    $("#grossWeightInput").val(formData.grossWeight ? formData.grossWeight : "");
    $("#unladenWeightInput").val(formData.unladenWeight ? formData.unladenWeight : "");
    var fitExpDate = new Date(formData.fitnessExpiryDate).toLocaleDateString('en-CA');
    $("#fitnessExpiryInput").val(fitExpDate);
    var taxxExpDate = new Date(formData.taxExpiryDate).toLocaleDateString('en-CA');
    $("#taxExpiryInput").val(taxxExpDate);
    $("#permitNoInput").val(formData.permitNo);
    var perExpDate = new Date(formData.permitExpiryDate).toLocaleDateString('en-CA');
    $("#permitExpiryInput").val(perExpDate);
    var npermitExpDate = new Date(formData.npExpiryDate).toLocaleDateString('en-CA');
    $("#npExpiryInput").val(npermitExpDate);
    $("#vehicleCapacityInput").val(formData.vehicleCapacity ? formData.vehicleCapacity : "");
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

        var formData = {
            VehicleId: $("#hdVehicleId").val(),
            VehicleNo: $("#vehicleNo").val(),
            VehicleCategoryId: $("#ddlVehicleCategory").val(),
            VehicleTypeId: $("#ddlVehicleType").val(),
            VehicleCapacity: $("#vehicleCapacity").val() ? $("#vehicleCapacity").val() : null,
            OwnerVendorId: $("#ddlOwnerName").val() ? $("#ddlOwnerName").val() : 0,
            TrackingProviderId: $("#ddlTrackingProvider").val() ? $("#ddlTrackingProvider").val() : null,
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
            GrossWeight: $("#grossWeightInput").val() ? parseFloat($("#grossWeightInput").val()).toFixed(2) : null,
            UnladenWeight: $("#unladenWeightInput").val() ? parseFloat($("#unladenWeightInput").val()).toFixed(2) : null,
            FitnessExpiryDate: $("#fitnessExpiryInput").val() ? new Date($("#fitnessExpiryInput").val()).toISOString() : null,
            TaxExpiryDate: $("#taxExpiryInput").val() ? new Date($("#taxExpiryInput").val()).toISOString() : null,
            PermitNo: $("#permitNoInput").val(),
            PermitExpiryDate: $("#permitExpiryInput").val() ? new Date($("#permitExpiryInput").val()).toISOString() : null,
            NPExpiryDate: $("#npExpiryInput").val() ? new Date($("#npExpiryInput").val()).toISOString() : null,
            PolicyNo: $("#policyNoInput").val(),
            PolicyExpiryDate: $("#policyExpiryInput").val() ? new Date($("#policyExpiryInput").val()).toISOString() : null,
            LinkId: GetQueryParam("LinkId")
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
                    addMasterUserActivityLog(0, LogType.Update, "Vehicle Details Updated Successfully!", 0);
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
            var deleteVehicle = `/Vehicle/DeleteVehicle/${vehicleId}`;

            $.ajax({
                url: deleteVehicle,
                type: "DELETE",
                dataType: "json",
                success: function (response) {
                    if (response && response.result === "success") {
                        toastr.success("Vehicle Details c Successfully!");
                        addMasterUserActivityLog(0, LogType.Delete, "Vehicle Details Delete Successfully!", 0);
                        $('#currentPage').val(1);
                        FetchVehicleList();
                    }
                    else {
                        toastr.error("Failed to Delete Vehicle Details!", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Delete Vehicle Details!", "Error");
                }
            });
        }
    });
}
function FetchVehicleList() {
    $("#addVehicleDiv").css('display', 'none');
    $("#tableDiv").css('display', 'block');
    $("#vehicleForm")[0].reset();
    $("#btnSaveNewVehicle").show();
    $("#btnSaveVehicle").show();
    $("#btnUpdateVehicle").addClass('d-none')
    $("#vehicleNo").prop("disabled", false);
    $("select.select2-custom").each(function () {
        $(this).val(0).trigger('change');
    });
    $("#ddlOwnerName").prop('disabled', false);
    FetchDataForTable('vehicleTable', fetchVehicleUrl, orderColumn, orderDir.toUpperCase(), 'EditVehicle', 'DeleteVehicle', 'vehicleId');
}

$('#vehicleTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchVehicleList();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchVehicleList();
});

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
                    $("#verifiedOnInput").val(new Date().toISOString().split('T')[0]);
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
                    $("#vehicleCapacity").val(rcModel.vehicleCubicCapacity);
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
            /*const dropdown = document.getElementById("ddlVehicleCategory");*/
            const dropdowns = document.querySelectorAll("#ddlVehicleCategory");
            const vehicleCategoryDropdown = dropdowns[dropdowns.length - 1];
            vehicleCategoryDropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a VehicleCategory";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vehicleCategoryDropdown.appendChild(placeholderOption);

            response.forEach(category => {
                const option = document.createElement("option");
                option.value = category.internalMasterId;
                option.textContent = category.internalMasterName;
                vehicleCategoryDropdown.appendChild(option);
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
        data: { companyId: companyId },
        success: function (response) {
           /* const ownerdropdown = document.getElementById("ddlOwnerName");*/
            const dropdowns = document.querySelectorAll("#ddlOwnerName");
            const ownerdropdown = dropdowns[dropdowns.length - 1];
            ownerdropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
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
    if (!$("#ddlOwnerName").prop("disabled") && IsNullOrEmpty($("#ddlOwnerName").val())) {
        toastr.warning("Please select a valid OwnerName", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#ddlVehicleCategory").val())) {
        toastr.warning("Please select a valid VehicleCategory", "Validation Error");
        return false;
    }
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

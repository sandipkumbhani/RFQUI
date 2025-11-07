const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');
var companyId;
var driverDrpList;
var orderColumn = '';
var orderDir = '';
var companyId;
var profileId;
var locationId;
var FetchVehiclePlacementUrl = '/VehiclePlacement/GetAllVehiclePlacement';
var VehicIndentList;

$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    $('#ddlIndentNo').on('change', function () {
        if ($(this).val() != null) {
            AutoFetch();
        }
        else {
            return;
        }
    });
    $('#ddlVehicleNo').on('change', function () {
        const selectedValue = $(this).val();
        const selectedVehicle = VehicleList.find(x => x.vehicleId == selectedValue);
        if (selectedVehicle) {
            $("#ddlOwnerName").val(selectedVehicle.ownerVendorId).trigger('change');
        }
    });

    GetAllDriver();
    GetAllTrackingType();
    //GetAllVehicleIndent();
    GetAllVehicleNumber();
    FetchPlacementNo();
    GetAllOwnerOrVendor();
    GetAllBrokerVendor();
    FetchVehiclePlacement();
    ButtonUpdateClick();
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("ddlVehicleType", companyId);
    //GetAllLocation("ddlIndentBranch", companyId);
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
    $("#ddlLocation").on('change', function () {
        let selectLocationId = $(this).val();
        GetAllVehicleIndent(selectLocationId);
    })

    $('#tableDivLink').on('click', function (e) {
        FetchVehiclePlacement();
    });

    $("#btnCancel").on("click", function () {
        FetchVehiclePlacement();
    });

    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('PlacementTable', FetchVehiclePlacementUrl, orderColumn, orderDir.toUpperCase(), 'UpdateVehiclePlacement', 'DeleteVehiclePlacement', 'placementId');
    });

    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        $(this).prop('disabled', true);
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveVehiclePlacement(action);
        }
    });
    $("#ddlLocation").on('change', function () {
        let selectLocationId = $(this).val();
        GetAllVehicleIndent(selectLocationId);
    })
});

$('#btnAdd').click(function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");
});

$("#txtAdvancePayable").on('change', function () {
    var hireAmt = Number($("#txtTotalHairAmt").val());
    var advancePay = Number($("#txtAdvancePayable").val());
    var payable = hireAmt - advancePay;
    $("#txtBalancePayable").val(payable);
});

$("#txtTotalHairAmt").on('change', function () {
    var hireAmt = Number($("#txtTotalHairAmt").val());
    var advancePay = Number($("#txtAdvancePayable").val());
    var payable = hireAmt - advancePay;
    $("#txtBalancePayable").val(payable);
});

$("#ddlDriverName").on('change', function () {
    if ($(this).val() != null) {
        var filterData = driverDrpList.find(x => x.driverId == $(this).val());
        $("#txtMobileNo").val(filterData.mobNo);
    }
    else {
        return;
    }
})

$('#PlacementTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchVehiclePlacement();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchVehiclePlacement();
});
function FetchVehiclePlacement() {
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    $('#vehiclePlacementForm')[0].reset();
    ////myDropzone.removeAllFiles();
    ////$('#ddlCity').val(null).trigger('change');
    $("#btnSaveForm").show();
    $("#btnUpdate").hide();
    $("#btnSaveAndNewForm").show();
    //ResetAttachmentRepeater();
    FetchDataForTable('PlacementTable', FetchVehiclePlacementUrl, orderColumn, orderDir.toUpperCase(), 'UpdateVehiclePlacement', 'DeleteVehiclePlacement', 'placementId');
}
function GetAllVehicleIndent(selectLocationId, selectedIndentId = null) {
    var getVehicleTypeUrl = '/RequestForQuote/GetAllVehicleIndentList'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: function (response) {
            response = response.result;
            VehicIndentList = response.filter(x => x.locationId == selectLocationId);
            $("#ddlIndentNo").empty();
            const Indentdropdown = document.getElementById("ddlIndentNo");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Indent No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            Indentdropdown.appendChild(placeholderOption);
            VehicIndentList.forEach(item => {
                const option = document.createElement("option");
                option.value = item.indentId;
                option.textContent = item.indentNo;
                Indentdropdown.appendChild(option);
            });
            if (selectedIndentId) {
                $("#ddlIndentNo").val(Number(selectedIndentId)).trigger('change');
                $("#ddlIndentNo").prop('disabled', true);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlLocation").val())) {
        toastr.warning("Please Select a Location", "Validation Error");
        return false;
    }

    if (!isValidateSelect($("#ddlIndentNo").val())) {
        toastr.warning("Please Select a IndentNo", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlVehicleNo").val())) {
        toastr.warning("Please Select a Vehicle  No", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlTrakingType").val())) {
        toastr.warning("Please Select a ddlTrakingType", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlDriverName").val())) {
        toastr.warning("Please Select a Driver Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtMobileNo").val())) {
        toastr.warning("Please enter a Mobile No", "Validation Error");
        return false;
    }
    //if (!isValidateSelect($("#ddlBrokerName").val())) {
    //    toastr.warning("Please Select a Broker Name", "Validation Error");
    //    return false;
    //}
    //if (IsNullOrEmpty($("#txtTotalHairAmt").val())) {
    //    toastr.warning("Please enter a Total Hair Amt", "Validation Error");
    //    return false;
    //}
    //if (IsNullOrEmpty($("#txtAdvancePayable").val())) {
    //    toastr.warning("Please enter a Advance Payable", "Validation Error");
    //    return false;
    //}
    return true;
}
function GetAllTrackingType() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == EnumInternalMasterType.TRACKING_TYPE);
            const select = document.getElementById("ddlTrakingType");
            select.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Tracking Type";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            internalData.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.internalMasterId;
                opt.textContent = option.internalMasterName;
                select.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllDriver() {
    $.ajax({
        url: '/Driver/GetAllDriverList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            driverDrpList = response;
            const selectLocation = document.getElementById("ddlDriverName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Driver";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            driverDrpList.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.driverId;
                opt.textContent = option.driverName;
                selectLocation.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllVehicleNumber() {
    $.ajax({
        url: '/Vehicle/GetVehicleNumber',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            VehicleList = response;
            if (VehicleList != null) {
                $('#ddlVehicleNo').empty();
                const selectVehicleNumber = document.getElementById("ddlVehicleNo");
                let placeholderOption = document.createElement("option");
                placeholderOption.value = "";
                placeholderOption.textContent = "Select Vehicle No";
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                selectVehicleNumber.appendChild(placeholderOption);
                data.forEach(option => {
                    let opt = document.createElement("option");
                    opt.value = option.vehicleId;
                    opt.textContent = option.vehicleNo;
                    selectVehicleNumber.appendChild(opt);
                });
                $('.selectpicker').selectpicker('refresh');
            } else {
                toastr.warning("No Vehicle Number Found!", "warning");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function FetchPlacementNo() {
    $.ajax({
        url: "/VehiclePlacement/GetPlacementNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtPlacementNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Placement No!", "Error");
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
            const ownerdropdown = document.getElementById("ddlOwnerName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Owner Name";
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
function GetAllBrokerVendor() {
    var getAllBrokerVendorUrl = "/Vendor/GetAllVendorList";
    $.ajax({
        url: getAllBrokerVendorUrl,
        type: "GET",
        dataType: "json",
        data: { companyId: companyId },
        success: function (response) {
            var data = response.filter(x => x.partyCategoryId == EnumInternalMaster.BROKER);
            const brokerdropdown = document.getElementById("ddlBrokerName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Broker Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            brokerdropdown.appendChild(placeholderOption);

            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                brokerdropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch Broker Vendor Data!", "Error");
        }
    });
}
function AutoFetch() {
    var indentNo = $("#ddlIndentNo").val();
    var getUrl = '/VehiclePlacement/AutoFetchPlacement/' + indentNo;
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            // Check if response is a non-empty array
            if (Array.isArray(response) && response.length > 0) {
                let data = response[0]; // Use the first object in the array
                let indentDate = data.indentDate;
                if (indentDate) {
                    if (indentDate instanceof Date) {
                        indentDate = indentDate.toISOString().split('T')[0];
                    } else if (typeof indentDate === "string" && indentDate.includes("T")) {
                        indentDate = indentDate.split('T')[0];
                    }
                    $('#txtIndentDate').val(indentDate);
                } else {
                    $('#txtIndentDate').val('');
                }
                $("#txtRFQNo").val(data.rfqNo);
                $("#ddlCustomerName").val(data.partyId).trigger('change');
                $("#ddlVehicleType").val(data.vehicleTypeId).trigger('change');
                $('#from-search-box').val(data.fromLocation);
                $('#to-search-box').val(data.toLocation);
                $('#txtNoOfVehicles').val(data.requiredVehicles);
                $('#ddlIndentBranch').val(data.locationId).trigger('change');
                $('#txtPendingVehicles').val(data.pendingVehicles);

                // Format vehicleReqOn
                let vehicleReqOn = data.vehicleReqOn;
                if (vehicleReqOn) {
                    if (vehicleReqOn instanceof Date) {
                        vehicleReqOn = vehicleReqOn.toISOString().split('T')[0];
                    } else if (typeof vehicleReqOn === "string" && vehicleReqOn.includes("T")) {
                        vehicleReqOn = vehicleReqOn.split('T')[0];
                    }
                    $('#txtVehicleReqOn').val(vehicleReqOn);
                } else {
                    $('#txtVehicleReqOn').val('');
                }

                let rfqDate = data.vehicleReqOn;
                if (rfqDate) {
                    if (rfqDate instanceof Date) {
                        rfqDate = rfqDate.toISOString().split('T')[0];
                    } else if (typeof rfqDate === "string" && rfqDate.includes("T")) {
                        rfqDate = rfqDate.split('T')[0];
                    }
                    $('#txtRFQDate').val(rfqDate);
                } else {
                    $('#txtRFQDate').val('');
                }

            } else {
                toastr.warning("No data found for selected indent number.", "Warning");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch RFQ data!", "Error");
        }
    });
}
function VehiclePopUp() {
    $("#vehiclePopupModal .modal-body").load('/VehiclePlacement/CreateVehicle', function () {
        $("#btnVehicleKyc").off("click").on("click", function () {
            VehicleEKycClick();
        });
        $("#btnSaveVehicle").on('click', function () {
            var action = $(this).data('action');
            if (VehicleValidationCheck()) {
                SaveVehicle(action);
            }
        })
        PopUpOwnerOrVendor();
        GetAllVehicleCategory();
        GetAllVehicleType("popUpVehicleType", companyId);
        $("#vehiclePopupModal").modal("show");
    });
}
function SaveVehicle(action) {
    var vehicleNo = $("#vehicleNo").val();
    var vehicleCategory = $("#ddlVehicleCategory").val();
    var vehicleType = $("#popUpVehicleType").val();
    var vehicleCapacity = $("#vehicleCapacity").val();
    var ownerName = $("#popUpOwnerName").val();
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
        LinkId: GetQueryParam("LinkId"),
    };
    if (action === "save") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response.result == "success") {
                    GetAllVehicleNumber();
                    $("#vehicleForm")[0].reset();
                    $("#ddlVehicleCategory").val("");
                    $("#popUpVehicleType").val("");
                    $("#popUpOwnerName").val("");
                    $("#ddlTrackingProvider").val("");
                    $("#vehiclePopupModal").modal("hide");
                } else {
                    toastr.error("Something went wrong saved to Vehicle Number!");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Details", "Error");
            }
        });
    }
}
function VehicleValidationCheck() {

    if (IsNullOrEmpty($("#vehicleNo").val()) || !IsValidVehicleNumber($("#vehicleNo").val())) {
        toastr.warning("Please enter a valid VehicleNo", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#popUpVehicleType").val())) {
        toastr.warning("Please select a valid VehicleType", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#popUpOwnerName").val())) {
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
function VehicleEKycClick() {

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
function PopUpOwnerOrVendor() {
    var getAllOwnerOrVendorUrl = "/Vehicle/GetAllOwnerOrVendor";
    $.ajax({
        url: getAllOwnerOrVendorUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const ownerdropdown = document.getElementById("popUpOwnerName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Owner Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            ownerdropdown.appendChild(placeholderOption);

            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                ownerdropdown.appendChild(option);
            });

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch Owner/Vendor Data!", "Error");
        }
    });
}
function GetAllVehicleType(dropdownId, companyIdParam) {
    $.ajax({
        url: '/Vehicle/GetAllMasterVehicleType',
        type: "GET",
        data: { companyId: companyIdParam },
        dataType: "json",
        success: function (response) {
            if (response != null) {
                var data = response
                const selectVehicleType = document.getElementById(dropdownId);
                let placeholderOption = document.createElement("option");
                placeholderOption.value = "";
                placeholderOption.textContent = "Select a Vehicle Type";
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                selectVehicleType.appendChild(placeholderOption);

                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.vehicleTypeId;
                    option.textContent = item.vehicleTypeName;
                    selectVehicleType.appendChild(option);
                });
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vehicle Type!", "Error");
        }
    });
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
function DriverPopUp() {
    var url = '/VehiclePlacement/CreateDriver';
    $("#driverPopupModal .modal-body").load(url, function () {
        // Dynamically load JS dependencies for the popup
        $.getScript('/js/Views/Driver.js')
            .done(function () {
                console.log("Driver form script loaded successfully.");
            })
            .fail(function () {
                console.log("Failed to load driver form script!");
            });
        $.getScript('/js/AttachmentDetails.js')
            .done(function () {
                console.log("AttachmentDetails script loaded successfully.");
            })
            .fail(function () {
                console.log("Failed to load AttachmentDetails script!");
            });

        $('#driverSave').on('click', function (e) {
            e.preventDefault();
            if (!isDLEKycClicked) {
                toastr.warning("Please Complete DL E-KYC Before Saving!");
                return false;
            }
            if (!ValidationCheck()) {
                return false;
            }
            if (uploadedFileName) {
                SaveDriverDetails(uploadedFileName);
            } else {
                toastr.warning("Please Upload a Driver Photo", "Validation Error");
            }
        });
        $("#driverPopupModal").modal("show");
    });

    $('#driverPopupModal').on('hide.bs.modal', function (event) {
        var closepop = false;
        if ($(event.target).hasClass('modal')) {
            // Modal itself is clicked (backdrop close)
            closepop = true;
        } else if (event.keyCode === 27) {
            // ESC pressed
            closepop = true;
        } else if ($(event.relatedTarget).hasClass('close')) {
            // Close button
            closepop = true;
        } else {
            closepop = true;
        }
        if (closepop) {
            const form = $(this).find('driverForm')[0];
            if (form) {
                form.reset(); // reset all form inputs
            }
        }
    });

    $('#driverPopupModal').on('shown.bs.modal', function () {
        GetDriverType();
        GetAllCityList("ddlCity");
    });
}
function SaveDriverDetails(uploadedFileName) {
    var driverType = $("#ddlDriverType").val();
    var licenseNo = $("#numLicenseNo").val();
    var driverName = $("#txtDriverName").val();
    var dlIssueDate = $("#txtDLIssueDate").val();
    var dlIssueRto = $("#txtDLIssuingRTO").val();
    var dateOfBirth = $("#txtDateOfBirth").val();
    var driverCode = $("#txtDriverCode").val();
    var dlExpiryDate = $("#txtDLExpiryDate").val();
    var whatsappNumber = $("#numWhatsapp").val();
    var address = $("#txtAddress").val();
    var city = $("#ddlCity").val();
    var mobileNumber = $("#numMobile").val();
    var pincode = $("#numPincode").val();
    // var verifiedOn = $("#txtVerifiedOn").val();
    var uploadPhoto = uploadedFileName;
    var driverId = 0;

    var saveUrl = '/Driver/DriverSave';
    var formData = {
        DriverTypeId: driverType,
        LicenseNo: licenseNo,
        DriverName: driverName,
        LicenseIssueDate: dlIssueDate,
        LicenseIssueCityId: 1,
        DateOfBirth: dateOfBirth,
        DriverCode: driverCode,
        LicenseExpDate: dlExpiryDate,
        WhatsAppNo: whatsappNumber,
        AddressLine: address,
        CityId: city,
        MobNo: mobileNumber,
        PinCode: pincode,
        LinkId: linkId,
        DriverImagePath: uploadPhoto
    };

    $.ajax({
        url: saveUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            var driverId = response.result.result.driverId;
            Saveattachment(driverId);
            toastr.success("Driver Details Submitted Successfully!");
            $("#driverPopupModal").modal("hide");
            GetAllDriver();
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Submit Driver Details", "Error");
        }
    });
}
function GetDriverType() {
    var GetUrl = '/Driver/GetDriverType';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {

            response.forEach(category => {
                driverTypeMap[category.internalMasterId] = category.internalMasterName;
            });
            const dropdown = document.getElementById("ddlDriverType");
            dropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Driver Type";
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
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetDropdownValue(inputId) {
    const selectedValue = $("#" + inputId).val();
    const selectedText = $("#" + inputId).find("option:selected").text();
    let result;
    if (selectedValue === selectedText) {
        result = {
            id: 0,
            name: selectedValue
        };
    } else {
        result = {
            id: selectedValue,
            name: selectedText
        };
    }
    return result;
}
function SaveVehiclePlacement(action) {
    var saveUrl = '/VehiclePlacement/AddVehiclePlacement';
    var driverResult = GetDropdownValue("ddlDriverName");
    const formData = {

        LocationId: $('#ddlLocation').val(),
        PlacementNo: $('#txtPlacementNo').val(),
        PlacementDate: $('#txtPlacementDate').val(),
        IndentId: $('#ddlIndentNo').val(),
        VehicleId: $('#ddlVehicleNo').val(),
        TrackingTypeId: $('#ddlTrakingType').val(),
        DriverId: driverResult.id,
        DriverName: driverResult.name,
        MobileNo: $('#txtMobileNo').val(),
        OwnerVendorId: $('#ddlOwnerName').val() ? $('#ddlOwnerName').val() : 0,
        BrokerVendorId: $('#ddlBrokerName').val() ? $('#ddlBrokerName').val() : 0,
        TotalHireAmount: $("#txtTotalHairAmt").val() ? $("#txtTotalHairAmt").val() : 0,
        AdvancePayable: $("#txtAdvancePayable").val() ? $("#txtAdvancePayable").val() : 0,
        LinkId: GetQueryParam("LinkId")
    };
    console.log(formData);
    if (action === "save") {

        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    $("#btnSaveForm").prop('disabled', false);
                    $("#btnSaveAndNewForm").prop('disabled', false);
                    window.location.href = "../Dashboard/Dashboard";
                    addMasterUserActivityLog(0, LogType.Create, "Vehicle Placement Submitted Successfully!", 0);
                } else {
                    toastr.error("Failed to Submit Vehicle Placement Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Placement Details.", "Error");
            }
        });
    }
    else if (action === "saveNew") {
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    toastr.success("Vehicle Placement Saved Successfully!", "Success");
                    addMasterUserActivityLog(0, LogType.Create, "Vehicle Placement Submitted Successfully!", 0);
                    $("#btnSaveForm").prop('disabled', false);
                    $("#btnSaveAndNewForm").prop('disabled', false);
                    $('#vehiclePlacementForm')[0].reset();
                    $('.select2-custom').val(null).trigger('change');
                    FetchVehiclePlacement();

                    if (profileId == EnumProfile.Branch) {
                        $('#ddlLocation').val(Number(locationId)).trigger('change');
                        $('#ddlLocation').prop('disabled', true);
                    }
                    else {
                        $('#ddlLocation').val(null).trigger('change');
                        $('#ddlLocation').prop('disabled', false);
                    }

                } else {
                    toastr.error("Failed to Submit Vehicle Placement Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Placement Details.", "Error");
            }
        });
    }
}
function ButtonUpdateClick() {
    $("#btnUpdate").on('click', function (e) {
        e.preventDefault();
        var isValid = OnSubmitCheckValidation();
        if (!isValid) {
            return;
        }

        var driverResult = GetDropdownValue("ddlDriverName");
        var formData = {
            PlacementId: $("#vehiclePlacementId").val(),
            LocationId: $("#ddlLocation").val(),
            PlacementNo: $("#txtPlacementNo").val(),
            PlacementDate: $("#txtPlacementDate").val(),
            IndentId: $("#ddlIndentNo").val(),
            VehicleId: $("#ddlVehicleNo").val(),
            TrackingTypeId: $("#ddlTrakingType").val(),
            DriverId: driverResult.id,
            DriverName: driverResult.name,
            MobileNo: $("#txtMobileNo").val(),
            OwnerVendorId: $('#ddlOwnerName').val() ? $('#ddlOwnerName').val() : 0,
            BrokerVendorId: $('#ddlBrokerName').val() ? $('#ddlBrokerName').val() : 0,
            TotalHireAmount: $("#txtTotalHairAmt").val() ? $("#txtTotalHairAmt").val() : 0,
            AdvancePayable: $("#txtAdvancePayable").val() ? $("#txtAdvancePayable").val() : 0,
            LinkId: GetQueryParam("LinkId")
        };

        var linkd = GetQueryParam("LinkId");
        $.ajax({
            type: "PUT",
            url: "/VehiclePlacement/UpdateVehiclePlacement",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result.result == "success") {
                    toastr.success("Vehicle Placement Details Updated Successfully!");
                    addMasterUserActivityLog(0, LogType.Update, "Vehicle Placement Details Updated Successfully!", 0);
                    $("#formDiv").css('display', 'none');
                    FetchVehiclePlacement();
                    $('#vehiclePlacementForm')[0].reset();
                    $('#ddlLocation').val(null).trigger('change');
                    $('#ddlIndentNo').val(null).trigger('change');
                    $('#ddlVehicleNo').val(null).trigger('change');
                    $('#ddlDriverName').val(null).trigger('change');
                    $('#ddlOwnerName').val(null).trigger('change');
                    $('#ddlBrokerName').val(null).trigger('change');
                    $("#btnUpdate").hide();
                    $("#btnSaveAndNewForm").show();
                    $("#btnSaveForm").show();

                } else {
                    toastr.error("Failed to Update Vehicle Placement Details!", "Error");
                }

            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Vehicle Placement Details!", "Error");
            }
        });
    });
};
function formatDateForInput(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date)) return '';

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
}
function DeleteVehiclePlacement(placementId) {
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
            var deleteVehicleIndentUrl = `/VehiclePlacement/DeleteVehiclePlacement/${placementId}`;
            $.ajax({
                url: deleteVehicleIndentUrl,
                type: "DELETE",
                contentType: "application/json",
                dataType: "json",
                success: function (response) {
                    if (response && response.result === "success") {
                        toastr.success("Vehicle Placement has been deleted successfully.");
                        addMasterUserActivityLog(0, LogType.Delete, "Vehicle Placement has been deleted successfully.", 0);
                        $("#addReqBranchDiv").addClass('d-none');
                        $('#currentPage').val(1);
                        FetchVehiclePlacement();
                    } else {
                        toastr.error("Failed to delete Vehicle Placement.", "Error");
                    }
                },
                error: function () {
                    toastr.error("Failed to delete Vehicle Placement.", "Error");
                }
            });
        }
    });
}
function UpdateVehiclePlacement(placementId) {
    if ($("#updateButton").hasClass('d-none')) {
        $("#updateButton").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.placementId == placementId);
    var formData = data[0];
    $('#tableDiv').css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#backButton").css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#btnSaveForm").hide();
    $("#btnUpdate").show();
    $("#btnView").hide();
    $("#btnCancel").removeClass('d-none');
    $("#btnSaveAndNewForm").hide();
    $("#vehiclePlacementId").val(formData.placementId);
    $("#ddlLocation").val(formData.locationId).trigger('change');
    $("#txtPlacementNo").val(formData.placementNo);
    $("#txtPlacementDate").val(formatDateForInput(formData.placementDate));
    ////$("#ddlIndentNo").val(formData.indentId).trigger('change');
    GetAllVehicleIndent(formData.locationId, formData.indentId);
    $("#ddlVehicleNo").val(formData.vehicleId).trigger('change');
    $("#ddlTrakingType").val(formData.trackingTypeId).trigger('change');
    $("#ddlDriverName").val(formData.driverId).trigger('change');
    $("#txtMobileNo").val(formData.mobileNo);
    $("#ddlOwnerName").val(formData.ownerVendorId).trigger('change');
    $("#ddlBrokerName").val(formData.brokerVendorId).trigger('change');
    $("#txtTotalHairAmt").val(formData.totalHireAmount);
    $("#txtAdvancePayable").val(formData.advancePayable);
}
function ViewVehiclePlacement(placementId) {
    UpdateVehiclePlacement(placementId);
    $('#formDiv').find('input, select, textarea, button, a').prop('disabled', true);
    $("#updateButton").addClass('d-none');
}

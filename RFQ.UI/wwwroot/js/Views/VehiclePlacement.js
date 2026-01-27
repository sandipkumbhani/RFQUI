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
var VehicleList;
let IsEditClick = false;
var VendorCosting = [];

$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    VendorCosting = [];

    $('#ddlVehicleNo').on('change', function () {
        const selectedValue = $(this).val();
        if (!IsNullOrEmpty(VehicleList)) {
            const selectedVehicle = VehicleList.find(x => x.vehicleId == selectedValue);
            if (selectedVehicle) {
                console.log(VehicleList, "VehicleList");
                $("#drpOwnerName").val(selectedVehicle.ownerVendorId).trigger('change');
            }
        }
        else {
            $("#drpOwnerName").val(0).trigger('change');
        }

    });

    GetAllDriver();
    GetAllTrackingType();
    Defaultdrpdownset();
    GetAllVehicleNumber();
    GetAllOwnerOrVendor();
    GetAllBrokerVendor();
    ButtonUpdateClick();
    loadVendorCosting()
    FetchVehiclePlacement();
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("drpVehicleType", companyId);
    GetAllLocation("ddlIndentBranch", companyId); //Both Dropdown Id are Different 
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });

    $("#ddlLocation").on("change", async function () {
        var locationId = $(this).val();
        if (!IsNullOrEmpty(locationId)) {
            await GetAllVehicleIndent(locationId);
            var locationData = await GetLocationById(locationId)
            console.log(locationData.code);
            var code = await GetAutoGenerateCode(locationData.code, PrefixCode.VP);
            console.log(code);
        }
        if (!IsEditClick) {
            $("#txtPlacementNo").val(code);
        }
    });

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

    $("#drpOwnerName").on('change', async function () {
        if (isValidateSelect($("#drpOwnerName").val())) {
            const value = $(this).val();
            if (isValidateSelect($("#drpOwnerName").val())) {
                const costing = VendorCosting.filter(x => x.partyId == value).map(x => x.totalHireCost);
                $("#txtTotalHairAmt").val(costing.length > 0 ? costing[0] : 0);
            }
        }
    });

    $("#ddlBrokerName").on('change', async function () {
        const ownerCheck = isValidateSelect($("#drpOwnerName").val())
        if (ownerCheck) {
            const Owner = $("#drpOwnerName").val();
            if (isValidateSelect(Owner)) {
                const costing = VendorCosting.filter(x => x.partyId == Owner).map(x => x.totalHireCost);
                $("#txtTotalHairAmt").val(costing.length > 0 ? costing[0] : 0);
            }
        }
        else {
            const Broker = $("#ddlBrokerName").val();
            if (isValidateSelect(Broker)) {
                const costing = VendorCosting.filter(x => x.partyId == Broker).map(x => x.totalHireCost);
                $("#txtTotalHairAmt").val(costing.length > 0 ? costing[0] : 0);
            }
        }
    });

});

$('#ddlIndentNo').on('change', async function () {
    await AutoFetch();
    setTimeout(() => {
        GetVehiclePlacementCountByIndentNo();
    }, 100);
});

$('#btnAdd').on('click', function () {
    $('#formDiv').css("display", "block");
    $('#tableDiv').css("display", "none");

    if ($("#ddlLocation").is(":disabled"))
        $("#ddlLocation").removeAttr("disabled");

    if ($("#ddlIndentNo").is(":disabled"))
        $("#ddlIndentNo").removeAttr("disabled");
    // FetchPlacementNo();
});

$("#txtAdvancePayable").on('change', function () {
    var hireAmt = Number($("#txtTotalHairAmt").val());
    var advancePay = Number($("#txtAdvancePayable").val());
    var payable = hireAmt - advancePay;
    $("#txtBalancePayable").val(payable);
});

$("#txtAdvancePayable").on('blur', function () {
    var hireAmt = Number($("#txtTotalHairAmt").val());
    var advancePay = Number($("#txtAdvancePayable").val());
    if (advancePay > hireAmt) {
        toastr.warning("Advance Payable shall not be greater than Total Hire Amt");
        $("#txtAdvancePayable").val('');
        $("#txtBalancePayable").val('');
    }
});

$("#txtTotalHairAmt").on('change', function () {
    var hireAmt = Number($("#txtTotalHairAmt").val());
    var advancePay = Number($("#txtAdvancePayable").val());
    var payable = hireAmt - advancePay;
    $("#txtBalancePayable").val(payable);
});

$("#ddlDriverName").on('change', function () {
    const value = $(this).val();
    if (!IsNullOrEmpty(value)) {
        var filterData = driverDrpList.find(x => x.driverId == value);
        if (!IsNullOrEmpty(filterData) && filterData.length > 0) {
            $("#txtMobileNo").val(filterData.mobNo);
        }
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
    IsEditClick = false;
    $("#tableDiv").css('display', 'block');
    $("#formDiv").css('display', 'none');
    vehiclePlacementFormReset();
    $("#btnSaveForm").show();
    $("#btnUpdate").hide();
    $("#btnSaveAndNewForm").show();
    //ResetAttachmentRepeater();
    FetchDataForTable('PlacementTable', FetchVehiclePlacementUrl, orderColumn, orderDir.toUpperCase(), 'UpdateVehiclePlacement', 'DeleteVehiclePlacement', 'placementId');
}

async function GetAllVehicleIndent(selectLocationId, selectedIndentId = null) {
    var getVehicleTypeUrl = '/VehiclePlacement/GetAwardedIndentList'
    return await $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: function (response) {
            if (!IsNullOrEmpty(response) && response.length > 0) {
                VehicIndentList = response.filter(x => x.locationId == selectLocationId);
                $("#ddlIndentNo").empty();
                const Indentdropdown = document.getElementById("ddlIndentNo");
                Indentdropdown.innerHTML = "";
                let placeholderOption = document.createElement("option");
                placeholderOption.value = 0;
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
                    const exists = VehicIndentList.some(x => x.indentId === selectedIndentId);
                    if (exists)
                        $("#ddlIndentNo").val(Number(selectedIndentId)).trigger('change');
                    else
                        $("#ddlIndentNo").val(0).trigger('change');
                }
            }
            else {
                Defaultdrpdownset();
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
    if (
        !isValidateSelect($("#drpOwnerName").val()) &&
        !isValidateSelect($("#ddlBrokerName").val())
    ) {
        toastr.warning("Please Select Owner / Broker For Placement", "Validation");
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
            placeholderOption.value = 0;
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
            if (!IsNullOrEmpty(response) && response.length > 0) {
                const userid = getCookieValue("userid");
                response = response.filter(x => x.createdBy == userid);
                driverDrpList = response;
                const ddlDriverName = document.getElementById("ddlDriverName");
                ddlDriverName.innerHTML = "";
                let placeholderOption = document.createElement("option");
                placeholderOption.value = 0;
                placeholderOption.textContent = "Select Driver";
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                ddlDriverName.appendChild(placeholderOption);
                driverDrpList.forEach(option => {
                    let opt = document.createElement("option");
                    opt.value = option.driverId;
                    opt.textContent = option.driverName;
                    ddlDriverName.appendChild(opt);
                });
            } else {
                console.log("Driver DropDown Not Loded");
            }

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
            if (!IsNullOrEmpty(response) && response.length > 0) {
                console.log(response, "vehicle number DropDown");
                const userid = getCookieValue("userid");
                response = response.filter(x => x.createdBy == userid);
                var data = response
                VehicleList = response;
                $('#ddlVehicleNo').empty();
                const selectVehicleNumber = document.getElementById("ddlVehicleNo");
                selectVehicleNumber.innerHTML = "";
                let placeholderOption = document.createElement("option");
                placeholderOption.value = 0;
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
            }
            else {
                console.log("No Vehicle Number Found!", "warning");
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
            const ownerdropdown = document.getElementById("drpOwnerName");
            ownerdropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
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
            brokerdropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
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

async function AutoFetch() {
    var indentNo = $("#ddlIndentNo").val();
    if (indentNo != 0) {
        var getUrl = '/VehiclePlacement/AutoFetchPlacement/' + indentNo;
        $.ajax({
            url: getUrl,
            type: "GET",
            contentType: "application/json",
            success: await function (response) {
                console.log(response);
                if (Array.isArray(response) && response.length > 0) {
                    let data = response[0]; // Use the first object in the array
                    $("#txtRFQNo").val(data.rfqNo);
                    $("#ddlCustomerName").val(data.partyId).trigger('change');
                    $("#drpVehicleType").val(data.vehicleTypeId).trigger('change');
                    $('#from-search-box').val(data.fromLocation);
                    $("#to-search-box").val(data.toLocation);
                    $("#txtNoOfVehicles").val(data.requiredVehicles);
                    $("#ddlIndentBranch").val(data.locationId).trigger('change');
                    //$("#txtPendingVehicles").val(data.pendingVehicles);

                    if (!IsNullOrEmpty(data.indentDate)) {
                        $('#txtIndentDate').val(FormatDateToLocal(data.indentDate));
                    } else {
                        $('#txtIndentDate').val('');
                    }

                    if (!IsNullOrEmpty(data.vehicleReqOn)) {
                        $('#txtVehicleReqOn').val(FormatDateToLocal(data.vehicleReqOn));
                    } else {
                        $('#txtVehicleReqOn').val('');
                    }

                    if (!IsNullOrEmpty(data.vehicleReqOn)) {
                        $('#txtRFQDate').val(FormatDateToLocal(data.vehicleReqOn));
                    } else {
                        $('#txtRFQDate').val('');
                    }

                } else {
                    console.log("No data found for selected indent number.", "Warning");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to fetch RFQ data!", "Error");
            }
        });
    }
}
function VehiclePopUp() {
    $("#vehiclePopupModal .modal-body").load('/VehiclePlacement/CreateVehicle', function () {
        $("#vehiclePopupModal").modal("show");

        // Load scripts only for popup context
        $.when(
            $.getScript('/js/Views/Vehicle.js'),
            $.getScript('/js/common.js')
        ).done(function () {
            console.log("Popup scripts loaded successfully.");
        }).fail(function (jqxhr, settings, exception) {
            console.error("Failed to load popup scripts:", exception);
        });
        $('#vehiclePopupModal').on('hide.bs.modal', function (event) {
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
                const form = $(this).find('vehicleForm')[0];
                if (form) {
                    form.reset(); // reset all form inputs
                }
                $('script[src="/js/Views/Vehicle.js"]').remove();
                $('#tableDiv').css("display", "none");
            }
        });
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
                selectVehicleType.innerHTML = "";
                let placeholderOption = document.createElement("option");
                placeholderOption.value = 0;
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
        $.when(
            $.getScript('/js/AttachmentDetails.js'),
            $.getScript('/js/Views/Driver.js'),
        ).done(function () {
            setTimeout(() => {
                $("#formDiv").css('display', 'block');
            }, 100);
            console.log("Popup scripts loaded successfully.");
        }).fail(function (jqxhr, settings, exception) {
            console.error("Failed to load one or more popup scripts:", exception);
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
            $('#tableDiv').css("display", "none");
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

async function SaveVehiclePlacement(action) {
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
        OwnerVendorId: $('#drpOwnerName').val() ? $('#drpOwnerName').val() : 0,
        BrokerVendorId: $('#ddlBrokerName').val() ? $('#ddlBrokerName').val() : 0,
        TotalHireAmount: $("#txtTotalHairAmt").val() ? $("#txtTotalHairAmt").val() : 0,
        AdvancePayable: $("#txtAdvancePayable").val() ? $("#txtAdvancePayable").val() : 0,
        LinkId: GetQueryParam("LinkId")
    };
    var check = await CheckVehicleAndIndentUnique(formData.VehicleId, formData.IndentId);
    if (check) {
        toastr.warning("Indent are already used this Vehicle");
        return
    }
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
                    $('.select2-custom').val(0).trigger('change');
                    FetchVehiclePlacement();

                    if (profileId == EnumProfile.Branch) {
                        $('#ddlLocation').val(Number(locationId)).trigger('change');
                        $('#ddlLocation').prop('disabled', true);
                    }
                    else {
                        $('#ddlLocation').val(0).trigger('change');
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
    $("#btnUpdate").on('click', async function (e) {
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
            OwnerVendorId: $('#drpOwnerName').val() ? $('#drpOwnerName').val() : 0,
            BrokerVendorId: $('#ddlBrokerName').val() ? $('#ddlBrokerName').val() : 0,
            TotalHireAmount: $("#txtTotalHairAmt").val() ? $("#txtTotalHairAmt").val() : 0,
            AdvancePayable: $("#txtAdvancePayable").val() ? $("#txtAdvancePayable").val() : 0,
            LinkId: GetQueryParam("LinkId")
        };
        var check = await CheckVehicleAndIndentUnique(formData.VehicleId, formData.IndentId);
        if (check) {
            toastr.warning("Indent are already used this Vehicle");
            return
        }
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
                    vehiclePlacementFormReset();
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

async function UpdateVehiclePlacement(placementId) {
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
    if (!IsNullOrEmpty(formData.locationId)) {
        $("#ddlLocation").val(formData.locationId).trigger('change');
        $("#ddlLocation").prop("disabled", true);
    }
    $("#txtPlacementNo").val(formData.placementNo);
    $("#txtPlacementDate").val(formatDateForInput(formData.placementDate));
    ////$("#ddlIndentNo").val(formData.indentId).trigger('change');
    await GetAllVehicleIndent(formData.locationId, formData.indentId);
    $("#ddlIndentNo").prop('disabled', true);

    $("#ddlVehicleNo").val(formData.vehicleId).trigger('change');
    $("#ddlTrakingType").val(formData.trackingTypeId).trigger('change');

    if (formData.driverId == 0 && !IsNullOrEmpty(formData.driverName)) {
        if ($("#ddlDriverName").find("option[value='" + formData.driverName + "']").length === 0) {
            var newOption = new Option(formData.driverName, formData.driverName, true, true);
            $("#ddlDriverName").append(newOption).trigger("change");
        } else {
            $("#ddlDriverName").val(formData.driverName).trigger("change");
        }
    }
    else {
        $("#ddlDriverName").val(formData.driverId).trigger("change");
    }

    $("#txtMobileNo").val(formData.mobileNo);
    $("#drpOwnerName").val(formData.ownerVendorId).trigger('change');
    $("#ddlBrokerName").val(formData.brokerVendorId).trigger('change');
    $("#txtTotalHairAmt").val(formData.totalHireAmount);
    $("#txtAdvancePayable").val(formData.advancePayable);
    IsEditClick = true;
}
function Defaultdrpdownset() {
    const $Indentdropdown = $("#ddlIndentNo");
    $Indentdropdown.empty();
    const placeholderOption = $('<option>', {
        value: 0,
        text: "Select a Indent No",
        disabled: true,
        selected: true
    });
    $Indentdropdown.append(placeholderOption);
}
function CheckVehicleAndIndentUnique(vehicleId, indentId) {
    return $.ajax({
        url: '/VehiclePlacement/CheckVehicleAndIndentUnique',
        type: 'GET',
        data: {
            vehicleId: vehicleId,
            indentId: indentId
        },
        dataType: 'json',
        success: function (response) {
            console.log("Unique check response:", response); // true / false
        },
        error: function (xhr, status, error) {
            console.error("Error in CheckVehicleAndIndentUnique:", error);
        }
    });
}
function vehiclePlacementFormReset() {
    $('#vehiclePlacementForm')[0].reset();
    $("#ddlCustomerName").val(0).trigger('change');
    $("#drpVehicleType").val(0).trigger('change');
    $("#ddlIndentBranch").val(0).trigger('change');
    $("#ddlLocation").val(0).trigger('change');
    $("#drpOwnerName").val(0).trigger('change');
    $("#ddlTrakingType").val(0).trigger('change');
    $("#ddlVehicleNo").val(0).trigger('change');
    $("#ddlDriverName").val(0).trigger('change');
    $("#ddlBrokerName").val(0).trigger('change');
    $("#ddlIndentNo").val(0).trigger('change');
}

function GetVehiclePlacementCountByIndentNo() {
    const indentId = $("#ddlIndentNo").val();
    if (indentId != 0) {
        $.ajax({
            url: '/VehiclePlacement/GetVehiclePlacementCountByIndentNo',
            type: 'GET',
            data: {
                indentId: indentId
            },
            success: function (response) {
                if (!IsNullOrEmpty(response) && response > 0) {
                    const totalVehicles = Number($("#txtNoOfVehicles").val());
                    const placedVehicles = Number(response);
                    const panddingVehicles = totalVehicles - placedVehicles;
                    $("#txtPendingVehicles").val(panddingVehicles);
                }
                else
                    $("#txtPendingVehicles").val(0);
            },
            error: function (xhr, status, error) {
                console.error("Error: GetVehiclePlacementCountByIndentNo :", error);
            }
        });
    }
}
function GetDropdownValue(inputId) {
    let result;
    if ($("#" + inputId).val() == null) {
        return result = {
            id: 0,
            name: ""
        }
    }
    const selectedValue = $("#" + inputId).val();
    const selectedText = $("#" + inputId).find("option:selected").text();

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
function setVehiclePlacementDate() {
    const rfqDate = $("#txtRFQDate").val();
    const txtPlacementDate = $("#txtPlacementDate").val();

    if (IsNullOrEmpty(rfqDate)) {
        txtPlacementDate.min = new Date().toISOString().split('T')[0];
        return;
    }

    var date = new Date(rfqDate);
    if (isNaN(date.getTime())) {
        txtPlacementDate.min = new Date().toISOString().split('T')[0];
        return;
    }
    $("#txtPlacementDate")[0].min = FormatDateToLocal(date);
}
function loadVendorCosting() {
    $.ajax({
        type: "POST",
        url: "/ReceivedVendorCosting/GetAllReceivedVendorCosting",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.statusCode === 200) {
                VendorCosting = response.data;
                console.log(VendorCosting, "loadVendorCosting");
            } else {
                console.warn(response.message + "⚠️ ");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Somthing Went Wrong loadVendorCosting", "error");
        }
    });
}
function CheckAwardedVendor() {

    let partyId = 0;

    // Broker selected
    if (isValidateSelect($("#ddlBrokerName").val())) {
        partyId = $("#ddlBrokerName").val();
    }

    // Owner selected (priority)
    if (isValidateSelect($("#drpOwnerName").val())) {
        partyId = $("#drpOwnerName").val();
    }

    // Validation
    if (partyId == 0) {
        toastr.warning("Please select Broker or Owner");
        return;
    }

    var requestDto = {
        PartyId: parseInt(partyId)
    };

    return $.ajax({
        url: '/vehicleplacement/CheckAwardedVendor',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(requestDto),
        dataType: 'json',
        success: function (response) {
            console.log("CheckAwardedVendor success:", response);
        },
        error: function (xhr) {
            console.error("CheckAwardedVendor error:", xhr.responseText);
        }
    });
}


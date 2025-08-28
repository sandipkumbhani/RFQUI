var companyId;

$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    $('#ddlIndentNo').on('change', function () {
        AutoFetch();
    });
    $('#ddlVehicleNo').on('change', function () {
        const selectedValue = $(this).val();
        const selectedVehicle = VehicleList.find(x => x.vehicleId == selectedValue);
        if (selectedVehicle) {
            $("#ddlOwnerName").val(selectedVehicle.ownerVendorId).trigger('change');
        }
    });
    $("#btnSaveForm, #btnSaveAndNewForm").on('click', function () {
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveVehicleIndent(action);
        }
    });


    //GetAllLocation("ddlLocation",companyId); 
    GetAllDriver();
    GetAllVehicleIndent();
    GetAllVehicleNumber();
    FetchPlacementNo();
    GetAllOwnerOrVendor();
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("ddlVehicleType", companyId);
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
});
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlIndentNo").val())) {
        toastr.warning("Please Select a Indent No", "Validation Error");
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
    if (!isValidateSelect($("#ddlBrokerName").val())) {
        toastr.warning("Please Select a Broker Name", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtTotalHairAmt").val())) {
        toastr.warning("Please enter a Total Hair Amt", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtAdvancePayable").val())) {
        toastr.warning("Please enter a Advance Payable", "Validation Error");
        return false;
    }
    return true;
}
function GetAllDriver() {
    $.ajax({
        url: '/Driver/GetAllDriverList',
        type: "GET",
        dataType: "json",
        success: function (response) {
            var data = response
            const selectLocation = document.getElementById("ddlDriverName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select Driver";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.driverId;
                opt.textContent = option.driverName;
                selectLocation.appendChild(opt);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllVehicleIndent() {
    var getVehicleTypeUrl = '/RequestForQuote/GetAllVehicleIndentList'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: function (response) {
            response = response.result;
            VehicIndentList = response;
            const Indentdropdown = document.getElementById("ddlIndentNo");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Indent No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            Indentdropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.indentId;
                option.textContent = item.indentNo;
                Indentdropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
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
            debugger;
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
        success: function (response) {
            debugger;
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

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch Owner/Vendor Data!", "Error");
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
            console.log(response);

            // Check if response is a non-empty array
            if (Array.isArray(response) && response.length > 0) {
                let data = response[0]; // Use the first object in the array

                // Format indentDate
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
                $('#txtIndentBranch').val(data.locationId);
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
            debugger;
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
            console.log("Closed by clicking outside (backdrop).");
            closepop = true;
        } else if (event.keyCode === 27) {
            // ESC pressed
            console.log("Closed by pressing ESC.");
            closepop = true;
        } else if ($(event.relatedTarget).hasClass('close')) {
            // Close button
            console.log("Closed by close button.");
            closepop = true;
        } else {
            console.log("Closed by other way (maybe programmatically).");
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
    console.log(driverId);
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
            debugger;
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
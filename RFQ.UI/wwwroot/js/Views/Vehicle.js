const urlParams = new URLSearchParams(window.location.search);
const linkId = urlParams.get('LinkId');

$(document).ready(function () {

    $(document).on("click", "#btnView", function () {
        FetchVehicleList();
        $("#addVehicleDiv").hide();
        $("#tableDiv").show();
        $("#backButton").show();
    });

    $("#btnSaveVehicle, #btnSaveNewVehicle").on('click', function () {
        var action = $(this).data('action');
        SaveAndSaveNew(action);
    });

    $('#backButton').click(function () {
        window.location.reload(true);
      
    });

    $("#cancleButton").on('click', function () {
        FetchVehicleList();
        $("#addVehicleDiv").hide();
        $("#tableDiv").show();
        $("#backButton").show();
    });

    GetAllOwnerOrVendor();
    GetAllVehicleCategory();
    GetAllVehicleTypeList();
    InitializeFields();
    VehicleEKycclick();
    UpdateVehicle();
});

function SaveAndSaveNew(action) {

    var isValid = ValidationCheck();
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
    var redgOwner = $("#regdOwnerInput").val();
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
    var vehicleCapacity = $("#vehicleCapacityInput").val();
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
        RegdOwner: redgOwner,
        EngineNo: engineNo,
        ChassisNo: chasisNo,
        MakeModel: makeModel,
        PUCExpiryDate: pucExpDate,
        Financer: financer,
        OwnerSerialNo: ownerSerialNo,
        NPNo: npNo,
        InsuranceCo: insuranceNo,
        VerifiedOn: verifiedOn,

        RTORegistration: rtoRegistration,
        RegistrationDate: registrationDate,
        PermanentAddress: permanentAddress,
        GrossWeight: grossWeight,
        UnladenWeight: unladenWeight,
        FitnessExpiryDate: fitnessExpDate,
        TaxExpiryDate: taxExpDate,
        PermitNo: permitNo,
        PermitExpiryDate: permitExpDate,
        NPExpiryDate: npExpDate,
        PolicyNo: policyNo,
        PolicyExpiryDate: policyExpDate
    };
    console.log(formData);
    if (action === "save") {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    window.location.href = "../Dashboard/Dashboard";
                    toastr.success("Vehicle details submitted successfully!");
                } else {
                    toastr.error("Something went wrong!");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to submit vehicle details", "Error");
            }
        });
    } else {
        $.ajax({
            url: saveUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    toastr.success("Vehicle details submitted successfully!");
                } else {
                    toastr.error("Something went wrong!");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to submit vehicle details", "Error");
            }
        });
    }
}

function EditVehicle(vehicleId) {
    var data = vehicleResponse.filter(x => x.vehicleId === vehicleId);
    var formData = data[0];
    console.log(formData);

    $('#tableDiv').hide();
    $("#backButton").css('display', 'none');
    $("#addVehicleDiv").css('display', 'Block');
    $("#btnSaveVehicle").hide();
    $("#btnUpdateVehicle").show();
    $("#cancleButton").removeClass('d-none');
    $("#btnSaveNewVehicle").hide();
    $("#btnView").hide();

    $("#vehicleNo").val(formData.vehicleNo).prop("disabled", true);
    $("#hdVehicleId").val(formData.vehicleId);
    $('#ddlVehicleCategory').selectpicker('val', formData.vehicleCategoryId);
    $('#ddlVehicleCategory').selectpicker('refresh');
    $('#ddlVehicleType').selectpicker('val', formData.vehicleTypeId);
    $('#ddlVehicleType').selectpicker('refresh');
    $("#vehicleCapacity").val(formData.vehicleCapacity);
    $('#ddlOwnerName').selectpicker('val', formData.ownerVendorId);
    $('#ddlOwnerName').selectpicker('refresh');
    //$('#ddlTrackingProvider').selectpicker('val', formData.trackingProviderId);
    //$('#ddlTrackingProvider').selectpicker('refresh');
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
        var isvalid = ValidationCheck();
        if (!isvalid) {
            return;
        }

        var formData = {
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
            PUCExpiryDate: $("#pucExpiryInput").val(),
            Financer: $("#financerInput").val(),
            OwnerSerialNo: $("#ownerSerialNoInput").val(),
            NPNo: $("#npNoInput").val(),
            InsuranceCo: $("#insuranceCoInput").val(),
            VerifiedOn: $("#verifiedOnInput").val(),
            RTORegistration: $("#rtoRegistrationInput").val(),
            RegistrationDate: $("#registrationDateInput").val(),
            PermanentAddress: $("#permanentAddressInput").val(),
            GrossWeight: $("#grossWeightInput").val(),
            UnladenWeight: $("#unladenWeightInput").val(),
            FitnessExpiryDate: $("#fitnessExpiryInput").val(),
            TaxExpiryDate: $("#taxExpiryInput").val(),
            PermitNo: $("#permitNoInput").val(),
            PermitExpiryDate: $("#permitExpiryInput").val(),
            NPExpiryDate: $("#npExpiryInput").val(),
            PolicyNo: $("#policyNoInput").val(),
            PolicyExpiryDate: $("#policyExpiryInput").val()
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
                    toastr.success("Vehicle Updated successfully!", "Success");
                    $("#addVehicleDiv").css('display', 'none');
                    FetchVehicleList();
                    $("#backButton").css('display', 'block');
                } else {
                    toastr.error("Failed to Update Vehicle", "Error");
                }
            },
            error: function (xhr, status, error) {
                $("#dataDiv").html("Error: " + status + " " + error + " " + xhr.status + " " + xhr.statusText + " " + xhr.responseText);
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
                toastr.success("Vehicle Detail Deleted successfully!");
                FetchVehicleList();
                console.log("Deleted successfully...");
            } else {
                toastr.error("Unexpected response received.", "Error");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error:", xhr.status, xhr.statusText, xhr.responseText);
            toastr.error("Failed to delete vehicle detail!", "Error");
        }
    });
}

function FetchVehicleList() {
    $("#tableDiv").show();
    var fetchVehicleUrl = '/Vehicle/ViewVehicle';
    $.ajax({
        url: fetchVehicleUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let trlist = response;
            vehicleResponse = response;

            if ($.fn.DataTable.isDataTable('#tableVehicle')) {
                $('#tableVehicle').DataTable().clear().destroy();
            }

            $('#tableVehicle').DataTable({
                processing: true,
                serverSide: false,
                paging: true,
                pageLength: 10,
                lengthChange: true,
                searching: true,
                info: true,
                autoWidth: false,
                responsive: true,
                scrollX: true,
                ordering: false,
                data: trlist,
                columns: [
                    { data: "vehicleNo" },
                    { data: "vehicleStatus" },
                    { data: "engineNo" },
                    { data: "chassisNo" },
                    { data: "vehicleCapacity" },
                    { data: "rtoRegistration" },
                    {
                        data: "vehicleId",
                        render: function (data, type, row) {
                            return `<div class="btn-group" role="group">
                            <button type="button" class="btn btn-sm btn-primary" onclick="EditVehicle(${data})">
                                <i class="ti ti-edit"></i> Edit
                            </button>
                            <button type="button" class="btn btn-sm btn-danger" onclick="DeleteVehicle(${data})">
                                <i class="ti ti-trash"></i> Delete
                            </button>
                        </div>`;
                        }
                    }
                ],
                columnDefs: [
                    { targets: "_all", className: "text-center" }
                ]
            });
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
            toastr.error("Failed to fetch data!", "Error");
        }
    });

}
function isValidVehicleNumber(vehicleNumber) {
    var pattern = /^([A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4})$/;
    return pattern.test(vehicleNumber);
}

function VehicleEKycclick() {
    $("#btnVehicleKyc").on("click", function () {
        var getUrl = '/Vehicle/GetVehicleKycDetails';
        var vehicleNo = $("#vehicleNo").val();

        if (!isValidVehicleNumber(vehicleNo)) {
            toastr.warning("Please enter a valid Vehicle No", "Validation Error");
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
                //var Data = response;
                var rcModel = response.vehicleRCModel;
                console.log(response);

                $("#vehicleNo").val(rcModel.vehicleNo);
                //$("#ownerName").val(rcModel.ownerName);
                //$("#vehicleCategory").val(rcModel.vehicleCategory);
                $("#vehicleStatusInput").val(rcModel.vehicleRCStatus);
                $("#blacklistStatusInput").val(rcModel.nonUseStatus);
                $("#regdOwnerInput").val(rcModel.ownerName);
                $("#engineNoInput").val(rcModel.vehicleEngineNumber);
                $("#chasisNoInput").val(rcModel.vehicleChassisNumber);
                $("#makeModelInput").val(rcModel.vehicleMakerModel);
                $("#pucExpiryInput").val(new Date(rcModel.pucExpiryDate).toISOString().split('T')[0]);
                $("#financerInput").val(rcModel.financier);
                $("#ownerSerialNoInput").val(rcModel.ownerSerialNo);
                $("#npNoInput").val(rcModel.nationalPermitNumber);
                $("#insuranceCoInput").val(rcModel.insuranceCompany);
                $("#verifiedOnInput").val(new Date(rcModel.issueDate).toISOString().split('T')[0]);
                $("#rtoRegistrationInput").val(rcModel.registeredAt);
                $("#registrationDateInput").val(new Date(rcModel.issueDate).toISOString().split('T')[0]);
                $("#permanentAddressInput").val(rcModel.permanentAddress);
                $("#grossWeightInput").val(rcModel.vehicleGrossWeight);
                $("#unladenWeightInput").val(rcModel.vehicleUnladenWeight);
                $("#fitnessExpiryInput").val(new Date(rcModel.expiryDate).toISOString().split('T')[0]);
                $("#taxExpiryInput").val(new Date(rcModel.taxEndDate).toISOString().split('T')[0]);
                $("#permitNoInput").val(rcModel.permitNumber);
                $("#permitExpiryInput").val(new Date(rcModel.permitExpiryDate).toISOString().split('T')[0]);
                $("#npExpiryInput").val(new Date(rcModel.nationalPermitExpiryDate).toISOString().split('T')[0]);
                $("#vehicleCapacityInput").val(rcModel.vehicleUnladenWeight);
                $("#policyNoInput").val(rcModel.pucNumber);
                $("#policyExpiryInput").val(new Date(rcModel.pucExpiryDate).toISOString().split('T')[0]);
            },
            error: function (xhr, status, error) {
                console.error("Error:", error);
                toastr.error("Failed to submit Vehicle Type", "Error");
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
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to submit Vehicle Type", "Error");
        }
    });
}
function GetAllVehicleTypeList() {
    var getVehicleTypeUrl = '/Vehicle/GetAllMasterVehicleType'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const vehicleTypedropdown = document.getElementById("ddlVehicleType");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a VehicleType";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vehicleTypedropdown.appendChild(placeholderOption);


            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.vehicleTypeId;
                option.textContent = item.vehicleTypeName;
                vehicleTypedropdown.appendChild(option);
            });

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            console.error("Error:", error);
            toastr.error("Failed to fetch data!", "Error");
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

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
            toastr.error("Failed to fetch owner/vendor data!", "Error");
        }
    });
}

function InitializeFields() {

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

function ValidationCheck() {

    //if (IsNullOrEmpty($("#rtoRegistrationInput").val())) {
    //    toastr.warning("Please complete Vehicle E-KYC before saving!");
    //    return false;
    //}

    if (IsNullOrEmpty($("#vehicleNo").val()) || !isValidVehicleNumber($("#vehicleNo").val())) {
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


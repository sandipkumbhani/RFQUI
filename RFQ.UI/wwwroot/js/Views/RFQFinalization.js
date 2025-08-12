var companyId;
var selectedVendor = [];
$("#ddlRfqStatus").on('change', function () {
    if ($(this).val() != null) {
        if ($("#txtRfqNo").val() == null || $("#txtRfqNo").val() == "") {
            toastr.warning("Please Enter Rfq No!", "Warning");
            $("#ddlRfqStatus").val(null).trigger('change');
            return;
        };
        if ($(this).find('option:selected').text() === "NOT AWARDED") {
            $(".ddlRfqReason").removeClass('d-none');
            $("#awardedDiv").addClass('d-none');
            $("#billingDiv").addClass('d-none');
            $("#remarksDiv").removeClass('col-lg-9');
            $("#remarksDiv").addClass('col-lg-6');

        } else {
            $(".ddlRfqReason").addClass('d-none');
            $("#remarksDiv").removeClass('col-lg-6');
            $("#remarksDiv").addClass('col-lg-9');
            $("#awardedDiv").removeClass('d-none');
            $("#billingDiv").removeClass('d-none');
            FetchAwarderVendorDetails();
        }
    }
    else {
        $("#billingDiv").addClass('d-none');
        $("#awardedDiv").addClass('d-none');
        $(".ddlRfqReason").addClass('d-none');
    }
});
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    $("#btnSave, #btnSaveAndNew").on('click', function () {

        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
    });
    GetRfqStatus();
    GetRfqFailureReason();
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("ddlVehicleType", companyId);
    $("#btnGetRfqData").on('click', function () {
        if (IsNullOrEmpty($("#txtRfqNumber").val())) {
            toastr.warning("Please Enter Rfq No", "Warning");
            ClearDisabledFields();
            return;
        }
        $("#ddlRfqStatus").val(null).trigger('change');
        GetRfqDetailsByRfqNo();
    })
    $("#txtBillingRate").on('change', function () {
        if ($(this).val() != null) {
            FetchAwarderVendorDetails();
        }
        return;
    });
});

function OnSubmitCheckValidation() {
    if (IsNullOrEmpty($("#txtRfqNumber").val())) {
        toastr.warning("Please enter a RFQ No", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlRfqStatus").val())) {
        toastr.warning("Please Select a RFQ Status", "Validation Error");
        return false;
    }
    if (IsNullOrEmpty($("#txtRemarks").val())) {
        toastr.warning("Please enter a Remarks", "Validation Error");
        return false;
    }
    if ($("#ddlRfqStatus").find('option:selected').text() === "AWARDED") {
        if (IsNullOrEmpty($("#txtBillingRate").val())) {
            toastr.warning("Please enter a Billing Rate", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#txtPerDay").val())) {
            toastr.warning("Please enter a Detention Per Day", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#txtFreeDays").val())) {
            toastr.warning("Please enter a Detention Free Days", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#txtAmount").val())) {
            toastr.warning("Please enter a Margin Amount", "Validation Error");
            return false;
        }
    }
    if ($("#ddlRfqStatus").find('option:selected').text() === "NOT AWARDED") {
        if (!isValidateSelect($("#ddlRfqReason").val())) {
            toastr.warning("Please Select a Failure Reason", "Validation Error");
            return false;
        }
    }
    return true;
}
function GetRfqStatus() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == EnumInternalMasterType.RFQ_STATUS);
            const select = document.getElementById("ddlRfqStatus");
            select.innerHTML = "";

            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a RFQ Status";
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
function GetRfqDetailsByRfqNo() {
    var rfqNumber = $("#txtRfqNumber").val();
    var getUrl = '/RequestForQuote/GetRfqByRfqNo/' + rfqNumber;
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            if (response == null) {
                toastr.warning("Enter Correct RFQ No.", "Warning");
                return;
            }
            $("#txtRFQFinalizationId").val(response.rfqId);
            $("#ddlCustomerName").val(response.partyId).trigger('change');
            $("#txtRfqNo").val(response.rfqNo)
            $("#txtRfqDate").val(response.rfqDate)
            $("#txtRfqExpiredOn").val(response.expiryDate)
            if (response.vehicleReqOn) {
                var date = new Date(response.vehicleReqOn);
                if (!isNaN(date)) {
                    $("#txtVehicleReqDate").val(date.toISOString().split('T')[0]);
                } else {
                    $("#txtVehicleReqDate").val('');
                    toastr.warning("Invalid Vehicle Required Date format.", "Warning");
                }
            } else {
                $("#txtVehicleReqDate").val('');
            }

            $('#from-search-box').val(response.fromLocation);
            $('#to-search-box').val(response.toLocation);
            $("#ddlVehicleType").val(response.vehicleTypeId).trigger('change');
            $("#txtNoofVehicles").val(response.vehicleCount)
            $("#txtSpecial").val(response.specialInstruction)
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Rfq Data!", "Error");
        }
    });
}
function GetRfqFailureReason() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == EnumInternalMasterType.FAILURE_REASONS);
            const select = document.getElementById("ddlRfqReason");
            select.innerHTML = "";

            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Failure Reason";
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
            toastr.error("Failed to Fetch Failure Reason!", "Error");
        }
    });
}
function SaveAndSaveNew(action) {
    var saveUrl = '/RFQFinalization/AddRfqFinal';
    const rfqFinalformData = {
        RfqId: $("#txtRFQFinalizationId").val(),
        RfqStatusId: $('#ddlRfqStatus').val(),
        ReasonId: $('#ddlRfqReason').val() || 0,
        Remarks: $('#txtRemarks').val(),
        BillingRate: $('#txtBillingRate').val() || 0,
        DetentionPerDay: $('#txtPerDay').val() || 0,
        DetentionFreeDays: $('#txtFreeDays').val() || 0,
        MarginAmount: $('#txtAmount').val() || 0,
        LinkId: GetQueryParam("LinkId")
    };
    let selectedVendorList = GetSelectedVendor();
    const rfqFinalRateFormData = selectedVendorList.map(vendor => ({
        VendorId: vendor.VendorId,
        RfqId: vendor.RfqId,
        IsAssigned: vendor.IsAssigned,
        AvailVehicleCount: vendor.AvailVehicleCount,
        AssignedVehicles: vendor.AssignedVehicles
    }));
    if ($("#ddlRfqStatus").find('option:selected').text() === "NOT AWARDED") {
        var formData = {
            RfqFinalDto: rfqFinalformData,
            RfqFinalRateDtos: []
        }
    }
    else {
        var formData = {
            RfqFinalDto: rfqFinalformData,
            RfqFinalRateDtos: rfqFinalRateFormData
        }
    }

    if (action === "save") {

        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    toastr.success("RFQ Finalization Submitted Successfully!", "Success");
                } else {
                    toastr.error("Failed to Submit RFQ Finalization.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit RFQ Finalization.", "Error");
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
                    toastr.success("Vehicle Indent Saved Successfully!", "Success");
                    $('#RFQForm')[0].reset();
                    $('#ddlCustomerName').val(null).trigger('change');
                    $('#ddlVehicleType').val(null).trigger('change');
                    $('#ddlRfqStatus').val(null).trigger('change');
                } else {
                    toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Vehicle Indent Details.", "Error");
            }
        });
    }
}
function FetchAwarderVendorDetails() {
    var rfqId = $("#txtRFQFinalizationId").val();
    var getAwardedVendorUrl = '/RFQFinalization/AwardedVendor/' + rfqId;
    $.ajax({
        url: getAwardedVendorUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const tbody = $("#awardedVendorTable tbody");
            tbody.empty();
            if (!response || response.length === 0) {
                $("#awardedVendorTable tbody").append('<tr><td colspan="16" class="text-center">No records found</td></tr>');
                return;
            }
            $.each(response, function (index, vendor) {
                let difference=0;
                const billingRate = parseFloat($("#txtBillingRate").val()) || 0;
                const hireCost = parseFloat(vendor.totalHireCost) || 0;
                if (billingRate == 0) {
                    difference = "Not Available";
                } else {
                    difference = billingRate - hireCost;
                }
                const rowHtml = `
                        <tr data-index="${index}">
                        <td>${index + 1}</td>
                        <td>${vendor.vendorName}</td>
                        <td>${vendor.panNo}</td>
                        <td>${vendor.vendorRating}</td>
                        <td>${vendor.mobNo}</td>
                        <td>${vendor.whatsAppNo}</td>
                        <td>${vendor.email}</td>
                        <td>${vendor.availVehicleCount}/${vendor.vehicleCount}</td>
                        <td><input type="text" id="txtassignedVehicle" class="form-control" maxlength="10" onkeypress="return isNumber(event)"></td>
                        <td>${vendor.totalHireCost}</td>
                        <td>${vendor.detentionPerDay}</td>
                        <td>${vendor.detentionFreeDays}</td>
                        <td>${difference}</td>
                        <td>${vendor.vendorPosition}</td>
                        <td style="text-align: center; vertical-align: middle;">
                            <label class="check-box-custom" style="display: inline-block;">
                                <input class="form-check-input" type="checkbox" data-vehiclecount="${vendor.vehicleCount}" data-availvehicle="${vendor.availVehicleCount}" data-vendorid="${vendor.vendorId}">
                                    <span class="checkmark"></span>
                            </label>    
                        </td>
                        </tr>`;
                tbody.append(rowHtml);
            })
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Awarded Vendor Details!", "Error");
        }
    });
}
$(document).on("input", "#awardedVendorTable tbody #txtassignedVehicle", function () {
    let row = $(this).closest("tr");
    let availVehicle = parseInt(row.find('input[type="checkbox"]').data("availvehicle")) || 0;
    let vehicleCount = parseInt(row.find('input[type="checkbox"]').data("vehiclecount")) || 0;
    let enteredValue = parseInt($(this).val()) || 0;

    if (enteredValue > availVehicle || enteredValue > vehicleCount) {
        toastr.warning(`Assigned vehicles cannot exceed available vehicles and  total vehicles.`);
        $(this).val('');
    }
    ValidateTotalForVendor(vehicleCount);
});

$(document).on("change", "#awardedVendorTable tbody input[type='checkbox']", function () {
    let row = $(this).closest("tr");
    let vehicleCount = parseInt($(this).data("vehiclecount")) || 0;
    ValidateTotalForVendor(vehicleCount);
});
function ValidateTotalForVendor(vehicleCount) {
    let totalAssigned = 0;

    $("#awardedVendorTable tbody tr").each(function () {
        let checkbox = $(this).find('input[type="checkbox"]');
        if (checkbox.is(":checked")) {
            let val = parseInt($(this).find("#txtassignedVehicle").val()) || 0;
            totalAssigned += val;
        }
    });

    if (totalAssigned > vehicleCount) {
        toastr.warning(`Total assigned vehicles cannot exceed total vehicles (${vehicleCount}).`);
        $("#txtassignedVehicle").val('');
        return false;
    }
    return true;
}

function GetSelectedVendor() {
    selectedVendor = [];
    $("#awardedVendorTable tbody tr").each(function () {
        var checkbox = $(this).find('input[type="checkbox"]');
        var vendorId = checkbox.data('vendorid');
        var availVehicleCount = checkbox.data('availvehicle');
        var assignedVehicle = $("#txtassignedVehicle").val();
        if (checkbox.is(':checked')) {
            selectedVendor.push({
                VendorId: vendorId,
                RfqId: $("#txtRFQFinalizationId").val(),
                AvailVehicleCount: availVehicleCount,
                AssignedVehicles: assignedVehicle,
                IsAssigned: true,
            });
        }
        else {
            selectedVendor.push({
                VendorId: vendorId,
                RfqId: $("#txtRFQFinalizationId").val(),
                AvailVehicleCount: availVehicleCount,
                AssignedVehicles:0,
                IsAssigned: false,
            });
        }
    });
    return selectedVendor;
}
function ClearDisabledFields() {
    // Clear disabled text, date, datetime-local inputs
    $('input:disabled').val('');
    $('input[type="hidden"]').val('');
    // Clear disabled select2 dropdowns
    $('select.select2-custom:disabled').each(function () {
        $(this).val(null).trigger('change');
    });
}

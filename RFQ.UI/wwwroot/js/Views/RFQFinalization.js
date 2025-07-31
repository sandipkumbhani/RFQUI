var companyId;
$("#ddlRfqStatus").on('change', function () {
    if ($(this).find('option:selected').text() === "NOT AWARDED") {
        $(".ddlRfqReason").removeClass('d-none');
        $("#awardedDiv").addClass('d-none');
    } else {
        $(".ddlRfqReason").addClass('d-none');
        $("#awardedDiv").removeClass('d-none');
    }
});
$(document).ready(function () {
    companyId = getCookieValue('companyid');
    $("#btnSave, #btnSaveAndNew").on('click', function () {

        var action = $(this).data('action'); // "save" or "saveNew"
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
    });
    GetRfqStatus();
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("ddlVehicleType", companyId);
    $("#btnGetRfqData").on('click', function () {
        GetRfqDetailsByRfqNo();
    })
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
    //if (!isValidateSelect($("#ddlRfqReason").val())) {
    //    toastr.warning("Please Select a Failure Reason", "Validation Error");
    //    return false;
    //}
    if (IsNullOrEmpty($("#txtRemarks").val())) {
        toastr.warning("Please enter a Remarks", "Validation Error");
        return false;
    }
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
    return true;
}
function GetRfqStatus() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == 11);
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
            debugger;
            if (response == null) {
                toastr.warning("Enter Correct RFQ No.", "Warning");
                return;
            }
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

function SaveAndSaveNew(action) {
    var saveUrl = '/RFQFinalization/AddRfqFinal';
    const formData = {
        RfqId: $('#txtRfqNumber').val(),
        RfqStatusId: $('#ddlRfqStatus').val(),
        Remarks: $('#txtRemarks').val(),
        BillingRate: $('#txtBillingRate').val(),
        DetentionPerDay: $('#txtPerDay').val(),
        DetentionFreeDays: $('#txtFreeDays').val(),
        MarginAmount: $('#txtAmount').val(),
        LinkId: GetQueryParam("LinkId")
    };

    if (action === "save") {

        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    window.location.href = "../Dashboard/Dashboard";
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
                    //FetchIndentNo();
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

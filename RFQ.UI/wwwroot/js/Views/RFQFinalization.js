var companyId;
var fetchUrl = '/RFQFinalization/GetAllRfqFinalization';
var selectedVendor = [];
var orderColumn = '';
var orderDir = '';
$("#ddlRfqStatus").on('change', function () {
    if ($(this).val() != null) {
        if ($("#txtRfqNo").val() == null || $("#txtRfqNo").val() == "") {
            toastr.warning("Please Enter Rfq No!", "Warning");
            ClearDisabledFields();
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
    $("#txtRfqNumber").prop('disabled', false);
    $('#tableDivLink').on('click', function (e) {
        e.preventDefault();
        $("#tableDiv").show();
        $("#formDiv").hide();
        FetchRfqFinalizationList();
    });
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir);

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('rfqFinalizationTable', fetchUrl, orderColumn, orderDir.toUpperCase());
    });
    $("#btnSave, #btnSaveAndNew").on('click', function () {

        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
    });
    $("#btnAddRfqFinalization").on('click', function () {
        $("#tableDiv").css('display', 'none ');
        $("#formDiv").css('display', 'block');
    })
    $("#btnCancel").on('click', function () {
        FetchRfqFinalizationList();
    });
    GetRfqStatus();
    GetRfqFailureReason();
    FetchRfqFinalizationList();
    UpdateRfqFinalization();
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
            FetchAwarderVendorDetails(function () {
                FetchRfqAwardedVendorList();
            });
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
        //if (IsNullOrEmpty($("#txtAmount").val())) {
        //    toastr.warning("Please enter a Margin Amount", "Validation Error");
        //    return false;
        //}
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
function GetRfqDetailsByRfqNo(callback) {
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
            $("#txtRfqId").val(response.rfqId);
            $("#ddlCustomerName").val(response.partyId).trigger('change');
            $("#txtRfqNo").val(response.rfqNo)
            $("#txtRfqDate").val(response.rfqDate.split('T')[0])
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
            if (callback && typeof callback === 'function') {
                callback();
            }
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
        RfqId: $("#txtRfqId").val(),
        RfqStatusId: $('#ddlRfqStatus').val(),
        ReasonId: $('#ddlRfqReason').val() || 0,
        Remarks: $('#txtRemarks').val(),
        BillingRate: $('#txtBillingRate').val() || 0,
        DetentionPerDay: $('#txtPerDay').val() || 0,
        DetentionFreeDays: $('#txtFreeDays').val() || 0,
        MarginAmount: 12314,
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
function FetchRfqFinalizationList() {
    $("#tableDiv").show();
    $("#formDiv").hide();
    $("#btnUpdateRfqFinalization").hide();
    $("#btnSave").show();
    $("#btnSaveAndNew").show();
    $('.select2-custom').val(null).trigger('change');
    $("#txtRfqNumber").prop('disabled', false);
    ClearDisabledFields();
    FetchDataForTable('rfqFinalizationTable', fetchUrl, orderColumn, orderDir.toUpperCase());
}
$('#rfqFinalizationTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchRfqFinalizationList();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchRfqFinalizationList();
});
function EditRfqFinalizatioin(rfqFinalIdId) {
    var data = viewModelDto.filter(x => x.rfqFinalIdId == rfqFinalIdId);
    var formData = data[0];
    console.log(formData);
    $('#tableDiv').css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#btnUpdateRfqFinalization").show();
    $("#btnSave").hide();
    $("#btnSaveAndNew").hide();
    $("#txtRfqNumber").val(formData.rfqNo);
    $("#txtRfqNumber").prop('disabled', true);
    $("#txtRfqId").val(formData.rfqId);
    $("#hdnRFQFinalizationId").val(formData.rfqFinalIdId);
    $("#txtRemarks").val(formData.remarks);
    GetRfqDetailsByRfqNo(function () {
        $("#ddlRfqStatus").val(formData.rfqStatusId).trigger('change');
        if (formData.reasonId) {
            $("#ddlRfqReason").val(formData.reasonId).trigger('change');
        }
        else {
            $("#txtBillingRate").val(formData.billingRate);
            $("#txtPerDay").val(formData.detentionPerDay);
            $("#txtFreeDays").val(formData.detentionFreeDays);
            FetchAwarderVendorDetails(function () {
                FetchRfqAwardedVendorList();
            })
        }
    });
}
function UpdateRfqFinalization() {
    $("#btnUpdateRfqFinalization").on('click', function () {
        if (!OnSubmitCheckValidation()) {
            return;
        }
        const rfqFinalUpadateFormData = {
            RfqFinalIdId: $("#hdnRFQFinalizationId").val(),
            RfqId: $("#txtRfqId").val(),
            RfqStatusId: $('#ddlRfqStatus').val(),
            ReasonId: $('#ddlRfqReason').val() || 0,
            Remarks: $('#txtRemarks').val(),
            BillingRate: $('#txtBillingRate').val() || 0,
            DetentionPerDay: $('#txtPerDay').val() || 0,
            DetentionFreeDays: $('#txtFreeDays').val() || 0,
            MarginAmount: 12314,
            LinkId: GetQueryParam("LinkId")
        };
        let selecteUpdatedVendorList = GetSelectedVendor();
        const rfqFinalRateUpdateFormData = selecteUpdatedVendorList.map(vendor => ({
            VendorId: vendor.VendorId,
            RfqId: vendor.RfqId,
            RfqFinalId: $("#hdnRFQFinalizationId").val(),
            RfqFinalRateId: vendor.FinalRateId,
            IsAssigned: vendor.IsAssigned,
            AvailVehicleCount: vendor.AvailVehicleCount,
            AssignedVehicles: vendor.AssignedVehicles
        }));
        if ($("#ddlRfqStatus").find('option:selected').text() === "NOT AWARDED") {
            var formData = {
                RfqFinalDto: rfqFinalUpadateFormData,
                RfqFinalRateDtos: []
            }
        }
        else {
            var formData = {
                RfqFinalDto: rfqFinalUpadateFormData,
                RfqFinalRateDtos: rfqFinalRateUpdateFormData
            }
        }
        var updateRfqFinalization = '/RFQFinalization/UpdateRfqFinal';
        $.ajax({
            type: "PUT",
            url: updateRfqFinalization,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (result) {
                    toastr.success("Rfq Finalization Updated Successfully!", "Success");
                    FetchRfqFinalizationList();
                } else {
                    toastr.error("Failed to Update Rfq Finalization Details!", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Rfq Finalization Details!", "Error");
            }
        });
    })
}
function DeleteRfqFinalizatioin(rfqFinalIdId) {
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
            var deleteRfqFinalUrl = '/RFQFinalization/DeleteRfqFinal/' + rfqFinalIdId;
            $.ajax({
                url: deleteRfqFinalUrl,
                type: "DELETE",
                dataType: "json",
                success: function (response) {
                    if (response) {
                        toastr.success("Rfq Finalization Details Deleted Successfully!");
                        $('#currentPage').val(1);
                        FetchRfqFinalizationList();
                    }
                    else {
                        toastr.error("Failed to Delete Rfq Finalization Details!", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Delete Rfq Finalization Details!", "Error");
                }
            });
        }
    });
}
function FetchRfqAwardedVendorList() {
    //var rfqId = $("#txtRfqId").val();
    var rfqFinalId = $("#hdnRFQFinalizationId").val();
    var url = '/RFQFinalization/GetRfqFinalRateList';
    $.ajax({
        url: url,
        type: "GET",
        data: { rfqFinalId: rfqFinalId },
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            $("#awardedVendorTable tbody tr").each(function () {
                var checkbox = $(this).find('input[type="checkbox"]');
                var vendorId = checkbox.data('vendorid');

                const vendorData = response.find(v => v.vendorId === vendorId);
                if (vendorData) {
                    $(this).find("#txtassignedVehicle").val(vendorData.assignedVehicles || "");
                    checkbox.attr("data-finalrateid", vendorData.rfqFinalRateId);
                    if (vendorData.isAssigned) {
                        $(this).find("input[type='checkbox']").prop("checked", true);
                    } else {
                        $(this).find("input[type='checkbox']").prop("checked", false);
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Awarded Vendor List!", "Error");
        }
    })
}
function FetchAwarderVendorDetails(callback) {
    var rfqId = $("#txtRfqId").val();
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
            console.log(response);
            $.each(response, function (index, vendor) {
                let difference = 0;
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
                                <input class="form-check-input" type="checkbox" data-finalrateid="" data-vehiclecount="${vendor.vehicleCount}" data-availvehicle="${vendor.availVehicleCount}" data-vendorid="${vendor.vendorId}">
                                    <span class="checkmark"></span>
                            </label>    
                        </td>
                        </tr>`;
                tbody.append(rowHtml);
            });
            if (callback && typeof callback === 'function') {
                callback();
            };
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
        var finalRateId = checkbox.data('finalrateid');
        var assignedVehicle = $("#txtassignedVehicle").val();
        if (checkbox.is(':checked')) {
            selectedVendor.push({
                VendorId: vendorId,
                FinalRateId: finalRateId || 0,
                RfqId: $("#txtRfqId").val(),
                AvailVehicleCount: availVehicleCount,
                AssignedVehicles: assignedVehicle,
                IsAssigned: true,
            });
        }
        else {
            selectedVendor.push({
                VendorId: vendorId,
                FinalRateId: finalRateId || 0,
                RfqId: $("#txtRfqId").val(),
                AvailVehicleCount: availVehicleCount,
                AssignedVehicles: 0,
                IsAssigned: false,
            });
        }
    });
    return selectedVendor;
}
function ClearDisabledFields() {
    // Clear disabled text, date, datetime-local inputs
    $('input:disabled').val('');
    $("#txtRfqNumber").val('');
    $('input[type="hidden"]').val('');
    // Clear disabled select2 dropdowns
    $('select.select2-custom:disabled').each(function () {
        $(this).val(null).trigger('change');
    });
}

var companyId;
var fetchUrl = '/RFQFinalization/GetAllRfqFinalization';
var selectedVendor = [];
var orderColumn = '';
var orderDir = '';
var awardedVendorDetails = [];
var ddlRfqNoData = [];
var viewModelDto = [];

$("#ddlRfqStatus").on('change', function () {
    if ($(this).val() != null) {
        if (IsNullOrEmpty($("#ddlRfqNo").val())) {
            toastr.warning("Please Select Rfq No!", "Warning");
            ClearDisabledFields();
            $("#ddlRfqStatus").val(0).trigger('change');
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
            FetchAwardedVendorDetails();
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

    $("#ddlRfqNo").prop('disabled', false);

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
        FetchDataForTable('rfqFinalizationTable', fetchUrl, orderColumn, orderDir.toUpperCase(), 'EditRfqFinalizatioin', 'DeleteRfqFinalizatioin', 'rfqFinalIdId');
    });

    $("#btnSave, #btnSaveAndNew").on('click', function () {
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            SaveAndSaveNew(action);
        }
    });

    $("#btnAdd").on('click', function () {
        $("#tableDiv").css('display', 'none ');
        $("#formDiv").css('display', 'block');
        $('#RFQForm').find('input, select, textarea, button, a').prop('disabled', false);
        if (viewModelDto.length > 0) {
            const usedRfqNos = viewModelDto.map(x => x.rfqNo.trim());
            var drpData = ddlRfqNoData.filter(
                x => !usedRfqNos.includes(x.rfqNo.trim())
            );
            console.log("drpData", drpData);
            console.log("usedRfqNos", usedRfqNos);
            ReBindddlRfqNoDrp(drpData)
        }
    })

    $("#btnCancel").on('click', function () {
        FetchRfqFinalizationList();

    });

    GetRfqDrpList();
    GetRfqStatus();
    GetRfqFailureReason();
    FetchRfqFinalizationList();
    UpdateRfqFinalization();

    GetAllCustomer("ddlCustomerName", companyId);

    GetAllVehicleType("ddlVehicleType", companyId);

    $("#ddlRfqNo").on('change', function () {
        if (!isValidateSelect($("#ddlRfqNo").val())) {
            ClearDisabledFields();
            return;
        }
        $("#ddlRfqStatus").val(0).trigger('change');
        GetRfqDetailsByRfqNo();
    })

    //$("#txtBillingRate").on('keyup', async function () {
    //    const value = $(this).val();
    //    if (!IsNullOrEmpty(value)) {
    //        await FetchAwardedVendorDetails();
    //    }
    //    return;
    //});
});
function OnSubmitCheckValidation() {
    if (!isValidateSelect($("#ddlRfqNo").val())) {
        toastr.warning("Please enter a RFQ No", "Validation Error");
        return false;
    }
    if (!isValidateSelect($("#ddlRfqStatus").val())) {
        toastr.warning("Please Select a RFQ Status", "Validation Error");
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
function GetRfqDrpList() {
    var getRfqDrpListUrl = '/RFQFinalization/GetRfqDrpList'
    $.ajax({
        url: getRfqDrpListUrl,
        type: "GET",
        dataType: "json",
        data: { companyId: companyId },
        success: function (response) {
            ddlRfqNoData = response;
            $("#ddlRfqNo").empty();
            const select = document.getElementById("ddlRfqNo");
            select.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a RFQ No";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            ddlRfqNoData.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.rfqId;
                opt.textContent = option.rfqNo;
                select.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
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
            placeholderOption.value = 0;
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
    var rfqNumber = $("#ddlRfqNo").find('option:selected').text();
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
            placeholderOption.value = 0;
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

async function SaveAndSaveNew(action) {
    var saveUrl = '/RFQFinalization/AddRfqFinal';
    const rfqFinalformData = {
        RfqId: $("#txtRfqId").val(),
        RfqStatusId: $('#ddlRfqStatus').val(),
        ReasonId: $('#ddlRfqReason').val() || 0,
        Remarks: $('#txtRemarks').val(),
        BillingRate: $('#txtBillingRate').val() || 0,
        DetentionPerDay: $('#txtPerDay').val() || 0,
        DetentionFreeDays: $('#txtFreeDays').val() || 0,
        MarginAmount: 0,
        LinkId: GetQueryParam("LinkId")
    };
    let selectedVendorList = GetSelectedVendor();
    const rfqFinalRateFormData = selectedVendorList.map(vendor => ({
        VendorId: vendor.VendorId || 0,
        RfqId: vendor.RfqId || 0,
        IsAssigned: vendor.IsAssigned || 0,
        AvailVehicleCount: vendor.AvailVehicleCount || 0,
        AssignedVehicles: vendor.AssignedVehicles || 0
    }));
    const check = await checkAssignedVehicles(rfqFinalRateFormData);
    if (check) {
        if ($("#ddlRfqStatus").find('option:selected').text() === "NOT AWARDED") {
            var formData = {
                RfqFinalDto: rfqFinalformData,
                RfqFinalRateDtos: []
            }
        }
        else {
            var formData = {
                RfqFinalDto: rfqFinalformData,
                RfqFinalRateDtos: rfqFinalRateFormData,
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
                        addMasterUserActivityLog(0, LogType.Create, "RFQ Finalization Submitted Successfully!", 0);
                        var selectedCheckBoxData = GetSelectedVendors()
                        SendAssignOrder(selectedCheckBoxData);
                        if (typeof this.completeOnSuccess === "function") {
                            this.completeOnSuccess();
                        }
                    } else {
                        toastr.error("Failed to Submit RFQ Finalization.", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Submit RFQ Finalization.", "Error");
                },
                completeOnSuccess: function () {
                    FetchRfqFinalizationList();
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
                        addMasterUserActivityLog(0, LogType.Create, "RFQ Finalization Submitted Successfully!", 0);
                        $('#RFQForm')[0].reset();
                        $(".select2-custom").each(function () {
                            $(this).val(0).trigger('change');
                        });
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
}
function FetchRfqFinalizationList() {
    $("#tableDiv").show();
    $("#formDiv").hide();
    $("#btnUpdateRfqFinalization").hide();
    $("#btnSave").show();
    $("#btnSaveAndNew").show();
    $('#RFQForm')[0].reset();
    $(".select2-custom").each(function () {
        $(this).val(0).trigger('change');
    });
    $("#ddlRfqNo").prop('disabled', false);
    ClearDisabledFields();
    FetchDataForTable('rfqFinalizationTable', fetchUrl, orderColumn, orderDir.toUpperCase(), 'EditRfqFinalizatioin', 'DeleteRfqFinalizatioin', 'rfqFinalIdId');
}

$('#rfqFinalizationTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchRfqFinalizationList();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchRfqFinalizationList();
});

async function EditRfqFinalizatioin(rfqFinalIdId) {
    if ($("#btnUpdateRfqFinalization").hasClass('d-none')) {
        $("#btnUpdateRfqFinalization").removeClass('d-none');
        $('#RFQForm').find('input, select, textarea, button, a').prop('disabled', false);
    }
    var data = viewModelDto.filter(x => x.rfqFinalIdId == rfqFinalIdId);
    var formData = data[0];
    ReBindddlRfqNoDrp(ddlRfqNoData);
    $('#tableDiv').css('display', 'none');
    $("#formDiv").css('display', 'Block');
    $("#btnUpdateRfqFinalization").show();
    $("#btnSave").hide();
    $("#btnSaveAndNew").hide();
    $("#ddlRfqNo").val(formData.rfqId).trigger('change');
    $("#ddlRfqNo").prop('disabled', true);
    $("#txtRfqId").val(formData.rfqId);
    $("#hdnRFQFinalizationId").val(formData.rfqFinalIdId);
    $("#txtRemarks").val(formData.remarks);
    await GetRfqDetailsByRfqNo();
    $("#ddlRfqStatus").val(formData.rfqStatusId).trigger('change');
    $("#txtBillingRate").val(formData.billingRate);
    $("#txtPerDay").val(formData.detentionPerDay);
    $("#txtFreeDays").val(formData.detentionFreeDays);
    await FetchAwardedVendorDetails();
    if (!IsNullOrEmpty(formData.reasonId)) {
        $("#ddlRfqReason").val(formData.reasonId).trigger('change');
    }
};
function UpdateRfqFinalization() {
    $("#btnUpdateRfqFinalization").on('click', async function () {
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
            MarginAmount: 0,
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
        var check = await checkAssignedVehicles(rfqFinalRateUpdateFormData);
        if (check) {
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
                        addMasterUserActivityLog(0, LogType.Update, "Rfq Finalization Updated Successfully!", 0);
                        var selectedCheckBoxData = GetSelectedVendors()
                        SendAssignOrder(selectedCheckBoxData);
                        FetchRfqFinalizationList();
                    } else {
                        toastr.error("Failed to Update Rfq Finalization Details!", "Error");
                    }
                },
                error: function (xhr, status, error) {
                    toastr.error("Failed to Update Rfq Finalization Details!", "Error");
                }
            });
        }
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
                        addMasterUserActivityLog(0, LogType.Delete, "Rfq Finalization Details Deleted Successfully!", 0);
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
function FetchAwardedVendorDetails() {
    var rfqId = $("#txtRfqId").val();
    var getAwardedVendorUrl = '/RFQFinalization/AwardedVendor/' + rfqId;
    $.ajax({
        url: getAwardedVendorUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            awardedVendorTable = response
            const tbody = $("#awardedVendorTable tbody");
            tbody.empty();
            if (!response || response.length === 0) {
                $("#awardedVendorTable tbody").append('<tr><td colspan="16" class="text-center">No records found</td></tr>');
                return;
            }
            $.each(response, function (index, vendor) {
                let difference = 0;
                const billingRate = parseFloat($("#txtBillingRate").val()) || 0;
                const hireCost = parseFloat(vendor.totalHireCost) || 0;
                if (billingRate == 0) {
                    difference = "Not Available";
                } else {
                    difference = billingRate - hireCost;
                }
                console.log(vendor);
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
                        <td><input type="text" id="txtassignedVehicle_${index}" value="${vendor.assignedVehicles}" class="form-control assigned-vehicle" maxlength="10" onkeypress="return isNumber(event)"></td>
                        <td>${vendor.totalHireCost}</td>
                        <td>${vendor.detentionPerDay}</td>
                        <td>${vendor.detentionFreeDays}</td>
                        <td>${difference}</td>
                        <td>${vendor.vendorPosition}</td>
                        <td style="text-align: center; vertical-align: middle;">
                            <label class="check-box-custom" style="display: inline-block;">
                                <input class="form-check-input"
                                       type="checkbox"
                                       data-finalrateid=""
                                       data-vehiclecount="${vendor.vehicleCount}"
                                       data-availvehicle="${vendor.availVehicleCount}"
                                       data-vendorid="${vendor.vendorId}"
                                       ${vendor.isAssigned ? 'checked' : ''}>
                                <span class="checkmark"></span>
                            </label>
                        </td>
                        </tr>`;
                tbody.append(rowHtml);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Awarded Vendor Details!", "Error");

        }
    });
}

$(document).on("input", ".assigned-vehicle", function () {
    // 🔹 current input
    let $input = $(this);
    // 🔹 allow only numbers
    let value = $input.val().replace(/[^0-9]/g, '');
    $input.val(value);
    let assignedVehicle = parseInt(value) || 0;
    // 🔹 get full row
    let $row = $input.closest("tr");
    let availVehicle = parseInt($row.find('input[type="checkbox"]').data("availvehicle")) || 0;
    if (assignedVehicle > availVehicle) {
        toastr.warning("Assigned vehicles shall not be greater than the available vehicle count.", "Warning");
        $(this).val('');
    }
});

//$(document).on("change", "#awardedVendorTable tbody input[type='checkbox']", function () {
//    let row = $(this).closest("tr");
//    let vehicleCount = parseInt($(this).data("vehiclecount")) || 0;
//    ValidateTotalForVendor(vehicleCount);
//});

function GetSelectedVendor() {
    selectedVendor = [];
    $("#awardedVendorTable tbody tr").each(function (index) {
        var checkbox = $(this).find('input[type="checkbox"]');
        var vendorId = checkbox.data('vendorid');
        var availVehicleCount = checkbox.data('availvehicle');
        var finalRateId = checkbox.data('finalrateid');
        var assignedVehicle = $("#txtassignedVehicle_" + index).val();

        if (IsNullOrEmpty(assignedVehicle)) {
            assignedVehicle = 0;
        }
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
    $('input:disabled').val('');
    $('input[type="hidden"]').val('');
    $("#ddlCustomerName").val(0).trigger('change');
    $("#ddlVehicleType").val(0).trigger('change');
}
function GetSelectedVendors() {
    const selectedData = [];
    $("#awardedVendorTable tbody input[type='checkbox']:checked").each(function () {
        const vendorId = $(this).data("vendorid"); // capture once
        console.log(awardedVendorTable);
        const result = $.grep(awardedVendorTable, function (obj) {
            return obj.vendorId === vendorId; // compare correctly
        });
        if (result.length > 0) {
            selectedData.push(result[0]); // push first match
        }
    });
    return selectedData;
}
function SendAssignOrder(selectedVendors) {
    if (parseInt($("#ddlRfqStatus").val()) === EnumInternalMaster.AWARDED) {
        if (selectedVendors.length === 0) {
            toastr.warning("No vendors selected for assignment.");
            return;
        } else {
            var VehicleTypeText = $("#ddlVehicleType option:selected")[0].innerHTML;
            var body = {
                vendors: selectedVendors,
                fromLocation: $("#from-search-box").val(),
                toLocation: $("#to-search-box").val(),
                vehicleType: VehicleTypeText,
                vehicleReqOn: $("#txtVehicleReqDate").val()
                    ? new Date($("#txtVehicleReqDate").val()).toISOString()
                    : null
            };
            console.log(body);
            $.ajax({
                url: "/RFQFinalization/SendAssignOrder",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(body),
                success: function (response) {
                    toastr.success("Assign Order Sucsessfully");
                },
                error: function (xhr, status, error) {
                    toastr.error("Something went wrong while sending emails!");
                }
            });
        }
    }
}

async function checkAssignedVehicles(AssignedVehicleListData) {
    if (parseInt($("#ddlRfqStatus").val()) === EnumInternalMaster.AWARDED) {
        const TotalRequerdvehicleCount = $("#txtNoofVehicles").val();
        const totalAssignedVehicles = AssignedVehicleListData.reduce((total, vendor) => {
            return total + (parseInt(vendor.AssignedVehicles, 10) || 0);
        }, 0);

        if (parseInt(totalAssignedVehicles) > parseInt(TotalRequerdvehicleCount)) {
            toastr.warning("Assigned Vehicles - Total shall not be greater than RFQ Required Vehicles count.", "warning");
            return;
        }

        if (
            totalAssignedVehicles !== 0 &&
            totalAssignedVehicles < TotalRequerdvehicleCount
        ) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'The required number of vehicles has not been met.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, proceed'
            });

            if (result.isConfirmed)
                return true;
            else
                return false;
        }
    }
    return true;
}
function ReBindddlRfqNoDrp(ddlRfqNoData) {
    $("#ddlRfqNo").empty();
    const select = document.getElementById("ddlRfqNo");
    select.innerHTML = "";
    let placeholderOption = document.createElement("option");
    placeholderOption.value = 0;
    placeholderOption.textContent = "Select a RFQ No";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);
    ddlRfqNoData.forEach(option => {
        let opt = document.createElement("option");
        opt.value = option.rfqId;
        opt.textContent = option.rfqNo;
        select.appendChild(opt);
    });
}
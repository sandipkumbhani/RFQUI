var VehicIndentList;
var companyId;
var rfqId;
var fetchedVendorDataList = [];
var orderColumn = '';
var orderDir = '';
let IsEditClick = false;
var fetchRfqUrl = '/RequestForQuote/GetAllRfq';
var vendorList = [];
var VendorListDrpData = [];

$(document).ready(function () {
    companyId = getCookieValue('companyid');
    profileId = getCookieValue('profileid');
    locationId = getCookieValue('locationid');
    CheckValidation();
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir);
        $('th.sortable').not(this).data('order', 'asc');
        FetchDataForTable('rfqTable', fetchRfqUrl, orderColumn, orderDir.toUpperCase(), 'EditRfq', 'DeleteRfq', 'rfqID');
    });

    $("#btnCancel").on("click", function () {
        FetchRfqList();
    });
    $("#btnSaveType, #btnSaveAndNew").on('click', function () {
        var action = $(this).data('action');
        if (OnSubmitCheckValidation()) {
            showLoader();
            SaveAndSaveNew(action);
        }
    });
    $("#btnAdd").on("click", function () {
        $("#tableDiv").css('display', 'none ');
        $("#formDiv").css('display', 'block');
        //$('#RfqDetailsForm').find('input, select, textarea, button, a').prop('disabled', false);
        if ($("#ddlLocation").is(":disabled"))
            $("#ddlLocation").removeAttr("disabled");

        const rfqDetailsTab = document.getElementById("rfqDetails-tab");
        rfqDetailsTab.click();
    });

    $('#tableDivLink').on('click', function (e) {
        e.preventDefault();
        FetchRfqList();
        $("#tableDiv").show();
        $("#formDiv").hide();
    });

    $('#ddlIndent').on('change', function () {
        const selectedValue = $(this).val();
        if (!selectedValue) {
            return;
        }

        const selectedIndent = VehicIndentList.find(x => x.indentId == selectedValue);
        if (selectedIndent) {
            $("#ddlCustomerName").val(selectedIndent.partyId).trigger('change');
            $("#ddlVehicleType").val(selectedIndent.vehicleTypeId).trigger('change');
            $('#from-search-box').val(selectedIndent.fromLocation);
            $('#to-search-box').val(selectedIndent.toLocation);
            $('#txtNoofVehicles').val(selectedIndent.requiredVehicles);
            $('#txtVehicleReqDate').val(selectedIndent.vehicleReqOn.split('T')[0]);
            $('#fromState').val(selectedIndent.fromLocationState);
            $('#fromCity').val(selectedIndent.fromLocationCity);
            $('#fromLat').val(selectedIndent.fromLatitude);
            $('#fromLng').val(selectedIndent.fromLongitude);
            $('#toState').val(selectedIndent.toLocationState);
            $('#toCity').val(selectedIndent.toLocationCity);
            $('#toLat').val(selectedIndent.toLatitude);
            $('#toLng').val(selectedIndent.toLongitude);
            $("#ddlItemName").val(selectedIndent.itemId == 0 ? 0 : selectedIndent.itemId).trigger('change');
            $("#ddlPackingType").val(selectedIndent.packingTypeId == 0 ? 0 : selectedIndent.packingTypeId).trigger('change');
            $("#hdnIndentDate").val(selectedIndent.indentDate);
            //$("#hdnIndentExpiryDate").val(selectedIndent.expiryDate);
        }
    });

    $("#ddlLocation").on('change', async function () {
        var locationId = $(this).val();
        if (!IsNullOrEmpty(locationId)) {
            await GetAllVehicleIndent(locationId);
            var locationData = await GetLocationById(locationId)
            var code = await GetAutoGenerateCode(locationData.code, PrefixCode.RFQ);
            console.log(code);
            if (!IsEditClick) {
                $("#txtRfqNo").val(code);
            }
        }
    });

    $("#txtVehicleReqDate").on('change', function () {
        setVehicleReqOnDate();
    });

    UpdateRfq();
    GetAllLocation("ddlLocation", companyId, function () {
        if (profileId == EnumProfile.Branch) {
            $('#ddlLocation').val(Number(locationId)).trigger('change');
            $('#ddlLocation').prop('disabled', true);
        }
    });
    GetRfqType();
    GetRfqPriority();
    //FetchRfqNo();
    FetchRfqList();
    RenderFetchTable();
    SaveRfqVendorDetails();
    GetAllCustomer("ddlCustomerName", companyId);
    GetAllVehicleType("ddlVehicleType", companyId);
    GetAllItemName("ddlItemName", companyId);
    GetAllPakingType("ddlPackingType");
    SetDefaultIndentDropdown();
    OnChangeFetchVendorData();
    ClearFetchForm();
});
function CheckValidation() {
    $("#ddlLocation").on("keypress", function () {
        if (!isValidateSelect($(this).val())) {
            toastr.warning("Please Select a Location", "Validation Error");
            return;
        }
    });

    $("#txtRfqExpiredOn").on("change Blur", function () {
        const indentVal = $("#ddlIndent").val();
        if (!IsNullOrEmpty(indentVal) && Number(indentVal) != 0) {
            if (formatDate($(this).val()) < formatDate($("#txtVehicleReqDate").val())) {
                toastr.warning("Enter valid RFQ Expired On Date !", "Warning");
                $(this).val('');
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const rfqDetailsTab = document.getElementById("rfqDetails-tab");
    const vendorDetailsTab = document.getElementById("vendorDetails-tab");
    const previousQuotes = document.getElementById("previousQuotes-tab");

    if (vendorDetailsTab) {
        vendorDetailsTab.addEventListener("click", function () {
            if (OnSubmitCheckValidation()) {
                GetAllVendorList();
                VendorListBindDropDown();
            } else {
                rfqDetailsTab.click();
                return
            }
        });
    }
    if (previousQuotes) {
        previousQuotes.addEventListener("click", function () {
            if (OnSubmitCheckValidation()) {
                GetPreviousQuotesList();
            } else {
                rfqDetailsTab.click();
                return
            }
            //if (!isValidateSelect($("#ddlIndent").val())) {
            //    toastr.warning("Please Select a Indent No", "Validation Error");
            //    rfqDetailsTab.click();
            //    return;
            //} else {
            //    GetPreviousQuotesList();
            //}
        });
    }
});
function OnSubmitCheckValidation() {
    try {
        if (!isValidateSelect($("#ddlLocation").val())) {
            toastr.warning("Please Select a Location", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#txtRfqNo").val())) {
            toastr.warning("Please enter a RFQ No", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#txtRfqDate").val())) {
            toastr.warning("Please enter a RFQ Date", "Validation Error");
            return false;
        }

        //if (!isValidateSelect($("#ddlIndent").val())) {
        //    toastr.warning("Please Select a Indent No", "Validation Error");
        //    return false;
        //}
        if (!isValidateSelect($("#ddlCustomerName").val())) {
            toastr.warning("Please Select a Customer Name", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#txtVehicleReqDate").val())) {
            toastr.warning("Please enter a Vehicle Req On", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#txtRfqExpiredOn").val())) {
            toastr.warning("Please enter a RFQ Expired On", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#from-search-box").val())) {
            toastr.warning("Please enter a Origin/From", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#to-search-box").val())) {
            toastr.warning("Please enter a Destination/To", "Validation Error");
            return false;
        }
        if (!isValidateSelect($("#ddlVehicleType").val())) {
            toastr.warning("Please Select a Vehicle Type", "Validation Error");
            return false;
        }
        if (IsNullOrEmpty($("#txtNoofVehicles").val())) {
            toastr.warning("Please enter a No. of Vehicles", "Validation Error");
            return false;
        }

        if (FormatDateToLocal($("#txtRfqDate").val()) < FormatDateToLocal($("#hdnIndentDate").val())) {
            toastr.warning("RFQ Date shall be greater than or equal to selected Vehicle Req On.");
            return false;
        }
        if (FormatDateToLocal($("#txtRfqExpiredOn").val()) < FormatDateToLocal($("#txtRfqDate").val())) {
            toastr.warning("RFQ Expired On Date shall be greater than or equal to selected RFQ Date.");
            return false;
        }
        return true;
    } catch (e) {
        false
    }
}

async function GetAllVehicleIndent(selectLocationId, selectedIndentId = null) {
    var getVehicleTypeUrl = '/RequestForQuote/GetAllVehicleIndentList'
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: await function (response) {
            response = response.result;
            VehicIndentList = response.filter(x => x.locationId == selectLocationId);
            $("#ddlIndent").empty();
            const Indentdropdown = document.getElementById("ddlIndent");
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
                $("#ddlIndent").val(selectedIndentId).trigger('change');
                $("#ddlIndent").prop('disabled', true);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function GetRfqType() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == EnumInternalMasterType.RFQ_TYPE);
            const select = document.getElementById("ddlRfqType");
            select.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a RFQ Type";
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
function GetRfqPriority() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let internalData = response.filter(x => x.internalMasterTypeId == EnumInternalMasterType.RFQ_PRIORITY);
            const select = document.getElementById("ddlRfqPriority");
            select.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a RFQ Priority";
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
function FetchRfqNo() {
    $.ajax({
        url: "/RequestForQuote/GetRfqNo",
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            $("#txtRfqNo").val(response.result);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Indent No!", "Error");
        }
    });
}
function GetAllVendorList() {
    $("#ddlRFQVendorList").empty();
    var getUrl = '/RequestForQuote/GetAllVendorListForRfq'
    let fromStateName = $("#fromState").val().toUpperCase();
    let toStateName = $("#toState").val().toUpperCase();
    var RfqDetailsId = $("#txtRfqDetailsId").val();
    var formData = {
        OriginFrom: fromStateName,
        ToDestination: toStateName,
        VehicleTypeId: $('#ddlVehicleType').val(),
        RfqId: IsNullOrEmpty(RfqDetailsId) ? 0 : parseInt(RfqDetailsId)
    }
    $.ajax({
        url: getUrl,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            if (fetchedVendorDataList.length > 0) {
                $.each(response, function (i, party) {
                    if (!fetchedVendorDataList.some(x => x.partyId == parseInt(party.partyId))) {
                        fetchedVendorDataList.push(party);
                    }
                });
            } else {
                fetchedVendorDataList = response;
            }
            RenderFetchTable();
            //BindAllVendorList(fetchedVendorDataList);
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vendor Name!", "Error");
        }
    });
}
function BindAllVendorList(fetchedVendorDataList) {
    const tbody = $("#rfqVendorTable tbody");
    tbody.empty();
    if (!fetchedVendorDataList || !Array.isArray(fetchedVendorDataList) || fetchedVendorDataList.length <= 0) {
        tbody.append('<tr><td colspan="12" class="text-center">No records found</td></tr>');
    }
    $.each(fetchedVendorDataList, function (index, vendor) {
        const rowHtml = `
                        <tr data-index="${index}">
                        <td>${index + 1}</td>
                        <td>${vendor.partyName}</td >
                        <td>${vendor.panNo}</td >
                        <td>5</td >
                        <td>${vendor.mobNo}</td>
                        <td>${vendor.whatsAppNo}</td>
                        <td>${vendor.email}</td>
                        <td class="text-center action-items" style="cursor:pointer;">
                            <a class="icon-btn" id="editVendor"><i class="ri-edit-2-line"></i></a>
                            <a class="icon-btn" id="deleteVendor"><i class="ri-delete-bin-3-line"></i></a>
                        </td>
                    </tr>`;
        tbody.append(rowHtml);
    })
}

function RenderFetchTable() {
    const tbody = $('#rfqVendorTable tbody');
    tbody.empty();
    $.each(fetchedVendorDataList, function (index, vendor) {
        const row = `
      <tr data-index="${index}">
        <td>${index + 1}</td>
        <td>${vendor.partyName}</td>
        <td>${vendor.panNo}</td>
        <td>0</td>
        <td>${vendor.mobNo}</td>
        <td>${vendor.whatsAppNo}</td>
        <td>${vendor.email}</td>
        <td class="text-center action-items" style="cursor:pointer;">
                            <a class="icon-btn" id="editVendor"><i class="ri-edit-2-line"></i></a>
                            <a class="icon-btn" id="deleteVendor"><i class="ri-delete-bin-3-line"></i></a>
        </td>
      </tr>
    `;
        tbody.append(row);
    });
}

$('#rfqVendorTable').on('click', '#deleteVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    const deletedVendor = fetchedVendorDataList.splice(rowIndex, 1);
    RenderFetchTable();
});

$('#rfqVendorTable').on('click', '#editVendor', function () {
    const rowIndex = $(this).closest('tr').data('index');
    const vendor = fetchedVendorDataList[rowIndex];
    const mobileNoInputHtml = `<input type="text" id="editMobileNo" class="form-control" maxlength="10" value="${vendor.mobNo}">`;
    const whatsappNoInputHtml = `<input type="text" id="editWhatsappNo" class="form-control" maxlength="10" value="${vendor.whatsAppNo}">`;
    const emailInputHtml = `<input type="email" id="editEmailId" class="form-control" maxlength="50" value="${vendor.email}">`;

    $(this).closest('tr').find('td:nth-child(5)').html(mobileNoInputHtml);
    $(this).closest('tr').find('td:nth-child(6)').html(whatsappNoInputHtml);
    $(this).closest('tr').find('td:nth-child(7)').html(emailInputHtml);

    const actionButtonsHtml = `  
                     <button type="button" class="saveEditVendor" style="color:blue;border:none;background:none;">Save</button> /  
                     <button type="button" class="cancelEditVendor" style="color:blue;border:none;background:none;">Cancel</button>  
                  `;
    $(this).closest('tr').find('td:nth-child(8)').html(actionButtonsHtml);

    $('.saveEditVendor').on('click', function () {
        const updatedMobileNo = $('#editMobileNo').val();
        const updatedWhatsappNo = $('#editWhatsappNo').val();
        const updatedEmailId = $('#editEmailId').val();

        if (IsNullOrEmpty(updatedEmailId)) {
            toastr.warning("Please fill all Email Id!", "Validation");
            return;
        }

        fetchedVendorDataList[rowIndex].mobNo = updatedMobileNo;
        fetchedVendorDataList[rowIndex].whatsAppNo = updatedWhatsappNo;
        fetchedVendorDataList[rowIndex].email = updatedEmailId;
        RenderFetchTable();
    });

    $('.cancelEditVendor').on('click', function () {
        RenderFetchTable();
    });

});
function SaveAndSaveNew(action) {
    var saveUrl = '/RequestForQuote/AddRfq';
    const rfqFormData = {
        //RfqId:0,
        RfqNo: $('#txtRfqNo').val(),
        //CompanyId:0,
        LocationId: $('#ddlLocation').val(),
        IndentId: $('#ddlIndent').val() || 0,
        RfqDate: $('#txtRfqDate').val(),
        ExpiryDate: $('#txtRfqExpiredOn').val(),
        PartyId: $('#ddlCustomerName').val(),
        VehicleReqOn: $('#txtVehicleReqDate').val(),
        FromLocation: $('#from-search-box').val(),
        FromLocationState: $('#fromState').val(),
        FromLocationCity: $('#fromCity').val(),
        FromLatitude: $('#fromLat').val(),
        FromLongitude: $('#fromLng').val(),
        ToLocation: $('#to-search-box').val(),
        ToLocationState: $('#toState').val(),
        ToLocationCity: $('#toCity').val(),
        ToLatitude: $('#toLat').val(),
        ToLongitude: $('#toLng').val(),
        VehicleTypeId: $('#ddlVehicleType').val(),
        VehicleCount: $('#txtNoofVehicles').val(),
        RfqSubject: $('#txtRfqSubject').val(),
        RfqPriorityId: $('#ddlRfqPriority').val(),
        RfqTypeId: $('#ddlRfqType').val(),
        ItemId: parseInt($('#ddlItemName').val()),
        MaxCosting: parseInt($('#txtMaxCosting').val()),
        DetentionPerDay: parseInt($('#txtPerDay').val()),
        DetentionFreeDays: parseInt($('#txtFreeDay').val()),
        PackingTypeId: parseInt($('#ddlPackingType').val()),
        SpecialInstruction: $('#txtSpecialInstructions').val(),
        LinkId: parseInt(GetQueryParam("LinkId"))
    };
    const recipientFormData = fetchedVendorDataList.map(vendor => ({
        VendorId: vendor.partyId,
        PanNo: vendor.panNo,
        VendorRating: "5",
        MobNo: vendor.mobNo,
        WhatsAppNo: vendor.whatsAppNo,
        EmailId: vendor.email
    }));
    var formData = {
        RfqRequestDto: rfqFormData,
        RfqRecipients: recipientFormData
    }
    if (action === "save") {
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response) {
                    rfqId = response.rfqRequestDto.rfqId;
                    Saveattachment(rfqId);
                    toastr.success("Request For Quote Saved Sucessfully", "success");
                    addMasterUserActivityLog(0, LogType.Create, "Request For Quote Saved Sucessfully", 0);
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
            },
            complete: function () {
                hideLoader();
                window.location.reload();
            },
            error: function (xhr, status, error) {
                hideLoader();
                toastr.error("Failed to Submit Request For Quote.", "Error");
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
                    rfqId = response.rfqRequestDto.rfqId;
                    Saveattachment(rfqId);
                    toastr.success("Request For Quote Saved Sucessfully", "success");
                    addMasterUserActivityLog(0, LogType.Create, "Request For Quote Saved Sucessfully", 0);
                    $('#RfqDetailsForm')[0].reset();
                    $(".select2-custom").each(function () {
                        $(this).val(0).trigger('change');
                    });
                    //FetchRfqNo();
                    setTimeout(() => {
                        ResetAttachmentRepeater();
                    }, 1000);
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Request For Quote.", "Error");
                hideLoader();
            },
            complete: function () {
                hideLoader();
            },
        });
    }
}
function EditRfq(rfqID) {
    IsEditClick = true;
    if ($("#btnUpdateRfq").hasClass('d-none')) {
        $("#btnUpdateRfq").removeClass('d-none');
    }
    var data = viewModelDto.filter(x => x.rfqId === rfqID);
    var formData = data[0];
    FetchMasterAttachment(formData.linkId, rfqID, function (list) {
        var attachmentData = list;
        $('#tableDiv').css('display', 'none');
        $("#formDiv").css('display', 'Block');
        $("#btnSaveType").hide();
        $("#btnSaveAndNew").hide();
        $("#button-main").css('display', 'Block');
        $("#vendorDetails-tab").prop('disabled', false);
        $("#previousQuotes-tab").prop('disabled', false);
        $("#txtRfqDetailsId").val(formData.rfqId);
        if (!IsNullOrEmpty(formData.locationId)) {
            $("#ddlLocation").val(formData.locationId).trigger('change');
            $("#ddlLocation").prop('disabled', true);
        }

        $("#txtRfqNo").val(formData.rfqNo);
        $("#txtRfqDate").val(formData.rfqDate.split('T')[0]);
        $("#txtRfqExpiredOn").val(formData.expiryDate);
        GetAllVehicleIndent(formData.locationId, formData.indentId);
        $("#ddlCustomerName").val(formData.partyId).trigger('change');
        $("#txtVehicleReqDate").val(formData.vehicleReqOn.split('T')[0]);
        $("#from-search-box").val(formData.fromLocation);
        $("#to-search-box").val(formData.toLocation);
        $("#ddlVehicleType").val(formData.vehicleTypeId).trigger('change');
        $("#txtNoofVehicles").val(formData.vehicleCount);
        $("#txtMaxCosting").val(formData.maxCosting);
        $("#txtPerDay").val(formData.detentionPerDay);
        $("#txtFreeDay").val(formData.detentionFreeDays);
        $("#txtRfqSubject").val(formData.rfqSubject);
        $("#ddlRfqPriority").val(formData.rfqPriorityId).trigger('change');
        $("#ddlRfqType").val(formData.rfqTypeId).trigger('change');
        $("#ddlItemName").val(formData.itemId).trigger('change');
        $("#ddlPackingType").val(formData.packingTypeId).trigger('change');
        $("#txtSpecialInstructions").val(formData.specialInstruction);

        if (attachmentData.length > 0) {
            EditMasterAttachment(attachmentData);
        }
    });
    const rfqDetailsTab = document.getElementById("rfqDetails-tab");
    rfqDetailsTab.click();
}
function UpdateRfq() {
    $("#btnUpdateRfq").on('click', function (e) {
        e.preventDefault();
        showLoader();
        var isvalid = OnSubmitCheckValidation();
        if (!isvalid) {
            return;
        }
        const rfqFormData = {
            RfqId: $("#txtRfqDetailsId").val(),
            RfqNo: $('#txtRfqNo').val(),
            LocationId: $('#ddlLocation').val(),
            IndentId: $('#ddlIndent').val() || 0,
            RfqDate: $('#txtRfqDate').val(),
            ExpiryDate: $('#txtRfqExpiredOn').val(),
            PartyId: $('#ddlCustomerName').val(),
            VehicleReqOn: $('#txtVehicleReqDate').val(),
            FromLocation: $('#from-search-box').val(),
            FromLocationState: $('#fromState').val(),
            FromLocationCity: $('#fromCity').val(),
            FromLatitude: $('#fromLat').val(),
            FromLongitude: $('#fromLng').val(),
            ToLocation: $('#to-search-box').val(),
            ToLocationState: $('#toState').val(),
            ToLocationCity: $('#toCity').val(),
            ToLatitude: $('#toLat').val(),
            ToLongitude: $('#toLng').val(),
            VehicleTypeId: $('#ddlVehicleType').val(),
            VehicleCount: $('#txtNoofVehicles').val(),
            RfqSubject: $('#txtRfqSubject').val(),
            RfqPriorityId: $('#ddlRfqPriority').val(),
            RfqTypeId: $('#ddlRfqType').val(),
            ItemId: parseInt($('#ddlItemName').val()),
            MaxCosting: parseInt($('#txtMaxCosting').val()),
            DetentionPerDay: parseInt($('#txtPerDay').val()),
            DetentionFreeDays: parseInt($('#txtFreeDay').val()),
            PackingTypeId: parseInt($('#ddlPackingType').val()),
            SpecialInstruction: $('#txtSpecialInstructions').val(),
            LinkId: parseInt(GetQueryParam("LinkId"))
        };
        const recipientFormData = fetchedVendorDataList.map(vendor => ({
            VendorId: vendor.partyId,
            PanNo: vendor.panNo,
            VendorRating: "5",
            MobNo: vendor.mobNo,
            WhatsAppNo: vendor.whatsAppNo,
            EmailId: vendor.email
        }));
        var formData = {
            RfqRequestDto: rfqFormData,
            RfqRecipients: recipientFormData
        }

        DeleteAttachmentAPI(formData.RfqRequestDto.RfqId);
        var updateRfq = '/RequestForQuote/UpdateRfq';
        $.ajax({
            type: "PUT",
            url: updateRfq,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(formData),
            dataType: "json",
            success: function (result) {
                if (!IsNullOrEmpty(result)) {
                    toastr.success(result);
                    addMasterUserActivityLog(0, LogType.Update, "Rfq Details Updated Successfully!", 0);
                    const transactionId = $("#txtRfqDetailsId").val();
                    UpdateAttachmentData(transactionId);
                    FetchRfqList();
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Update Rfq Details", "Error");
                hideLoader();
            },
            complete: function () {
                hideLoader();
            },
        });
    });
}
function DeleteRfq(rfqID) {
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
            var deleteRfqUrl = '/RequestForQuote/DeleteRfq/' + rfqID;
            var result;
            var linkId = parseInt(GetQueryParam("LinkId"));
            FetchMasterAttachment(linkId, rfqID, function (list) {
                result = list;
                $.ajax({
                    url: deleteRfqUrl,
                    type: "DELETE",
                    dataType: "json",
                    data: JSON.stringify(rfqID),
                    success: function (response) {
                        if (response) {
                            toastr.success("Rfq Details Deleted Successfully!");
                            addMasterUserActivityLog(0, LogType.Delete, "Rfq Details Deleted Successfully!", 0);
                            $('#currentPage').val(1);
                            $("#formDiv").addClass('d-none');
                            FetchRfqList();
                        } else {
                            toastr.warning("Cannot delete RFQ: referenced in RFQFinalization.");
                        }
                    },
                    error: function (xhr, status, error) {
                        toastr.error("Failed to Delete Rfq Details!", "Error");
                    }
                });
            });
        }
    });
}
function FetchRfqList() {
    IsEditClick = false;
    $("#tableDiv").show();
    $("#formDiv").hide();
    $('#RfqDetailsForm')[0].reset();
    $("#btnSaveType").show();
    $("#button-main").hide();
    $("#btnSaveAndNew").show();
    $("#ddlIndent").prop('disabled', false);
    $(".select2-custom").each(function () {
        $(this).val(0).trigger('change');
    });
    $("#vendorDetails-tab").prop('disabled', false);
    $("#previousQuotes-tab").prop('disabled', false);
    //GetAllLocation("ddlLocation", companyId, function () {
    //    if (profileId == EnumProfile.Branch) {
    //        $('#ddlLocation').val(Number(locationId)).trigger('change');
    //        $('#ddlLocation').prop('disabled', true);
    //    }
    //});
    //FetchRfqNo();
    ResetAttachmentRepeater();
    FetchDataForTable('rfqTable', fetchRfqUrl, orderColumn, orderDir.toUpperCase(), 'EditRfq', 'DeleteRfq', 'rfqID');
}

$('#rfqTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchRfqList();
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchRfqList();
});
function SaveRfqVendorDetails() {
    var saveUrl = '/RfqRecipient/AddRfqRecipient';
    $("#btnSaveRfqVendorDetails").on('click', function () {
        var formData = fetchedVendorDataList.map(vendor => ({
            RfqId: rfqId,
            VendorId: vendor.partyId,
            PanNo: vendor.panNo,
            VendorRating: "5",
            MobNo: vendor.mobNo,
            WhatsAppNo: vendor.whatsAppNo,
            EmailId: vendor.email
        }));
        sendQuoteLinksForVendors(formData);
        $.ajax({
            url: saveUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                if (response != null) {
                    toastr.success("Request For Quote Submitted Successfully!", "Success");
                } else {
                    toastr.error("Failed to Submit Request For Quote.", "Error");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Submit Request For Quote.", "Error");
            }
        });
    });
}
function sendQuoteLinksForVendors(vendorList) {
    const formData = vendorList.map(vendor => ({
        RfqRecipientId: 0,
        RfqId: rfqId,
        VendorId: vendor.VendorId,
        PanNo: vendor.PanNo,
        VendorRating: vendor.VendorRating,
        MobNo: vendor.MobileNo,
        WhatsAppNo: vendor.WhatsAppNo,
        EmailId: vendor.EmailId
    }));

    $.ajax({
        url: '/QuoteRateVendor/SendQuoteLinks', // Must match your controller route
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(formData),
        success: function (response) {
            response.links.forEach(linkInfo => {
                if (linkInfo.WhatsAppNo) {
                    const message = encodeURIComponent("Please fill your RFQ form: " + linkInfo.Link);
                    const waUrl = `https://wa.me/${linkInfo.WhatsAppNo}?text=${message}`;
                    window.open(waUrl, '_blank');
                }
            });
        },
        error: function (xhr) {
            toastr.error("Failed to send links.", "Error");
        }
    });
}
function GetPreviousQuotesList() {
    let fromStateName = $("#fromState").val().toUpperCase();
    let toStateName = $("#toState").val().toUpperCase();
    var requestData = {
        OriginFrom: fromStateName,
        ToDestination: toStateName,
        VehicleTypeId: parseInt($('#ddlVehicleType').val()),
    };
    $.ajax({
        url: '/RequestForQuote/GetPreviousQuotesList',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (response) {
            const tbody = $("#previousQoutesTable tbody");
            tbody.empty();
            if (!response || !Array.isArray(response) || response.length <= 0) {
                tbody.append('<tr><td colspan="12" class="text-center">No records found</td></tr>');
            }
            $.each(response, function (index, quotes) {
                const rowHtml = `
                        <tr data-index="${index}">
                        <td>${index + 1}</td>
                        <td>${quotes.partyName}</td >
                        <td>${quotes.panNo}</td >
                        <td>5</td >
                        <td>${quotes.rfqDate.split(" ")[0]}</td>
                        <td>${quotes.totalHireCost}</td>
                    </tr>`;
                tbody.append(rowHtml);
            })
        },
        error: function (xhr, status, error) {
            toastr.error('Failed to fetch previous quotes:', "Error");
        }
    });
}

function SetDefaultIndentDropdown() {
    $("#ddlIndent").empty();
    const Indentdropdown = document.getElementById("ddlIndent");
    let placeholderOption = document.createElement("option");
    placeholderOption.value = 0;
    placeholderOption.textContent = "Select a Indent No";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    Indentdropdown.appendChild(placeholderOption);
}

function setRfqExpiredMinDate() {
    const vehicleInput = document.getElementById('txtVehicleReqDate');
    const rfqInput = document.getElementById('txtRfqExpiredOn');
    const vehicleDateValue = vehicleInput.value;
    // if empty → today datetime
    if (IsNullOrEmpty(vehicleDateValue)) {
        rfqInput.min = new Date().toISOString().slice(0, 16);
        return;
    }
    const date = new Date(vehicleDateValue);
    // invalid date safety
    if (isNaN(date.getTime())) {
        rfqInput.min = new Date().toISOString().slice(0, 16);
        return;
    }
    rfqInput.min = date.toISOString().slice(0, 16);
}

function setVehicleReqOnDate() {

    var vehicleDate = $("#txtVehicleReqDate").val();
    // if indent date is null or empty
    if (IsNullOrEmpty(vehicleDate)) {
        vehicleDate.min = new Date().toISOString().split('T')[0];
        return;
    }
    var date = new Date(vehicleDate);
    if (isNaN(date.getTime())) {
        vehicleDate.min = new Date().toISOString().split('T')[0];
        return;
    }
    $("#txtVehicleReqDate")[0].min = date.toISOString().split('T')[0];
}
function setRfqDateMinDate() {
    var txtRfqDate = $("#txtRfqDate").val();
    var txtVehicleReqDate = $("#txtVehicleReqDate").val();
    var indentval = $('#ddlIndent').val();
    if (!IsNullOrEmpty(indentval) && indentval > 0) {
        // if indent date is null or empty
        if (IsNullOrEmpty(txtVehicleReqDate)) {
            $("#txtRfqDate").min = new Date().toISOString().split('T')[0];
            return;
        }
        var date = new Date(txtVehicleReqDate);
        if (isNaN(date.getTime())) {
            $("#txtRfqDate").min = new Date().toISOString().split('T')[0];
            return;
        }
        $("#txtRfqDate")[0].min = date.toISOString().split('T')[0];
    } else {
        $("#txtRfqDate")[0].min = new Date().toISOString().split('T')[0];
    }
}

$('#btnAddVendor').on('click', function () {
    vendorList = [];
    const getSelectVendorID = $("#ddlRFQVendorList").val();
    if (IsNullOrEmpty(getSelectVendorID)) {
        toastr.warning("Please Select Vendor Name!", "Warning");
        return;
    }
    const getvendorName = $('#ddlRFQVendorList option:selected').text();
    const getpanNo = $("#fetchVendorPanNo").val();
    const getVendorRating = $("#fetchVendorRating").val();
    const getMobileNo = $("#fetchVendorMobileNo").val();
    const getWhatsappNo = $("#fetchVendorWhatsappNo").val();
    const getEmail = $("#fetchVendorEmailId").val();
    if (IsNullOrEmpty(getEmail)) {
        toastr.warning("Please Fill Email For Sending Mail!", "Warning");
        return;
    }
    vendorList.push({
        partyId: parseInt(getSelectVendorID),
        partyName: getvendorName,
        panNo: getpanNo,
        VendorRating: parseInt(getVendorRating) || 0,
        mobNo: getMobileNo,
        whatsAppNo: getWhatsappNo,
        email: getEmail
    });
    
    
    const isPresent = fetchedVendorDataList.some(
        x => x.partyId === parseInt(getSelectVendorID)
    );

    if (isPresent)
        toastr.warning("This Vendor Name!", "Already Exsist");
    else
        fetchedVendorDataList.push(vendorList[0]);

    RenderFetchTable();
    ClearFetchForm();
});

$('#btnCancelVendor').on('click', function () {
    ClearFetchForm();
});

//$('#rfqVendorTable').on('click', '.deleteVendor', function () {
//    const rowIndex = $(this).closest('tr').data('index');
//    const deletedVendor = vendorList.splice(rowIndex, 1);
//    RenderFetchTable();
//    deletedVendor.forEach(item => {
//        fetchedVendorDataList.push({
//            email: item.EmailId,
//            mobNo: item.MobileNo,
//            panNo: item.PanNo,
//            partyId: item.VendorId,
//            partyName: item.VendorName,
//            whatsAppNo: item.WhatsappNo
//        });
//    })
//    BindAllVendorList(fetchedVendorDataList);
//});

//$('#rfqVendorTable').on('click', '.editVendor', function () {
//    const rowIndex = $(this).closest('tr').data('index');
//    const vendor = vendorList[rowIndex];
//    const mobileNoInputHtml = `<input type="text" id="editMobileNo" class="form-control" maxlength="10" value="${vendor.MobileNo}">`;
//    const whatsappNoInputHtml = `<input type="text" id="editWhatsappNo" class="form-control" maxlength="10" value="${vendor.WhatsappNo}">`;
//    const emailInputHtml = `<input type="email" id="editEmailId" class="form-control" maxlength="50" value="${vendor.EmailId}">`;

//    $(this).closest('tr').find('td:nth-child(5)').html(mobileNoInputHtml);
//    $(this).closest('tr').find('td:nth-child(6)').html(whatsappNoInputHtml);
//    $(this).closest('tr').find('td:nth-child(7)').html(emailInputHtml);

//    const actionButtonsHtml = `
//                     <button type="button" class="saveEditVendor" style="color:blue;border:none;background:none;">Save</button> /
//                     <button type="button" class="cancelEditVendor" style="color:blue;border:none;background:none;">Cancel</button>
//                  `;
//    $(this).closest('tr').find('td:nth-child(8)').html(actionButtonsHtml);

//    $('.saveEditVendor').on('click', function () {
//        const updatedMobileNo = $('#editMobileNo').val();
//        const updatedWhatsappNo = $('#editWhatsappNo').val();
//        const updatedEmailId = $('#editEmailId').val();

//        if (!updatedMobileNo || !updatedEmailId) {
//            toastr.warning("Please fill all required fields!", "Validation Error");
//            return;
//        }

//        vendorList[rowIndex].MobileNo = updatedMobileNo;
//        vendorList[rowIndex].WhatsappNo = updatedWhatsappNo;
//        vendorList[rowIndex].EmailId = updatedEmailId;

//        RenderFetchTable();
//    });

//    $('.cancelEditVendor').on('click', function () {
//        RenderFetchTable();
//    });
//});

function VendorListBindDropDown(fetchedVendorDataList) {
    var getUrl = '/Vendor/GetAllVendorList'
    $.ajax({
        url: getUrl,
        type: "GET",
        data: { companyId: companyId },
        contentType: "application/json",
        success: function (response) {
            if (!IsNullOrEmpty(response)) {
                $("#ddlRFQVendorList").empty();
                VendorListDrpData = response
                const vendorListDropdown = document.getElementById("ddlRFQVendorList");
                let placeholderOption = document.createElement("option");
                placeholderOption.value = 0;
                placeholderOption.textContent = "Select a Vendor Name";
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                vendorListDropdown.appendChild(placeholderOption);
                response.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.partyId;
                    option.textContent = item.partyName;
                    vendorListDropdown.appendChild(option);
                });
            }
        },
        error: function (xhr, status, error) {
            console.log("Failed to Fetch VendorList DropDown!");
        }
    });

}
function OnChangeFetchVendorData() {
    $("#ddlRFQVendorList").on('change', function () {
        const selectedVendorId = $(this).val();
        if (IsNullOrEmpty(selectedVendorId)) {
            return;
        }
        const selectedVendorData = VendorListDrpData.find(x => x.partyId == selectedVendorId);
        $("#fetchVendorPanNo").val(selectedVendorData.panNo);
        $("#fetchVendorRating").val("0");
        $("#fetchVendorMobileNo").val(selectedVendorData.mobNo);
        $("#fetchVendorWhatsappNo").val(selectedVendorData.whatsAppNo);
        $("#fetchVendorEmailId").val(selectedVendorData.email);
    })
}
function ClearFetchForm() {
    $("#fetchVendorPanNo").val('');
    $("#fetchVendorRating").val('');
    $("#fetchVendorMobileNo").val('');
    $("#fetchVendorWhatsappNo").val('');
    $("#fetchVendorEmailId").val('');
    $('#ddlRFQVendorList').val(0).trigger('change');
}
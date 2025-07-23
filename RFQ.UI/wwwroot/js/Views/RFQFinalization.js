
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
    GetRfqStatus();
    GetAllStateList("ddlOrigin");
    GetAllStateList("ddlDestination");
    GetAllCustomer("ddlCustomerName");
    GetAllVehicleType("ddlVehicleType"); 
    $("#btnGetRfqData").on('click', function () {
        GetRfqDetailsByRfqNo();
    })
});

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
            if (response == null) {
                toastr.warning("Enter Correct RFQ No.", "Warning");
                return;
            }
            $("#ddlCustomerName").val(response.partyId).trigger('change');
            $("#txtRfqNo").val(response.rfqNo)
            $("#txtRfqDate").val(response.rfqDate)
            $("#txtRfqExpiredOn").val(response.expiryDate)
            $("#txtVehicleReqDate").val(new Date(response.vehicleReqOn).toISOString().split('T')[0])
            $("#ddlOrigin").val(response.fromLocation).trigger('change');
            $("#ddlDestination").val(response.toLocation).trigger('change');
            $("#ddlVehicleType").val(response.vehicleTypeId).trigger('change');
            $("#txtNoofVehicles").val(response.vehicleCount)
            $("#txtSpecial").val(response.specialInstruction)
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Rfq Data!", "Error");
        }
    });
}

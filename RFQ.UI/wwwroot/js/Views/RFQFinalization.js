
$(document).ready(function () {
    GetAllCustomerName();
    GetAllVehicleType();
    GetAllItemName();
    $("#btnGetRfqData").on('click', function () {
        GetRfqDetailsByRfqNo();
    })
});

function GetAllCustomerName() {
    var GetUrl = '/Customer/GetDrpCustomerList';
    $.ajax({
        url: GetUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            let customerList = response.filter(x => x.partyTypeId == 6);
            const dropdown = document.getElementById("ddlCustomerName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Customer Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            dropdown.appendChild(placeholderOption);
            customerList.forEach(name => {
                const option = document.createElement("option");
                option.value = name.partyId;
                option.textContent = name.partyName;
                dropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Customer Name!", "Error");
        }
    });
}
function GetAllVehicleType() {
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
            toastr.error("Failed to Fetch Vehicle Type!", "Error");
        }
    });
}
function GetAllItemName() {
    var getUrl = '/Product/GetDrpProductList';
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const vehicleTypedropdown = document.getElementById("ddlItemName");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Item Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vehicleTypedropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.itemId;
                option.textContent = item.itemName;
                vehicleTypedropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vehicle Type!", "Error");
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
            console.log(response);
            $("#ddlCustomerName").val(response.partyId).trigger('change');
            $("#txtRfqNo").val(response.rfqNo)
            $("#txtRfqDate").val(response.rfqDate)
            $("#txtRfqExpiredOn").val(response.expiryDate)
            $("#txtVehicleReqDate").val(new Date(response.vehicleReqOn).toISOString().split('T')[0])
            $("#txtOrigin").val(response.fromLocation)
            $("#txtDestination").val(response.toLocation)
            $("#ddlVehicleType").val(response.vehicleTypeId).trigger('change');
            $("#txtNoofVehicles").val(response.vehicleCount)
            $("#txtSpecial").val(response.specialInstruction)
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Rfq Data!", "Error");
        }
    });
}
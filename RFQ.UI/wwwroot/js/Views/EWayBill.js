
$(document).ready(function () {
    Initlization();
});
function Initlization() {
    $("#btnShow").on('click', function () {
        GetTripDetailsByBillExpiryDate();
    })
}
function GetTripDetailsByBillExpiryDate() {
    const CompanyId = getCookieValue('companyid');
    const expiryDate = $('#txtExpiryDate').val();
    const requestDto = {
        EWayBillExpiryDate: expiryDate,
        CompanyId: CompanyId
    };
    $.ajax({
        url: '/EWayBill/GetTripDetailsByBillExpiryDate',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestDto),
        success: function (response) {
            if (response.statusCode == 200) {
                console.log('Trip Details:', response);
                RenderTable(response.data);
            }
            else
                console.log('Trip Details:', response.message);
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
function RenderTable(data) {
    const tbody = $('#tripDetailsTable tbody');
    tbody.empty();

    $.each(data, function (index, item) {
        // Encode item as JSON and escape quotes for safe inline use
        const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

        const row = `
        <tr data-index="${index}">
            <td class="text-center">${index + 1}</td>
           
            <td class="text-center">${item.vehicleNo ?? ''}</td>
            <td class="text-center">${item.bookingNo ?? ''}</td>
            <td class="text-center">${item.bookingDate ?? ''}</td>
            <td class="text-center">${item.fromLocation ?? ''}</td>
            <td class="text-center">${item.toLocation ?? ''}</td>
            <td class="text-center">
                <input type="text" class="form-control" id="txtCurrentLocation_${index}" placeholder="Location" style="width: 100%;" />
            </td>
            <td class="text-center">
                <input type="number" class="form-control" id="txtPinCode_${index}" placeholder="PinCode" style="width: 100%;" />
            </td>
            <td class="text-center">
                <select class="select2-custom form-control" id="ddlState_${index}" style="width: 100%;"></select>
            </td>
             <td class="text-center">
                <select class="select2-custom form-control" id="ddlExtReason_${index}" style="width: 100%;"></select>
            </td>
            <td class="text-center">
                <input type="number" class="form-control" id="txtDistance_${index}" placeholder="Distance" style="width: 100%;" />
            </td>
           <td class="text-center">
                <input
                  class="form-check-input"
                  type="checkbox"
                  style="border: 1px solid black;"
                  value=""
                  onchange="OnChangeCheckbox(this, '${index}')">
           </td>
        </tr>
        `;
        tbody.append(row);
        GetAllStateList('ddlState_' + index);
    });
}
function OnChangeCheckbox(element, index) {
    const $checkbox = $(element); 
    console.log("Checkbox ID:", $checkbox.attr("id"));
    console.log("Index:", index);
}
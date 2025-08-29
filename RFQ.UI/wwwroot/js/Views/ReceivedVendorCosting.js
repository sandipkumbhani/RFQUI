$(document).ready(function () {
    loadVendorCosting();
});
function loadVendorCosting() {
    $.ajax({
        type: "POST",
        url: "/ReceivedVendorCosting/GetAllReceivedVendorCosting",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response != null && response.length > 0) {
                BindTable(response)
            } else {
                toastr.error("Somthing Went Wrong", "error");
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Somthing Went Wrong", "error");
        }
    });
}
function openModal(row) {
    $('#quoteVendorModal').modal('show');
    //$("#rfqrateId").val("123");
    $("#txtRFQNo").val(row.rfqNumber);
    $("#txtRFQDate").val(row.rfqDate.split('T')[0]);
    $("#txtExpireOn").val(row.rfqExpiredOn);
    $("#txtVehicleReqOn").val(row.vehicleRequiredOn.split('T')[0]);
    $("#txtVednorName").val(row.vendorName);
    $("#txtPANNo").val(row.panNo);
    $("#ddlOrigin").val(row.origin);
    $("#ddlDestination").val(row.destination);
    $("#ddlVehicleType").val(row.vehicleType);
    $("#txtNoOfVehicles").val(row.vehicleCount);
    $("#ddlItemName").val(row.itemName);
    $("#ddlPackingType").val(row.packingName);
    $("#txtInstruction").val(row.specialInstruction);
    $("#txtAvailableVehicle").val(row.availableVehicle);
    $("#txtHireCost").val(row.totalHireCost);
    $("#txtDetentionDay").val(row.detentionPerDay);
    $("#txtDetentionFreeDays").val(row.detentionFreeDays);
}
function BindTable(data) {
    const tbody = $("#rcostingReceivedTable tbody");
    tbody.empty();
    if (!data || data.length === 0) {
        $("#rcostingReceivedTable tbody").append('<tr><td colspan="16" class="text-center">No records found</td></tr>');
        return;
    }
    $.each(data, function (index, row) {
        const rowHtml = `
            <tr data-index="${index}">
                <td>${index + 1}</td>
                <td>${row.indentNumber}</td>
                <td>${row.indentDate ? new Date(row.indentDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
                <td>${row.rfqNumber}</td>
                <td>${row.rfqDate ? new Date(row.rfqDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
                <td>${row.customerName}</td>
                <td>${row.rfqExpiredOn ? new Date(row.rfqExpiredOn).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }).replace(/\//g, '-').replace(',', '').toUpperCase() : ''}</td>
                <td>${row.vehicleRequiredOn ? new Date(row.vehicleRequiredOn).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
                <td>${row.origin}</td>
                <td>${row.destination}</td>
                <td>${row.vehicleType}</td>
                <td>${row.availableVehicle}</td>
                <td>${row.vendorName}</td>
                <td>${row.totalHireCost}</td>
                <td>${row.vendorPosition}</td>
                <td><a href="#" class="view-quote" data-row='${JSON.stringify(row).replace(/'/g, "&apos;")}'>View Quote</a></td>
                <td style="text-align: center; vertical-align: middle;">
                            <label class="check-box-custom" style="display: inline-block;">
                                <input class="form-check-input" type="checkbox"  ${row.askForReBid ? "checked" : ""}>
                                    <span class="checkmark"></span>
                            </label>    
                </td>
            </tr>
        `;
        tbody.append(rowHtml);
    })
    $('.view-quote').off('click').on('click', function (e) {
        e.preventDefault();
        const rowData = $(this).data('row');
        openModal(rowData);
    });
}
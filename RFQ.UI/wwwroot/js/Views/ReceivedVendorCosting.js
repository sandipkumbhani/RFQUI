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
        tbody.append('<tr><td colspan="16" class="text-center">No records found</td></tr>');
        return;
    }

    data.forEach((row, index) => {
        
        const safeRow = $('<div>').text(JSON.stringify(row)).html(); // Prevent XSS
        const rowHtml = `
      <tr data-index="${index}" data-row='${safeRow}'>
        <td>${index + 1}</td>
        <td>${row.indentNumber}</td>
        <td>${row.indentDate ? new Date(row.indentDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
        <td>${row.rfqNumber}</td>
        <td>${row.rfqDate ? new Date(row.rfqDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
        <td>${row.customerName}</td>
        <td>${row.rfqExpiredOn ? new Date(row.rfqExpiredOn).toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        }).replace(/\//g, '-').replace(',', '').toUpperCase() : ''}</td>
        <td>${row.vehicleRequiredOn ? new Date(row.vehicleRequiredOn).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
        <td>${row.origin}</td>
        <td>${row.destination}</td>
        <td>${row.vehicleType}</td>
        <td>${row.availableVehicle}</td>
        <td>${row.vendorName}</td>
        <td>${row.totalHireCost}</td>
        <td>${row.vendorPosition}</td>
        <td>${row.specialInstruction}</td>
        <td>${row.detentionPerDay}</td>
        <td>${row.detentionFreeDays}</td>
        <td>${row.vehicleCount}</td>
        <td>${row.packingName}</td>
        <td>${row.itemName}</td>
        <td>${row.panNo}</td>



        <td>${row.email}</td>


        <td><a href="#" class="view-quote">View Quote</a></td>
        <td style="text-align:center;">
          <input type="checkbox" class="select-row" data-index="${index}" ${row.askForReBid ? 'checked' : ''}>
        </td>
      </tr>`;
        tbody.append(rowHtml);
        
    });

    // Event: view-quote
    $('#rcostingReceivedTable').off('click', '.view-quote').on('click', '.view-quote', function (e) {
        e.preventDefault();
        const rowData = JSON.parse($(this).closest('tr').attr('data-row'));
        openModal(rowData);
    });

    // Event: Send button click
    $(document).off('click', '.button-main .card-link').on('click', '.button-main .card-link', function (e) {
        e.preventDefault();

        const selectedData = $('#rcostingReceivedTable tbody tr').map((_, tr) => {
            const checkbox = $(tr).find('.select-row');
            if (checkbox.is(':checked')) {
                const rowData = $(tr).attr('data-row');
                return JSON.parse(rowData);
            }
        }).get().filter(Boolean);

        if (!selectedData.length) {
            toastr.warning('Please select at least one row.');
            return;
        }

        let successCount = 0;
        let failureCount = 0;

        selectedData.forEach((rowData, i) => {
            $.ajax({
                url: '/ReceivedVendorCosting/SendEmail',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(rowData),
                success: () => {
                    successCount++;
                    if (successCount + failureCount === selectedData.length) {
                        toastr.success(`${successCount} email(s) sent successfully.`);
                    }
                },
                error: function (xhr) {
                    failureCount++;
                    console.error("AJAX error:", xhr);
                    if (successCount + failureCount === selectedData.length) {
                        toastr.error(`${failureCount} email(s) failed to send.`);
                    }
                }
            });
        });
    });




}

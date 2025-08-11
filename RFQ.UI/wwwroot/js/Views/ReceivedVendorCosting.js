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
                FillCostingTable(response)
            } else {
                toster.error("Somthing Went Wrong", "error");
            }
        },
        error: function (xhr, status, error) {

        }
    });
}
function FillCostingTable(data) {
    // Destroy existing DataTable to avoid duplicates
    if ($.fn.DataTable.isDataTable('#costingReceivedTable')) {
        $('#costingReceivedTable').DataTable().clear().destroy();
    }

    // Clear table body
    $("#costingReceivedTableBody").empty();

    // Append new rows
    $.each(data, function (index, row) {
        console.log(data);
        $("#costingReceivedTableBody").append(`
            <tr>
                <td>${row.serialNumber}</td>
                <td>${row.indentNumber}</td>
                <td>${row.indentDate}</td>
                <td>${row.rfqNumber}</td>
                <td>${row.rfqDate}</td>
                <td>${row.customerName}</td>
                <td>${row.rfqExpiredOn}</td>
                <td>${row.vehicleRequiredOn}</td>
                <td>${row.origin}</td>
                <td>${row.destination}</td>
                <td>${row.vehicleType}</td>
                <td>${row.availableVehicle}</td>
                <td>${row.vendorName}</td>
                <td>${row.totalHireCost}</td>
                <td>0</td>
                <td><a href="#" class="view-quote" data-row='${JSON.stringify(row).replace(/'/g, "&apos;")}'>View Quote</a></td>
                <td>
                    <input type="checkbox" ${row.askForReBid ? "checked" : ""}>
                </td>
            </tr>
        `);
    });

    // Initialize DataTable
    const table = $('#costingReceivedTable').DataTable({
        responsive: false,
        paging: true,
        ordering: false,
        searching: false,
        info: false,
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move pagination to custom div
    $('#costingReceivedTable_paginate').appendTo('#customPagination');

    // Handle page length change
    $('#pageLength').off('change').on('change', function () {
        table.page.len(this.value).draw();
    });

    // Attach click event for "View Quote"
    $('.view-quote').off('click').on('click', function (e) {
        e.preventDefault();
        const rowData = $(this).data('row');
        openModal(rowData);
    });
}


function openModal(row) {
    debugger;

    $('#quoteVendorModal').modal('show');
 //   $("#rfqrateId").val("123");
    $("#txtRFQNo").val(row.rfqNumber);
    $("#txtRFQDate").val(row.rfqDate);
    $("#txtExpireOn").val(row.rfqExpiredOn);
    $("#txtVehicleReqOn").val(row.vehicleRequiredOn);
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



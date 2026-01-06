$(document).ready(function () {
    
}); 

$(document).ready(function () {
    const table = $('#remindersTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#remindersTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#remindersTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("remindersTable", csvData);
                }
            },
        ],

        paging: true,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exportButtons');

    // Search
    $('#customSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Move pagination to custom div
    $('#remindersTable_paginate').appendTo('#customPagination');

    // Filter dropdown logic
    $('.filter-option').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();

        // Update filter label after selection
        $('#filterDropdown').text(label === 'All Status' ? 'Filter' : `${label}`);

        // Apply DataTables column filter (status is column 2)
        table.column(2).search(value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });

    // Update total reminders
    $('#totalReminders').text(`Total Reminders: ${table.rows().count()}`);
});
$(document).ready(function () {
    const table = $('#franchiseTable').DataTable({
        responsive: true,
        processing: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#franchiseTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#franchiseTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("franchiseTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        ordering:true,
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exportFranchiseButtons');

    // Search
    $('#franchiseTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
});
$(document).ready(function () {
    const table = $('#driverTable').DataTable({
        responsive: true,
        processing: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#driverTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#driverTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("driverTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }

        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exportDriverButtons');

    // Search
    $('#driverTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });

    
});
$(document).ready(function () {
    const table = $('#vendorTable').DataTable({
        responsive: true,
        processing: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#vendorTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#vendorTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("vendorTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exportVendorButtons');

    // Search
    $('#customVendorSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
});
$(document).ready(function () {
    const table = $('#customerTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            {
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#customerTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#customerTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("customerTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exportCustomerButtons');

    // Search
    $('#customerTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
});
$(document).ready(function () {

    const table = $('#vehicleTypesTable').DataTable({
        responsive: true,
        processing: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#vehicleTypesTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#vehicleTypesTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("vehicleTypesTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        ordering: true,
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Export buttons
    table.buttons().container().appendTo('#exportvehicleTypesButtons');

    // Global search
    $('#vehicleTypesTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Status filter dropdown
    $('.filter-option-vehicletypes').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();

        $('#filterVehicleTypesDropdown').text(label === 'All Status' ? 'Filter' : `${label}`);
        table.column(2).search(value).draw(); // Filter by column 2 (example)
    });

    // Page length selector
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
});
$(document).ready(function () {

    $.fn.DataTable.ext.pager.numbers_length = 3;

    const table = $('#applicableRouteTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#applicableRouteTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#applicableRouteTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("applicableRouteTable", csvData);
                }
            },
        ],
        paging: true,
        info: true,
        lengthChange: false,
        pageLength: 3,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exportapplicableRouteButtons');

    // Search
    $('#customapplicableRouteSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Move pagination to custom div
    $('#applicableRouteTable_paginate').appendTo('#customapplicableRoutePagination');

    // Filter dropdown logic
    $('.filter-option-applicableroute').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();

        // Update filter label after selection
        $('#filterApplicableRouteDropdown').text(label === 'All Status' ? 'Filter' : `${label}`);

        // Apply DataTables column filter (status is column 2)
        table.column(2).search(value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });

    // Update total reminders
    $('#totalapplicableRouteReminders').text(`Total List: ${table.rows().count()}`);
});
$(document).ready(function () {
    const table = $('#corporateTable').DataTable({
        responsive: false,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#corporateTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#corporateTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("corporateTable", csvData);
                }
            }
        ],

        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, className: 'details-control', targets: 0 }, // Expand control
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Add child row toggle
    $('#corporateTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown fulltable');
        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown fulltable'); // Add your custom class here
        }
    });


    // Move export buttons
    table.buttons().container().appendTo('#exportcorporateButtons');

    // Search
    $('#customcorporateSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Move pagination
    $('#corporateTable_paginate').appendTo('#customcorporatePagination');

    // Filter dropdown
    $('.filter-option-corporate').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        $('#filterDropdownCorporate').text(label === 'All Status' ? 'Filter' : `${label}`);
        table.column(2).search(value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });

    // Update total reminders
    $('#totalRemindersCorporate').text(`Total List: ${table.rows().count()}`);
});
$(document).ready(function () {
    $.fn.DataTable.ext.pager.numbers_length = 3;

    const table = $('#vehicleTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#vehicleTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#vehicleTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("vehicleTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 3,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' },
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exporttableVehicleButtons');

    // Search
    $('#vehicleTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

});
$(document).ready(function () {
    $.fn.DataTable.ext.pager.numbers_length = 3;
    const table = $('#tablelocation').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            {
               // extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#tablelocation thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#tablelocation tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("tablelocation", csvData);
                }
            },
        ],
        paging: true,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });
    // Move export buttons
    table.buttons().container().appendTo('#exporttablelocation');
    // Search
    $('#customSearch').on('keyup', function () {
        table.search(this.value).draw();
    });
    // Move pagination to custom div
    $('#tablelocation_paginate').appendTo('#customPagination');
    // Filter dropdown logic
    $('.filter-option-applicableroute').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        // Update filter label after selection
        $('#filterApplicableRouteDropdown').text(label === 'All Status' ? 'Filter' : `${label}`);
        // Apply DataTables column filter (status is column 2)
        table.column(2).search(value).draw();
    });
    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
    // Update total reminders
    $('#totalapplicableRouteReminders').text(`Total List: ${table.rows().count()}`);
});
$(document).ready(function () {
    $.fn.DataTable.ext.pager.numbers_length = 3;
    const table = $('#tableuser').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#tableuser thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#tableuser tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("tableuser", csvData);
                }
            },
        ],
        paging: true,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });
    // Move export buttons
    table.buttons().container().appendTo('#exporttableuser');
    // Search
    $('#customSearch').on('keyup', function () {
        table.search(this.value).draw();
    });
    // Move pagination to custom div
    $('#tableuser_paginate').appendTo('#customPagination');
    // Filter dropdown logic
    $('.filter-option-applicableroute').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        // Update filter label after selection
        $('#filterApplicableRouteDropdown').text(label === 'All Status' ? 'Filter' : `${label}`);
        // Apply DataTables column filter (status is column 2)
        table.column(2).search(value).draw();
    });
    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
    // Update total reminders
    $('#totalapplicableRouteReminders').text(`Total List: ${table.rows().count()}`);
});
$(document).ready(function () {
    $.fn.DataTable.ext.pager.numbers_length = 3;
    const table = $('#tableCmpConfig').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#tableCmpConfig thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#tableCmpConfig tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("tableCmpConfig", csvData);
                }
            },
        ],
        paging: true,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });
    // Move export buttons
    table.buttons().container().appendTo('#exporttableCC');
    // Search
    $('#customSearch').on('keyup', function () {
        table.search(this.value).draw();
    });
    // Move pagination to custom div
    $('#tableCmpConfig_paginate').appendTo('#customPagination');
    // Filter dropdown logic
    $('.filter-option-applicableroute').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        // Update filter label after selection
        $('#filterApplicableRouteDropdown').text(label === 'All Status' ? 'Filter' : `${label}`);
        // Apply DataTables column filter (status is column 2)
        table.column(2).search(value).draw();
    });
    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
    // Update total reminders
    $('#totalapplicableRouteReminders').text(`Total List: ${table.rows().count()}`);
});
$(document).ready(function () {
    $.fn.DataTable.ext.pager.numbers_length = 3;
    const table = $('#productTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#productTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#productTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("productTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, targets: [] } // all sortable
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });
    // Move export buttons
    table.buttons().container().appendTo('#exporttableproduct');
    // Search
    $('#productTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });
});
$(document).ready(function () {
    const table = $('#awardedVendorTable').DataTable({
        responsive: false,
        paging: false,
        ordering: false
    });
});
$(document).ready(function () {
    const table = $('#rcostingReceivedTable').DataTable({
        responsive: false,
        paging: false,
        ordering: false
    });
});
$(document).ready(function () {
    const table = $('#rfqTable').DataTable({
        responsive: false,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#rfqTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#rfqTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("rfqTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exportRfqButtons');

    // Search
    $('#rfqTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
});
$(document).ready(function () {
    const table = $('#rfqFinalizationTable').DataTable({
        responsive: false,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#rfqFinalizationTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#rfqFinalizationTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("rfqFinalizationTable", csvData);
                }
            },
        ],
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Move export buttons
    table.buttons().container().appendTo('#exportRfqFinalizationButtons');

    // Search
    $('#rfqFinalizationTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });
});
$(document).ready(function () {
    const table = $('#IndentTable').DataTable({
        responsive: false,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#IndentTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#IndentTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("IndentTable", csvData);
                }
            }
        ],

        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, className: 'details-control', targets: 0 }, // Expand control
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Add child row toggle
    $('#IndentTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown fulltable');
        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown fulltable'); // Add your custom class here
        }
    });


    // Move export buttons
    table.buttons().container().appendTo('#exportIndentButtons');

    // Search
    $('#IndentTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Move pagination
    $('#IndentTable_paginate').appendTo('#customPagination');

    // Filter dropdown
    $('.filter-option-corporate').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        $('#filterDropdownCorporate').text(label === 'All Status' ? 'Filter' : `${label}`);
        table.column(2).search(value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });

    
});

$(document).ready(function () {
    const table = $('#PlacementTable').DataTable({
        responsive: false,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#PlacementTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#PlacementTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("PlacementTable", csvData);
                }
            }
        ],

        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, className: 'details-control', targets: 0 }, // Expand control
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Add child row toggle
    $('#PlacementTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown fulltable');
        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown fulltable'); // Add your custom class here
        }
    });


    // Move export buttons
    table.buttons().container().appendTo('#exportPlacementButtons');

    // Search
    $('#PlacementTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Move pagination
    $('#PlacementTable_paginate').appendTo('#customPagination');

    // Filter dropdown
    $('.filter-option-corporate').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        $('#filterDropdownCorporate').text(label === 'All Status' ? 'Filter' : `${label}`);
        table.column(2).search(value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });


});
$(document).ready(function () {
    const table = $('#ActivityLogTable').DataTable({
        responsive: false,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#ActivityLogTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#ActivityLogTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("ActivityLogTable", csvData);
                }
            }
        ],

        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, className: 'details-control', targets: 0 }, // Expand control
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Add child row toggle
    $('#ActivityLogTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown fulltable');
        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown fulltable'); // Add your custom class here
        }
    });


    // Move export buttons
    table.buttons().container().appendTo('#exportPlacementButtons');

    // Search
    $('#PlacementTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Move pagination
    $('#PlacementTable_paginate').appendTo('#customPagination');

    // Filter dropdown
    $('.filter-option-corporate').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        $('#filterDropdownCorporate').text(label === 'All Status' ? 'Filter' : `${label}`);
        table.column(2).search(value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });


});

$(document).ready(function () {
    const table = $('#BookingTable').DataTable({
        responsive: false,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#BookingTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#BookingTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("BookingTable", csvData);
                }
            }
        ],

        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, className: 'details-control', targets: 0 }, // Expand control
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Add child row toggle
    $('#BookingTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown fulltable');
        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown fulltable'); // Add your custom class here
        }
    });


    // Move export buttons
    table.buttons().container().appendTo('#exportIndentButtons');

    // Search
    $('#BookingTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Move pagination
    $('#BookingTable_paginate').appendTo('#customPagination');

    // Filter dropdown
    $('.filter-option-corporate').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        $('#filterDropdownCorporate').text(label === 'All Status' ? 'Filter' : `${label}`);
        table.column(2).search(value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });


});

$(document).ready(function () {
    const table = $('#DeliveryTable').DataTable({
        responsive: false,
        dom: 'Bfrtip',
        buttons: [
            {
                //extend: 'csv',
                text: '<i class="ri-file-excel-line"></i> Export All',
                action: function (e, dt, node, config) {
                    let headers = [];
                    let csvData = [];

                    $('#DeliveryTable thead th').each(function () {
                        headers.push($(this).text().trim());
                    });
                    csvData.push(headers); // push header row as array

                    $('#DeliveryTable tbody tr').each(function () {
                        let row = [];
                        $(this).find('td').each(function () {
                            row.push($(this).text().trim() || "");
                        });
                        csvData.push(row); // push row as array
                    });

                    exportToCSV("DeliveryTable", csvData);
                }
            }
        ],

        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            // { orderable: false, className: 'details-control', targets: 0 }, // Expand control
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });

    // Add child row toggle
    $('#DeliveryTable tbody').on('click', 'td.details-control', function () {
        const tr = $(this).closest('tr');
        const row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
            tr.removeClass('shown fulltable');
        } else {
            row.child(format(row.data())).show();
            tr.addClass('shown fulltable'); // Add your custom class here
        }
    });


    // Move export buttons
    table.buttons().container().appendTo('#exportIndentButtons');

    // Search
    $('#DeliveryTableSearch').on('keyup', function () {
        table.search(this.value).draw();
    });

    // Move pagination
    $('#DeliveryTable_paginate').appendTo('#customPagination');

    // Filter dropdown
    $('.filter-option-corporate').on('click', function () {
        const value = $(this).data('value');
        const label = $(this).text();
        $('#filterDropdownCorporate').text(label === 'All Status' ? 'Filter' : `${label}`);
        table.column(2).search(value).draw();
    });

    // Page length
    $('#pageLength').on('change', function () {
        table.page.len(this.value).draw();
    });


});

$(document).ready(function () {
    const table = $('#tripDetailsTable').DataTable({
        responsive: false,
        paging: false,
        info: true,
        lengthChange: false,
        pageLength: 10,
        columnDefs: [
            { orderable: false, targets: 'no-sort' }
        ],
        language: {
            paginate: {
                previous: '<i class="ri-arrow-left-s-line"></i>',
                next: '<i class="ri-arrow-right-s-line"></i>'
            }
        }
    });
});
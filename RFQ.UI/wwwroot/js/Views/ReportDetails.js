var AppState = {
    reportName: '',
    columns: [],
    columnTypes: {},

    originalData: [],
    filteredData: [],
    sortedData: [],
    currentData: [],

    searchTerm: '',
    currentPage: 1,
    recordsPerPage: 10,
    sortConfig: {
        key: null,
        direction: null
    },

    loading: true,
    error: false,
    errorMessage: ''
};


$(document).ready(function () {
    companyId = getCookieValue('companyid');
    GetAllLocation("ddlLocation", companyId);
    initializeRecordsPerPageDropdown();
    bindEvents();
    $('#btnSearch').on('click', function () {
        $('#rfqCardDetailsTableDiv').removeClass('d-none');
        render();
        loadDataFromAPI();
    });
    $('#btnReset').on('click', function () {
        $('#ddlLocation').val(0).trigger('change');
        $('#fromDate').val('');
        $('#toDate').val('');
        $('#rfqCardDetailsTableDiv').addClass('d-none');
    });
});

function loadDataFromAPI() {
    var LinkId = $('#LinkId').val();
    var ddlLocation = $('#ddlLocation').val();
    var fromDate = $('#fromDate').val();
    var toDate = $('#toDate').val();

    var formData = {
        LinkItemId: LinkId,
        LocationId: IsNullOrEmpty(ddlLocation) ? 0 : ddlLocation,
        FromDate: IsNullOrEmpty(fromDate) ? null : fromDate,
        ToDate: IsNullOrEmpty(toDate) ? null : toDate
    };

    $.ajax({
        url: '/Report/GetReportDetails',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            if (response.success) {
                var reportData = response.data;
                AppState.reportName = reportData.reportName;
                AppState.columns = reportData.columns;
                AppState.originalData = reportData.rows;
                AppState.currentPage = 1;
                AppState.loading = false;
                AppState.error = false;
                processData();
            } else {
                console.error('Error:', response.message);
                AppState.loading = false;
                AppState.error = true;
                AppState.errorMessage = 'Failed to load report data. Please try again.';
            }
            render();
        },
        error: function (xhr, status, error) {
            console.error('API Error:', error);
            console.error('Status:', status);
            console.error('Response:', xhr.responseText);

            AppState.loading = false;
            AppState.error = true;

            if (status === 'timeout') {
                AppState.errorMessage = 'Request timeout. Please try again.';
            } else if (xhr.status === 404) {
                AppState.errorMessage = 'API endpoint not found. Please check the configuration.';
            } else if (xhr.status >= 500) {
                AppState.errorMessage = 'Server error. Please contact support.';
            } else if (status === 'error' && xhr.status === 0) {
                AppState.errorMessage = 'Network error. Please check your connection.';
            } else {
                AppState.errorMessage = 'Failed to load report data. Please try again.';
            }

            render();
        }
    });
}

/**
 * Highlight search term in text
 */
function highlightText(text, searchTerm) {
    if (!searchTerm.trim()) return text;

    var regex = new RegExp('(' + searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.toLocaleString().replace(regex, '<mark>$1</mark>');
}

/**
 * Get sort icon HTML
 */
function getSortIcon(key) {
    if (AppState.sortConfig.key !== key) {
        return '<i class="fas fa-sort sort-icon"></i>';
    }
    if (AppState.sortConfig.direction === 'asc') {
        return '<i class="fas fa-sort-up sort-icon"></i>';
    }
    if (AppState.sortConfig.direction === 'desc') {
        return '<i class="fas fa-sort-down sort-icon"></i>';
    }
    return '<i class="fas fa-sort sort-icon"></i>';
}

/**
 * Filter data based on search term
 */
function filterData() {
    if (!AppState.searchTerm.trim()) {
        AppState.filteredData = AppState.originalData.slice();
        return;
    }

    var searchLower = AppState.searchTerm.toLowerCase();
    AppState.filteredData = AppState.originalData.filter(function (row) {
        return AppState.columns.some(function (column) {
            var value = row[column];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().indexOf(searchLower) !== -1;
        });
    });
}

/**
 * Sort data based on current sort configuration
 */
function sortData() {
    if (!AppState.sortConfig.key || !AppState.sortConfig.direction) {
        AppState.sortedData = AppState.filteredData.slice();
        return;
    }

    AppState.sortedData = AppState.filteredData.slice().sort(function (a, b) {
        var aValue = a[AppState.sortConfig.key];
        var bValue = b[AppState.sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        var comparison = 0;

        
        var aNum = parseFloat(aValue);
        var bNum = parseFloat(bValue);

        if (!isNaN(aNum) && !isNaN(bNum)) {
            comparison = aNum - bNum;
        } else {
            comparison = String(aValue).localeCompare(String(bValue));
        }

        return AppState.sortConfig.direction === 'asc' ? comparison : -comparison;
    });
}

/**
 * Paginate data
 */
function paginateData() {
    var startIndex = (AppState.currentPage - 1) * AppState.recordsPerPage;
    var endIndex = startIndex + AppState.recordsPerPage;
    AppState.currentData = AppState.sortedData.slice(startIndex, endIndex);
}

/**
 * Process all data (filter, sort, paginate)
 */
function processData() {
    filterData();
    sortData();
    paginateData();
}

/**
 * Render table headers
 */
function renderHeaders() {
    var html = '';
    AppState.columns.forEach(function (column) {
        var sortedClass = AppState.sortConfig.key === column ? 'sorted' : '';
        var sortIcon = getSortIcon(column);

        html += '<th class="sortable ' + sortedClass + '" data-key="' + column + '">';
        html += '<div class="d-flex align-items-center">';
        html += '<span>' + column + '</span>';
        html += sortIcon;
        html += '</div>';
        html += '</th>';
    });

    $('#tableHeader').html(html);
}

/**
 * Render table body
 */
function renderTableBody() {
    if (AppState.currentData.length === 0) {
        $('#tableBody').html('');
        return;
    }

    var html = '';
    AppState.currentData.forEach(function (row) {
        html += '<tr>';
        AppState.columns.forEach(function (column) {
            var value = row[column];
            var columnType = AppState.columnTypes[column];
            var highlightedValue = highlightText(value, AppState.searchTerm);
            html += '<td>' + highlightedValue + '</td>';
        });
        html += '</tr>';
    });

    $('#tableBody').html(html);
}

/**
 * Get page numbers for pagination
 */
function getPageNumbers() {
    var totalPages = Math.ceil(AppState.sortedData.length / AppState.recordsPerPage);
    var pages = [];
    var maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
        for (var i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (AppState.currentPage <= 3) {
            for (var i = 1; i <= 4; i++) {
                pages.push(i);
            }
            pages.push('...');
            pages.push(totalPages);
        } else if (AppState.currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (var i = totalPages - 3; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            pages.push('...');
            pages.push(AppState.currentPage - 1);
            pages.push(AppState.currentPage);
            pages.push(AppState.currentPage + 1);
            pages.push('...');
            pages.push(totalPages);
        }
    }

    return pages;
}

/**
 * Render pagination
 */
function renderPagination() {
    var totalPages = Math.ceil(AppState.sortedData.length / AppState.recordsPerPage);

    if (totalPages <= 1) {
        $('#paginationContainer').hide();
        return;
    }

    $('#paginationContainer').show();

    $('#pageInfo').html('Page <span class="fw-bold">' + AppState.currentPage + '</span> of <span class="fw-bold">' + totalPages + '</span>');

    var html = '';
    var prevDisabled = AppState.currentPage === 1 ? 'disabled' : '';
    html += '<li class="page-item ' + prevDisabled + '">';
    html += '<a class="page-link" href="#" data-page="prev"><i class="fas fa-chevron-left"></i></a>';
    html += '</li>';

    var pages = getPageNumbers();
    pages.forEach(function (page) {
        if (page === '...') {
            html += '<li class="page-item disabled">';
            html += '<span class="page-link page-ellipsis">...</span>';
            html += '</li>';
        } else {
            var activeClass = AppState.currentPage === page ? 'active' : '';
            html += '<li class="page-item ' + activeClass + '">';
            html += '<a class="page-link" href="#" data-page="' + page + '">' + page + '</a>';
            html += '</li>';
        }
    });
    var nextDisabled = AppState.currentPage === totalPages ? 'disabled' : '';
    html += '<li class="page-item ' + nextDisabled + '">';
    html += '<a class="page-link" href="#" data-page="next"><i class="fas fa-chevron-right"></i></a>';
    html += '</li>';

    $('#paginationList').html(html);
}

/**
 * Update records info
 */
function updateRecordsInfo() {
    var totalRecords = AppState.sortedData.length;
    var startIndex = (AppState.currentPage - 1) * AppState.recordsPerPage;
    var endIndex = Math.min(startIndex + AppState.recordsPerPage, totalRecords);

    var infoText = 'Showing ' + (startIndex + 1) + ' to ' + endIndex + ' of ' + totalRecords + ' entries';

    if (AppState.searchTerm) {
        infoText += ' (filtered from ' + AppState.originalData.length + ' total entries)';
    }

    $('#recordsInfo').text(infoText);
}

/**
 * Update report title
 */
function updateReportTitle() {
    $('#reportTitle').text(AppState.reportName || 'Report');
}

/**
 * Show/hide states (loading, error, empty, table)
 */
function updateDisplayState() {
    if (AppState.loading) {
        $('#loadingState').show();
        $('#errorState').hide();
        $('#emptyState').hide();
        $('#tableContainer').hide();
        $('#exportExcel').prop('disabled', true);
        $('#exportPDF').prop('disabled', true);
        $('#searchInput').prop('disabled', true);
        return;
    }

    if (AppState.error) {
        $('#loadingState').hide();
        $('#errorState').show();
        $('#emptyState').hide();
        $('#tableContainer').hide();
        $('#errorMessage').text(AppState.errorMessage);
        $('#exportExcel').prop('disabled', true);
        $('#exportPDF').prop('disabled', true);
        $('#searchInput').prop('disabled', true);
        return;
    }

    if (AppState.sortedData.length === 0) {
        $('#loadingState').hide();
        $('#errorState').hide();
        $('#emptyState').show();
        $('#tableContainer').hide();
        $('#exportExcel').prop('disabled', true);
        $('#exportPDF').prop('disabled', true);
        $('#searchInput').prop('disabled', false);

        if (AppState.searchTerm) {
            $('#emptyMessage').text('No results match your search for "' + AppState.searchTerm + '"');
            $('#clearSearchBtn').show();
        } else {
            $('#emptyMessage').text('No data available to display');
            $('#clearSearchBtn').hide();
        }
    } else {
        $('#loadingState').hide();
        $('#errorState').hide();
        $('#emptyState').hide();
        $('#tableContainer').show();
        $('#exportExcel').prop('disabled', false);
        $('#exportPDF').prop('disabled', false);
        $('#searchInput').prop('disabled', false);
    }
}

/**
 * Render complete UI
 */
function render() {
    updateDisplayState();
    updateReportTitle();

    if (!AppState.loading && !AppState.error && AppState.sortedData.length > 0) {
        renderHeaders();
        renderTableBody();
        renderPagination();
        updateRecordsInfo();
    }
}

/**
 * Handle search input
 */
function handleSearch() {
    var value = $(this).val();
    AppState.searchTerm = value;
    AppState.currentPage = 1; 

    
    if (value) {
        $('#clearSearch').show();
    } else {
        $('#clearSearch').hide();
    }

    processData();
    render();
}

/**
 * Handle clear search
 */
function handleClearSearch() {
    AppState.searchTerm = '';
    $('#searchInput').val('');
    $('#clearSearch').hide();
    AppState.currentPage = 1;

    processData();
    render();
}

/**
 * Handle column sort
 */
function handleSort(key) {
    var direction = 'asc';

    if (AppState.sortConfig.key === key) {
        if (AppState.sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (AppState.sortConfig.direction === 'desc') {
            direction = null;
        }
    }

    AppState.sortConfig = {
        key: direction ? key : null,
        direction: direction
    };

    processData();
    render();
}

/**
 * Handle records per page change
 */
function handleRecordsPerPageChange() {
    AppState.recordsPerPage = parseInt($(this).val());
    AppState.currentPage = 1; 

    processData();
    render();
}

/**
 * Handle page change
 */
function handlePageChange(e) {
    e.preventDefault();

    var page = $(this).data('page');
    var totalPages = Math.ceil(AppState.sortedData.length / AppState.recordsPerPage);

    if (page === 'prev') {
        AppState.currentPage = Math.max(1, AppState.currentPage - 1);
    } else if (page === 'next') {
        AppState.currentPage = Math.min(totalPages, AppState.currentPage + 1);
    } else {
        AppState.currentPage = page;
    }

    processData();
    render();

    $('html, body').animate({
        scrollTop: $('#reportTable').offset().top - 100
    }, 300);
}

/**
 * Handle Excel export
 */
function handleExportExcel() {
    if (AppState.sortedData.length === 0) {
        alert("No data available to display");
        return;
    }

    try {
        var exportData = AppState.sortedData.map(function (row) {
            var exportRow = {};
            AppState.columns.forEach(function (column) {
                exportRow[column] = row[column];
            });
            return exportRow;
        });

        var worksheet = XLSX.utils.json_to_sheet(exportData);
        var range = XLSX.utils.decode_range(worksheet['!ref']);
        for (var col = range.s.c; col <= range.e.c; col++) {
            var cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); 
            if (!worksheet[cellAddress]) continue;

            worksheet[cellAddress].s = {
                font: { bold: true },
                fill: { fgColor: { rgb: "E9ECEF" } },
                alignment: { horizontal: "center" },
                border: {
                    top: { style: "thin", color: { rgb: "000000" } },
                    bottom: { style: "thin", color: { rgb: "000000" } },
                    left: { style: "thin", color: { rgb: "000000" } },
                    right: { style: "thin", color: { rgb: "000000" } }
                }
            };
        }
        
        var maxWidth = 50;
        var columnWidths = AppState.columns.map(function (column) {
            var headerWidth = column.length;
            var maxContentWidth = Math.max.apply(Math, exportData.map(function (row) {
                return String(row[column] || '').length;
            }));
            return { wch: Math.min(Math.max(headerWidth, maxContentWidth) + 2, maxWidth) };
        });
        worksheet['!cols'] = columnWidths;

        var workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, AppState.reportName);
        
        var filename = '';
        if (AppState.reportName) {
            filename = AppState.reportName.replace(/\s+/g, '_');
            filename += '_' + formatDateTime();
        }
        filename += '.xlsx';
        
        XLSX.writeFile(workbook, filename);
    } catch (error) {
        console.error('Export failed:', error);
        alert('Failed to export data. Please try again.');
    }
}
function formatDateTime() {
    let d = new Date();
    let day = String(d.getDate()).padStart(2, '0');
    let month = String(d.getMonth() + 1).padStart(2, '0');
    let year = d.getFullYear();
    let hours = String(d.getHours()).padStart(2, '0');
    let minutes = String(d.getMinutes()).padStart(2, '0');
    let seconds = String(d.getSeconds()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}-${minutes}-${seconds}`;
}

/**
 * Handle retry button click
 */
function handleRetry() {
    AppState.error = false;
    AppState.errorMessage = '';
    AppState.loading = true;
    render();
    loadDataFromAPI();
}

/**
 * Bind all event handlers
 */
function bindEvents() {
    $('#searchInput').on('input', handleSearch);
    $('#clearSearch').on('click', handleClearSearch);
    $('#clearSearchBtn').on('click', handleClearSearch);

    $('#recordsPerPage').on('change', handleRecordsPerPageChange);

    $('#exportExcel').on('click', handleExportExcel);
    $('#exportPDF').on('click', handleExportPDF);

    $('#retryBtn').on('click', handleRetry);

    $(document).on('click', '#tableHeader th.sortable', function () {
        var key = $(this).data('key');
        handleSort(key);
    });
    $(document).on('click', '#paginationList .page-link', handlePageChange);
}

/**
 * Initialize records per page dropdown from config
 */
function initializeRecordsPerPageDropdown() {
    var html = '';
    var recordsPerPageOptions = [10, 25, 50, 100];
    recordsPerPageOptions.forEach(function (option) {
        var selected = option === 10 ? 'selected' : '';
        html += '<option value="' + option + '" ' + selected + '>' + option + '</option>';
    });
    $('#recordsPerPage').html(html);
}
function handleExportPDF() {
    if (AppState.sortedData.length === 0) {
        alert("No data available to export");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'pt', 'a4');

    doc.setFontSize(14);
    doc.text(AppState.reportName || "Report", 40, 30);

    const headers = [AppState.columns];

    const rows = AppState.sortedData.map(row => {
        return AppState.columns.map(col => row[col]);
    });

    doc.autoTable({
        head: headers,
        body: rows,
        startY: 50,
        styles: {
            fontSize: 8
        },
        headStyles: {
            fillColor: [52, 58, 64],  
            textColor: [255, 255, 255],
            fontStyle: 'bold',         
            halign: 'center',          
            valign: 'middle'
        },
        theme: 'grid'
    });

    let filename = (AppState.reportName || "Report").replace(/\s+/g, '_') + '_' + formatDateTime() + '.pdf';
    doc.save(filename);
}
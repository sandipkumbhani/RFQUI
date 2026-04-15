var state = {
    columns: [],
    tableData: [],
    filteredData: [],
    currentPage: 1,
    searchText: "",
    pageSize: 10
}
$(document).ready(function () {

});
function PopUpModel(cardId, cardHeaderName) {
    $("#PopupModal").modal("show");
    $("#popupModalLabel").text(cardHeaderName);
    loadDynamicTable('rfqDashboardTable', cardId);
}

function loadDynamicTable(tableId, cardId) {
    $.ajax({
        url: `/Dashboard/GetDashboardCardDetails?cardId=${cardId}`,
        type: "GET",
        success: function (response) {
            state.columns = mapColumns(response.data.columns);
            state.tableData = mapRows(response.data.rows);
            state.filteredData = mapRows(response.data.rows);
            builTableStructure();
            bindSearch();
            bindPageSize();
            randerTableData();
            initTables();
        },
        error: function () {
            alert("Error loading data");
        }
    });
}
function mapColumns(columns) {
    return columns.map(col => {
        let key = col.replace(/\s+/g, '_');
        return { title: col, data: key };
    });
}

function mapRows(rows) {
    return rows.map(row => {
        let newRow = {};
        Object.keys(row).forEach(key => {
            newRow[key.replace(/\s+/g, '_')] = row[key];
        });
        return newRow;
    });
}


function builTableStructure() {
    $('#rfqCardDetailsTableDiv').html('');
    var html = `
        <div class="table-card">
            <div class="com-profile-info">
                <div class="table-top-header">
                    <div class="d-flex gap-2">
                        <div class="table-search-box">
                            <input type="text" id="rfqDashboardTable_Search" class="form-control form-control-sm" placeholder="Search...">
                            <button type="submit"><i class="ri-search-line"></i></button>
                        </div>
                        <div id="exportButtons" class="btn-group" role="group"></div>
                        <div class="d-flex align-items-center gap-2" style="width: 100%;">
                            <label class="mb-0">Show per page:</label>
                            <select id="rfqDashboardTable_pageSize" class="form-select form-select-sm" style="width:auto;">
                                <option value="5">5</option>
                                <option value="10" selected>10</option>
                                <option value="25">25</option>
                                <option value="-1">All</option>
                            </select>
                            <span>entries</span>
                        </div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table id="rfqDashboardTable" class="table dt-responsive w-100">
                        <thead class="text-center">
                            ${generateHeaderColumns()}
                        </thead>
                        <tbody class="text-center" id="tableBody"></tbody>
                    </table>
                </div>
                <div class="table-pagination">
                    <div class="pagination-info"
                            id="rfqDashboardTable_info">
                    </div>
                    <nav>
                        <ul class="pagination" id="rfqDashboardTable_pagination">
                        </ul>
                    </nav>
                </div>
            </div>
        </div>`;
    $('#rfqCardDetailsTableDiv').html(html);
    state.pageSize = 10;
}
function generateHeaderColumns() {
    var html = "";
    state.columns.forEach(col => {
        html += `
                <th class="sortable" data-column="${col.data}" style="cursor:pointer;">
                    ${col.title}
                </th>`;
    });

    return html;
}
function bindSearch() {
    $("#rfqDashboardTable_Search").on("keyup", function () {
        state.searchText = $(this).val().toLowerCase();
        state.filteredData = state.tableData.filter(row => {
            return state.columns.some(col => {
                var val = row[col.data];
                return val && val.toString().toLowerCase().includes(state.searchText);
            });
        });
        state.currentPage = 1;
        randerTableData();
    });
}
function bindPageSize() {
    $("#rfqDashboardTable_pageSize").on("change", function () {
        state.pageSize = parseInt($(this).val());
        state.currentPage = 1; // reset to first page
        randerTableData();
    });
}
function randerTableData() {
    var tbody = "";
    var start = (state.currentPage - 1) * state.pageSize;
    var end = start + state.pageSize;
    if (end < 0) {
        var pageData = state.filteredData;
    } else {
        var pageData = state.filteredData.slice(start, end);
    }
    pageData.forEach((row, rowIndex) => {
        tbody += `<tr>`;
        state.columns.forEach(col => {
            var value = row[col.data];
            tbody += `<td data-label="${col.data}" class="tooltip-cell" title="${value}">${value}</td>`;
        });
        tbody += `</tr>`;
    });
    $("#rfqDashboardTable tbody").html(tbody);
    updateInfo();
    renderPagination();
}
function updateInfo() {
    var start = (state.currentPage - 1) * state.pageSize + 1;
    var end = Math.min(state.currentPage * state.pageSize, state.filteredData.length);
    if (end < 0) {
        end = state.filteredData.length;
    }
    $("#rfqDashboardTable_info").html(
        `Showing ${start} to ${end} of ${state.filteredData.length} entries`
    );
}
function renderPagination() {
    var totalPages = Math.ceil(state.filteredData.length / state.pageSize);
    var current = state.currentPage;
    var html = "";
    if (totalPages <= 1) {
        $("#rfqDashboardTable_pagination").html("");
        return;
    }
    html += `<li class="page-item ${current === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${current - 1}">Prev</a>
                </li>`;
    var start = Math.max(1, current - 2);
    var end = Math.min(totalPages, current + 2);
    if (start > 1) {
        html += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
        if (start > 2) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    for (var i = start; i <= end; i++) {
        html += `<li class="page-item ${current === i ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>`;
    }
    if (end < totalPages) {
        if (end < totalPages - 1) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        html += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
    }
    html += `<li class="page-item ${current === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${current + 1}">Next</a>
                </li>`;
    $("#rfqDashboardTable_pagination").html(html);
    bindPagination();
}

function bindPagination() {
    $("#rfqDashboardTable_pagination a").click(function (e) {
        e.preventDefault();
        var page = parseInt($(this).data("page"));
        var totalPages = Math.ceil(state.filteredData.length / state.pageSize);
        if (page < 1 || page > totalPages) return;
        state.currentPage = page;
        randerTableData();
    });
}


function initTables() {
    $('.sortable').on('click', function () {
        const table = $(this).closest('table');
        const tbody = table.find('tbody');
        const rows = tbody.find('tr').toArray();
        const index = $(this).index();
        const isAsc = $(this).hasClass('asc');

        rows.sort(function (a, b) {
            const aVal = $(a).find('td').eq(index).text();
            const bVal = $(b).find('td').eq(index).text();

            if (isAsc) {
                return bVal.localeCompare(aVal);
            }
            return aVal.localeCompare(bVal);
        });

        tbody.empty().append(rows);

        $(this).toggleClass('asc desc');
        $(this).siblings().removeClass('asc desc');
    });
}
var orderColumn = '';
var orderDir = '';
var FetchActivityLogUrl = '/MasterUserActivityLog/GetAllMasterUserActivityLogList';

$(document).ready(function () {
    FetchActivityLog();
    $(document).on('click', 'th.sortable', function () {
        orderColumn = $(this).data('column');
        let currentOrder = $(this).data('order') || 'asc';
        orderDir = currentOrder === 'asc' ? 'desc' : 'asc';
        $(this).data('order', orderDir); // update for next click

        $('th.sortable').not(this).data('order', 'asc');

        FetchDataForTable('ActivityLogTable', FetchActivityLogUrl, orderColumn, orderDir.toUpperCase(), null, null, null);
    });
});
function FetchActivityLog() {
    FetchDataForTable('ActivityLogTable', FetchActivityLogUrl, orderColumn, orderDir.toUpperCase(), null, null, null);
}

$('#ActivityLogTableSearch').off('keyup').on('keyup', function () {
    $('#currentPage').val(1);
    FetchDataForTable('ActivityLogTable', FetchActivityLogUrl, orderColumn, orderDir.toUpperCase(), null, null, null);
});

$('#pageLength').off('change').on('change', function () {
    $('#currentPage').val(1);
    FetchDataForTable('ActivityLogTable', FetchActivityLogUrl, orderColumn, orderDir.toUpperCase(), null, null, null);
})
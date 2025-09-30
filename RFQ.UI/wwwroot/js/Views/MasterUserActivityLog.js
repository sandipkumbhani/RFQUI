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

        FetchDataForTable('ActivityLogTable', FetchActivityLogUrl, orderColumn, orderDir.toUpperCase());
    });
});

function FetchActivityLog() {
    FetchDataForTable('ActivityLogTable', FetchActivityLogUrl, orderColumn, orderDir.toUpperCase());
}
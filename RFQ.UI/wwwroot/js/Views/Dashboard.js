$(document).ready(function () {

});

// Fuel Consumption Chart
const fuelCtx = document.getElementById('fuelChart').getContext('2d');
new Chart(fuelCtx, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Fuel (L)',
            data: [320, 410, 380, 450, 500, 470, 430],
            backgroundColor: 'rgba(34,197,94,0.6)'
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }
});

// Breakdown Causes Chart
const breakdownCtx = document.getElementById('breakdownChart').getContext('2d');
new Chart(breakdownCtx, {
    type: 'doughnut',
    data: {
        labels: ['Engine', 'Tyres', 'Electrical', 'Others'],
        datasets: [{
            data: [40, 25, 20, 15],
            backgroundColor: [
                'rgba(239,68,68,0.7)',
                'rgba(245,158,11,0.7)',
                'rgba(59,130,246,0.7)',
                'rgba(156,163,175,0.7)'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
    }
});

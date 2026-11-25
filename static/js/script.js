
document.addEventListener("DOMContentLoaded", function () {

    // CURRENT DATE
    const dateElement = document.getElementById("currentDate");

    dateElement.textContent = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });


    // ACTIVITY CHART
    const activityCanvas = document.getElementById("activityChart");

    const activityData = {
        7: {
            labels: ["16 Nov", "17 Nov", "18 Nov", "19 Nov",
                     "20 Nov", "21 Nov", "22 Nov"],
            phishing: [12, 18, 14, 22, 17, 28, 25],
            safe: [80, 95, 88, 110, 102, 125, 118]
        },
        30: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            phishing: [55, 62, 48, 75],
            safe: [280, 310, 295, 340]
        }
    };

    const activityChart = new Chart(activityCanvas, {
        type: "line",
        data: {
            labels: activityData[7].labels,
            datasets: [
                {
                    label: "Phishing",
                    data: activityData[7].phishing,
                    borderColor: "#f05265",
                    backgroundColor: "rgba(240,82,101,0.12)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: "Safe",
                    data: activityData[7].safe,
                    borderColor: "#32c98b",
                    backgroundColor: "rgba(50,201,139,0.08)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#a8b5c8",
                        usePointStyle: true,
                        boxWidth: 7,
                        font: { size: 10 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#8493aa", font: { size: 10 } }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: "rgba(132,147,170,0.12)" },
                    ticks: { color: "#8493aa", font: { size: 10 } }
                }
            }
        }
    });


    // ACTIVITY PERIOD FILTER
    document.getElementById("activityPeriod").addEventListener("change", function () {

        const selected = activityData[this.value];

        activityChart.data.labels = selected.labels;
        activityChart.data.datasets[0].data = selected.phishing;
        activityChart.data.datasets[1].data = selected.safe;

        activityChart.update();
    });


    // THREAT DISTRIBUTION CHART
    new Chart(document.getElementById("threatChart"), {
        type: "doughnut",
        data: {
            labels: ["Phishing", "Suspicious", "Safe"],
            datasets: [{
                data: [186, 94, 1004],
                backgroundColor: ["#f05265", "#f5a44c", "#32c98b"],
                borderColor: "#111d31",
                borderWidth: 4,
                hoverOffset: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "72%",
            plugins: {
                legend: { display: false }
            }
        }
    });


    // SEARCH INVESTIGATIONS
    const searchInput = document.getElementById("globalSearch");
    const riskFilter = document.getElementById("riskFilter");
    const tableRows = document.querySelectorAll("#investigationTable tr");

    function filterInvestigations() {

        const searchText = searchInput.value.toLowerCase();
        const selectedRisk = riskFilter.value;

        tableRows.forEach(function (row) {

            const rowText = row.textContent.toLowerCase();
            const rowRisk = row.dataset.risk;

            const matchesSearch = rowText.includes(searchText);
            const matchesRisk =
                selectedRisk === "all" || selectedRisk === rowRisk;

            row.style.display =
                matchesSearch && matchesRisk ? "" : "none";
        });
    }

    searchInput.addEventListener("input", filterInvestigations);
    riskFilter.addEventListener("change", filterInvestigations);


    // MOBILE SIDEBAR
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("show");
    });

});

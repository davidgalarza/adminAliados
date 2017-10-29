new Chart($("#m_chart_sales_stats"), {
    type: "line",
    data: {
        labels:
        ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Augosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        datasets: [{
            label: "Ventas", borderColor: mUtil.getColor("brand"), borderWidth: 2, pointBackgroundColor: mUtil.getColor("brand"), backgroundColor: mUtil.getColor("accent"), pointHoverBackgroundColor: mUtil.getColor("danger"), pointHoverBorderColor: Chart.helpers.color(mUtil.getColor("danger")).alpha(.2).rgbString(),
            data: JSON.parse(localStorage.getItem('salesPerMonth'))
        }]
    }, options: {
        title: { display: !1 },
        tooltips: {
            intersect: !1, mode: "nearest", xPadding: 10, yPadding: 10, caretPadding: 10
        },
        legend: {
            display: !1, labels: { usePointStyle: !1 }
        },
        responsive: !0,
        maintainAspectRatio: !1,
        hover: {
            mode: "index"
        },
        scales: {
            xAxes: [{ display: !1, gridLines: !1, scaleLabel: { display: !0, labelString: "Month" } }], yAxes: [{ display: !1, gridLines: !1, scaleLabel: { display: !0, labelString: "Value" } }]
        },
        elements: {
            point: {
                radius: 3,
                borderWidth: 0, 
                hoverRadius: 8, 
                hoverBorderWidth: 2
            }
        }
    }
});
console.log("In file", JSON.parse(localStorage.getItem('salesPerMonth')));
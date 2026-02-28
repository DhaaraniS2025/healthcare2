document.getElementById('vbdForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const totalVolume = parseFloat(document.getElementById('totalVolume').value);
    const fibroglandularVolume = parseFloat(document.getElementById('fibroglandularVolume').value);

    if (totalVolume <= 0) {
        alert("Total breast volume must be greater than zero.");
        return;
    }

    const vbd = (fibroglandularVolume / totalVolume) * 100;
    let category = '';
    let riskLevel = '';

    if (vbd < 10) {
        category = 'Fatty breasts';
        riskLevel = 'Low risk';
    } else if (vbd >= 10 && vbd < 25) {
        category = 'Scattered fibroglandular tissue';
        riskLevel = 'Average risk';
    } else if (vbd >= 25 && vbd < 50) {
        category = 'Heterogeneously dense';
        riskLevel = 'Higher risk';
    } else {
        category = 'Extremely dense';
        riskLevel = 'Significantly higher cancer risk';
    }

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h2>Results:</h2>
                           <p>VBD: ${vbd.toFixed(2)}%</p>
                           <p>Density Category: ${category}</p>
                           <p>Risk Level: ${riskLevel}</p>`;
});
document.querySelector("button").addEventListener("click", function() {
    document.querySelector(".result").style.display = "block";
});

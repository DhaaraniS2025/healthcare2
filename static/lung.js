async function analyzeImage() {
    let fileInput = document.getElementById('mammogram');
    let resultDiv = document.getElementById('result');
    let suggestionsDiv = document.getElementById('suggestions');

    if (!fileInput.files.length) {
        resultDiv.innerHTML = "Please upload a mammogram scan.";
        return;
    }

    resultDiv.innerHTML = "Analyzing image...";
    suggestionsDiv.innerHTML = "";

    let formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
        let response = await fetch("/lung_predict", {
            method: "POST",
            body: formData
        });

        let data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = data.error;
            return;
        }

        if (data.confidence !== null && data.confidence !== undefined) {
            resultDiv.innerHTML = data.result + 
                "<br>Confidence: " + data.confidence + "%";
        } else {
            resultDiv.innerHTML = data.result;
        }

        if (data.result && data.result.includes("Cancerous")) {
            fetchSuggestions();
        }

    } catch (error) {
        resultDiv.innerHTML = "Server error. Please try again.";
    }
}

function fetchSuggestions() {
    let suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerHTML = "Fetching treatment suggestions...";

    fetch("https://www.cancer.org/cancer/breast-cancer/treatment.html")
        .then(() => {
            suggestionsDiv.innerHTML = `
                <p>Visit 
                <a href="https://www.cancer.org/cancer/breast-cancer/treatment.html" target="_blank">
                American Cancer Society</a> for treatment guidelines.</p>
            `;
        })
        .catch(() => {
            suggestionsDiv.innerHTML = "Need to have an appointment with a Doctor...";
        });
}

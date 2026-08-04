const certificateInput = document.getElementById("certificateId");
const verifyBtn = document.getElementById("verifyBtn");
const searchSection = document.getElementById("searchSection");
const resultSection = document.getElementById("resultSection");

const WEBSITE = window.location.origin + "/Sun-Shine-Club_Kendupalli";
const params = new URLSearchParams(window.location.search);
const urlId = params.get("id")?.toUpperCase();
if (urlId) {
    searchSection.style.display = "none";
    resultSection.style.display = "block";
    loadCertificate(urlId);
}

if (verifyBtn) {
    verifyBtn.addEventListener("click", verifyCertificate);
}
if (certificateInput) {
    certificateInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            verifyCertificate();
        }
    });
}

function verifyCertificate() {
    const id = certificateInput.value.trim().toUpperCase();

    if (!id) {
        alert("Please enter the Certificate ID.");
        certificateInput.focus();
        return;
    }

    searchSection.style.display = "none";
    resultSection.style.display = "block";
    loadCertificate(id);
}

async function loadCertificate(id) {
    resultSection.innerHTML = `
        <div class="loading">
            <div class="loader"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h2>Verifying Certificate...</h2>
        </div>
    `;

    try {
        const response = await fetch("data/certificates-issued.json");
        if (!response.ok) {
    throw new Error("Unable to load JSON.");
}

const certificates = await response.json();
        const certificate = certificates.find(item =>
    item.certificateId &&
    item.certificateId.toUpperCase() === id.toUpperCase()
);

        if (!certificate) {
            showError("Certificate ID not found in the issued certificate database.");
            return;
        }

        showCertificate(certificate);
    } catch (error) {
        console.error(error);
        showError("Unable to load the certificate database.");
    }
}

function showCertificate(certificate) {
    const isValid = certificate.status === "Issued";
    const statusClass = isValid ? "status-valid" : "status-invalid";
    const statusText = isValid ? "Verified Certificate" : "Certificate Status Check";
    const certificateImage = certificate.certificateImage || "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80";
    const eventImage = certificate.eventImage || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80";

    resultSection.innerHTML = `
        <div class="valid-result">
            <div class="club-logo-wrap">
                <img src="../assets/logo/sun-shine-club-logo.png" class="club-logo" alt="Sun Shine Club" />
            </div>
            <h1>Sun Shine Club</h1>
            <h2 class="${statusClass}">${statusText}</h2>

            <div class="certificate-visuals">
                <div class="certificate-image-card">
                    <div class="section-label">Original Certificate</div>
                    <img src="${certificateImage}" alt="${certificate.name} certificate" class="certificate-main-image" />
                </div>

                <div class="certificate-image-card">
                    <div class="section-label">Event Capture</div>
                    <img src="${eventImage}" alt="${certificate.event} event capture" class="certificate-event-image" />
                </div>
            </div>

            <div class="result-grid">
                <div class="result-row"><strong>Certificate ID</strong><span>${certificate.certificateId}</span></div>
                <div class="result-row"><strong>Name</strong><span>${certificate.name}</span></div>
                <div class="result-row"><strong>Event</strong><span>${certificate.event}</span></div>
                <div class="result-row"><strong>Position</strong><span>${certificate.position}</span></div>
                <div class="result-row"><strong>Category</strong><span>${certificate.category}</span></div>
                <div class="result-row"><strong>Issue Date</strong><span>${certificate.issueDate}</span></div>
                <div class="result-row"><strong>Certificate Type</strong><span>${certificate.certificateType}</span></div>
                <div class="result-row"><strong>Secretary</strong><span>${certificate.secretary}</span></div>
                <div class="result-row"><strong>Status</strong><span>${certificate.status}</span></div>
            </div>

            <div class="status-badge ${statusClass}">${isValid ? "✔ Verified" : "⚠ Review Needed"}</div>

            <div class="qr-section">
                <div class="section-label">Scan QR to Verify</div>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${WEBSITE}/club-certificate/verify.html?id=${certificate.certificateId}`)}" alt="QR code for ${certificate.certificateId}" class="qr-code-image" />
            </div>

            <div style="margin-top:20px;">
                <button class="search-again-btn" onclick="goBack()">Verify Another Certificate</button>
            </div>
        </div>
    `;
}

function showError(message) {
    resultSection.innerHTML = `
        <div class="invalid-result">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=120&q=80" class="club-logo" alt="Sun Shine Club" />
            <h1>Sun Shine Club</h1>
            <h2>Certificate Not Found</h2>
            <p>${message}</p>
            <p>This certificate is not registered in the official issued list.</p>
            <button class="search-again-btn" onclick="goBack()">Try Again</button>
        </div>
    `;
}

function goBack() {
    resultSection.style.display = "none";
    searchSection.style.display = "block";
    certificateInput.value = "";
    certificateInput.focus();
}

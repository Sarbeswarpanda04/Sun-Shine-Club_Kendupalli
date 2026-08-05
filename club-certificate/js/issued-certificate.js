const issuedContainer = document.getElementById("issuedCertificates");
const searchInput = document.getElementById("issuedSearch");
const statusMessage = document.getElementById("issuedStatus");

const fallbackImage = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80";
const fallbackEventImage = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80";

async function loadIssuedCertificates() {
    if (!issuedContainer) {
        return;
    }

    issuedContainer.innerHTML = `
        <div class="loading">
            <div class="loader"><i class="fa-solid fa-spinner fa-spin"></i></div>
            <h2>Loading Issued Certificates...</h2>
        </div>
    `;

    try {
        const response = await fetch("data/certificates-issued.json");
        if (!response.ok) {
            throw new Error("Unable to load issued certificate data.");
        }

        const certificates = await response.json();
        renderCertificates(certificates);
    } catch (error) {
        console.error(error);
        issuedContainer.innerHTML = `
            <div class="invalid-result">
                <h2>Unable to load certificates</h2>
                <p>Please refresh the page or try again later.</p>
            </div>
        `;
    }
}

function renderCertificates(certificates) {
    if (!Array.isArray(certificates) || certificates.length === 0) {
        issuedContainer.innerHTML = `
            <div class="invalid-result">
                <h2>No issued certificates found</h2>
                <p>The requested certificate list is currently empty.</p>
            </div>
        `;
        return;
    }

    const sortedCertificates = [...certificates].sort((a, b) => {
        return new Date(b.issueDate || 0) - new Date(a.issueDate || 0);
    });

    const html = sortedCertificates.map((certificate) => {
        const certificateTitle = certificate.certificateType || "Certificate of Appreciation";
        const displayName = certificate.name || "Certificate Holder";
        const displayPosition = certificate.position || "Participant";
        const displayEvent = certificate.event || "Club Event";
        const displayDate = certificate.issueDate || "Not Available";
        const displayId = certificate.certificateId || "N/A";
        const displayImage = certificate.certificateImage || fallbackImage;
        const displayEventImage = certificate.eventImage || fallbackEventImage;
        const displayCategory = certificate.category || "Participation";
        const displaySecretary = certificate.secretary || "Secretary";
        const displayStatus = certificate.status || "Issued";

        return `
            <article class="issued-certificate-card">
                <div class="issued-card-layout">
                    <div class="issued-certificate-image-wrap">
                        <img src="${displayImage}" alt="${displayName} certificate" class="issued-certificate-image" />
                    </div>

                    <div class="issued-candidate-details">
                        <div class="issued-card-title">${certificateTitle}</div>
                        <div class="issued-card-name">${displayName}</div>
                        <div class="issued-card-row"><strong>Event:</strong> ${displayEvent}</div>
                        <div class="issued-card-row"><strong>Position:</strong> ${displayPosition}</div>
                        <div class="issued-card-row"><strong>Category:</strong> ${displayCategory}</div>
                        <div class="issued-card-row"><strong>Date:</strong> ${displayDate}</div>
                        <div class="issued-card-row"><strong>Certificate ID:</strong> ${displayId}</div>
                        <div class="issued-card-row"><strong>Secretary:</strong> ${displaySecretary}</div>
                        <div class="issued-card-row"><strong>Status:</strong> ${displayStatus}</div>
                    </div>

                    <div class="issued-event-image-wrap">
                        <img src="${displayEventImage}" alt="${displayEvent} event" class="issued-event-image" />
                    </div>
                </div>
            </article>
        `;
    }).join("");

    issuedContainer.innerHTML = html;

    if (statusMessage) {
        statusMessage.textContent = `${sortedCertificates.length} certificate${sortedCertificates.length === 1 ? "" : "s"} loaded from the issued database.`;
    }
}

function getCardClass(position = "") {
    const value = position.toLowerCase();

    if (value.includes("first")) return "first";
    if (value.includes("second")) return "second";
    if (value.includes("third")) return "third";
    return "participant";
}

function getBadge(position = "") {
    const value = position.toLowerCase();

    if (value.includes("first")) return "🏆";
    if (value.includes("second")) return "🥈";
    if (value.includes("third")) return "🥉";
    return "🎖️";
}

function handleSearchFilter() {
    if (!searchInput || !issuedContainer) {
        return;
    }

    const term = searchInput.value.trim().toLowerCase();
    const cards = issuedContainer.querySelectorAll(".issued-certificate-card");

    cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        const match = !term || text.includes(term);
        card.style.display = match ? "block" : "none";
    });
}

if (searchInput) {
    searchInput.addEventListener("input", handleSearchFilter);
}

window.addEventListener("DOMContentLoaded", loadIssuedCertificates);

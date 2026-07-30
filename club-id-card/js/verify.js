// =====================================
// Sun Shine Club
// Member Verification
// =====================================

const verifyCard = document.getElementById("verifyCard");

// Get ID from URL
const params = new URLSearchParams(window.location.search);
const memberId = params.get("id");

// No ID in URL
if (!memberId) {

    showError("No Member ID provided.");

} else {

    loadMember(memberId);

}

// =====================================
// Load Member Data
// =====================================

async function loadMember(id) {

    try {

        const response = await fetch("data/members-id.json");

        const members = await response.json();

        const member = members.find(m => m.id === id);

        if (!member) {

            showError("Member ID not found.");

            return;

        }

        showMember(member);

    }

    catch (error) {

        console.error(error);

        showError("Unable to load member database.");

    }

}

// =====================================
// Check Expiry
// =====================================

function isExpired(validDate) {

    const today = new Date();

    const expiry = new Date(validDate);

    return expiry < today;

}

// =====================================
// Display Member
// =====================================

function showMember(member) {

    const expired = isExpired(member.valid);

    const statusColor = expired ? "#e74c3c" : "#27ae60";

    const statusText = expired ? "Expired" : "Verified";

    verifyCard.innerHTML = `

    <div class="verified">

        <img
            src="assets/logo.png"
            class="club-logo"
            alt="Club Logo">

        <h1>Sun Shine Club</h1>

        <h2 style="color:${statusColor};">

            ✔ ${statusText} Member

        </h2>

        <img
            src="${member.photo}"
            class="profile-photo"
            alt="${member.name}">

        <table class="member-table">

            <tr>

                <th>Name</th>

                <td>${member.name}</td>

            </tr>

            <tr>

                <th>Member ID</th>

                <td>${member.id}</td>

            </tr>

            <tr>

                <th>Designation</th>

                <td>${member.designation}</td>

            </tr>

            <tr>

                <th>Phone</th>

                <td>${member.phone}</td>

            </tr>

            <tr>

                <th>Blood Group</th>

                <td>${member.blood}</td>

            </tr>

            <tr>

                <th>Join Date</th>

                <td>${member.joinDate}</td>

            </tr>

            <tr>

                <th>Valid Until</th>

                <td>${member.valid}</td>

            </tr>

            <tr>

                <th>Status</th>

                <td style="color:${statusColor};font-weight:bold;">

                    ${member.status}

                </td>

            </tr>

        </table>

    </div>

    `;

}

// =====================================
// Error Page
// =====================================

function showError(message) {

    verifyCard.innerHTML = `

    <div class="invalid">

        <img
            src="assets/logo.png"
            class="club-logo"
            alt="Club Logo">

        <h1>Sun Shine Club</h1>

        <h2 style="color:#e74c3c;">

            ❌ Invalid Member

        </h2>

        <p>${message}</p>

        <p>

            This ID Card is not registered.

        </p>

    </div>

    `;

}
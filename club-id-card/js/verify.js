// =====================================
// Sun Shine Club
// Member Verification
// =====================================

const searchSection = document.getElementById("searchSection");
const resultSection = document.getElementById("resultSection");
const memberInput = document.getElementById("memberId");
const verifyBtn = document.getElementById("verifyBtn");

// =====================================
// Auto Verify from URL
// =====================================

const params = new URLSearchParams(window.location.search);
const urlMemberId = params.get("id");

if (urlMemberId) {

    searchSection.style.display = "none";
    resultSection.style.display = "block";

    loadMember(urlMemberId);

}

// =====================================
// Verify Button
// =====================================

verifyBtn.addEventListener("click", verifyMember);

// Press Enter
memberInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        verifyMember();

    }

});

// =====================================
// Verify Member
// =====================================

function verifyMember() {

    const id = memberInput.value.trim().toUpperCase();

    if (!id) {

        alert("Please enter your Member ID.");

        memberInput.focus();

        return;

    }

    searchSection.style.display = "none";
    resultSection.style.display = "block";

    loadMember(id);

}

// =====================================
// Load Member
// =====================================

async function loadMember(id) {

    resultSection.innerHTML = `

        <div class="loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <h2>Verifying Member...</h2>

        </div>

    `;

    try {

        const response = await fetch("data/members-id.json");

        const members = await response.json();

        const member = members.find(
            m => m.id.toUpperCase() === id.toUpperCase()
        );

        if (!member) {

            showError("Member ID not found.");

            return;

        }

        showMember(member);

    }

    catch (err) {

        console.error(err);

        showError("Unable to load member database.");

    }

}

// =====================================
// Check Expiry
// =====================================

function isExpired(validDate) {

    return new Date(validDate) < new Date();

}

// =====================================
// Show Member
// =====================================

function showMember(member) {

    const expired = isExpired(member.valid);

    const statusText = expired ? "Expired" : "Verified";

    const statusColor = expired ? "#e74c3c" : "#2ecc71";

    resultSection.innerHTML = `

        <div class="verified">

            <img src="assets/logo.png"
                 class="club-logo">

            <h1>Sun Shine Club</h1>

            <h2 style="color:${statusColor};">

                ${expired ? "❌" : "✔"} ${statusText} Member

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

                    <td>${member.phone || "-"}</td>

                </tr>

                <tr>

                    <th>Blood Group</th>

                    <td>${member.blood || "-"}</td>

                </tr>

                <tr>

                    <th>Join Date</th>

                    <td>${member.joinDate || "-"}</td>

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

            <button
                class="search-again-btn"
                onclick="goBack()">

                Verify Another Member

            </button>

        </div>

    `;

}

// =====================================
// Invalid Member
// =====================================

function showError(message) {

    resultSection.innerHTML = `

        <div class="invalid">

            <img src="assets/logo.png"
                 class="club-logo">

            <h1>Sun Shine Club</h1>

            <h2 style="color:#e74c3c;">

                ❌ Invalid Member

            </h2>

            <p>${message}</p>

            <p>This ID Card is not registered.</p>

            <button
                class="search-again-btn"
                onclick="goBack()">

                Try Again

            </button>

        </div>

    `;

}

// =====================================
// Back to Search
// =====================================

function goBack() {

    resultSection.style.display = "none";

    searchSection.style.display = "block";

    memberInput.value = "";

    memberInput.focus();

}
const container = document.getElementById("cardsContainer");

// Change this after uploading your website
const WEBSITE = window.location.origin;

fetch("data/members-id.json")
  .then((res) => res.json())
  .then(generateCards)
  .catch((err) => {
    container.innerHTML = `
            <h2 style="color:red;text-align:center;">
                Failed to load members-id.json
            </h2>`;
    console.error(err);
  });

function generateCards(members) {
  container.innerHTML = "";

  members.forEach((member) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    wrapper.innerHTML = `

            <div class="id-card">

                <div class="card-header">

                    <img src="assets/logo.png" class="club-logo">

                    <div>

                        <h2>Sun Shine Club</h2>

                        <small>Kendupalli, Bhapur, Nayagarh, Odisha - 752077</small>

                        <div class="webandmail">
    🌐 www.sunshineclubkendupalli.com
</div>

                    </div>

                </div>

                <img
                    src="${member.photo}"
                    class="member-photo"
                    alt="${member.name}">

                <h3>${member.name}</h3>
                <h3>${member.odia_name}</h3>

                <p><strong>ID :</strong> ${member.id}</p>

                <p><strong>Designation :</strong> ${member.designation}</p>

                <p><strong>Valid :</strong> ${member.valid}</p>

                <div id="qr-${member.id}" class="qr-box"></div>

            </div>

            <button
                class="download-btn"
                data-id="${member.id}">
                <i class="fa-solid fa-download"></i>
                Download ID Card
            </button>

        `;

    container.appendChild(wrapper);

    new QRCode(document.getElementById(`qr-${member.id}`), {
      text: `${WEBSITE}/club-id-card/verify.html?id=${member.id}`,
      width: 90,
      height: 90,
    });
  });

  attachDownloadButtons();
}

//-----------------------------------------
// Download One Card
//-----------------------------------------

function attachDownloadButtons() {
  document.querySelectorAll(".download-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.parentElement.querySelector(".id-card");

      html2canvas(card, {
        scale: 2,
      }).then((canvas) => {
        const link = document.createElement("a");

        link.download = btn.dataset.id + ".png";

        link.href = canvas.toDataURL("image/png");

        link.click();
      });
    });
  });
}

//-----------------------------------------
// Download All
//-----------------------------------------

document.getElementById("downloadAll").addEventListener("click", downloadAll);

async function downloadAll() {
  const cards = document.querySelectorAll(".id-card");

  for (const card of cards) {
    const id = card.querySelector(".download-btn").dataset.id;

    const canvas = await html2canvas(card, {
      scale: 2,
    });

    const link = document.createElement("a");

    link.download = id + ".png";

    link.href = canvas.toDataURL("image/png");

    link.click();

    // Small delay

    await new Promise((r) => setTimeout(r, 400));
  }
}

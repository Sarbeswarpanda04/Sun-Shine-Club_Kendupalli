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

                        <h2>Sun Shine Club | ସନ୍‌ସାଇନ୍ କ୍ଲବ୍</h2>

                        <small>Kendupalli, Bhapur, Nayagarh, Odisha - 752077</small>

                        <div class="webandmail">
    🌐 www.sunshineclubkendupalli.in
</div>

                    </div>

                </div>

                <img
                    src="${member.photo}"
                    class="member-photo"
                    alt="${member.name}">

                <h3>${member.name}</h3>
                <h3>${member.odia_name}</h3>

                <img class="break-image" src="assets/break.png">

                <div class="member-info">

    <div class="member-details">

        <p>
            <i class="fa-solid fa-id-card"></i>
            <strong>ID :</strong>
            <span>${member.id}</span>
        </p>

        <p>
            <i class="fa-solid fa-user-tie"></i>
            <strong>Designation :</strong>
            <span>${member.designation}</span>
        </p>

        <p>
            <i class="fa-solid fa-phone"></i>
            <strong>Phone :</strong>
            <span>${member.phone}</span>
        </p>

    </div>

    <div class="qr-border">

        <div id="qr-${member.id}" class="qr-box"></div>

    </div>

</div>

<hr>

<div class="member-details2">

    <p>
        <i class="fa-solid fa-location-dot"></i>
        <strong>Address :</strong>
        <span>${member.address}</span>
    </p>

    <p>
        <i class="fa-regular fa-calendar"></i>
        <strong>Join Date :</strong>
        <span>${member.joinDate}</span>
    </p>

    <p>
        <i class="fa-solid fa-check-to-slot"></i>
        <strong>Valid :</strong>
        <span>${member.valid}</span>
    </p>

</div>


</div>



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
      width: 100,
      height: 100,
      correctLevel: QRCode.CorrectLevel.H,
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

      // html2canvas(card, {
      //   scale: 2,
      // }).then((canvas) => {
      //   const link = document.createElement("a");

      //   link.download = btn.dataset.id + ".png";

      //   link.href = canvas.toDataURL("image/png");

      //   link.click();
      // });

      html2canvas(card, {
    scale: 4,
    useCORS: true,
    backgroundColor: null,
    logging: false
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

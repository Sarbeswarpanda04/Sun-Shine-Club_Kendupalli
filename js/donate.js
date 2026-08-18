/*====================================================
                DONATE PAGE JAVASCRIPT
        Premium Interactions for Donate Page
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*====================================
            COPY UPI ID
    ====================================*/

    const copyBtn = document.querySelector(".copy-upi");
    const upiId = document.getElementById("upi-id");

    if(copyBtn && upiId){

        copyBtn.addEventListener("click", async () => {

            try{

                await navigator.clipboard.writeText(
                    upiId.textContent.trim()
                );

                const originalText = copyBtn.textContent;

                copyBtn.textContent = "✓ Copied";

                copyBtn.style.background = "#28a745";

                setTimeout(()=>{

                    copyBtn.textContent = originalText;

                    copyBtn.style.background = "";

                },2000);

            }

            catch(error){

                alert("Unable to copy UPI ID.");

            }

        });

    }



    /*====================================
            IMPACT COUNTERS
    ====================================*/

    const counters = document.querySelectorAll(".counter");

    const counterObserver = new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                const counter = entry.target;

                const target = +counter.dataset.target;

                let current = 0;

                const increment = target / 100;

                const updateCounter = ()=>{

                    current += increment;

                    if(current < target){

                        counter.textContent =
                        Math.floor(current);

                        requestAnimationFrame(updateCounter);

                    }

                    else{

                        counter.textContent = target;

                    }

                };

                updateCounter();

                counterObserver.unobserve(counter);

            }

        });

    },{

        threshold:.5

    });

    counters.forEach(counter=>{

        counterObserver.observe(counter);

    });



    /*====================================
            FAQ ACCORDION
    ====================================*/

    const details = document.querySelectorAll(
        ".donation-faq details"
    );

    details.forEach(item=>{

        item.addEventListener("toggle",()=>{

            if(item.open){

                details.forEach(other=>{

                    if(other !== item){

                        other.removeAttribute("open");

                    }

                });

            }

        });

    });



    /*====================================
            SCROLL REVEAL
    ====================================*/

    const reveals = document.querySelectorAll(

        ".donation-card,\
        .upi-card,\
        .bank-details table,\
        .impact-card,\
        .thank-you .container,\
        .donation-faq details,\
        .donation-contact"

    );

    const revealObserver = new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("fade-up");

                revealObserver.unobserve(entry.target);

            }

        });

    },{

        threshold:.15

    });

    reveals.forEach(item=>{

        revealObserver.observe(item);

    });



    /*====================================
            HOVER TILT EFFECT
    ====================================*/

    const cards = document.querySelectorAll(

        ".donation-card,\
        .impact-card"

    );

    cards.forEach(card=>{

        card.addEventListener("mousemove",(e)=>{

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;

            const y = e.clientY - rect.top;

            const rotateX =

                ((y / rect.height)-0.5)*10;

            const rotateY =

                ((x / rect.width)-0.5)*-10;

            card.style.transform =

                `perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-8px)`;

        });

        card.addEventListener("mouseleave",()=>{

            card.style.transform="";

        });

    });



    /*====================================
            HERO PARALLAX
    ====================================*/

    const hero = document.querySelector(".donate-hero");

    if(hero){

        window.addEventListener("scroll",()=>{

            const offset =

                window.pageYOffset;

            hero.style.backgroundPositionY =

                offset * 0.5 + "px";

        });

    }



    /*====================================
            SMOOTH SCROLL
    ====================================*/

    document.querySelectorAll(

        'a[href^="#"]'

    ).forEach(anchor=>{

        anchor.addEventListener("click",(e)=>{

            const target = document.querySelector(

                anchor.getAttribute("href")

            );

            if(target){

                e.preventDefault();

                target.scrollIntoView({

                    behavior:"smooth",

                    block:"start"

                });

            }

        });

    });



    /*====================================
            BUTTON RIPPLE
    ====================================*/

    document.querySelectorAll(

        "button"

    ).forEach(button=>{

        button.addEventListener("click",(e)=>{

            const ripple =

                document.createElement("span");

            const diameter =

                Math.max(

                    button.clientWidth,

                    button.clientHeight

                );

            ripple.style.width =

            ripple.style.height =

                diameter+"px";

            ripple.style.left =

                e.offsetX -

                diameter/2 + "px";

            ripple.style.top =

                e.offsetY -

                diameter/2 + "px";

            ripple.classList.add("ripple");

            const oldRipple =

                button.querySelector(".ripple");

            if(oldRipple){

                oldRipple.remove();

            }

            button.appendChild(ripple);

        });

    });



   /*====================================================
            PAYMENT PART 1A.1
    Constants, DOM, Helpers & Validation
====================================================*/

// ---------- CONFIGURATION ----------

const UPI_ID = "8260916384@ptsbi";
const PAYEE_NAME = "Sun Shine Club";
const PAYMENT_NOTE = "Donation to Sun Shine Club";

// ---------- EMAILJS ----------

emailjs.init({ // Changed publicKey as well, assuming it's tied to the service
    publicKey: "IA7XsesRDVThapDCf"
});

// ---------- DOM ----------

const amountButtons = document.querySelectorAll(".amount-btn");

const donationForm = document.getElementById("donationForm");

const payButton = document.getElementById("payUPI");


const customAmount = document.getElementById("customAmount");

const selectedAmountText = document.getElementById("selectedAmount");

const donorName = document.getElementById("donorName");

const donorEmail = document.getElementById("donorEmail");

const donorMobile = document.getElementById("donorMobile");

const paymentConfirmation =
document.getElementById("paymentConfirmation");

const confirmationForm =
document.getElementById("confirmationForm");

const utrInput = document.getElementById("utr");

const remarksInput =
document.getElementById("remarks");

// ---------- STATE ----------

let selectedAmount = 0;

// ---------- HELPERS ----------

function showMessage(message){

    alert(message);

}

function generateDonationId(){

    return "SSC-" +
        Date.now() +
        "-" +
        Math.floor(Math.random()*1000);

}

function getDonationAmount(){

    const custom = Number(customAmount.value);

    if(custom > 0){

        return custom;

    }

    return selectedAmount;

}

function updateAmountDisplay(amount){

    selectedAmountText.textContent =

        "₹" + amount.toLocaleString("en-IN");

}

// ---------- VALIDATION ----------

function validateDonationForm(){

    const name =
        donorName.value.trim();

    const email =
        donorEmail.value.trim();

    const mobile =
        donorMobile.value.trim();

    const amount =
        getDonationAmount();

    if(name.length < 3){

        showMessage(
            "Please enter your full name."
        );

        donorName.focus();

        return false;

    }

    const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){

        showMessage(
            "Please enter a valid email address."
        );

        donorEmail.focus();

        return false;

    }

    const mobileRegex = /^[6-9]\d{9}$/;

    if(!mobileRegex.test(mobile)){

        showMessage(
            "Please enter a valid 10-digit mobile number."
        );

        donorMobile.focus();

        return false;

    }

    if(amount < 1){

        showMessage(
            "Please select or enter a donation amount."
        );

        return false;

    }

    return true;

}

// ---------- SAVE DONOR ----------

function saveDonationData(){

    const donationId =
        generateDonationId();

    sessionStorage.setItem(
        "donationId",
        donationId
    );

    sessionStorage.setItem(
        "donorName",
        donorName.value.trim()
    );

    sessionStorage.setItem(
        "donorEmail",
        donorEmail.value.trim()
    );

    sessionStorage.setItem(
        "donorMobile",
        donorMobile.value.trim()
    );

    sessionStorage.setItem(
        "donationAmount",
        getDonationAmount()
    );

    sessionStorage.setItem(
        "donationDate",
        new Date().toLocaleString()
    );

}

/*====================================================
            PAYMENT PART 1A.2
    Amount Selection & UPI Payment
====================================================*/

/*====================================
        SELECT DONATION AMOUNT
        (single listener — handles both
        the active state and the amount)
====================================*/

amountButtons.forEach(button => {

    button.addEventListener("click", () => {

        amountButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        selectedAmount =
            Number(button.dataset.amount);

        customAmount.value = "";

        updateAmountDisplay(selectedAmount);

    });

});


/*====================================
        CUSTOM AMOUNT
====================================*/

customAmount.addEventListener("input", () => {

    amountButtons.forEach(btn =>
        btn.classList.remove("active")
    );

    const value =
        Number(customAmount.value);

    if(value > 0){

        selectedAmount = value;

        updateAmountDisplay(value);

    }

    else{

        selectedAmount = 0;

        updateAmountDisplay(0);

    }

});


/*====================================
        PAY VIA UPI
====================================*/

payButton.addEventListener("click", () => {

    if(!validateDonationForm()){

        return;

    }

    saveDonationData();

    const amount =
        getDonationAmount();

    const donationId =
        sessionStorage.getItem("donationId");

    const upiURL =

        "upi://pay?" +

        "pa=" +
        encodeURIComponent(UPI_ID) +

        "&pn=" +
        encodeURIComponent(PAYEE_NAME) +

        "&tn=" +
        encodeURIComponent(
            PAYMENT_NOTE +
            " (" +
            donationId +
            ")"
        ) +

        "&am=" +
        amount +

        "&cu=INR";


    // Open installed UPI App

    window.open(upiURL, "_self");

});


/*====================================
    HANDLE RETURN FROM UPI APP
====================================*/

function handleReturnFromUPI() {
    // If a donation ID exists, it means payment was just initiated.
    if (sessionStorage.getItem("donationId")) {
        paymentConfirmation.style.display = "block";
        paymentConfirmation.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

// When the page is loaded or becomes visible (e.g., returning from a UPI app)
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        handleReturnFromUPI();
    }
});

window.addEventListener("load", handleReturnFromUPI);


/*====================================================
            PAYMENT PART 2
    Payment Confirmation & EmailJS
====================================================*/

let isSubmitting = false;

/*====================================
        UTR VALIDATION
====================================*/

function validateUTR() {

    const utr = utrInput.value.trim();

    if (utr === "") {

        showMessage("Please enter the UTR / Transaction Reference Number.");

        utrInput.focus();

        return false;

    }

    if (utr.length < 12) {

        showMessage("Please enter a valid UTR number.");

        utrInput.focus();

        return false;

    }

    return true;

}


/*====================================
        SUBMIT DONATION
====================================*/

/*====================================
        SUBMIT DONATION
        ADMIN + DONOR AUTO-REPLY
====================================*/

confirmationForm.addEventListener("submit", function (e) {

    e.preventDefault();

    if (isSubmitting) return;

    if (!validateUTR()) return;


    const submitBtn =
        confirmationForm.querySelector("button");

    const originalText =
        submitBtn.innerHTML;


    /* =====================================
       CHECK EMAILJS
    ===================================== */

    if (typeof emailjs === "undefined") {

        showMessage(
            "Email service is unavailable. Please try again shortly."
        );

        return;
    }


    /* =====================================
       DONOR EMAIL
    ===================================== */

    const donorEmailValue =
        sessionStorage.getItem("donorEmail");


    if (!donorEmailValue) {

        showMessage(
            "Donor email address is missing. Please check your details."
        );

        return;
    }


    /* =====================================
       START SUBMISSION
    ===================================== */

    isSubmitting = true;

    submitBtn.disabled = true;

    submitBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        Submitting...
    `;


    /* =====================================
       EMAIL PARAMETERS
    ===================================== */

    const params = {

        donation_id:
            sessionStorage.getItem("donationId"),

        name:
            sessionStorage.getItem("donorName"),

        email:
            donorEmailValue,

        mobile:
            sessionStorage.getItem("donorMobile"),

        amount:
            sessionStorage.getItem("donationAmount"),

        utr:
            utrInput.value.trim(),

        remarks:
            remarksInput.value.trim(),

        date:
            sessionStorage.getItem("donationDate")

    };


    /* =====================================
       SEND ADMIN EMAIL
       Order Confirmation
    ===================================== */

    const adminEmail = emailjs.send(
        "service_0vhfdar_sunshine",
        "template_6viqjnd",
        params
    );


    /* =====================================
       SEND DONOR EMAIL
       Auto-Reply
    ===================================== */

    const donorEmail = emailjs.send(
        "service_0vhfdar_sunshine",
        "template_Im1upie",
        params
    );


    /* =====================================
       WAIT FOR BOTH EMAILS
    ===================================== */

    Promise.all([
        adminEmail,
        donorEmail
    ])

    .then(function (responses) {

        console.log(
            "Admin email sent:",
            responses[0]
        );

        console.log(
            "Donor auto-reply sent:",
            responses[1]
        );


        submitBtn.innerHTML = `
            <i class="fas fa-check-circle"></i>
            Submitted Successfully
        `;


        showMessage(
            "🎉 Thank you!\n\n" +
            "Your donation details have been submitted successfully.\n\n" +
            "A confirmation email has been sent to your email address."
        );


        /* =====================================
           RESET FORM
        ===================================== */

        confirmationForm.reset();


        sessionStorage.removeItem("donationId");
        sessionStorage.removeItem("donorName");
        sessionStorage.removeItem("donorEmail");
        sessionStorage.removeItem("donorMobile");
        sessionStorage.removeItem("donationAmount");
        sessionStorage.removeItem("donationDate");


        setTimeout(() => {

            paymentConfirmation.style.display =
                "none";

            submitBtn.disabled = false;

            submitBtn.innerHTML =
                originalText;

            isSubmitting = false;

        }, 2000);

    })


    /* =====================================
       EMAIL ERROR
    ===================================== */

    .catch(function (error) {

        console.error(
            "EmailJS error:",
            error
        );


        submitBtn.disabled = false;

        submitBtn.innerHTML =
            originalText;

        isSubmitting = false;


        showMessage(
            "Unable to send the donation confirmation emails.\n\n" +
            "Please try again."
        );

    });

});





    /*====================================
            PAGE LOADED
    ====================================*/

    console.log(

        "❤️ Donate Page Loaded Successfully"

    );

});
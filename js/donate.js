/*====================================================
        SUN SHINE CLUB — DONATION PAGE
        FINAL DONATION JAVASCRIPT
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*====================================================
                        CONFIG
    ====================================================*/

    const UPI_ID = "8260916384@ptsbi";

    const PAYEE_NAME = "Sarbeswar panda";

    const PAYMENT_NOTE = "Donation to Sun Shine Club";


    /*====================================================
                        EMAILJS
    ====================================================*/

    const EMAILJS_PUBLIC_KEY =
        "IA7XsesRDVThapDCf";

    const EMAILJS_SERVICE_ID =
        "service_0vhfdar_sunshine";

    /*
        ADMIN / ORDER CONFIRMATION TEMPLATE

        This template is sent to the club/admin.

        DO NOT send template_Im1upie from JavaScript.

        template_Im1upie must be configured as the
        Auto-Reply template inside EmailJS.
    */

    const EMAILJS_ADMIN_TEMPLATE_ID =
        "template_6viqjnd";


    /*====================================================
                    INITIALIZE EMAILJS
    ====================================================*/

    if (typeof emailjs !== "undefined") {

        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });

        console.log("✅ EmailJS initialized");

    } else {

        console.error(
            "❌ EmailJS library was not loaded."
        );

    }


    /*====================================================
                        ELEMENTS
    ====================================================*/

    const copyBtn =
        document.querySelector(".copy-upi");

    const upiIdElement =
        document.getElementById("upi-id");

    const counters =
        document.querySelectorAll(".counter");

    const donationForm =
        document.getElementById("donationForm");

    const payButton =
        document.getElementById("payUPI");

    const amountButtons =
        document.querySelectorAll(".amount-btn");

    const customAmount =
        document.getElementById("customAmount");

    const selectedAmountText =
        document.getElementById("selectedAmount");

    const donorName =
        document.getElementById("donorName");

    const donorEmail =
        document.getElementById("donorEmail");

    const donorMobile =
        document.getElementById("donorMobile");

    const paymentConfirmation =
        document.getElementById("paymentConfirmation");

    const confirmationForm =
        document.getElementById("confirmationForm");

    const utrInput =
        document.getElementById("utr");

    const remarksInput =
        document.getElementById("remarks");


    /*====================================================
                        STATE
    ====================================================*/

    let selectedAmount = 0;

    let isSubmitting = false;


    /*====================================================
                    HELPER — MESSAGE
    ====================================================*/

    function showMessage(message) {

        alert(message);

    }


    /*====================================================
                    GENERATE DONATION ID
    ====================================================*/

    function generateDonationId() {

        return (
            "SSC-" +
            Date.now() +
            "-" +
            Math.floor(
                Math.random() * 1000
            )
        );

    }


    /*====================================================
                    GET AMOUNT
    ====================================================*/

    function getDonationAmount() {

        if (customAmount) {

            const customValue =
                Number(customAmount.value);

            if (customValue > 0) {

                return customValue;

            }

        }

        return selectedAmount;

    }


    /*====================================================
                    UPDATE AMOUNT
    ====================================================*/

    function updateAmountDisplay(amount) {

        if (!selectedAmountText) {

            return;

        }

        selectedAmountText.textContent =
            "₹" +
            Number(amount)
                .toLocaleString("en-IN");

    }


    /*====================================================
                VALIDATE DONATION FORM
    ====================================================*/

    function validateDonationForm() {

        if (
            !donorName ||
            !donorEmail ||
            !donorMobile
        ) {

            return false;

        }


        const name =
            donorName.value.trim();

        const email =
            donorEmail.value.trim();

        const mobile =
            donorMobile.value.trim();

        const amount =
            getDonationAmount();


        /* NAME */

        if (name.length < 3) {

            showMessage(
                "Please enter your full name."
            );

            donorName.focus();

            return false;

        }


        /* EMAIL */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {

            showMessage(
                "Please enter a valid email address."
            );

            donorEmail.focus();

            return false;

        }


        /* MOBILE */

        const mobileRegex =
            /^[6-9]\d{9}$/;

        if (!mobileRegex.test(mobile)) {

            showMessage(
                "Please enter a valid 10-digit mobile number."
            );

            donorMobile.focus();

            return false;

        }


        /* AMOUNT */

        if (amount < 1) {

            showMessage(
                "Please select or enter a donation amount."
            );

            return false;

        }


        return true;

    }


    /*====================================================
                SAVE DONOR INFORMATION
    ====================================================*/

    function saveDonationData() {

        const donationId =
            generateDonationId();

        const date =
            new Date().toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            );


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
            String(getDonationAmount())
        );

        sessionStorage.setItem(
            "donationDate",
            date
        );


        console.log(
            "✅ Donation information saved"
        );

        console.log({
            donationId,
            name:
                donorName.value.trim(),
            email:
                donorEmail.value.trim(),
            mobile:
                donorMobile.value.trim(),
            amount:
                getDonationAmount(),
            date
        });

    }


    /*====================================================
                    COPY UPI ID
    ====================================================*/

    if (
        copyBtn &&
        upiIdElement
    ) {

        copyBtn.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        upiIdElement.textContent.trim()
                    );


                    const oldText =
                        copyBtn.textContent;


                    copyBtn.textContent =
                        "✓ Copied";


                    setTimeout(() => {

                        copyBtn.textContent =
                            oldText;

                    }, 2000);

                }

                catch (error) {

                    console.error(
                        "UPI copy error:",
                        error
                    );

                    showMessage(
                        "Unable to copy UPI ID."
                    );

                }

            }
        );

    }


    /*====================================================
                    COUNTERS
    ====================================================*/

    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            const counter =
                                entry.target;

                            const target =
                                Number(
                                    counter.dataset.target
                                );


                            let current = 0;

                            const increment =
                                target / 100;


                            function updateCounter() {

                                current +=
                                    increment;


                                if (
                                    current < target
                                ) {

                                    counter.textContent =
                                        Math.floor(
                                            current
                                        );

                                    requestAnimationFrame(
                                        updateCounter
                                    );

                                } else {

                                    counter.textContent =
                                        target;

                                }

                            }


                            updateCounter();

                            counterObserver.unobserve(
                                counter
                            );

                        }
                    );

                },
                {
                    threshold: 0.5
                }
            );


        counters.forEach(
            counter => {

                counterObserver.observe(
                    counter
                );

            }
        );

    }


    /*====================================================
                    FAQ
    ====================================================*/

    const faqDetails =
        document.querySelectorAll(
            ".donation-faq details"
        );


    faqDetails.forEach(
        item => {

            item.addEventListener(
                "toggle",
                () => {

                    if (!item.open) {

                        return;

                    }


                    faqDetails.forEach(
                        other => {

                            if (
                                other !== item
                            ) {

                                other.removeAttribute(
                                    "open"
                                );

                            }

                        }
                    );

                }
            );

        }
    );


    /*====================================================
                    SCROLL REVEAL
    ====================================================*/

    const revealElements =
        document.querySelectorAll(
            ".donation-card, " +
            ".upi-card, " +
            ".bank-details table, " +
            ".impact-card, " +
            ".thank-you .container, " +
            ".donation-faq details, " +
            ".donation-contact"
        );


    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "fade-up"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.15
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );

    }


    /*====================================================
                    AMOUNT BUTTONS
    ====================================================*/

    amountButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    amountButtons.forEach(
                        btn => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedAmount =
                        Number(
                            button.dataset.amount
                        );


                    if (customAmount) {

                        customAmount.value =
                            "";

                    }


                    updateAmountDisplay(
                        selectedAmount
                    );

                }
            );

        }
    );


    /*====================================================
                    CUSTOM AMOUNT
    ====================================================*/

    if (customAmount) {

        customAmount.addEventListener(
            "input",
            () => {

                amountButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                const value =
                    Number(
                        customAmount.value
                    );


                if (value > 0) {

                    selectedAmount =
                        value;

                    updateAmountDisplay(
                        value
                    );

                } else {

                    selectedAmount =
                        0;

                    updateAmountDisplay(
                        0
                    );

                }

            }
        );

    }


    /*====================================================
                    PAY VIA UPI
    ====================================================*/

    if (payButton) {

        payButton.addEventListener(
            "click",
            () => {

                if (
                    !validateDonationForm()
                ) {

                    return;

                }


                saveDonationData();


                const amount =
                    getDonationAmount();


                const donationId =
                    sessionStorage.getItem(
                        "donationId"
                    );


                const upiURL =
                    "upi://pay?" +
                    "pa=" +
                    encodeURIComponent(
                        UPI_ID
                    ) +
                    "&pn=" +
                    encodeURIComponent(
                        PAYEE_NAME
                    ) +
                    "&tn=" +
                    encodeURIComponent(
                        PAYMENT_NOTE +
                        " (" +
                        donationId +
                        ")"
                    ) +
                    "&am=" +
                    encodeURIComponent(
                        amount
                    ) +
                    "&cu=INR";


                console.log(
                    "Opening UPI:",
                    upiURL
                );


                window.location.href =
                    upiURL;

            }
        );

    }


    /*====================================================
                SHOW CONFIRMATION AFTER UPI
    ====================================================*/

    function showPaymentConfirmation() {

        const donationId =
            sessionStorage.getItem(
                "donationId"
            );


        if (
            donationId &&
            paymentConfirmation
        ) {

            paymentConfirmation.style.display =
                "block";

        }

    }


    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                showPaymentConfirmation();

            }

        }
    );


    window.addEventListener(
        "load",
        showPaymentConfirmation
    );


    /*====================================================
                    UTR VALIDATION
    ====================================================*/

    function validateUTR() {

        if (!utrInput) {

            return false;

        }


        const utr =
            utrInput.value.trim();


        if (!utr) {

            showMessage(
                "Please enter the UTR / Transaction Reference Number."
            );

            utrInput.focus();

            return false;

        }


        if (utr.length < 12) {

            showMessage(
                "Please enter a valid UTR number."
            );

            utrInput.focus();

            return false;

        }


        return true;

    }


    /*====================================================
        FINAL SUBMISSION

        IMPORTANT:

        ONLY template_6viqjnd is sent here.

        template_Im1upie MUST be configured as
        EmailJS Auto-Reply.

        Therefore:

        ADMIN:
        template_6viqjnd

        DONOR:
        template_Im1upie Auto-Reply
    ====================================================*/

    if (confirmationForm) {

        confirmationForm.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                if (isSubmitting) {

                    return;

                }


                if (!validateUTR()) {

                    return;

                }


                /*----------------------------------------
                    CHECK EMAILJS
                ----------------------------------------*/

                if (
                    typeof emailjs ===
                    "undefined"
                ) {

                    console.error(
                        "EmailJS is not loaded."
                    );

                    showMessage(
                        "Email service is unavailable. Please try again later."
                    );

                    return;

                }


                /*----------------------------------------
                    SUBMIT BUTTON
                ----------------------------------------*/

                const submitButton =
                    confirmationForm.querySelector(
                        "button[type='submit'], button"
                    );


                const originalButtonText =
                    submitButton
                        ? submitButton.innerHTML
                        : "Submit";


                /*----------------------------------------
                    GET SAVED DATA
                ----------------------------------------*/

                const donationId =
                    sessionStorage.getItem(
                        "donationId"
                    );

                const name =
                    sessionStorage.getItem(
                        "donorName"
                    );

                const email =
                    sessionStorage.getItem(
                        "donorEmail"
                    );

                const mobile =
                    sessionStorage.getItem(
                        "donorMobile"
                    );

                const amount =
                    sessionStorage.getItem(
                        "donationAmount"
                    );

                const date =
                    sessionStorage.getItem(
                        "donationDate"
                    );


                const utr =
                    utrInput.value.trim();


                const remarks =
                    remarksInput
                        ? remarksInput.value.trim()
                        : "";


                /*----------------------------------------
                    CHECK DATA
                ----------------------------------------*/

                if (
                    !donationId ||
                    !name ||
                    !email ||
                    !mobile ||
                    !amount
                ) {

                    console.error(
                        "Missing donation data:",
                        {
                            donationId,
                            name,
                            email,
                            mobile,
                            amount
                        }
                    );


                    showMessage(
                        "Donation information is incomplete. Please restart the donation process."
                    );

                    return;

                }


                /*----------------------------------------
                    EMAIL VALIDATION
                ----------------------------------------*/

                const emailRegex =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailRegex.test(email)
                ) {

                    showMessage(
                        "The donor email address is invalid."
                    );

                    return;

                }


                /*----------------------------------------
                    EMAILJS PARAMETERS
                ----------------------------------------*/

                const params = {

                    donation_id:
                        donationId,

                    name:
                        name,

                    email:
                        email,

                    mobile:
                        mobile,

                    amount:
                        amount,

                    utr:
                        utr,

                    remarks:
                        remarks,

                    date:
                        date ||
                        new Date().toLocaleString(
                            "en-IN"
                        )

                };


                /*----------------------------------------
                    DEBUG
                ----------------------------------------*/

                console.log(
                    "================================"
                );

                console.log(
                    "SUN SHINE CLUB DONATION"
                );

                console.log(
                    "EmailJS Service:",
                    EMAILJS_SERVICE_ID
                );

                console.log(
                    "Admin Template:",
                    EMAILJS_ADMIN_TEMPLATE_ID
                );

                console.log(
                    "Donor Email:",
                    params.email
                );

                console.log(
                    "Parameters:",
                    params
                );

                console.log(
                    "================================"
                );


                /*----------------------------------------
                    START
                ----------------------------------------*/

                isSubmitting =
                    true;


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML = `
                        <i class="fas fa-spinner fa-spin"></i>
                        Sending...
                    `;

                }


                try {

                    /*====================================
                        SEND ONLY ADMIN TEMPLATE
                    ====================================*/

                    const response =
                        await emailjs.send(
                            EMAILJS_SERVICE_ID,
                            EMAILJS_ADMIN_TEMPLATE_ID,
                            params
                        );


                    /*====================================
                        SUCCESS
                    ====================================*/

                    console.log(
                        "✅ ADMIN EMAIL SENT"
                    );

                    console.log(
                        "Status:",
                        response.status
                    );

                    console.log(
                        "Response:",
                        response.text
                    );


                    /*
                        IMPORTANT:

                        EmailJS should now trigger:

                        template_Im1upie

                        as the Auto-Reply.

                        We do NOT call it here.
                    */


                    if (submitButton) {

                        submitButton.innerHTML = `
                            <i class="fas fa-check-circle"></i>
                            Submitted Successfully
                        `;

                    }


                    showMessage(
                        "🎉 Thank you!\n\n" +
                        "Your donation details have been submitted successfully.\n\n" +
                        "A confirmation email will be sent to " +
                        email +
                        "."
                    );


                    /*------------------------------------
                        RESET FORM
                    ------------------------------------*/

                    confirmationForm.reset();


                    /*------------------------------------
                        CLEAN SESSION
                    ------------------------------------*/

                    sessionStorage.removeItem(
                        "donationId"
                    );

                    sessionStorage.removeItem(
                        "donorName"
                    );

                    sessionStorage.removeItem(
                        "donorEmail"
                    );

                    sessionStorage.removeItem(
                        "donorMobile"
                    );

                    sessionStorage.removeItem(
                        "donationAmount"
                    );

                    sessionStorage.removeItem(
                        "donationDate"
                    );


                    /*------------------------------------
                        FINISH
                    ------------------------------------*/

                    setTimeout(
                        () => {

                            if (
                                paymentConfirmation
                            ) {

                                paymentConfirmation.style.display =
                                    "none";

                            }


                            if (submitButton) {

                                submitButton.disabled =
                                    false;

                                submitButton.innerHTML =
                                    originalButtonText;

                            }


                            isSubmitting =
                                false;

                        },
                        2500
                    );

                }

                catch (error) {

                    /*====================================
                        EMAIL ERROR
                    ====================================*/

                    console.error(
                        "❌ EMAILJS ERROR"
                    );

                    console.error(
                        "Status:",
                        error?.status
                    );

                    console.error(
                        "Text:",
                        error?.text
                    );

                    console.error(
                        "Full error:",
                        error
                    );

                    console.error(
                        "Parameters:",
                        params
                    );


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            originalButtonText;

                    }


                    isSubmitting =
                        false;


                    showMessage(
                        "Unable to send the donation confirmation email.\n\n" +
                        "Please check your details and try again."
                    );

                }

            }
        );

    }


    /*====================================================
                    COMPLETE
    ====================================================*/

    console.log(
        "❤️ Sun Shine Club Donate Page Ready"
    );

});
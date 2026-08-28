document.addEventListener("DOMContentLoaded", () => {

    const shareButton =
        document.getElementById("shareMember");

    if (!shareButton) return;


    shareButton.addEventListener("click", async () => {

        const title =
            document.title;

        const url =
            window.location.href;

        const text =
            `View ${document.querySelector("[itemprop='name']")?.textContent || "member"}'s profile on Sun Shine Club Kendupalli.`;


        if (navigator.share) {

            try {

                await navigator.share({
                    title: title,
                    text: text,
                    url: url
                });

            } catch (error) {

                if (error.name !== "AbortError") {
                    console.error(
                        "Share failed:",
                        error
                    );
                }

            }

        } else {

            try {

                await navigator.clipboard.writeText(url);

                showShareMessage(
                    "Profile link copied!"
                );

            } catch {

                prompt(
                    "Copy this profile link:",
                    url
                );

            }

        }

    });

});


function showShareMessage(message) {

    const toast =
        document.createElement("div");

    toast.className =
        "share-toast";

    toast.textContent =
        message;

    document.body.appendChild(toast);


    requestAnimationFrame(() => {
        toast.classList.add("show");
    });


    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2000);

}
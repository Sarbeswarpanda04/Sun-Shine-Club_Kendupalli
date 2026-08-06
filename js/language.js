const switcher = document.getElementById("languageSwitcher");

const DEFAULT_LANGUAGE = localStorage.getItem("language") || "en";

switcher.value = DEFAULT_LANGUAGE;

loadLanguage(DEFAULT_LANGUAGE);

switcher.addEventListener("change", () => {

    loadLanguage(switcher.value);

});

const flag = document.getElementById("languageFlag");

switcher.addEventListener("change", () => {

    switch (switcher.value) {

        case "en":
            flag.className = "fi fi-us";
            break;

        case "hi":
            flag.className = "fi fi-in";
            break;

        case "or":
            flag.className = "fi fi-in";
            break;

    }

});

async function loadLanguage(lang){

    const response = await fetch(`lang/${lang}.json`);

    const dictionary = await response.json();

    const elements = document.querySelectorAll("[data-lang]");

    // Fade Out
    elements.forEach(el=>{

        el.classList.add("fade-out");

    });

    setTimeout(()=>{

        elements.forEach(el=>{

            const key = el.dataset.lang;

            if(dictionary[key]){

                el.textContent = dictionary[key];

            }

            el.classList.remove("fade-out");

            el.classList.add("fade-in");

        });

        setTimeout(()=>{

            elements.forEach(el=>{

                el.classList.remove("fade-in");

            });

        },350);

    },300);

    localStorage.setItem("language",lang);

}
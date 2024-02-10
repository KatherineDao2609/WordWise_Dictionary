const wrapper = document.querySelector(".wrapper"),
searchInput = wrapper.querySelector("input"),
volume = wrapper.querySelector(".word i"),
infoText = wrapper.querySelector(".info-text"),
removeIcon = wrapper.querySelector(".search span");
let audio;

// Checks if the result object contains a title property. If it does, the API was unable to find a definition for the given word, so the 'infoText' with a message letting the user know that the word could not be found.//
function data(result, word){
    if(result.title){
        infoText.innerHTML = `Cannot find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }
    else{
      //setting up the "active" part in the wrapper (including word defenition, phontenics, example)//
        wrapper.classList.add("active");
      //Getting the first definition from the first meaning of the first result and formatting the part of speech and phonetic text into a string.//
        let definitions = result[0].meanings[0].definitions[0],
        phontetics = `${result[0].meanings[0].partOfSpeech}  ${result[0].phonetics[0].text}`;
      //Setting the word, part of speech, definition, and example in the appropriate HTML elements.//
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
      //Creating a new Audio object with the phonetic audio URL.//
        audio = new Audio(result[0].phonetics[0].audio);

    }
}

// Triggering an API request to retrieve the definition of the given word and updates the text input element with the searched word.//
function search(word){
    fetchApi(word);
    searchInput.value = word;
}

// Fetching data from Dictionary API by the URL. If the request is successful, the response data is converted to JSON (JSON data results returned from the API) and updated on HTML. If the request fails, the catch block will display an error message 'infoText', indicated that the entered word is not found on API. //
function fetchApi(word){
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(response => response.json()).then(result => data(result, word)).catch(() =>{
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}
// Code from Gibolt - Stackoverflow https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field //

      // Listen to the user entering the word and hitting "enter", which will trigger fetchAPI function to retrieve the word's defenition on Dictionary API. //
searchInput.addEventListener("keyup", e =>{
    let word = e.target.value.replace(/\s+/g, ' ');
    if(e.key == "Enter" && word){
        fetchApi(word);
    }
});

// End code from Gibolt - Stackoverflow


// Adding a click event listener to the volume icon and playing an audio file while changing the color of the volume icon temporarily to provide visual feedback. //
volume.addEventListener("click", ()=>{
    volume.style.color = "#4D59FB";
    audio.play();

//Returning the original color to the volume icon after 1000 milliseconds, or 1 second// 
    setTimeout(() =>{
        volume.style.color = "#999";
    }, 1000);
});

//Adding a click event to the remove icon "x" in search bar, which will clear the data in the search bar, as well as the 'active' part (defenition, example, volume icon) in the wrapper and replace it with the 'infoText'. //
removeIcon.addEventListener("click", ()=>{
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Type any existing word then press enter to get defenition and more";
});
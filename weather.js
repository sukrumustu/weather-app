


const form = document.querySelector("section.top-banner form");
const input = document.querySelector(".container input");
const  msg = document.querySelector("span.msg");
const list = document.querySelector(".ajax-section ul.cities");




localStorage.setItem("tokenKey", "+TxJY0DgN3ufLrO8ovIqJsI7SLN2pTd60VJJWxqHouVvjk4y/4OHA/AFQlrXCSTg");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    getWeatherDataFromApi();

}
);


const getWeatherDataFromApi = async () => {

    const tokenKey = DecryptStringAES(localStorage.getItem("tokenKey"));
    const inputValue = input.value;
    const units = "metric";
    const lang ="tr";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${tokenKey}&units=${units}&lang=${lang}`;

    try {
        // const response = await fetch(url).then(response => response.json());

        const response = await axios(url);
        
        const {main:{temp}, sys: {country}, weather, name} = response.data;

        const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
        const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;


        const cityNameSpans = list.querySelectorAll(".city span");
        const cityNameSpansArray = Array.from(cityNameSpans);
        if (cityNameSpansArray.length > 0) {
          const filteredArray = cityNameSpansArray.filter(
          (span) => span.innerText == name
          );
          if (filteredArray.length > 0) {
            msg.innerText = `${name} is already in the list, Please search for another city 😉`;
            setTimeout(() => {
              msg.innerText = "";
            }, 5000);
            form.reset();
            return;
          }
        }

        const createdLi = document.createElement('li');
        // createdLi.className = "city";
        createdLi.classList.add("city");
        createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${country}">
                            <span>${name}</span>
                            <sup>${country}</sup>
                            </h2>
            <div class="city-temp">${Math.round(temp)}<sup>°C</sup></div>
            <figure>
                <img class="city-icon" src="${iconUrl}">
                    <figcaption>${weather[0].description}</figcaption>
            </figure>`;
          //append vs. prepend
          list.prepend(createdLi);
        
    } catch (error) {
        console.log(error);
        msg.innerText = `404 (City Not Found)`;
        setTimeout(() =>{
            msg.innerText = "";}, 5000);        
    }
    form.reset();

};

const image = document.querySelector("#art");
image.src = "../src/art.jpg";
image.style.borderRadius = "24px";

const song_title = "Havana";
const artist = "Camila Cabello"; 
const time = "3:30";

const text = document.querySelector("#text");
text.setAttribute("text", `width: 1.8;color:black; value: ${song_title}`);

let audio = new Audio();
let currentTrackIndex = -1;
let tracks = [];
const image = document.querySelector("#art");
image.setAttribute("src", "../src/dummy.jfif");
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "audio/mp3";
fileInput.style.display = "none"; // Hide the input initially
document.body.appendChild(fileInput);

function loadTrack(index) {
  if (index >= 0 && index < tracks.length) {
    audio.src = URL.createObjectURL(tracks[index]);
    audio.load();
    audio.play();
    // Optionally, call the metadata function to show album art
    loadMetadata(tracks[index]);
  }
}

fileInput.addEventListener("change", function (event) {
  let files = event.target.files;
  loadMetadata(files[0]);
  tracks = Array.from(files); // Store the files in an array
  if (tracks.length > 0) {
    currentTrackIndex = 0;
    loadMetadata(tracks[currentTrackIndex]);
    loadTrack(currentTrackIndex);
  }
});

function Play() {
 
  if (audio.paused) {
    if (currentTrackIndex === -1) {
      alert("Please select an MP3 file.");
      fileInput.click();
    } else {
      const image = document.querySelector("#art");
      if (image) {
        image.setAttribute("src", "../src/art.jpg");
        audio.play();
      }
    }
  } else {
    audio.pause();
  }
}
 
function prevTrack() {
  fileInput.click();
}

 
function nextTrack() {
  if (tracks.length > 0 && currentTrackIndex < tracks.length - 1) {
    currentTrackIndex++;
    loadTrack(currentTrackIndex);
  } else {
    alert("No next track.");
  }
}

 
function loadMetadata(file) {
  jsmediatags.read(file, {
    onSuccess: function (tag) {
      const { title, artist, album, year, picture } = tag.tags;
      const text = document.querySelector("#text");
      text.setAttribute(
        "value",
        `Title: ${title}, Artist: ${artist}, Album: ${album}, Year: ${year}`
      );
       
      console.log(
        `Title: ${title}, Artist: ${artist}, Album: ${album}, Year: ${year}`
      );

      if (picture) {
        const data = new Uint8Array(picture.data);
        const base64String = btoa(
          data.reduce(
            (dataString, byte) => dataString + String.fromCharCode(byte),
            ""
          )
        );
        const imageDataUrl = `data:${picture.format};base64,${base64String}`;

        // You can display album art if desired
        const img = document.createElement("img");
        img.src = imageDataUrl;
        document.body.appendChild(img);
      } else {
        console.log("No picture available.");
      }
    },
    onError: function (error) {
      console.error("Error reading metadata:", error);
    },
  });
}

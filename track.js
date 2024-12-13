import { createCD } from "./createTrackElement";
import { setImage } from "./matirial";

// import {  setImage } from "./matirial";

let cd_count = 0;

let audio = new Audio();
let currentTrackIndex = -1;
let tracks = [];

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "audio/mp3";
fileInput.style.display = "none";  
document.body.appendChild(fileInput);

const addTrack = (scene, material) => {
  fileInput.addEventListener("change", function (event) {
    let files = event.target.files;

 
    if (files.length > 0) {
      const track = files[0];  
      const cd = {
        name: `cd${cd_count}`,
        track: [track],  
      };

      tracks.push(cd);

      const y = 0.5 + cd_count * 0.15;
      createCD(scene, material, 0, y, -4, track.name);

      cd_count++;
    }

  
    fileInput.value = "";
  });
  if (tracks.length < 8) {
    fileInput.click();
  } else {
    alert("You can't add more than 8 tracks");
  }

  return tracks;
};

const Play = () => {
  if (audio.paused) {
 
    if (currentTrackIndex === -1) {
      currentTrackIndex = 0;
      audio.src = URL.createObjectURL(tracks[currentTrackIndex].track[0]);
    }
    audio.play();
    
     
   
    // setImage(data.data.coverArt.data);
    loadMetadata(tracks[currentTrackIndex].track[0])
      .then((metadata) => {
        setImage(metadata.coverArt ? metadata.coverArt.data : null);
        console.log(metadata);
        alert("Metadata extracted successfully.");
        
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to extract metadata.");
      });
  } else {
 
    audio.pause();
  }
};

const Next = () => {
  if (currentTrackIndex < tracks.length - 1) {
    currentTrackIndex++;
    audio.src = URL.createObjectURL(tracks[currentTrackIndex].track[0]);
    audio.play();
    const data = loadMetadata(tracks[currentTrackIndex].track[0]);
    console.log(data);
  }
};
const Prev = () => {
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
    audio.src = URL.createObjectURL(tracks[currentTrackIndex].track[0]);
    audio.play();
    const data = loadMetadata(tracks[currentTrackIndex].track[0]);
    console.log(data.data);
  }
};
 
function loadMetadata(file) {
    return new Promise((resolve, reject) => {
        new jsmediatags.Reader(file)
            .setTagsToRead(["title", "artist", "album", "picture"])  
            .read({
                onSuccess: ({ tags }) => {
                    
                    const coverArt = tags.picture ? {
                        format: tags.picture.format,
                        data: `data:${tags.picture.format};base64,${arrayBufferToBase64(tags.picture.data)}`
                    } : null;

                    // Resolve with structured metadata
                    resolve({
                        title: tags.title || "Unknown Title",
                        artist: tags.artist || "Unknown Artist",
                        album: tags.album || "Unknown Album",
                        coverArt: coverArt || null,
                    });
                },
                onError: (error) => reject(`Error reading metadata: ${error}`),
            });
    });
}

 
function arrayBufferToBase64(buffer) {
    return window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
export { addTrack, Play, Next, Prev };

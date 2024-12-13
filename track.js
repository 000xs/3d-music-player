import {
  chanagePositionPlay,
  controlerPosition,
  createCD,
} from "./createTrackElement";
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

const Play = (scene) => {
  if (audio.paused) {
    if (currentTrackIndex === -1) {
      currentTrackIndex = 0;
      audio.src = URL.createObjectURL(tracks[currentTrackIndex].track[0]);
    }
    audio.play();
    chanagePositionPlay(currentTrackIndex, scene);
    controlerPosition(scene, 60);

    // setImage(data.data.coverArt.data);
    loadMetadata(tracks[currentTrackIndex].track[0])
      .then((metadata) => {
        setImage(metadata.coverArt ? metadata.coverArt.data : null);
        console.log(metadata);
      })
      .catch((error) => {
        console.error(error);
      });
    audio.addEventListener("timeupdate", () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration; // Total duration of the track
      const percentage = (currentTime / duration) * 100;
      controlerPosition(scene, percentage); // Update controller position
    });
  } else {
    audio.pause();
  }
};

const Next = (scene) => {
  if (currentTrackIndex < tracks.length - 1) {
    currentTrackIndex++;
    audio.src = URL.createObjectURL(tracks[currentTrackIndex].track[0]);
    audio.play();
    loadMetadata(tracks[currentTrackIndex].track[0])
      .then((metadata) => {
        setImage(metadata.coverArt ? metadata.coverArt.data : null);
        console.log(metadata);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration; // Total duration of the track
    const percentage = (currentTime / duration) * 100;
    controlerPosition(scene, percentage); // Update controller position
  });
};
const Prev = (scene) => {
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
    audio.src = URL.createObjectURL(tracks[currentTrackIndex].track[0]);
    audio.play();
    loadMetadata(tracks[currentTrackIndex].track[0])
      .then((metadata) => {
        setImage(metadata.coverArt ? metadata.coverArt.data : null);
        console.log(metadata);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  audio.addEventListener("timeupdate", () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration; // Total duration of the track
    const percentage = (currentTime / duration) * 100;
    controlerPosition(scene, percentage); // Update controller position
  });
};

function loadMetadata(file) {
  return new Promise((resolve, reject) => {
    new jsmediatags.Reader(file)
      .setTagsToRead(["title", "artist", "album", "picture"])
      .read({
        onSuccess: ({ tags }) => {
          const coverArt = tags.picture
            ? {
                format: tags.picture.format,
                data: `data:${tags.picture.format};base64,${arrayBufferToBase64(
                  tags.picture.data
                )}`,
              }
            : null;

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

function updateAudioPlayback(positionX) {
  const minPosition = 0.65;
  const maxPosition = -0.65;

  const normalizedTime =
    ((positionX - minPosition) / (maxPosition - minPosition)) * audio.duration;

  if (!isNaN(normalizedTime)) {
    audio.currentTime = normalizedTime; // Update audio current time based on position
  }
}

function arrayBufferToBase64(buffer) {
  return window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export { addTrack, Play, Next, Prev };

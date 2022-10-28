import { Howl, Howler } from "howler";

Howler.volume(0.2);

let player = new Howl({
    src: ["keroshort.mp3"],
});

let analyzer = Howler.ctx.createAnalyser();
Howler.masterGain.connect(analyzer);
analyzer.connect(Howler.ctx.destination);
analyzer.fftSize = 2048;
let bufferLength = analyzer.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

export const updateDataArray = () => {
    analyzer.getByteFrequencyData(dataArray);
    return dataArray;
};
export const setPlayer = (to: Howl) => {
    player = to;
};
export const playPlayer = () => {
    player.play();
};

export const stopPlayer = () => {
    player.stop();
};

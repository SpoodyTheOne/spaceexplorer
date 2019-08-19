var loadedSounds = {};

var masterVolume = 1;

function playSound(str,v)
{
    if (typeof loadedSounds[str] != "null") {
    var sound = new Audio("./mp3/" + str);
    sound.volume = masterVolume*(v != null ? v : 1);
    sound.play();

    loadedSounds[str] = sound;

    return sound;
    } else {
        loadedSounds[str].load();
        loadedSounds[str].play();
    }
}
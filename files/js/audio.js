var loadedSounds = {};

function playSound(str)
{
    if (typeof loadedSounds[str] != "null") {
    var sound = new Audio("./mp3/" + str);
    sound.play();

    loadedSounds[str] = sound;

    return sound;
    } else {
        loadedSounds[str].load();
        loadedSounds[str].play();
    }
}
function playSound(sound)
{
    var sound = new Audio("./mp3/" + sound);
    sound.play();
    return sound;
}
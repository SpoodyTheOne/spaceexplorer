var changelogs = new Array();
var version = "0.1.0.3";

function changelog(title,vers,date,text)
{
    changelogs.push(
        `<h2>${title}</h2>
        <h3>v${vers}</h3>
        <h3>${date}</h3>
        <pre>${text}</pre>`);
}

changelogs.push(
`<h2>Changelogs are here!</h2>
<h3>v0.1.0</h3>
<h3>16/8/2019</h3>
<pre>We added changelogs so you can figure out what we changed and what we didnt change.
In other news game is still far from ready for release</pre>`);

changelogs.push(
    `<h2>New commands</h2>
    <h3>v0.1.0.1</h3>
    <h3>16/8/2019</h3>
    <pre>Don't you hate when you get stuck 50 000 000 meters away from everybody else? Fear not, 
the <strong>!reload</strong> command is here!
<strong>!reload</strong>,<strong>!rejoin</strong>,<strong>!exit</strong> and <strong>!home</strong> have arrived. Their uses are pretty self explanetory</pre>`);

changelogs.push(
    `<h2>Improved netcode</h2>
    <h3>v0.1.0.2</h3>
    <h3>19/8/2019</h3>
    <pre>Gone are the days of glithing through your friends because we fixed the netcode!
Also added new commands. See if you can find out what they are. (hint: !cmds)</pre>`);

changelog("Android support","v0.1.0.3","22/08/2019",`Now you can play on the go with android support!
If you would like to download goto <a href='http://space-explore.herokuapp.com/download/android' download='spaceexplorer.apk'>http://space-explore.herokuapp.com/download/android</a>`)
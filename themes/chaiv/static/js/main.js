let pos = 0;
let albums = [
    ["Djesse", "Jacob Collier", "djesse.jpg", "https://open.spotify.com/album/47bMDS4CMLbqcIVjEMWUjK?si=Pm49KxDxT7y9D3kg1DD9eA"],
    ["re:member", "Ólafur Arnalds", "remember.jpg", "https://open.spotify.com/album/6JpQGIi2he6iskzR4aLwPG?si=pPyTsRZGRcG2-BpKzECX-Q"],
    ["In the Heights", "Musical", "intheheights.jpg", "https://open.spotify.com/album/3VPHalWocJfe7VfbEW60zg?si=vtDvoGIGTNqhquQi3Gg0CA"],
    ["Culcha Vulcha", "Snarky Puppy", "culchavulcha.jpg", "https://open.spotify.com/album/2y5N5FEb9giR3d1BP9wX9n?si=Est5Ep2UQL-bjgan94uQHw"],
    ["Down to Earth", "Flight Facilities", "downtoearth.jpg", "https://open.spotify.com/album/3ymNidn5GJ9cVhGo2Symqk?si=YkW6hDyORPaSxIO8DXhP3w"]
]

function appendAlbum(album) {
    let name = album[0];
    let artist = album[1];
    let fname = album[2];
    let spotifyLink = album[3];

    let musicEl = document.getElementById("music");
    let aEl = document.createElement("a");
    let imgEl = document.createElement("img");
    imgEl.src = "img/" + fname;
    imgEl.title = name + " (" + artist + ")";
    aEl.href = spotifyLink;
    aEl.target = "_blank";
    aEl.appendChild(imgEl);
    musicEl.appendChild(aEl);
}

function nudgeMusic(dir) { // 1 for right, -1 for left
    // check bounds
    if (dir + pos > 0 || -(pos + dir)  >= albums.length) {
        return false
    }
    pos += dir;

    updateArrows();

    let el = document.getElementById("music");
    let ml = el.style.marginLeft;
    let amtPx = dir * 200;

    // base case (no margin-left defined)
    if (ml == "") {
        el.style.marginLeft = amtPx.toString() + "px";
        return true
    }

    // adjust the element
    ml = ml.replace("px", "");
    ml = parseInt(ml);
    ml += amtPx;
    el.style.marginLeft = ml.toString() + "px";
    return true
}

function updateArrows() {
    let leftEl = document.getElementById("previous");
    let rightEl = document.getElementById("next");

    if (pos == 0) leftEl.style.opacity = 0;
    else leftEl.style.opacity = 1;

    if (pos == (albums.length-1) * -1) rightEl.style.opacity = 0;
    else rightEl.style.opacity = 1;
}

window.onload = () => {
    feather.replace();

    for (let i in albums) {
        let album = albums[i];
        appendAlbum(album);
    }

    updateArrows();

    // bind arrow keys to music carousel
    document.onkeydown = (e) => {
        if(e.keyCode == 37) nudgeMusic(1);
        if(e.keyCode == 39) nudgeMusic(-1);
    }

    // bind scroll in music carousel to nudges
    document.getElementById("music").onwheel = (e) => {
        e.preventDefault();

        if (e.deltaX > 0 || e.deltaY < 0) wheeled = nudgeMusic(1);
        else if (e.deltaX < 0 || e.deltaY > 0) wheeled = nudgeMusic(-1);
    }
}
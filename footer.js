/* =========================
ACTIVE PAGE DETECT
========================= */

const currentPath =
location.pathname;

/* PAGE CHECK */

const isHome =

currentPath.endsWith("/") ||

currentPath.endsWith("/index.html");

const isMescidler =
currentPath.includes("mescidler");

const isSosyal =
currentPath.includes("sosyal");

const isIletisim =
currentPath.includes("iletisim");


/* =========================
RENDER FOOTER
========================= */

document.write(`

<nav class="bottom-nav">

<!-- ANA -->

<button
type="button"
class="nav-item ${isHome ? "active" : ""}"
onclick="location.href='index.html'"
>

<i class="ri-home-5-line nav-icon"></i>

<span>
Ana
</span>

</button>


<!-- MESCIDLER -->

<button
type="button"
class="nav-item ${isMescidler ? "active" : ""}"
onclick="location.href='mescidler.html'"
>

<i class="ri-star-line nav-icon"></i>

<span>
Mescidler
</span>

</button>


<!-- CENTER FAB -->

<button
type="button"
class="nav-fab"
onclick="handleCenterAction()"
aria-label="Mescid Değerlendir"
>

<i class="ri-add-line"></i>

</button>


<!-- SOSYAL -->

<button
type="button"
class="nav-item ${isSosyal ? "active" : ""}"
onclick="location.href='sosyal.html'"
>

<i class="ri-group-line nav-icon"></i>

<span>
Sosyal
</span>

</button>


<!-- ILETISIM -->

<button
type="button"
class="nav-item ${isIletisim ? "active" : ""}"
onclick="location.href='iletisim.html'"
>

<i class="ri-mail-line nav-icon"></i>

<span>
İletişim
</span>

</button>

</nav>

`);


/* =========================
CENTER BUTTON SYSTEM
========================= */

function handleCenterAction(){

const path =
location.pathname;

/* HOME */

const isHome =

path.endsWith("/") ||

path.endsWith("/index.html") ||

path === "";

/* OPEN MODAL */

if(isHome){

if(typeof startForm === "function"){

startForm();

return;

}

}

/* OTHER PAGE */

location.href =
"index.html";

}
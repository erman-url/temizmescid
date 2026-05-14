document.write(`

<nav class="footer">

<!-- ANA -->

<div
class="nav-item"
onclick="location.href='index.html'"
>

<span class="nav-icon">
⌂
</span>

<p>
Ana
</p>

</div>

<!-- MESCİDLER -->

<div
class="nav-item"
onclick="location.href='mescidler.html'"
>

<span class="nav-icon">
★
</span>

<p>
Mescidler
</p>

</div>

<!-- CENTER ACTION -->

<button
type="button"
class="center-btn"
onclick="handleCenterAction()"
>
+
</button>

<!-- SOSYAL -->

<div
class="nav-item"
onclick="location.href='sosyal.html'"
>

<span class="nav-icon">
◎
</span>

<p>
Sosyal
</p>

</div>

<!-- İLETİŞİM -->

<div
class="nav-item"
onclick="location.href='iletisim.html'"
>

<span class="nav-icon">
✉
</span>

<p>
İletişim
</p>

</div>

</nav>

`);

/* =========================
CENTER BUTTON SYSTEM
========================= */

function handleCenterAction(){

const path =
location.pathname;

/* INDEX PAGE */

const isHome =

path.endsWith("/") ||

path.endsWith("/index.html") ||

path === "";

/* INDEX → OPEN MODAL */

if(isHome){

if(typeof startForm === "function"){

startForm();

return;

}

}

/* OTHER PAGES → HOME */

location.href = "index.html";

}
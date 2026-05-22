/* =========================
CITY / DISTRICT SYSTEM FINAL
========================= */

function normalizeTR(text){

return String(text || "")

.toLocaleLowerCase("tr-TR")

.normalize("NFC")

.trim();

}

function initCitySystem(){

const citySelect =
document.getElementById("city");

const districtSelect =
document.getElementById("district");

/* =========================
ELEMENT CHECK
========================= */

if(
!citySelect ||
!districtSelect ||
typeof window.CITY_DATA !== "object" ||
window.CITY_DATA === null
){
return;
}

/* =========================
RESET SELECTS
========================= */

citySelect.innerHTML = `
<option value="">
Şehir Seçiniz
</option>
`;

districtSelect.innerHTML = `
<option value="">
Önce Şehir Seçin
</option>
`;

districtSelect.disabled = true;

/* =========================
CITY LIST
========================= */

const cities =

Object.keys(window.CITY_DATA)

.filter(city=>

typeof city === "string" &&
city.trim().length

)

/* UNIQUE */

.filter((city,index,array)=>

array.indexOf(city) === index

)

/* SORT */

.sort((a,b)=>

a.localeCompare(
b,
"tr"
)

);

/* =========================
CITY APPEND
========================= */

const cityFragment =
document.createDocumentFragment();

cities.forEach(city=>{

const option =
document.createElement("option");

option.value = city;

option.textContent = city;

cityFragment.appendChild(option);

});

citySelect.appendChild(
cityFragment
);

/* =========================
REMOVE OLD EVENT
========================= */

if(citySelect._cityHandler){

citySelect.removeEventListener(
"change",
citySelect._cityHandler
);

}

/* =========================
CHANGE HANDLER
========================= */

const handleCityChange = ()=>{

const selectedCity =
citySelect.value;

/* RESET */

districtSelect.innerHTML = `
<option value="">
İlçe Seçiniz
</option>
`;

districtSelect.disabled = true;

/* EMPTY */

if(!selectedCity){
return;
}

/* INVALID */

if(
!Object.prototype.hasOwnProperty.call(
window.CITY_DATA,
selectedCity
)
){
return;
}

const rawDistricts =
window.CITY_DATA[selectedCity];

/* INVALID */

if(
!Array.isArray(rawDistricts)
){
return;
}

/* =========================
DISTRICT CLEAN
========================= */

const districts =

[...new Set(

rawDistricts

.filter(district=>

typeof district === "string" &&
district.trim().length

)

.map(district=>

district.trim()

)

)]

.sort((a,b)=>

a.localeCompare(
b,
"tr"
)

);

/* EMPTY */

if(!districts.length){
return;
}

/* =========================
DISTRICT APPEND
========================= */

const districtFragment =
document.createDocumentFragment();

districts.forEach(district=>{

const option =
document.createElement("option");

option.value = district;

option.textContent = district;

districtFragment.appendChild(option);

});

districtSelect.appendChild(
districtFragment
);

districtSelect.disabled = false;

};

/* =========================
SAVE EVENT
========================= */

citySelect._cityHandler =
handleCityChange;

/* =========================
BIND EVENT
========================= */

citySelect.addEventListener(
"change",
handleCityChange
);

}
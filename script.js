const content = document.getElementById("content");
const modal = document.getElementById("modal");
const modalJP = document.getElementById("modalJP");
const speakButton = document.getElementById("speak");
const closeBtn = document.getElementById("close");

const yenTopInput = document.getElementById("yenTopInput");
const yenTopResult = document.getElementById("yenTopResult");
const yenSwapBtn = document.getElementById("yenSwapBtn");

// כיוון ההמרה: true = ין -> שקל, false = שקל -> ין
let yenToShekel = true;

function updateYenConversion(){
    if(!yenTopInput || !yenTopResult) return;
    const amount = parseFloat(yenTopInput.value) || 0;
    if(yenToShekel){
        yenTopResult.textContent = (amount * currentYenRate).toFixed(2) + " ₪";
    } else {
        yenTopResult.textContent = (amount / currentYenRate).toFixed(2) + " ¥";
    }
}

let currentTab = "phrases";
let currentYenRate = 0.024;
const fallbackYenRate = 0.024;

let clickCounts = {};
let warningTimeout = null;
let hasShownWarning = false;

// ניהול מועדפים
let favorites = JSON.parse(localStorage.getItem("japan_pocket_favs")) || [];

// אזהרת ווליום
const volumeWarning = document.createElement("div");
volumeWarning.style.cssText = `
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    padding: 15px 25px;
    border-radius: 15px;
    color: #212121;
    z-index: 1000;
    background: #e8e8e8;
    font-weight: bold;
    font-size: 17px;
    box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
    display: none;
    direction: rtl;
    text-align: center;
`;
volumeWarning.textContent = "ייתכן שהווליום במכשיר שלך מכובה או על שקט";
document.body.appendChild(volumeWarning);

async function fetchLiveYenRate() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/JPY");
        if (response.ok) {
            const data = await response.json();
            if (data && data.rates && data.rates.ILS) {
                currentYenRate = data.rates.ILS;
            }
        }
    } catch (e) {
        currentYenRate = fallbackYenRate;
    }
}
fetchLiveYenRate();

if (yenTopInput) {
    yenTopInput.addEventListener("input", () => {
        if(yenTopInput.value.length > 10) {
            yenTopInput.value = yenTopInput.value.slice(0, 10);
        }
        updateYenConversion();
    });
}

if (yenSwapBtn) {
    yenSwapBtn.addEventListener("click", () => {
        // ממיר את הסכום הקיים לצד השני כדי לשמור על רציפות, ואז מחליף כיוון
        const currentAmount = parseFloat(yenTopInput.value) || 0;
        const convertedAmount = yenToShekel
            ? currentAmount * currentYenRate
            : currentAmount / currentYenRate;

        yenToShekel = !yenToShekel;

        yenTopInput.placeholder = yenToShekel ? "הכנס סכום ¥" : "הכנס סכום ₪";
        yenTopInput.value = currentAmount ? convertedAmount.toFixed(2) : "";

        updateYenConversion();

        yenSwapBtn.classList.remove("spin");
        void yenSwapBtn.offsetWidth;
        yenSwapBtn.classList.add("spin");
    });
}

const database = {
phrases:[
{he:"שלום",en:"Hello",jp:"こんにちは",romaji:"Konnichiwa"},
{he:"בוקר טוב",en:"Good Morning",jp:"おはようございます",romaji:"Ohayou Gozaimasu"},
{he:"ערב טוב",en:"Good Evening",jp:"こんばんは",romaji:"Konbanwa"},
{he:"לילה טוב",en:"Good Night",jp:"おやすみなさい",romaji:"Oyasuminasai"},
{he:"תודה רבה",en:"Thank You",jp:"ありがとうございます",romaji:"Arigatou Gozaimasu"},
{he:"סליחה",en:"Excuse Me",jp:"すみません",romaji:"Sumimasen"},
{he:"כן",en:"Yes",jp:"はい",romaji:"Hai"},
{he:"לא",en:"No",jp:"いいえ",romaji:"Iie"},
{he:"אני לא מבין",en:"I don't understand",jp:"わかりません",romaji:"Wakarimasen"},
{he:"אפשר לעזור לי?",en:"Can you help me?",jp:"助けてください",romaji:"Tasukete Kudasai"},
{he:"איפה השירותים?",en:"Where is the toilet?",jp:"トイレはどこですか？",romaji:"Toire wa Doko Desu Ka"},
{he:"כמה זה עולה?",en:"How much is it?",jp:"いくらですか？",romaji:"Ikura Desu Ka"},
{he:"אני מישראל",en:"I'm from Israel",jp:"イスラエルから来ました",romaji:"Isuraeru kara kimashita"},
{he:"אפשר מים?",en:"Water Please",jp:"水をください",romaji:"Mizu o kudasai"},
{he:"אפשר את החשבון?",en:"The Bill Please",jp:"お会計お願いします",romaji:"Okaikei onegaishimasu"},
{he:"טעים מאוד",en:"Very Delicious",jp:"とてもおいしいです",romaji:"Totemo oishii desu"},
{he:"אפשר Wi-Fi?",en:"Do You Have Wi-Fi?",jp:"Wi-Fiはありますか？",romaji:"Wi-Fi wa arimasu ka"}
],
food:[
{he:"סושי",en:"Sushi",jp:"寿司"},
{he:"ראמן",en:"Ramen",jp:"ラーメン"},
{he:"אוניגירי",en:"Onigiri",jp:"おにぎり"},
{he:"טמפורה",en:"Tempura",jp:"天ぷら"},
{he:"גיוזה",en:"Gyoza",jp:"餃子"},
{he:"אודון",en:"Udon",jp:"うどん"},
{he:"סובה",en:"Soba",jp:"そば"},
{he:"בנטו",en:"Bento",jp:"弁当"},
{he:"טאקויאקי",en:"Takoyaki",jp:"たこ焼き"},
{he:"יאקיטורי",en:"Yakitori",jp:"焼き鳥"},
{he:"קארי",en:"Japanese Curry",jp:"カレー"},
{he:"מוצ'י",en:"Mochi",jp:"餅"}
],
transport:[
{he:"רכבת",en:"Train",jp:"電車"},
{he:"תחנה",en:"Station",jp:"駅"},
{he:"רציף",en:"Platform",jp:"ホーム"},
{he:"יציאה",en:"Exit",jp:"出口"},
{he:"כניסה",en:"Entrance",jp:"入口"},
{he:"שינקנסן",en:"Shinkansen",jp:"新幹線"},
{he:"מטרו",en:"Metro",jp:"地下鉄"},
{he:"אוטובוס",en:"Bus",jp:"バス"},
{he:"מונית",en:"Taxi",jp:"タクシー"},
{he:"שדה תעופה",en:"Airport",jp:"空港"}
],
shopping:[
{he:"כמה זה עולה?",en:"How much?",jp:"いくらですか？"},
{he:"כרטיס אשראי",en:"Credit Card",jp:"クレジットカード"},
{he:"מזומן",en:"Cash",jp:"現金"},
{he:"קבלה",en:"Receipt",jp:"レシート"},
{he:"שקית",en:"Bag",jp:"袋"},
{he:"זול",en:"Cheap",jp:"安い"},
{he:"יקר",en:"Expensive",jp:"高い"}
],
emergency:[
{he:"משטרה",en:"Police",jp:"警察"},
{he:"אמבולנס",en:"Ambulance",jp:"救急車"},
{he:"בית חולים",en:"Hospital",jp:"病院"},
{he:"רופא",en:"Doctor",jp:"医者"},
{he:"אני צריך עזרה",en:"Help",jp:"助けてください"},
{he:"אני חולה",en:"I'm Sick",jp:"気分が悪いです"}
]
};

function speak(text){
if(!window.speechSynthesis) return;
clickCounts[text] = (clickCounts[text] || 0) + 1;
if(clickCounts[text] >= 3 && !hasShownWarning){
    hasShownWarning = true;
    volumeWarning.style.display = "block";
    if(warningTimeout) clearTimeout(warningTimeout);
    warningTimeout = setTimeout(()=>{ volumeWarning.style.display = "none"; }, 4000);
}
speechSynthesis.cancel();
const speech = new SpeechSynthesisUtterance(text);
speech.lang = "ja-JP";
speech.rate = 0.9;
const voices = speechSynthesis.getVoices();
const jpVoice = voices.find(v=>v.lang.startsWith("ja"));
if(jpVoice){ speech.voice = jpVoice; }
speechSynthesis.speak(speech);
}

function openModal(jpText) {
    const allItems = [...database.phrases, ...database.food, ...database.transport, ...database.shopping, ...database.emergency];
    const found = allItems.find(i => i.jp === jpText);
    if (found && modalJP) {
        modalJP.textContent = found.jp;
    }
    if(modal) modal.classList.remove("hidden");
}

if (closeBtn) {
    closeBtn.addEventListener("click", () => { modal.classList.add("hidden"); });
}

if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) { modal.classList.add("hidden"); }
    });
}

if (speakButton) {
    speakButton.addEventListener("click", () => { speak(modalJP.textContent); });
}

// ניהול מועדפים - כפתור לב
function toggleFavorite(jp, btnEl) {
    const index = favorites.indexOf(jp);
    const willBeFav = index === -1;

    if (willBeFav) {
        favorites.push(jp);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem("japan_pocket_favs", JSON.stringify(favorites));

    if (btnEl) {
        // עדכון מיידי של הכפתור שנלחץ, בלי לרנדר את כל הרשימה מחדש
        const icon = btnEl.querySelector("i");
        btnEl.classList.toggle("is-fav", willBeFav);
        if (icon) {
            icon.classList.toggle("fa-solid", willBeFav);
            icon.classList.toggle("fa-regular", !willBeFav);
        }
        btnEl.classList.remove("pop");
        // מפעיל reflow כדי שהאנימציה תרוץ מחדש בכל לחיצה
        void btnEl.offsetWidth;
        btnEl.classList.add("pop");

        if (currentTab === "favorites" && !willBeFav) {
            // הוסר ממועדפים בזמן שמסתכלים על טאב המועדפים - צריך לרנדר מחדש כדי שייעלם
            render();
        }
    } else {
        render();
    }
}

function createCard(item){
let isFav = favorites.includes(item.jp);
return `
<div class="card" onclick="openModal('${item.jp.replace(/'/g, "\\'")}')">
<div style="width: 100%; box-sizing: border-box;">
<div class="cardMain" style="width: 100%; box-sizing: border-box;">
<div class="cardText" style="min-width: 0; overflow: hidden; text-overflow: ellipsis;">
<div class="cardHe">${item.he}</div>
<div class="cardJp">${item.jp}</div>
${item.romaji ? `<div class="cardRomaji">${item.romaji}</div>` : ""}
</div>
<button class="fav-btn${isFav ? ' is-fav' : ''}" onclick="event.stopPropagation(); toggleFavorite('${item.jp.replace(/'/g, "\\'")}', this)" aria-label="הוסף למועדפים">
<i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
</button>
<button class="playBtn" onclick="event.stopPropagation(); speak('${item.jp}')" aria-label="השמע">
<span class="playIcon"></span>
</button>
</div>
${item.en ? `<div class="cardEn">${item.en}</div>` : ""}
</div>
<div class="buttons" onclick="event.stopPropagation();">
<button onclick="speak('${item.jp}')">🔊 השמע</button>
</div>
</div>
`;
}

function renderCards(list){
    content.innerHTML="";
    if(list.length===0){
        content.innerHTML=`<div class="card" style="text-align:center; grid-column: 1 / -1;"><h2 style="font-size:32px;">🤍</h2><p style="margin-top:8px;">אין עדיין פריטים במועדפים</p></div>`;
        return;
    }
    list.forEach(item=>{ content.innerHTML+=createCard(item); });
}

function render(){
    let list = [];
    switch(currentTab){
        case "phrases": list = database.phrases; break;
        case "food": list = database.food; break;
        case "transport": list = database.transport; break;
        case "shopping": list = database.shopping; break;
        case "emergency": list = database.emergency; break;
        case "favorites": 
            const allItems = [...database.phrases, ...database.food, ...database.transport, ...database.shopping, ...database.emergency];
            list = allItems.filter(item => favorites.includes(item.jp));
            break;
    }
    renderCards(list);
}

document.querySelectorAll(".tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
        document.querySelectorAll(".tab").forEach(btn=>{ btn.classList.remove("active"); });
        tab.classList.add("active");
        currentTab=tab.dataset.tab;
        render();
    });
});

// הפעלת מתג מצב כהה (שמש/ירח)
const darkCheckbox = document.getElementById("darkCheckbox");
if (darkCheckbox) {
    if (localStorage.getItem("dark_mode") === "true") {
        document.body.classList.add("dark-mode");
        darkCheckbox.checked = true;
    }

    darkCheckbox.addEventListener("change", () => {
        if (darkCheckbox.checked) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("dark_mode", "true");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("dark_mode", "false");
        }
    });
}

render();
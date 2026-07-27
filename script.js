// ===============================
// 🇯🇵 JAPAN POCKET 2.0
// ===============================

const content = document.getElementById("content");
const modal = document.getElementById("modal");
const speakButton = document.getElementById("speak");
const closeButton = document.getElementById("close");

const yenTopInput = document.getElementById("yenTopInput");
const yenTopResult = document.getElementById("yenTopResult");

let currentTab = "phrases";
let currentYenRate = 0.024;

async function fetchLiveYenRate() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/JPY");
        if (response.ok) {
            const data = await response.json();
            if (data && data.rates && data.rates.ILS) {
                currentYenRate = data.rates.ILS;
            }
        }
    } catch (e) {}
}
fetchLiveYenRate();

if (yenTopInput) {
    yenTopInput.addEventListener("input", () => {
        const yen = parseFloat(yenTopInput.value) || 0;
        yenTopResult.textContent = "₪ " + (yen * currentYenRate).toFixed(2);
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
{he:"כמה זה עולה?",en:"How much is it?",jp:"いくらですか？",romaji:"Ikura Desu Ka"}
],

food:[
{he:"סושי",en:"Sushi",jp:"寿司",image:"🍣"},
{he:"ראמן",en:"Ramen",jp:"ラーメン",image:"🍜"},
{he:"אוניגירי",en:"Onigiri",jp:"おにぎり",image:"🍙"},
{he:"טמפורה",en:"Tempura",jp:"天ぷら",image:"🍤"},
{he:"גיוזה",en:"Gyoza",jp:"餃子",image:"🥟"},
{he:"אודון",en:"Udon",jp:"うどん",image:"🍜"},
{he:"סובה",en:"Soba",jp:"そば",image:"🍜"},
{he:"בנטו",en:"Bento",jp:"弁当",image:"🍱"},
{he:"טאקויאקי",en:"Takoyaki",jp:"たこ焼き",image:"🐙"},
{he:"יאקיטורי",en:"Yakitori",jp:"焼き鳥",image:"🍢"}
],

transport:[
{he:"רכבת",en:"Train",jp:"電車",image:"🚆"},
{he:"תחנה",en:"Station",jp:"駅",image:"🚉"},
{he:"רציף",en:"Platform",jp:"ホーム",image:"🛑"},
{he:"יציאה",en:"Exit",jp:"出口",image:"🚪"},
{he:"כניסה",en:"Entrance",jp:"入口",image:"🚪"},
{he:"שינקנסן",en:"Shinkansen",jp:"新幹線",image:"🚄"},
{he:"מטרו",en:"Metro",jp:"地下鉄",image:"🚇"},
{he:"אוטובוס",en:"Bus",jp:"バス",image:"🚌"},
{he:"מונית",en:"Taxi",jp:"タクシー",image:"🚕"},
{he:"שדה תעופה",en:"Airport",jp:"空港",image:"✈️"},
{he:"כרטיס",en:"Ticket",jp:"切符",image:"🎫"},
{he:"מכונת כרטיסים",en:"Ticket Machine",jp:"券売機",image:"🖨️"},
{he:"רכבת אחרונה",en:"Last Train",jp:"終電",image:"🌙"},
{he:"מדרגות נעות",en:"Escalator",jp:"エスカレーター",image:"🛝"},
{he:"מעלית",en:"Elevator",jp:"エレベーター",image:"🛗"}
],

shopping:[
{he:"כמה זה עולה?",en:"How much?",jp:"いくらですか？",image:"💰"},
{he:"כרטיס אשראי",en:"Credit Card",jp:"クレジットカード",image:"💳"},
{he:"מזומן",en:"Cash",jp:"現金",image:"💵"},
{he:"קבלה",en:"Receipt",jp:"レシート",image:"🧾"},
{he:"שקית",en:"Bag",jp:"袋",image:"🛍️"},
{he:"מבצע",en:"Sale",jp:"セール",image:"🏷️"},
{he:"פתוח",en:"Open",jp:"営業中",image:"🟢"},
{he:"סגור",en:"Closed",jp:"閉店",image:"🔴"},
{he:"קטן",en:"Small",jp:"小さい",image:"🔹"},
{he:"בינוני",en:"Medium",jp:"中",image:"🔸"},
{he:"גדול",en:"Large",jp:"大きい",image:"🔶"},
{he:"אני רק מסתכל",en:"Just Looking",jp:"見ているだけです",image:"👀"},
{he:"אפשר למדוד?",en:"Can I Try It On?",jp:"試着できますか？",image:"👕"},
{he:"זול",en:"Cheap",jp:"安い",image:"📉"},
{he:"יקר",en:"Expensive",jp:"高い",image:"📈"}
],

emergency:[
{he:"משטרה",en:"Police",jp:"警察",image:"👮‍♂️"},
{he:"אמבולנס",en:"Ambulance",jp:"救急車",image:"🚑"},
{he:"בית חולים",en:"Hospital",jp:"病院",image:"🏥"},
{he:"בית מרקחת",en:"Pharmacy",jp:"薬局",image:"💊"},
{he:"רופא",en:"Doctor",jp:"医者",image:"👨‍⚕️"},
{he:"אני צריך עזרה",en:"Help",jp:"助けてください",image:"🆘"},
{he:"אני חולה",en:"I'm Sick",jp:"気分が悪いです",image:"🤒"},
{he:"אני אלרגי",en:"I Have Allergies",jp:"アレルギーがあります",image:"⚠️"},
{he:"אש",en:"Fire",jp:"火事",image:"🔥"},
{he:"סכנה",en:"Danger",jp:"危険",image:"⚠️"},
{he:"איבדתי את הדרכון",en:"I Lost My Passport",jp:"パスポートをなくしました",image:"🛂"},
{he:"תתקשר למשטרה",en:"Call The Police",jp:"警察を呼んでください",image:"🚨"},
{he:"תתקשר לאמבולנס",en:"Call An Ambulance",jp:"救急車を呼んでください",image:"🚑"}
]

};

function speak(text){
if(!window.speechSynthesis) return;
speechSynthesis.cancel();
const speech = new SpeechSynthesisUtterance(text);
speech.lang = "ja-JP";
speech.rate = 0.9;
const voices = speechSynthesis.getVoices();
const jpVoice = voices.find(v=>v.lang.startsWith("ja"));
if(jpVoice){ speech.voice = jpVoice; }
speechSynthesis.speak(speech);
}

function createCard(item){
let imageHtml = "";
if (item.image) {
    imageHtml = `<div style="font-size: 40px; text-align: center; margin-bottom: 12px;">${item.image}</div>`;
}

return `
<div class="card">
<div>
${imageHtml}
<div class="cardMain">
<div class="cardText">
<div class="cardHe">${item.he}</div>
<div class="cardJp">${item.jp}</div>
${item.romaji ? `<div class="cardRomaji">${item.romaji}</div>` : ""}
</div>
<button class="playBtn" onclick="speak('${item.jp}')" aria-label="השמע">
<span class="playIcon"></span>
</button>
</div>
${item.en ? `<div class="cardEn">${item.en}</div>` : ""}
</div>
<div class="buttons">
<button onclick="speak('${item.jp}')">🔊</button>
</div>
</div>
`;
}

function renderCards(list){
    content.innerHTML="";
    if(list.length===0){
        content.innerHTML=`<div class="card"><h2>😕</h2><p>לא נמצאו תוצאות</p></div>`;
        return;
    }
    list.forEach(item=>{ content.innerHTML+=createCard(item); });
}

function render(){
    switch(currentTab){
        case "phrases": renderCards(database.phrases); break;
        case "food": renderCards(database.food); break;
        case "transport": renderCards(database.transport); break;
        case "shopping": renderCards(database.shopping); break;
        case "emergency": renderCards(database.emergency); break;
    }
}

document.querySelectorAll(".tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
        document.querySelectorAll(".tab").forEach(btn=>{ btn.classList.remove("active"); });
        tab.classList.add("active");
        currentTab=tab.dataset.tab;
        render();
    });
});

// הוספת מאכלים נוספים עם אימוג'י
database.food.push(
  {he:"קארי",en:"Japanese Curry",jp:"カレー",image:"🍛"},
  {he:"מוצ'י",en:"Mochi",jp:"餅",image:"🍡"},
  {he:"דנגו",en:"Dango",jp:"団子",image:"🍡"},
  {he:"אוקונומיאקי",en:"Okonomiyaki",jp:"お好み焼き",image:"🥞"},
  {he:"יאקיסובה",en:"Yakisoba",jp:"焼きそば",image:"🍜"},
  {he:"טונקאטסו",en:"Tonkatsu",jp:"とんかつ",image:"🥩"},
  {he:"שאבו שאבו",en:"Shabu Shabu",jp:"しゃぶしゃぶ",image:"🍲"},
  {he:"סוקיאקי",en:"Sukiyaki",jp:"すき焼き",image:"🍲"},
  {he:"אדממה",en:"Edamame",jp:"枝豆",image:"🫛"},
  {he:"דונבורי",en:"Donburi",jp:"丼",image:"🍚"}
);

database.phrases.push(
{he:"אני מישראל",en:"I'm from Israel",jp:"イスラエルから来ました",romaji:"Isuraeru kara kimashita",image:"🇮🇱"},
{he:"אפשר מים?",en:"Water Please",jp:"水をください",romaji:"Mizu o kudasai",image:"💧"},
{he:"אפשר את החשבון?",en:"The Bill Please",jp:"お会計お願いします",romaji:"Okaikei onegaishimasu",image:"🧾"},
{he:"טעים מאוד",en:"Very Delicious",jp:"とてもおいしいです",romaji:"Totemo oishii desu",image:"😋"},
{he:"איפה התחנה?",en:"Where Is The Station?",jp:"駅はどこですか？",romaji:"Eki wa doko desu ka",image:"🚉"},
{he:"אפשר Wi-Fi?",en:"Do You Have Wi-Fi?",jp:"Wi-Fiはありますか？",romaji:"Wi-Fi wa arimasu ka",image:"📶"},
{he:"אני לא אוכל בשר",en:"I Don't Eat Meat",jp:"肉を食べません",romaji:"Niku o tabemasen",image:"🥗"},
{he:"אני צמחוני",en:"I'm Vegetarian",jp:"私はベジタリアンです",romaji:"Watashi wa bejitarian desu",image:"🥕"},
{he:"אני טבעוני",en:"I'm Vegan",jp:"私はヴィーガンです",romaji:"Watashi wa vegan desu",image:"🌱"},
{he:"אפשר תמונה?",en:"Can I Take A Photo?",jp:"写真を撮ってもいいですか？",romaji:"Shashin o totte mo ii desu ka",image:"📸"}
);

render(); צ
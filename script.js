// ===============================
// 🇯🇵 JAPAN POCKET 2.0
// By ChatGPT
// ===============================

// ---------- Elements ----------

const content = document.getElementById("content");
const search = document.getElementById("search");

const modal = document.getElementById("modal");
const modalJP = document.getElementById("modalJP");
const modalEN = document.getElementById("modalEN");
const modalHE = document.getElementById("modalHE");
const speakButton = document.getElementById("speak");
const closeButton = document.getElementById("close");

const yenToggle = document.getElementById("yenToggle");
const yenPanel = document.getElementById("yenPanel");
const yenMiniInput = document.getElementById("yenMiniInput");
const yenMiniResult = document.getElementById("yenMiniResult");

// ---------- Current Tab ----------

let currentTab = "phrases";

// ---------- Exchange Rate ----------

const YEN_RATE = 0.024;

// ---------- DATA ----------

const database = {

phrases:[

{
he:"שלום",
en:"Hello",
jp:"こんにちは",
romaji:"Konnichiwa"
},

{
he:"בוקר טוב",
en:"Good Morning",
jp:"おはようございます",
romaji:"Ohayou Gozaimasu"
},

{
he:"ערב טוב",
en:"Good Evening",
jp:"こんばんは",
romaji:"Konbanwa"
},

{
he:"לילה טוב",
en:"Good Night",
jp:"おやすみなさい",
romaji:"Oyasuminasai"
},

{
he:"תודה רבה",
en:"Thank You",
jp:"ありがとうございます",
romaji:"Arigatou Gozaimasu"
},

{
he:"סליחה",
en:"Excuse Me",
jp:"すみません",
romaji:"Sumimasen"
},

{
he:"כן",
en:"Yes",
jp:"はい",
romaji:"Hai"
},

{
he:"לא",
en:"No",
jp:"いいえ",
romaji:"Iie"
},

{
he:"אני לא מבין",
en:"I don't understand",
jp:"わかりません",
romaji:"Wakarimasen"
},

{
he:"אפשר לעזור לי?",
en:"Can you help me?",
jp:"助けてください",
romaji:"Tasukete Kudasai"
},

{
he:"איפה השירותים?",
en:"Where is the toilet?",
jp:"トイレはどこですか？",
romaji:"Toire wa Doko Desu Ka"
},

{
he:"כמה זה עולה?",
en:"How much is it?",
jp:"いくらですか？",
romaji:"Ikura Desu Ka"
}

],

food:[

{
he:"סושי",
en:"Sushi",
jp:"寿司",
},

{
he:"ראמן",
en:"Ramen",
jp:"ラーメン",
},

{
he:"אוניגירי",
en:"Onigiri",
jp:"おにぎり",
},

{
he:"טמפורה",
en:"Tempura",
jp:"天ぷら",
},

{
he:"גיוזה",
en:"Gyoza",
jp:"餃子",
},

{
he:"אודון",
en:"Udon",
jp:"うどん",
},

{
he:"סובה",
en:"Soba",
jp:"そば",
},

{
he:"בנטו",
en:"Bento",
jp:"弁当",
},

{
he:"טאקויאקי",
en:"Takoyaki",
jp:"たこ焼き",
},

{
he:"יאקיטורי",
en:"Yakitori",
jp:"焼き鳥",
}

],

transport:[],

shopping:[],

emergency:[]

};

// ---------- Speech ----------

function speak(text){

if(!window.speechSynthesis) return;

speechSynthesis.cancel();

const speech = new SpeechSynthesisUtterance(text);

speech.lang = "ja-JP";

speech.rate = 0.9;

const voices = speechSynthesis.getVoices();

const jpVoice = voices.find(v=>v.lang.startsWith("ja"));

if(jpVoice){

speech.voice = jpVoice;

}

speechSynthesis.speak(speech);

}

// ---------- Copy ----------

function copy(text){

navigator.clipboard.writeText(text);

}

function copyFeedback(btn,text){

copy(text);

btn.classList.add("copied");

const original=btn.textContent;

btn.textContent="✓";

setTimeout(()=>{

btn.classList.remove("copied");

btn.textContent=original;

},700);

}

// ---------- Card ----------

function createCard(item){

return `

<div class="card">

<div class="cardMain">

<div class="cardText">

<div class="cardHe">${item.he}</div>

<div class="cardJp">${item.jp}</div>

${item.romaji ?

`<div class="cardRomaji">${item.romaji}</div>`

:

""

}

</div>

<button class="playBtn" onclick="speak('${item.jp}')" aria-label="השמע">

<span class="playIcon"></span>

</button>

</div>

${item.en ?

`<div class="cardEn">${item.en}</div>`

:

""

}

<div class="buttons">

<button onclick="speak('${item.jp}')">

🔊

</button>

<button onclick="copyFeedback(this,'${item.jp}')">

📋

</button>

</div>

</div>

`;

}
// ======================================
// JAPAN POCKET 2.0
// Part 2 - Render + Tabs + Search
// ======================================

// ---------- Render ----------

function renderCards(list){

    content.innerHTML="";

    if(list.length===0){

        content.innerHTML=`
        <div class="card">
            <h2>😕</h2>
            <p>לא נמצאו תוצאות</p>
        </div>
        `;

        return;

    }

    list.forEach(item=>{

        content.innerHTML+=createCard(item);

    });

}

// ---------- Render Current Tab ----------

function render(){

    switch(currentTab){

        case "phrases":
            renderCards(database.phrases);
        break;

        case "food":
            renderCards(database.food);
        break;

        case "transport":
            renderCards(database.transport);
        break;

        case "shopping":
            renderCards(database.shopping);
        break;

        case "emergency":
            renderCards(database.emergency);
        break;

    }

}

// ---------- Tabs ----------

document.querySelectorAll(".tab").forEach(tab=>{

    tab.addEventListener("click",()=>{

        document.querySelectorAll(".tab").forEach(btn=>{

            btn.classList.remove("active");

        });

        tab.classList.add("active");

        currentTab=tab.dataset.tab;

        search.value="";

        render();

    });

});

// ---------- Search ----------

search.addEventListener("input",()=>{

    const value=search.value.toLowerCase().trim();

    if(value===""){

        render();

        return;

    }

    const results=[];

    Object.values(database).forEach(category=>{

        if(!Array.isArray(category)) return;

        category.forEach(item=>{

            const he=(item.he||"").toLowerCase();

            const en=(item.en||"").toLowerCase();

            const jp=(item.jp||"").toLowerCase();

            const romaji=(item.romaji||"").toLowerCase();

            if(

                he.includes(value) ||

                en.includes(value) ||

                jp.includes(value) ||

                romaji.includes(value)

            ){

                results.push(item);

            }

        });

    });

    renderCards(results);

});

// ---------- Start ----------

render();
// ======================================
// JAPAN POCKET 2.0
// Part 3 - More Data
// ======================================

// ---------- Transport ----------

database.transport = [

{he:"רכבת",en:"Train",jp:"電車"},
{he:"תחנה",en:"Station",jp:"駅"},
{he:"רציף",en:"Platform",jp:"ホーム"},
{he:"יציאה",en:"Exit",jp:"出口"},
{he:"כניסה",en:"Entrance",jp:"入口"},
{he:"שינקנסן",en:"Shinkansen",jp:"新幹線"},
{he:"מטרו",en:"Metro",jp:"地下鉄"},
{he:"אוטובוס",en:"Bus",jp:"バス"},
{he:"מונית",en:"Taxi",jp:"タクシー"},
{he:"שדה תעופה",en:"Airport",jp:"空港"},
{he:"כרטיס",en:"Ticket",jp:"切符"},
{he:"מכונת כרטיסים",en:"Ticket Machine",jp:"券売機"},
{he:"רכבת אחרונה",en:"Last Train",jp:"終電"},
{he:"מדרגות נעות",en:"Escalator",jp:"エスカレーター"},
{he:"מעלית",en:"Elevator",jp:"エレベーター"}

];

// ---------- Shopping ----------

database.shopping = [

{he:"כמה זה עולה?",en:"How much?",jp:"いくらですか？"},
{he:"כרטיס אשראי",en:"Credit Card",jp:"クレジットカード"},
{he:"מזומן",en:"Cash",jp:"現金"},
{he:"קבלה",en:"Receipt",jp:"レシート"},
{he:"שקית",en:"Bag",jp:"袋"},
{he:"מבצע",en:"Sale",jp:"セール"},
{he:"פתוח",en:"Open",jp:"営業中"},
{he:"סגור",en:"Closed",jp:"閉店"},
{he:"קטן",en:"Small",jp:"小さい"},
{he:"בינוני",en:"Medium",jp:"中"},
{he:"גדול",en:"Large",jp:"大きい"},
{he:"אני רק מסתכל",en:"Just Looking",jp:"見ているだけです"},
{he:"אפשר למדוד?",en:"Can I Try It On?",jp:"試着できますか？"},
{he:"זול",en:"Cheap",jp:"安い"},
{he:"יקר",en:"Expensive",jp:"高い"}

];

// ---------- Emergency ----------

database.emergency = [

{he:"משטרה",en:"Police",jp:"警察"},
{he:"אמבולנס",en:"Ambulance",jp:"救急車"},
{he:"בית חולים",en:"Hospital",jp:"病院"},
{he:"בית מרקחת",en:"Pharmacy",jp:"薬局"},
{he:"רופא",en:"Doctor",jp:"医者"},
{he:"אני צריך עזרה",en:"Help",jp:"助けてください"},
{he:"אני חולה",en:"I'm Sick",jp:"気分が悪いです"},
{he:"אני אלרגי",en:"I Have Allergies",jp:"アレルギーがあります"},
{he:"אש",en:"Fire",jp:"火事"},
{he:"סכנה",en:"Danger",jp:"危険"},
{he:"איבדתי את הדרכון",en:"I Lost My Passport",jp:"パスポートをなくしました"},
{he:"תתקשר למשטרה",en:"Call The Police",jp:"警察を呼んでください"},
{he:"תתקשר לאמבולנס",en:"Call An Ambulance",jp:"救急車を呼んでください"}

];

// ---------- More Food ----------

database.food.push(

{he:"קארי",en:"Japanese Curry",jp:"カレー"},
{he:"מוצ'י",en:"Mochi",jp:"餅"},
{he:"דנגו",en:"Dango",jp:"団子"},
{he:"אוקונומיאקי",en:"Okonomiyaki",jp:"お好み焼き"},
{he:"יאקיסובה",en:"Yakisoba",jp:"焼きそば"},
{he:"טונקאטסו",en:"Tonkatsu",jp:"とんかつ"},
{he:"שאבו שאבו",en:"Shabu Shabu",jp:"しゃぶしゃぶ"},
{he:"סוקיאקי",en:"Sukiyaki",jp:"すき焼き"},
{he:"אדממה",en:"Edamame",jp:"枝豆"},
{he:"דונבורי",en:"Donburi",jp:"丼"}

);

// ---------- More Phrases ----------

database.phrases.push(

{he:"אני מישראל",en:"I'm from Israel",jp:"イスラエルから来ました",romaji:"Isuraeru kara kimashita"},
{he:"אפשר מים?",en:"Water Please",jp:"水をください",romaji:"Mizu o kudasai"},
{he:"אפשר את החשבון?",en:"The Bill Please",jp:"お会計お願いします",romaji:"Okaikei onegaishimasu"},
{he:"טעים מאוד",en:"Very Delicious",jp:"とてもおいしいです",romaji:"Totemo oishii desu"},
{he:"איפה התחנה?",en:"Where Is The Station?",jp:"駅はどこですか？",romaji:"Eki wa doko desu ka"},
{he:"אפשר Wi-Fi?",en:"Do You Have Wi-Fi?",jp:"Wi-Fiはありますか？",romaji:"Wi-Fi wa arimasu ka"},
{he:"אני לא אוכל בשר",en:"I Don't Eat Meat",jp:"肉を食べません",romaji:"Niku o tabemasen"},
{he:"אני צמחוני",en:"I'm Vegetarian",jp:"私はベジタリアンです",romaji:"Watashi wa bejitarian desu"},
{he:"אני טבעוני",en:"I'm Vegan",jp:"私はヴィーガンです",romaji:"Watashi wa vegan desu"},
{he:"אפשר תמונה?",en:"Can I Take A Photo?",jp:"写真を撮ってもいいですか？",romaji:"Shashin o totte mo ii desu ka"}

);
// ---------- Floating Yen Widget ----------

if(yenToggle){

    yenToggle.addEventListener("click",()=>{

        const isHidden=yenPanel.classList.toggle("hidden");

        yenToggle.textContent=isHidden ? "💴" : "✕";

        if(!isHidden){
            yenMiniInput.focus();
        }

    });

    yenMiniInput.addEventListener("input",()=>{

        const yen=parseFloat(yenMiniInput.value)||0;

        yenMiniResult.textContent="₪ "+(yen*YEN_RATE).toFixed(2);

    });

    document.addEventListener("click",(e)=>{

        if(!yenPanel.classList.contains("hidden") &&
           !document.getElementById("yenWidget").contains(e.target)){

            yenPanel.classList.add("hidden");
            yenToggle.textContent="💴";

        }

    });

}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('service-worker.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`))
    });
}

const validInputs = ['0','1','2','3','4','5','6','7','8','9',',','Enter','+','-','*','/'];
const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,31,32,34,36];
const column1 = [1,4,7,10,13,16,19,22,25,28,31,34];
const column2 = [2,5,8,11,14,17,20,23,26,29,32,35];
let inputs = ['0'];
let spins = [];

const recentSpins = document.getElementById('spins');
const bets = document.getElementById('bets');
const popup = document.getElementById('popup');
const odd = document.getElementById('odd');
const even = document.getElementById('even');
const red = document.getElementById('red');
const zero = document.getElementById('zero');
const black = document.getElementById('black');
const low = document.getElementById('low');
const high = document.getElementById('high');

window.onkeydown = function(event){
    if (validInputs.includes(event.key)) {
        input(event.key);
    };
}

function input(key) {
    if (key == ',') {
        noMoreBets();
    } else if (key == 'Enter') {
        // Delete all
        if (inputs[2]+inputs[1]+inputs[0] == '---') {
            spins = [];
            updateDisplay();
        // Delete latest
        } else if (inputs[0] == '-') {
            spins.shift();
            updateDisplay();
        // Hide popup after showing
        } else if (popup.style.display == 'block') {
            hidePopup();
        // Enter last number entered
        } else {
            const nr = parseInt(inputs[1]+inputs[0]);
            if (nr >= 0 && nr < 37) {
                spins.unshift(nr);
                showPopup();
            }
        }
        inputs = ['0'];
        //console.log(spins);
    }
    else {
        inputs.unshift(key);
    }
}

function noMoreBets() {
    if (bets.innerHTML == 'NO MORE BETS') {
        moreBets();
    } else {
        bets.classList.add('no-more');
        bets.innerHTML = 'NO MORE BETS';
    }
}

function moreBets() {
    bets.classList.remove('no-more');
    bets.innerHTML = 'PLACE YOUR BETS';
}

function showPopup() {
    popup.style.display = 'block';
    popup.firstElementChild.innerHTML = numberFactsHtml(spins[0]);

}

function hidePopup() {
    popup.style.display = 'none';
    updateDisplay();
    moreBets();
}

function updateDisplay() {
    saveSpins();
    recentSpins.innerHTML = '';
    for (i = 0; i < 14; i++) {
        recentSpins.innerHTML += numberToHtml(spins[i]);
    }
    updateStats(getStats(spins));
}

function updateStats(st) {
    odd.innerHTML = st['odd'];
    even.innerHTML = st['even'];
    red.innerHTML = st['red'];
    zero.innerHTML = st['zero'];
    black.innerHTML = st['black'];
    low.innerHTML = st['low'];
    high.innerHTML = st['high'];
}

function getStats(s) {
    let odd = 0;
    let even = 0;
    let zero = 0;
    let red = 0;
    let black = 0;
    let low = 0;
    let high = 0;
    let stat = [];
    const tot = s.length;

    // Count all stats
    for (i = 0; i < tot; i++) {
        if (s[i] == 0) {
            zero++;
            continue;
        }

        if (isEven(s[i]))
            even++;
        else
            odd++;

        if (isRed(s[i]))
            red++;
        else
            black++;

        if (isHigh(s[i]))
            high++;
        else
            low++;
    }
    
    stat['odd'] = toPercent(odd / tot);
    stat['even'] = toPercent(even / tot);
    stat['zero'] = toPercent(zero / tot);
    stat['red'] = toPercent(red / tot);
    stat['black'] = toPercent(black / tot);
    stat['low'] = toPercent(low / tot);
    stat['high'] = toPercent(high / tot);

    return stat;
}

function toPercent(n) {
    return Number(n).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:1});
}

function numberToHtml(nr) {
    if (nr == undefined) {
        return '<div><br></div>';
    } else if (reds.includes(nr)) {
        return '<div class="red">' + nr + '</div>';
    } else if (nr == 0) {
        return '<div class="green">0</div>';
    } else {
        return '<div class="black">' + nr + '</div>';
    }
}

function numberFactsHtml(nr) {
    if (nr == 0) {
        return '<div class="green">GREEN<div class="jumbo">' + nr + '</div>ZERO</div>'
    } else {
        let out = '<div class="';
        out += (isRed(nr)) ? 'red">RED' : 'black">BLACK';
        out += '<div class="jumbo">' + nr + '</div>'
        out += (isEven(nr)) ? 'EVEN' : 'ODD';
        out += '<br>'
        out += (isHigh(nr)) ? 'HIGH' : 'LOW';
        out += '<div class="small">SPIN #' + spins.length + '</div></div>';
        return out;
    }
}

function isRed(nr) {
    return reds.includes(nr);
}

function isEven(nr) {
    return nr % 2 == 0;
}

function isHigh(nr) {
    return nr > 18;
}

function get12(nr) {
    if (nr == 0)
        return 0;
    else if (nr < 13)
        return 1;
    else if (nr <25)
        return 2;
    else
        return 3;
}

function getColumn(nr) {
    if (nr == 0)
        return 0;
    else if (column1.includes(nr))
        return 1;
    else if (column2.includes(nr))
        return 2;
    else
        return 3;
}

// Save to local storage
function saveSpins() {
    localStorage.setItem('spins', JSON.stringify(spins));
}

function loadSpins() {
    spins = JSON.parse(localStorage.getItem('spins'));
}

// Init
loadSpins();
updateDisplay();
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('service-worker.js')
            .then(reg => console.log('Service Worker: Registered'))
            .catch(err => console.log(`Service Worker: Error: ${err}`))
    });
}

const validInputs = ['0','1','2','3','4','5','6','7','8','9',',','Enter','-'];
const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
/*const column1 = [1,4,7,10,13,16,19,22,25,28,31,34];
const column2 = [2,5,8,11,14,17,20,23,26,29,32,35];*/
let inputs = ['0'];
let spins = [];

const recentSpins = document.getElementById('spins');
const bets = document.getElementById('bets');
const popup = document.getElementById('popup');
const bonus = document.getElementById('bonus');
const odd = document.getElementById('odd');
const even = document.getElementById('even');
const red = document.getElementById('red');
const zero = document.getElementById('zero');
const black = document.getElementById('black');
const low = document.getElementById('low');
const high = document.getElementById('high');

const c1 = document.getElementById('c1');
const c2 = document.getElementById('c2');
const c3 = document.getElementById('c3');
const cs1 = document.getElementById('cs1');
const cs2 = document.getElementById('cs2');
const cs3 = document.getElementById('cs3');

const h1 = document.getElementById('h1');
const h2 = document.getElementById('h2');
const h3 = document.getElementById('h3');
const hs1 = document.getElementById('hs1');
const hs2 = document.getElementById('hs2');
const hs3 = document.getElementById('hs3');


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
        //bonus.style.display = 'block';
    }
}

function moreBets() {
    bets.classList.remove('no-more');
    bets.innerHTML = 'PLACE YOUR BETS';
    //bonus.style.display = 'none';
}

function showPopup() {
    popup.style.display = 'block';
    popup.firstElementChild.innerHTML = numberFactsHtml(spins[0]);
}

function hidePopup() {
    popup.style.display = 'none';
    //bonus.style.display = 'none';
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

    c1.innerHTML = st['cold'][0];
    c2.innerHTML = st['cold'][1];
    c3.innerHTML = st['cold'][2];
    cs1.innerHTML = st['cold'][3];
    cs2.innerHTML = st['cold'][4];
    cs3.innerHTML = st['cold'][5];

    h1.innerHTML = st['hot'][0];
    h2.innerHTML = st['hot'][1];
    h3.innerHTML = st['hot'][2];
    hs1.innerHTML = st['hot'][3];
    hs2.innerHTML = st['hot'][4];
    hs3.innerHTML = st['hot'][5];

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
    const tot = (s.length > 1000) ? 1000 : s.length;

    let numCount = [];
    for (i = 0; i < 37; i++) {
        numCount[i] = 0;
    }

    // Count all stats
    for (i = 0; i < tot; i++) {
        numCount[s[i]]++;
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
    stat['cold'] = getColds();
    stat['hot'] = getHots(numCount);

    return stat;
}

function getHots(n) {
    let max = -1;
    let maxI = 0;
    let sMax = -1;
    let sMaxI = 0;
    let tMax = -1;
    let tMaxI = 0;

    for (i = 0; i < n.length; i++) {
        //console.log(i + ':' + n[i]);
        if (n[i] > max) {
            tMax = sMax;
            tMaxI = sMaxI;
            sMax = max;
            sMaxI = maxI;
            max = n[i];
            maxI = i;
        } else if (n[i] > sMax) {
            tMax = sMax;
            tMaxI = sMaxI;
            sMax = n[i];
            sMaxI = i;
        } else if (n[i] > tMax) {
            tMax = n[i];
            tMaxI = i;
        }
    }
    /*console.log(maxI + ' : ' + max + ' spins.');
    console.log(sMaxI + ' : ' + sMax + ' spins.');
    console.log(tMaxI + ' : ' + tMax + ' spins.');*/
    return [maxI,sMaxI,tMaxI,max,sMax,tMax];

}

// Get three coldest numbers and nr of spins since last win
// nr1, nr2, nr3, spin1, spin2, spin3
function getColds() {
    let lastWin = [];

    for (i = 0; i < 37; i++) {
        let n = spins.indexOf(i);
        lastWin[i] = (n == -1) ? Infinity : n;
    }

    let maxSpins = -1;
    let maxIndex = 0;
    let secMaxS = -1;
    let secMaxI = 0;
    let thirdMaxS = -1;
    let thirdMaxI = 0;

    for (i = 0; i <37; i++) {
        if (lastWin[i] > maxSpins) {
            thirdMaxS = secMaxS;
            thirdMaxI = secMaxI;
            secMaxS = maxSpins;
            secMaxI = maxIndex;
            maxSpins = lastWin[i];
            maxIndex = i;
        } else if (lastWin[i] > secMaxS) {
            thirdMaxS = secMaxS;
            thirdMaxI = secMaxI;
            secMaxS = lastWin[i];
            secMaxI = i;
        } else if (lastWin[i] > thirdMaxS) {
            thirdMaxS = lastWin[i];
            thirdMaxI = i;
        }
    }
    maxSpins = (maxSpins == Infinity) ? '&infin;' : maxSpins;
    secMaxS = (secMaxS == Infinity) ? '&infin;' : secMaxS;
    thirdMaxS = (thirdMaxS == Infinity) ? '&infin;' : thirdMaxS;


    /*console.log(maxIndex + ' in ' + maxSpins + ' spins.');
    console.log(secMaxI + ' in ' + secMaxS + ' spins.');
    console.log(thirdMaxI + ' in ' + thirdMaxS + ' spins.');*/
    return [maxIndex,secMaxI,thirdMaxI,maxSpins,secMaxS,thirdMaxS];
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
    let out = '<div class="';
    if (nr == 0) {
        out += 'green">GREEN<div class="jumbo">' + nr + '</div>ZERO</div>'
    } else {
        out += (isRed(nr)) ? 'red">RED' : 'black">BLACK';
        out += '<div class="jumbo">' + nr + '</div>'
        out += (isEven(nr)) ? 'EVEN' : 'ODD';
        out += '<br>'
        out += (isHigh(nr)) ? 'HIGH' : 'LOW';
    }
    out += '<div class="small">SPIN #' + spins.length + '</div></div>';
    return out;
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
    if (localStorage.getItem('spins') != null)
        spins = JSON.parse(localStorage.getItem('spins'));
}

// Init
loadSpins();
updateDisplay();
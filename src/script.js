var starships = [];
var pageCount = 1;

(async function init(){
    await this.getAllData('https://swapi.dev/api/starships/');
})()

function getAllData(apiUrl){
    fetch(apiUrl).then(response => {
        return response.json();
    })
        .then(data => {
            data.results.forEach((element) => {
                this.starships.push(element);
            })


            /*if(data.next){
              this.getAllData(data.next);
            }else*/{
                this.starships = this.shuffle(this.starships);
                // this.generateHtml(this.starships[0]);
                this.starships.forEach((element) => {
                    this.generateHtml(element);
                });
                this.handler();
            }
        })
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function generateHtml(element){
    var html =``;
    html += `<div class="container" id='inactive'>`
    html += `  <div class="header">`

    html += `  <div class="stamp is-nope">NOPE</div>`
    html += `  <div class="stamp is-approved">BUY !</div>`

    html += `    <img class="starshipImg" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/2201276/${element.name}.jpeg">`
    html += `      <div class="starshipName">`
    html += `        <label>${element['name']}</label>`
    html += `       <div class="cost">${element['cost_in_credits']} <img class="credit" src="https://vignette.wikia.nocookie.net/fr.starwars/images/a/a0/Crédit.svg/revision/latest/scale-to-width-down/200?cb=20150925194810"></div>`
    html += `      </div>`
    html += `      <button class='btnInfo'>`
    html += `        <div><i class="fas fa-arrow-down"></i><i class="fas fa-info"></i></div>`
    html += `      </button>`
    html += `  </div>`
    html += ` <div class="body">`
    html += `  <div class="info">`

    html += `     <div class="general">`
    html += `     <div class="model"> ${element['model']}</div>`
    html += `     <div class="class"> ${element['starship_class']}</div>`
    html += `<hr>`
    html += `     </div>`


    html += `     <div class="fl">`
    html += `       <div class="passager">`
    html += `         <label><i class="fas fa-users"></i> Passenger</label>`
    html += `         <div>Crew : ${element['crew']}</div>`
    html += `         <div>Passengers : ${element['passengers']}</div>`
    html += `       </div>`
    html += `       <div class="capacity">`
    html += `         <label><i class="fas fa-box"></i> Capacity</label>`
    html += `         <div>Length : ${element['length']}  meters</div>`
    html += `         <div>Cargo : ${element['cargo_capacity']} tons</div>`
    html += `         <div>Consumables : ${element['consumables']}</div>`
    html += `       </div>`
    html += `     </div>`

    html += `     <div class="fr">`
    html += `       <div class="speed">`
    html += `         <label><i class="fas fa-tachometer-alt"></i> Speed</label>`
    /*html += `         <div>MGLT : ${element['MGLT']}</div>`*/
    html += `         <div>Hyperdrive rating : ${element['hyperdrive_rating']}</div>`
    html += `         <div>Atmosphering speed : ${element['max_atmosphering_speed']}</div>`
    html += `       </div>`
    html += `     </div>`

    html += `     <div class="made">Made by : ${element['manufacturer']}</div>`

    html += `   </div>`
    html += `   <div class="button">`
    html += `     <button class="pass" onclick="btnPass()"> Pass </button>`
    html += `     <button class="buy" onclick="btnBuy()"> Buy </button>`
    html += `   </div>`
    html += ` </div>`
    html += `</div>`
    document.getElementById('wrapper').innerHTML += html;
}

function getData(page){
    let results;
    fetch(`https://swapi.co/api/starships/?page=${page}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            results = data.results;
        })
    return results
}

function handler(){
    document.getElementsByClassName('container')[0].id='active';
    document.getElementsByClassName('btnInfo')[0].onclick = expendInfo;
    let card =  document.getElementById('active');
    let stampOk = document.getElementsByClassName('is-approved')[0];
    let stampNo = document.getElementsByClassName('is-nope')[0];

    let mouseDown = false;

    const X ={
        old:0,
        oew:0
    };
    const Y ={
        old:0,
        new:0
    };

    let buy=false;
    let pass=false;


    card.addEventListener("mousedown",function(e){
        X.old = e.clientX;
        Y.old = e.clientY;
        mouseDown = true;
        card.style.transition ='all 0s';
    });

    card.addEventListener("mouseup",function(e){
        mouseDown = false;


        if(buy){buyShip();}
        else if(pass){passShip();}
        else{
            card.style.transform =  `rotate(0deg)`;
            card.style.margin = `0px 0px 0px 0px`;
            card.style.transition ='all 1s';
            card.classList.remove('Pass');
            card.classList.remove('Buy');}

    });

    card.addEventListener("mousemove",function(e){
        if(mouseDown){
            X.new = e.clientX;
            if(X.new < X.old){
                leftSwipe(X.old - X.new);
            }
            else if(X.new > X.old){
                rightSwipe(X.new - X.old);
            }

            Y.new = e.clientY;
            if(Y.new < Y.old){
                downSwipe(Y.old - Y.new);
            }
            else if(Y.new > Y.old){
                upSwipe(Y.new - Y.old);
            }

            mouseWasDown = false;
        }
    });
    function leftSwipe(deviationX){
        card.style.transform =  `rotate(-${(deviationX)/20}deg)`;
        card.style.marginRight  = `${deviationX}px`;

        if(deviationX < 80){
            card.classList.remove('Pass');
            stampNo.style.opacity='0';
            pass=false;
        }
        if(deviationX > 100){
            card.classList.add('Pass');
            card.classList.remove('Buy');
            stampNo.style.opacity='1';
            pass=true;
        }
    }
    function rightSwipe(deviationX){
        card.style.transform = `rotate(${(deviationX)/20}deg)`;
        card.style.marginLeft  = `${deviationX}px`;

        if(deviationX < 80){
            card.classList.remove('Buy');
            stampOk.style.opacity='0';
            buy=false
        }
        if(deviationX > 100){
            card.classList.remove('Pass');
            card.classList.add('Buy');
            stampOk.style.opacity='1';
            buy=true;
        }
    }
    function upSwipe(deviationY){
        card.style.marginUp  = `${deviationY}px`;
    }
    function downSwipe(deviationY){
        card.style.marginBottom  = `${deviationY}px`;
    }

    function buyShip(){
        deleteCard();
    }
    function passShip(){
        deleteCard();
    }
    function deleteCard(){
        card.style.transition ='all .5s';
        card.style.opacity = 0;
        buy=false;
        pass=false;
        setTimeout(function(){
            this.starships.shift();
            card.remove();
            this.handler(); }, 400);
    }

    function expendInfo(){
        let info = document.getElementsByClassName('info')[0];

        if(info.clientHeight > 0){
            info.style.height = '0px';
        }else{
            info.style.height = '340px';
        }
    }
}


function btnPass(){
    let card =  document.getElementById('active');

    card.classList.add('Pass');
    card.style.transition ='all .5s';
    card.style.opacity = '0';
    card.style.marginRight = '200px';
    card.style.transform = 'rotate(-20deg)';

    setTimeout(function(){
        this.starships.shift();
        card.remove();
        this.handler(); }, 500);
}
function btnBuy(){
    let card =  document.getElementById('active');

    card.classList.add('Buy');
    card.style.transition ='all .5s';
    card.style.opacity = '0';
    card.style.marginLeft = '200px';
    card.style.transform = 'rotate(20deg)';

    setTimeout(function(){
        this.starships.shift();
        card.remove();
        this.handler(); }, 500);
}





'use strict';

// TODO: Render the cinema (7x15 with middle path)
// TODO: implement the Seat selection flow
// TODO: Popup shows the seat identier - e.g.: 3-5 or 7-15
// TODO: Popup should contain seat price (for now 4$ to all) 
// TODO: allow booking the seat ('S', 'X', 'B')
// TODO: Uplift your model - each seat should have its own price... 
// TODO: in seat details, show available seats around 
// TODO: Upload to GitHub Pages

var gElSelectedSeat = null;
var gCinema = createCinema();
renderCinema();

function createCinema() {
    var cinema = [];
    for (var i = 0; i < 7; i++) {
        cinema[i] = [];
        for (var j = 0; j < 15; j++) {
            var cell = {type: 'X'}
            if (j !== 7) {
                cell.type = 'S'
                cell.isBooked = false
                cell.price = 4 + i
            }
            cinema[i][j] = cell
        }
    }
    cinema[3][3].isBooked = true
    return cinema;
}
function renderCinema() {
    var strHTML = '';
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            var cell = gCinema[i][j];
            // For cell of type SEAT add seat class
            var className = '';
            if (cell.type !== 'X') {
                className = 'seat'
                // For cell that is booked add booked class
                if (cell.isBooked) className += ' booked'
            } 

            var seatTitle = 'Seat ' + (i+1) + ',' + (j+1)

            strHTML += `\t<td class="cell ${className}" 
                            onclick="cellClicked(this, ${i}, ${j})"
                            title="${seatTitle}" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    var elSeats = document.querySelector('.cinema-seats');
    elSeats.innerHTML = strHTML;
}
function cellClicked(elCell, i, j) {
    // Support selecting a seat
    // Only a single seat should be selected
    var cell = gCinema[i][j]
    
    // Ignore none seats and booked
    if (cell.type === 'X' || cell.isBooked) return;

    // console.log('Cell clicked: ', elCell, i, j)
    elCell.classList.toggle('selected')

    // Support Unselecting a seat
    if (gElSelectedSeat) {
        unSelectSeat()
    }

    gElSelectedSeat = (gElSelectedSeat === elCell)? null : elCell;

    // When seat is selected a popup is shown
    if (gElSelectedSeat)  showSeatDetails({i:i, j:j})


}

function showSeatDetails(pos) {
    var elPopup = document.querySelector('.popup');
    var seat = gCinema[pos.i][pos.j];
    var availableSeatsCount = countAvailableSeats(pos)
    elPopup.querySelector('h2 span').innerText = `${pos.i+1}-${pos.j+1}`
    elPopup.querySelector('h3 span').innerText = `$${seat.price}`
    elPopup.querySelector('h4 span').innerText = `${availableSeatsCount}`

    // Update the <button> dataset
    var elBtn = elPopup.querySelector('button')
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false;
}
function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function bookSeat(elBtn) {
    console.log('Booking seat, button: ', elBtn);
    var i = +elBtn.dataset.i
    var j = +elBtn.dataset.j

    // Book the seat
    gCinema[i][j].isBooked = true

    gElSelectedSeat.classList.add('booked')
    unSelectSeat()
    gElSelectedSeat = null
}

function unSelectSeat() {
    hideSeatDetails();
    gElSelectedSeat.classList.remove('selected')
}


function countAvailableSeats(pos) {
    var count = 0
    for (var i=pos.i-1; i <= pos.i+1 ; i++){
        if (i < 0 || i >= gCinema.length) continue;
        for (var j=pos.j-1; j <= pos.j+1 ; j++){
            if (j < 0 || j >= gCinema[0].length) continue;
            if (pos.i === i && pos.j === j) continue;
            var cell = gCinema[i][j]
            if (cell.type === 'S' && !cell.isBooked )  {
                count++
            }
        }
    }
    return count
}



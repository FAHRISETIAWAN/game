
var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var currTile;
var otherTile;

window.onload = function() {
    startGame();

    //1/10th of a second
    window.setInterval(function(){
        crushCandy();
        slideCandy();
        generateCandy();
    }, 100);
    document.getElementById("scoreContainer").style.display = "none";
    document.getElementById("startButton").addEventListener("click", startGameTimer);
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; //0 - 5.99
}


function startGameTimer() {
    // Set the duration of the game (1 minute = 60 seconds)
    var durationInSeconds = 60;

    score = 0; // Set score to 0 when starting the game

    // Start the countdown timer
    var timer = setInterval(function() {
        durationInSeconds--;
        updateProgressBar(durationInSeconds);
        if (durationInSeconds <= 0) {
            // If time is up, clear the timer and show game over popup
            clearInterval(timer);
            showGameOverPopup();
        }
    }, 1000); // Update every second
}


function startGame() {

    rows = 9;
    columns = 9;
    score = 0;
    sessionStorage.removeItem("score");
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <img id="0-0" src="./images/Red.png">
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            //DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
            tile.addEventListener("dragleave", dragLeave); //leave candy over another candy
            tile.addEventListener("drop", dragDrop); //dropping a candy over another candy
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap candies

                    // Tambahkan event listener untuk sentuhan di sini
                    tile.addEventListener("touchstart", touchStart);
                    tile.addEventListener("touchmove", touchMove);
                    tile.addEventListener("touchend", touchEnd);


            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function touchStart(event) {
    // Mengambil elemen yang sedang disentuh
    currTile = event.target;
    // Menyimpan posisi awal sentuhan
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}

function touchMove(event) {
    event.preventDefault(); // Mencegah aksi bawaan dari browser
    // Mengambil posisi sentuhan saat ini
    var touchX = event.touches[0].clientX;
    var touchY = event.touches[0].clientY;

    // Menghitung jarak perpindahan sentuhan
    var deltaX = touchX - startX;
    var deltaY = touchY - startY;

    // Menyimpan posisi sentuhan saat ini untuk digunakan di touchEnd
    lastX = touchX;
    lastY = touchY;

    // Lakukan sesuatu dengan perpindahan sentuhan, misalnya perpindahan ubin
    // Jangan lupa untuk mengupdate posisi awal sentuhan agar bisa dihitung perpindahan selanjutnya
    startX = touchX;
    startY = touchY;
}

function touchEnd(event) {
    // Mengambil elemen yang dilepaskan sentuhnya
    otherTile = document.elementFromPoint(lastX, lastY);
    // Proses pertukaran elemen jika valid
    dragEnd();
}


function dragStart() {
    //this refers to tile that was clicked on for dragging
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    //this refers to the target tile that was dropped on
    otherTile = this;
}

function dragEnd() {

    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;

    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        }
    }
}

function crushCandy() {
    //crushFive();
    //crushFour();
    crushThree();
    document.getElementById("score").innerText = score;

}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}


function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns;  c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}

function startGameTimer() {
    // Set the duration of the game (1 minute = 60 seconds)
    var durationInSeconds = 60;
    
   
    // Start the countdown timer
    var timer = setInterval(function() {
        durationInSeconds--;
        updateProgressBar(durationInSeconds);
        if (durationInSeconds <= 0) {
            // If time is up, clear the timer and show game over popup
            clearInterval(timer);
            showGameOverPopup();
        }
    }, 1000); // Update every second
}

// Function to update the progress bar based on remaining time
function updateProgressBar(durationInSeconds) {
    var progress = (durationInSeconds / 60) * 100; // Calculate progress percentage
    document.getElementById("progressBar").style.width = progress + "%"; // Update progress bar width
}

var token = "xxx.xxx.xxx";

function showGameOverPopup() {
    sessionStorage.removeItem("score");
    var popup = document.getElementById("gameOverPopup");
    var message = document.getElementById("gameOverMessage");
    
    if (score >= 1000) {
        message.textContent = "Congratulations!\nToken: " + token;
    } else {
        message.textContent = "Game Over!";
    }

    popup.style.display = "block";
}

function closePopup() {
    var popup = document.getElementById("gameOverPopup");
    popup.style.display = "none";
}


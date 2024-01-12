betValue = -1;
sel_idx = -1;
potentialWinLabel = null;
table = null;
glb_potential_win = -1;
MaxBetLabel = null;
OtherBetsChoice = -1;
TotalSpentLabel = null;
glb_total_spent = -1;
breakEvenTable = null;
must_bet_to_even = -1;
have_spend_label = null;
autobet_diff_label = null;
net_win_lbl = null;

function first_table_row() {
    if (table == null) {
        console.log("first row error")
        return null;
    }
    else {
        const firstRow = table.rows[1];
        const firstRowCells = firstRow.cells;
        const floatValuesArray = [];

        for (let i = 0; i < firstRowCells.length; i++) {
            const cellValue = firstRowCells[i].textContent;
            const floatValue = parseFloat(cellValue);
            floatValuesArray.push(floatValue);
        }

        return floatValuesArray;
    }
}

function last_table_row() {
    if (table == null) {
        console.log("first row error")
        return null;
    }

    const lastRow = table.rows[table.rows.length - 1];
    const valuesArray = [];

    for (const cell of lastRow.cells) {
        const value = parseFloat(cell.textContent);
        if (!isNaN(value)) {
            valuesArray.push(value);
        }
    }

    return valuesArray;
}








const handleKeydown = () => {
    console.log("gj")
    if (event.keyCode === 13) {
        console.log('Enter key intercepted, preventing newline insertion');
        event.preventDefault(); // Prevent the default behavior of inserting a new line
        handleAddRow();
    }
};

function max_other_bet_update() {
    // (potential win - bet)
    if(MaxBetLabel == null) {
        console.error("Cannot find max bet label");
        return;
    }
    if ((glb_potential_win >= 0) && (betValue >= 0)) {
        MaxBetLabel.textContent = (glb_potential_win - betValue).toFixed(2) +"$";
    }
    else {
        MaxBetLabel.textContent = "-";
    }
};


function potential_win_update() {
    if (potentialWinLabel == null) {
        console.log("label error");
        return;
    }

    if (betValue > 0 && sel_idx > -1) {
        s = "";
        if (first_table_row() != null) {
            win = betValue * first_table_row()[sel_idx];
            glb_potential_win = win;
            s = win;
        }
        else {
            s = "Missing first row of table!";
        }
        potentialWinLabel.textContent = s;

    }
    else {
        potentialWinLabel.textContent = '-';
    }

};

function UpdateTotalSpent() {
    if(TotalSpentLabel == null) {
        console.error("Cannot find total spent label");
        return;
    }
    if ((betValue >= 0) && (OtherBetsChoice >= 0)) {
        TotalSpentLabel.textContent = betValue + OtherBetsChoice;
        glb_total_spent = betValue + OtherBetsChoice;
    }
    else {
        TotalSpentLabel.textContent = "-";
        glb_total_spent = -1;
    }
}

function min_other_bets() {
    const bets_array = [];
    bets_array.length = 3;

    if ((glb_total_spent < 0) || (sel_idx < 0)) {
        console.log("Min bet fail" + glb_total_spent + " " + sel_idx);
        return null;
    }

    if (last_table_row() != null) {
        for (let i = 0; i < 3; i++) {
            if (i == sel_idx) {
                bets_array[i] = -1;
            }
            else {
                bets_array[i] = glb_total_spent / last_table_row()[i];
            }
        }
    }
    else {
        console.log("Fail last table row");
    }

    return bets_array;
}

function UpdateMinBets() {
    if(breakEvenTable == null) {
        console.error("Cannot find breakEvenTable");
        return;
    }
    const firstRow = breakEvenTable.rows[1];

    for (const cell of firstRow.cells) {
      const content = cell.textContent;
      console.log(content);
    }
    
      
    if (min_other_bets() == null)
        return;


    const secondRow = breakEvenTable.rows[1].cells;
    console.log("Break event table null "+(breakEvenTable==null));
    console.log("sr lenght"+secondRow.length);

    must_bet_to_even = 0;

    for (let i = 0; i < 3; i++) {
        console.log("update min bets" + min_other_bets()[i])

        if( min_other_bets()[i] == -1) {
            secondRow[i].textContent = "--$";
        }
        else {
            secondRow[i].textContent = min_other_bets()[i].toFixed(2) +"$";
            must_bet_to_even = must_bet_to_even +min_other_bets()[i];
        }
    }
}

function update_have_spend_label() {
    // must_bet_to_even + betValue
    if(have_spend_label == null) {
        console.error("Cannot find have_spend_label");
        return;
    }
    
    if ((must_bet_to_even != -1) && (betValue>=0)) {
        have_spend_label.textContent = (must_bet_to_even+betValue).toFixed(2) +"$";
    }
    else {
        have_spend_label.textContent = "---";
    }
}

function update_autobet_diff() {
    //OtherBetsChoice - must_bet_to_even
    if(autobet_diff_label == null) {
        console.error("Cannot find autobet_diff_label");
        return;
    }

    if ((OtherBetsChoice >=0 ) && (must_bet_to_even != -1)) {
        autobet_diff_label.textContent = (OtherBetsChoice - must_bet_to_even).toFixed(2) +"$";
    }
    else {
        autobet_diff_label.textContent = "--";
    }
}




function update_net_win() {
// glb_potential_win - (must_bet_to_even+betValue)
if ((glb_potential_win != -1) && (must_bet_to_even != -1) && (betValue>= 0)) {
    net_win_lbl.textContent = (glb_potential_win - (must_bet_to_even+betValue)).toFixed(2) +"$";
}
else {
    net_win_lbl.textContent = "---";
}
}


function input_changed() {
    console.log("INPUT CHANGED");
    potential_win_update();
    max_other_bet_update();
    UpdateTotalSpent();
    UpdateMinBets();
    update_have_spend_label();
    update_autobet_diff();
    //update_net_win();
}

const handleAddRow = () => {
    const dataRows = table.querySelectorAll('tr:not(.header)'); // Select all data rows
    const lastDataRow = dataRows[dataRows.length - 1]; // Get the last data row

    if (lastDataRow) {
        const newRow = lastDataRow.cloneNode(true); // Clone the last data row
        // Create and apply a new CSS class for the new row
        const newRowClass = 'new-data-row';
        newRow.classList.add(newRowClass);

        // Copy data from last row cells to new row cells
        for (let i = 0; i < lastDataRow.cells.length; i++) {
            const lastDataCell = lastDataRow.cells[i];
            const newDataCell = newRow.cells[i];
            newDataCell.textContent = lastDataCell.textContent;
        }

        // Clear the content of the new row cells
        for (const cell of newRow.querySelectorAll('td')) {
            //cell.textContent = 'a';
            // Attach a keydown event listener to the new row
            cell.addEventListener('keydown', handleKeydown);
        }

        const tbody = table.querySelector('tbody'); // Select the tbody element explicitly



        for (const cell of newRow.querySelectorAll('td')) {
            cell.classList.add('contenteditable');
            cell.style.width = '33.3333%'; // Set the cell width
        }
        tbody.appendChild(newRow); // Append the new row to the tbody
    }

    input_changed();
    
};
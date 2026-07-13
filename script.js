//DOM Selections

//form
const transactionForm = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const typeSelect = document.getElementById("typeSelect");
const categorySelect = document.getElementById("categorySelect");
const dateInput = document.getElementById("dateInput");

const transactionItems = document.querySelector(".transaction-items");

//summary

const incomeValue = document.getElementById("incomeValue");
const expenseValue = document.getElementById("expenseValue");
const balanceValue = document.getElementById("balanceValue");
const transactionsValue = document.getElementById("transactionsValue");

const emptyState = document.querySelector(".empty-state");
const emptyStateTitle = document.querySelector(".empty-state h3");
const emptyStateText = document.querySelector(".empty-state p");

// state

let transactions = [];

// Constants

const categoryIcons = {
    food: "🍔",
    salary: "💰",
    travel: "✈️",
    shopping: "🛍️",
    bills: "🧾",
    entertainment: "🎬",
    other: "📦"
};

//events

transactionForm.addEventListener("submit", (e)=> {

    e.preventDefault();

    const cleanedDescription = descriptionInput.value.trim();
    const realAmount = Number(amountInput.value);


    if (!cleanedDescription ||!realAmount || !typeSelect.value || !categorySelect.value || !dateInput.value) {
        return;
    }

    const type = typeSelect.value;
    const category = categorySelect.value;
    const date = dateInput.value;

    const transactionObj = {
            description : cleanedDescription,
            amount : realAmount ,
            type ,
            category,
            date  
        }

        transactions.push(transactionObj);

        saveTransactions();

        //reset form 

        transactionForm.reset();

        renderTransactions();
})


//functions 

function renderTransactions() {

    transactionItems.innerHTML = "";

    if(transactions.length === 0) {

        emptyState.style.display = "flex";

        emptyStateTitle.textContent = "No transactions yet.";
        emptyStateText.textContent = "Add your first transaction.";
    }else {

        emptyState.style.display = "none";
    }

    for(let transaction of transactions) {

        const transactionCard = document.createElement("div");
        transactionCard.classList.add("transaction-card");


        const transactionInfo = document.createElement("div");
        transactionInfo.classList.add("transaction-info");

        const transactionIcon = document.createElement("p");
        transactionIcon.classList.add("transaction-icon");
        transactionIcon.textContent = categoryIcons[transaction.category];


        const transactionMeta = document.createElement("div");
        transactionMeta.classList.add("transaction-meta");


        const transactionDescription = document.createElement("p");
        transactionDescription.classList.add("description");
        transactionDescription.textContent = transaction.description;

        const transactionType = document.createElement("p");
        transactionType.classList.add("type");
        transactionType.textContent = `${transaction.category} . ${transaction.type}`;


        const transactionDate = document.createElement("p");
        transactionDate.classList.add("date");
        transactionDate.textContent = transaction.date;


        const transactionRight = document.createElement("div");
        transactionRight.classList.add("transaction-right");

        const transactionAmount = document.createElement("p");
        transactionAmount.classList.add("amount");
        
        if (transaction.type === "income") {
            transactionAmount.classList.add("income");
            transactionAmount.textContent = `+₹${transaction.amount}`;

        }else {
            transactionAmount.classList.add("expense");
            transactionAmount.textContent = `-₹${transaction.amount}`;

        }

        const transactionAction = document.createElement("div");
        transactionAction.classList.add("transaction-action");


        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";



        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete";


        transactionAction.append(editBtn, deleteBtn);

        transactionRight.append(transactionAmount, transactionAction);


        transactionMeta.append(transactionDescription, transactionType, transactionDate);

        transactionInfo.append(transactionIcon, transactionMeta);

        transactionCard.append(transactionInfo, transactionRight);


        transactionItems.appendChild(transactionCard);

    }
    updateSummary();
}

function updateSummary () {

     const totalIncome = transactions.reduce ((acc, transaction)=>{
        if (transaction.type === "income") {
            return acc + transaction.amount;
        }
        return acc
        
    }, 0);

    incomeValue.textContent = totalIncome;

    const totalExpense = transactions.reduce ((acc, transaction)=>{
        if (transaction.type === "expense") {
           return acc + transaction.amount;
        }
        return acc
        
    }, 0);

    
    expenseValue.textContent = totalExpense;

    const balance = totalIncome - totalExpense;
    balanceValue.textContent = balance;

    const totalTransactions = transactions.length;
    transactionsValue.textContent = totalTransactions;
}


function saveTransactions () {
    const jsonStringArr =  JSON.stringify(transactions);
    localStorage.setItem("transactions", jsonStringArr);
}

function loadTransactions () {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    }

    renderTransactions ();

}

//initial rendering

loadTransactions();
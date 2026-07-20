//DOM Selections

//form
const transactionForm = document.getElementById("transactionForm");
const descriptionInput = document.getElementById("descriptionInput");
const amountInput = document.getElementById("amountInput");
const typeSelect = document.getElementById("typeSelect");
const categorySelect = document.getElementById("categorySelect");
const dateInput = document.getElementById("dateInput");

const submitBtn = document.getElementById("submitBtn");

//transaction card 
const transactionItems = document.querySelector(".transaction-items");

//summary

const incomeValue = document.getElementById("incomeValue");
const expenseValue = document.getElementById("expenseValue");
const balanceValue = document.getElementById("balanceValue");
const transactionsValue = document.getElementById("transactionsValue");

// search / filter

const searchTransaction = document.getElementById("searchTransaction");
const categoryFilter = document.getElementById("filterCategory");
const typeFilter = document.getElementById("typeFilter");
const sort = document.getElementById("sort");

// empty
const emptyState = document.querySelector(".empty-state");
const emptyStateTitle = document.querySelector(".empty-state h3");
const emptyStateText = document.querySelector(".empty-state p");

// state

let transactions = [];

let editingTransactionId = null;

let searchTerm = "";

let filterCategory = "";

let filterType = "";

let sortOption = "";


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

//functions 

function renderTransactions() {

    transactionItems.innerHTML = "";

    let finalFilteredArr;

    const filteredTransactions = transactions.filter((item)=>item.description.toLowerCase().includes(searchTerm.toLowerCase()));

    finalFilteredArr = filteredTransactions;

    if (filterCategory !== "") {

        finalFilteredArr = finalFilteredArr.filter((item)=> item.category === filterCategory);

    }
    

    if (filterType !== "") {

        finalFilteredArr = finalFilteredArr.filter((item)=> item.type === filterType);
    }


    if (sortOption === "highest") {

        finalFilteredArr.sort((a, b) => b.amount - a.amount);

    }else if (sortOption === "lowest") {

        finalFilteredArr.sort((a, b) => a.amount - b.amount);

    }else if (sortOption === "oldest") {

        finalFilteredArr.sort((a, b) =>new Date(a.date) - new Date(b.date));

    }else if (sortOption === "latest") {

        finalFilteredArr.sort((a, b) =>new Date(b.date) - new Date(a.date));
    }


    if(transactions.length === 0) {

        emptyState.style.display = "flex";

        emptyStateTitle.textContent = "No transactions yet.";
        emptyStateText.textContent = "Add your first transaction.";

    }else if (finalFilteredArr.length === 0) {

        emptyState.style.display = "flex";

        emptyStateTitle.textContent = "No matching transactions found.";
        emptyStateText.textContent = "Try a different search term.";
    }else {
        emptyState.style.display = "none";
    }

    for(let transaction of finalFilteredArr) {

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
        editBtn.dataset.transactionId = transaction.id;
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit";



        const deleteBtn = document.createElement("button");
        deleteBtn.dataset.transactionId = transaction.id;
        deleteBtn.classList.add("delete-btn"); 
        deleteBtn.textContent = "Delete";


        transactionAction.append(editBtn, deleteBtn);

        transactionRight.append(transactionAmount, transactionAction);


        transactionMeta.append(transactionDescription, transactionType, transactionDate);

        transactionInfo.append(transactionIcon, transactionMeta);

        transactionCard.append(transactionInfo, transactionRight);


        transactionItems.appendChild(transactionCard);

    }
    updateSummary(finalFilteredArr);
}

// summary cards

function updateSummary (transactionsToSummarize) {

     const totalIncome = transactionsToSummarize.reduce ((acc, transaction)=>{
        if (transaction.type === "income") {
            return acc + transaction.amount;
        }
        return acc
        
    }, 0);

    incomeValue.textContent = totalIncome;


    const totalExpense = transactionsToSummarize.reduce ((acc, transaction)=>{
        if (transaction.type === "expense") {
           return acc + transaction.amount;
        }
        return acc
        
    }, 0);

    
    expenseValue.textContent = totalExpense;

    const balance = totalIncome - totalExpense;
    balanceValue.textContent = balance;

    const totalTransactions = transactionsToSummarize.length;
    transactionsValue.textContent = totalTransactions;
}


// local storage

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

    if (editingTransactionId !== null) {

        const particularTransaction = transactions.find((element)=> element.id === editingTransactionId);


        particularTransaction.description = cleanedDescription;
        particularTransaction.amount = realAmount;
        particularTransaction.type = type;
        particularTransaction.category = category;
        particularTransaction.date = date;

        editingTransactionId = null;
        submitBtn.textContent = "Submit";
        
    }else {

        const transactionObj = {

            id : crypto.randomUUID(),
            description : cleanedDescription,
            amount : realAmount ,
            type ,
            category,
            date  
        }

        transactions.push(transactionObj);
    }

    

    saveTransactions();

    //reset form 

    transactionForm.reset();

    renderTransactions();
})

//delete transaction event

transactionItems.addEventListener("click", (e)=> {

    if(!e.target.classList.contains("delete-btn")) {
        return;
    }

    const transactionId = e.target.dataset.transactionId;

    if (transactionId === editingTransactionId) {
        transactionForm.reset();
        editingTransactionId = null;
        submitBtn.textContent = "Submit";
    }

    transactions = transactions.filter((transaction)=> transaction.id !== transactionId);

    saveTransactions();

    renderTransactions ();

})

//edit transaction event

transactionItems.addEventListener("click", (e)=> {

    if (!e.target.classList.contains("edit-btn")) {
        return;
    }

    const transactionId = e.target.dataset.transactionId;

    const particularTransaction = transactions.find((element)=> element.id === transactionId);

    descriptionInput.value = particularTransaction.description;
    amountInput.value = particularTransaction.amount;
    typeSelect.value = particularTransaction.type;
    categorySelect.value = particularTransaction.category;
    dateInput.value = particularTransaction.date;

    editingTransactionId = transactionId;

    submitBtn.textContent = "Update";
})


// search transaction

searchTransaction.addEventListener("input", (e)=> {

    searchTerm = e.target.value.trim();

    renderTransactions();
});

// filter transaction category 

categoryFilter.addEventListener("change",(e)=>{
    filterCategory = e.target.value;

    renderTransactions();
});

// filter transaction type 

typeFilter.addEventListener("change", (e)=>{
    filterType = e.target.value;

    renderTransactions();
});


sort.addEventListener("change", (e)=> {
    sortOption = e.target.value;

    renderTransactions();
});




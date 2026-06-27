let expenseName = document.getElementById("expenseName");
let expenseAmount = document.getElementById("expenseAmount");
let addBtn = document.getElementById("addBtn");
let expenseList = document.getElementById("expenseList");
let total = document.getElementById("total");

let totalExpense = 0;

addBtn.addEventListener("click", function(){

    let name = expenseName.value;
    let amount = Number(expenseAmount.value);

    if(name === "" || amount <= 0){
        alert("Please enter valid details.");
        return;
    }

    let li = document.createElement("li");

    let text = document.createElement("span");
    text.innerText = name + " - ₹" + amount;

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("delete");

    li.appendChild(text);
    li.appendChild(deleteBtn);

    expenseList.appendChild(li);

    totalExpense += amount;
    total.innerText = totalExpense;

    expenseName.value = "";
    expenseAmount.value = "";

    deleteBtn.addEventListener("click", function(){

        li.remove();

        totalExpense -= amount;
        total.innerText = totalExpense;

    });

});
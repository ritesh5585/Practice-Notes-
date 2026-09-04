let expenses = []

function addExpense(title, amount, category) {
    const expenses =
    {
        id: Date.now(),
        title,
        amount,
        category,
        date: new Date().toISOString().split("T")[0]
    }
    expenses.push(expense);
    return expense;

}

function getAllExpense() {
    return expenses
}

function deleteExpense(id, updates) {
    let idx = expenses.findIndex(e => e.id == id)
    if (idx !== -1) return expenses.splice(index, 1)[0];
    return null
}

function updateExpense9(id) {
    let idx = expenses.findIndex(e => e.id == id)

    if (expenses) {
        Object.assign(expense, updates);
        return expense;
    }
    return null
}

function getTotal() {
    return expenses.reduce((sum, e) => sum + e.amount, 0)
}

function getCategory() {
    return expenses.filter(e => e.category.toLowerCase() === category.toLowerCase())
}
function getMonthlyBill(month) {
    return expenses
        .filter(e => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0)
}

console.log("\n📊 EXPENSE TRACKER - PRACTICE PROJECT\n");
console.log("Adding sample expenses...\n");

// Add some expenses
addExpense("Lunch", 250, "Food");
addExpense("Uber", 350, "Travel");
addExpense("Movie", 500, "Entertainment");
addExpense("Groceries", 1500, "Food");
addExpense("Dinner", 800, "Food");

console.log("✅ Added 5 expenses\n");

console.log("📋 ALL EXPENSES:");
console.log("----------------");
getExpenses().forEach(e => {
    console.log(`${e.id} | ${e.title} | ₹${e.amount} | ${e.category} | ${e.date}`);
});
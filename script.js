Content is user-generated and unverified.
1
// Database simulation using localStorage
let currentUser = null;

// Initialize sample data
function initDatabase() {
    if (!localStorage.getItem('users')) {
        const sampleUsers = [
            {
                accountNumber: '1001',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '9876543210',
                password: 'pass123',
                balance: 5000,
                transactions: [
                    { type: 'credit', amount: 5000, date: new Date().toLocaleString(), description: 'Initial deposit' }
                ]
            },
            {
                accountNumber: '1002',
                name: 'Jane Smith',
                email: 'jane@example.com',
                phone: '9876543211',
                password: 'pass123',
                balance: 7500,
                transactions: [
                    { type: 'credit', amount: 7500, date: new Date().toLocaleString(), description: 'Initial deposit' }
                ]
            }
        ];
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
}

// Initialize on page load
initDatabase();

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function openRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
}

function closeDashboard() {
    document.getElementById('dashboardModal').style.display = 'none';
    currentUser = null;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const dashboardModal = document.getElementById('dashboardModal');
    
    if (event.target == loginModal) {
        closeLoginModal();
    }
    if (event.target == registerModal) {
        closeRegisterModal();
    }
    if (event.target == dashboardModal) {
        closeDashboard();
    }
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const accountNumber = document.getElementById('loginAccount').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.accountNumber === accountNumber && u.password === password);
    
    if (user) {
        currentUser = user;
        closeLoginModal();
        openDashboard();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid account number or password!', 'error');
    }
}

// Register Handler
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const deposit = parseFloat(document.getElementById('regDeposit').value);
    const password = document.getElementById('regPassword').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const accountNumber = (1000 + users.length + 1).toString();
    
    const newUser = {
        accountNumber: accountNumber,
        name: name,
        email: email,
        phone: phone,
        password: password,
        balance: deposit,
        transactions: [
            { type: 'credit', amount: deposit, date: new Date().toLocaleString(), description: 'Initial deposit' }
        ]
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    closeRegisterModal();
    showNotification(`Account created successfully! Your account number is: ${accountNumber}`, 'success');
    
    // Clear form
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPhone').value = '';
    document.getElementById('regDeposit').value = '';
    document.getElementById('regPassword').value = '';
}

// Open Dashboard
function openDashboard() {
    document.getElementById('dashboardModal').style.display = 'block';
    document.getElementById('dashName').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('dashAccount').textContent = currentUser.accountNumber;
    updateBalance();
    hideAllForms();
}

// Update Balance Display
function updateBalance() {
    document.getElementById('dashBalance').textContent = `₹${currentUser.balance.toFixed(2)}`;
}

// Save user data to localStorage
function saveUserData() {
    const users = JSON.parse(localStorage.getItem('users'));
    const index = users.findIndex(u => u.accountNumber === currentUser.accountNumber);
    users[index] = currentUser;
    localStorage.setItem('users', JSON.stringify(users));
}

// Show/Hide Forms
function hideAllForms() {
    document.getElementById('depositForm').style.display = 'none';
    document.getElementById('withdrawForm').style.display = 'none';
    document.getElementById('transferForm').style.display = 'none';
    document.getElementById('historyView').style.display = 'none';
}

function showDeposit() {
    hideAllForms();
    document.getElementById('depositForm').style.display = 'block';
}

function showWithdraw() {
    hideAllForms();
    document.getElementById('withdrawForm').style.display = 'block';
}

function showTransfer() {
    hideAllForms();
    document.getElementById('transferForm').style.display = 'block';
}

function showHistory() {
    hideAllForms();
    document.getElementById('historyView').style.display = 'block';
    displayTransactionHistory();
}

// Deposit Handler
function handleDeposit(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('depositAmount').value);
    
    if (amount <= 0) {
        showNotification('Please enter a valid amount!', 'error');
        return;
    }
    
    currentUser.balance += amount;
    currentUser.transactions.unshift({
        type: 'credit',
        amount: amount,
        date: new Date().toLocaleString(),
        description: 'Cash deposit'
    });
    
    saveUserData();
    updateBalance();
    document.getElementById('depositAmount').value = '';
    showNotification(`₹${amount} deposited successfully!`, 'success');
}

// Withdraw Handler
function handleWithdraw(event) {
    event.preventDefault();
    
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    
    if (amount <= 0) {
        showNotification('Please enter a valid amount!', 'error');
        return;
    }
    
    if (amount > currentUser.balance) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    currentUser.balance -= amount;
    currentUser.transactions.unshift({
        type: 'debit',
        amount: amount,
        date: new Date().toLocaleString(),
        description: 'Cash withdrawal'
    });
    
    saveUserData();
    updateBalance();
    document.getElementById('withdrawAmount').value = '';
    showNotification(`₹${amount} withdrawn successfully!`, 'success');
}

// Transfer Handler
function handleTransfer(event) {
    event.preventDefault();
    
    const recipientAccount = document.getElementById('transferAccount').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    
    if (amount <= 0) {
        showNotification('Please enter a valid amount!', 'error');
        return;
    }
    
    if (amount > currentUser.balance) {
        showNotification('Insufficient balance!', 'error');
        return;
    }
    
    if (recipientAccount === currentUser.accountNumber) {
        showNotification('Cannot transfer to same account!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users'));
    const recipient = users.find(u => u.accountNumber === recipientAccount);
    
    if (!recipient) {
        showNotification('Recipient account not found!', 'error');
        return;
    }
    
    // Deduct from sender
    currentUser.balance -= amount;
    currentUser.transactions.unshift({
        type: 'debit',
        amount: amount,
        date: new Date().toLocaleString(),
        description: `Transfer to ${recipientAccount}`
    });
    
    // Add to recipient
    recipient.balance += amount;
    recipient.transactions.unshift({
        type: 'credit',
        amount: amount,
        date: new Date().toLocaleString(),
        description: `Transfer from ${currentUser.accountNumber}`
    });
    
    // Save both users
    const senderIndex = users.findIndex(u => u.accountNumber === currentUser.accountNumber);
    const recipientIndex = users.findIndex(u => u.accountNumber === recipientAccount);
    users[senderIndex] = currentUser;
    users[recipientIndex] = recipient;
    localStorage.setItem('users', JSON.stringify(users));
    
    updateBalance();
    document.getElementById('transferAccount').value = '';
    document.getElementById('transferAmount').value = '';
    showNotification(`₹${amount} transferred successfully to ${recipient.name}!`, 'success');
}

// Display Transaction History
function displayTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    
    if (currentUser.transactions.length === 0) {
        transactionList.innerHTML = '<p style="text-align: center; color: #999;">No transactions yet</p>';
        return;
    }
    
    let html = '';
    currentUser.transactions.forEach(transaction => {
        html += `
            <div class="transaction-item ${transaction.type}">
                <div>
                    <div style="font-weight: bold;">${transaction.description}</div>
                    <div style="color: #666; font-size: 0.9rem;">${transaction.date}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
                </div>
            </div>
        `;
    });
    
    transactionList.innerHTML = html;
}

// Contact Form Handler
function handleContact(event) {
    event.preventDefault();
    showNotification('Thank you for contacting us! We will get back to you soon.', 'success');
    event.target.reset();
}

// Notification System
function showNotification(message, type) {
    // Remove existing notification
    const existingNotif = document.querySelector('.notification');
    if (existingNotif) {
        existingNotif.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth Scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('Banking Management System loaded successfully!');
console.log('Sample accounts for testing:');
console.log('Account 1: 1001, Password: pass123');
console.log('Account 2: 1002, Password: pass123');

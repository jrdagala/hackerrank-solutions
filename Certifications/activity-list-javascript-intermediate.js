function Activity(amount) {
    this.amount = amount;
}

// Add Activity-specific methods
Activity.prototype.getAmount = function() {
    return this.amount;
}

Activity.prototype.setAmount = function(value) {
    if(value <= 0) {
        return false;
    }
    
    this.amount = value;
    return true;
}

function Payment(amount, receiver) {
    // Call the parent constructor with 'this' context
    Activity.call(this, amount);
    this.receiver = receiver;
}

// Set Payment's prototype to inherit from Activity's prototype
Payment.prototype = Object.create(Activity.prototype);
// Reset the constructor property
Payment.prototype.constructor = Payment;

// Add Payment-specific methods
Payment.prototype.getReceiver = function() {
    return this.receiver;
}

Payment.prototype.setReceiver = function(value) {
    this.receiver = value;
}

function Refund(amount, sender) {
    // Call the parent constructor with 'this' context
    Activity.call(this, amount);
    this.sender = sender;
}

// Set Refund's prototype to inherit from Activity's prototype
Refund.prototype = Object.create(Activity.prototype);
// Reset the constructor property
Refund.prototype.constructor = Refund;

// Add Refund-specific methods
Refund.prototype.getSender = function() {
    return this.sender;
}

Refund.prototype.setSender = function(value) {
    this.sender = value;
}
// Define the AngularJS app and controller in one file
angular.module('financeApp', [])
.controller('FinanceController', ['$scope', function($scope) {
    $scope.transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    $scope.newTransaction = {};
    $scope.monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || null;

    $scope.addTransaction = function () {
        if (!$scope.newTransaction.description || !$scope.newTransaction.amount) return;
        $scope.transactions.push({
            description: $scope.newTransaction.description,
            amount: parseFloat($scope.newTransaction.amount),
            date: new Date()
        });
        $scope.newTransaction = {};
        $scope.saveData();
    };

    $scope.getTotal = function () {
        return $scope.transactions.reduce((total, t) => total + t.amount, 0);
    };

    $scope.saveBudget = function () {
        localStorage.setItem('monthlyBudget', $scope.monthlyBudget);
    };

    $scope.saveData = function () {
        localStorage.setItem('transactions', JSON.stringify($scope.transactions));
    };

    $scope.clearData = function () {
        if (confirm("Are you sure you want to clear all data?")) {
            $scope.transactions = [];
            $scope.monthlyBudget = null;
            localStorage.clear();
        }
    };

    // Chart rendering
    setTimeout(() => {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: $scope.transactions.map(t => t.description),
                datasets: [{
                    label: 'Expenses',
                    data: $scope.transactions.map(t => t.amount),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                }]
            }
        });
    }, 100); // slight delay so HTML can finish rendering
}]);

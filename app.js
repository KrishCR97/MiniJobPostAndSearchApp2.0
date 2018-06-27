var app = angular.module('myApp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/login', {
        template: '<login-directive></login-directive>',
        controller: 'loginController'

    }).when('/register', {
        template: '<registration-directive></registration-directive>',
        controller: 'registerController'
    }).when('/home', {
        template: '<registration-directive></registration-directive>',
        controller: 'homeController',
        resolve: ['authService', function (authService) {
            return authService.checkUserInDBService();
        }]
    }).when('/logOut', {
        template: '<registration-directive></registration-directive>',
        controller: 'logOutController',
        resolve: ['authService', function (authService) {
            return authService.checkUserInDBService();
        }]
    }).when('/searchJob',{
        templateUrl : 'searchJob.html',
        controller: 'searchJobController',
        resolve: ['authService', function (authService) {
            return authService.checkUserInDBService();
        }]
    }).when('/PostJob',{
        templateUrl:'postJob.html',
        controller:'postJobController',
        resolve: ['authService', function (authService) {
            return authService.checkUserInDBService();
        }]
    }).otherwise({
        template: ''
    });
});

app.factory('authService', function ($http, $q) {
    return {
        checkUserInDBService: function () {
            var defer = $q.defer();
            if (localStorage.isLogged) {
                defer.resolve();
            }
            else {
                defer.reject();
            }
            return defer.promise;
        }
    }
});

app.controller('loginController', function ($scope,$http) {
    $scope.checkUserInDB = function () {
        var userLoginDetails = {
            userName: $scope.formAuth.userName,
            password: $scope.formAuth.password
        }
        $http.post('http://localhost:3000/checkLogin', JSON.stringify(userLoginDetails)).then((data) => {
            console.log(data.data.validUser);
            if (data.data.validUser) {
                localStorage.isLogged = true;
            }
            else{
                localStorage.isLogged = false;
            }
            
        });
    }
});

app.controller('registerController', function ($scope, $http, $location) {
    $scope.roles = ['Company', 'Job Seeker']
    $scope.registerUser = function () {
        var newUserDetails = {
            userName: $scope.registerForm.userName,
            password: $scope.registerForm.password,
            email: $scope.registerForm.email,
            phoneNum: $scope.registerForm.phNumber,
            location: $scope.registerForm.location,
            userType: $scope.registerForm.selectedRole
        };
        $http.post('http://localhost:3000/saveUser', JSON.stringify(newUserDetails)).then((data) => {
            if (data.data.savedUser) {
                console.log('Saved user.');
            }
        });
    }
});

app.controller('logOutController', function ($scope) {

});

app.controller('homeController',function($scope){

});

app.controller('searchJobController',function($scope){
$scope.searchJob = function(){

};

$scope.resetAll = function(){
    
}
});

app.controller('postJobController',function($scope,$http){
    $scope.saveJob = function(){
        var newJob = {
            title : $scope.job.title,
            description : $scope.job.description,
            keyword : $scope.job.keyword,
            location : $scope.job.location
        }
        console.log(newJob);
        $http.post('http://localhost:3000/saveJob',JSON.stringify(newJob)).then((data)=>{
            console.log(data);
        });
    }
});

app.directive('loginDirective', function () {
    return {
        template: `
    
    <div class="row">
    <div class="col-sm-3"></div>
    </div>
    <div class="col-sm-6">   
    <h1>Login form</h1>
    <label>User Name:</label> 
    <input type = 'text' class='form-control' ng-model = 'formAuth.userName' placeholder = "User Name"/>
    <label>Password:</label>
    <input type = 'password' class='form-control' ng-model = 'formAuth.password' placeholder = "Password"/><br/>
    <input type = 'submit' value="Login" class="btn btn-success" ng-click = 'checkUserInDB()'/>
    </div>
    <div class="col-sm-3"></div>
    </div>
    `
    }
});

app.directive('registrationDirective', function () {
    return {
        template: `        
        <div class="row">
        <div class="col-sm-3"></div>
        </div>
        <div class="col-sm-6"> 
        <h1>Registration Form</h1>
        <label>User Name:</label> 
        <input type="text" class='form-control'ng-model="registerForm.userName" placeholder="User Name">
        <label>Password:</label> 
        <input type="password" class='form-control' ng-model="registerForm.password" placeholder="Password">
        <label>Email :</label> 
        <input type="email" class='form-control' ng-model="registerForm.email" placeholder="Email">
        <label>Location:</label> 
        <input type="text" class='form-control' ng-model="registerForm.location" placeholder="Location">
        <label>Number:</label> 
        <input type="number" class='form-control' ng-model="registerForm.phNumber" placeholder="Phone Number">
        <label>Select user role:</label> <br/>
        <select ng-model="registerForm.selectedRole">
        <option ng-repeat="role in roles" value="{{role}}">{{role}}</option>
        </select>
        <br/><br/>
        <input type="submit" class="btn btn-success" ng-click="registerUser()" value="Sign Up!">
        </div>
        <div class="col-sm-3"></div>
        </div>
        `
    }
});
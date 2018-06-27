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
    }).when('/searchJob', {
        templateUrl: 'searchJob.html',
        controller: 'searchJobController',
        resolve: ['authService', function (authService) {
            return authService.checkUserInDBService();
        }]
    }).when('/PostJob', {
        templateUrl: 'postJob.html',
        controller: 'postJobController',
        resolve: ['authService', function (authService) {
            return authService.checkUserInDBService();
        }]
    }).otherwise({
        template: ''
    });
});

app.factory('authService', function ($q) {
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

app.factory('isEmptyObjectService', function () {
    return {
        isEmpty: function (objectToCheck) {
            for (var key in objectToCheck) {
                if (objectToCheck.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
    }
});
app.controller('loginController', function ($scope, $http) {
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
            else {
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

app.controller('homeController', function ($scope) {

});

app.controller('searchJobController', function ($scope, isEmptyObjectService, $http, $sce) {
    $scope.searchJob = function () {
        var jobSearchDetails = {
            title: $scope.jobSearch.byTitle,
            keyword: $scope.jobSearch.byKeyword,
            location: $scope.jobSearch.byLocation
        };
        $scope.jobLists = '';
        $http.post('http://localhost:3000/findJobs', JSON.stringify(jobSearchDetails)).then((data) => {
            console.log(data.data.jobsFound);
            var htmlData = "";
            if (data.data.jobsFound){
                var jobs = data.data.jobsList;
                //console.log(jobs);
                console.log(jobs[0]._id);
            for(var index=0;index<jobs.length;index++) {
            //console.log(job +"11121");
            htmlData += `<div class="panel panel-default">
            <div class="panel-heading">${jobs[index].title}</div>
            <div class="panel-body">
            <div>
            <p>Job Description : ${jobs[index].description}</p>
            <p>Location : ${jobs[index].location}</p>
            <input type="submit" class="btn btn-primary" ng-click="applyJob()" id=${jobs[index]._id} value="Apply Job"/>
            <input type="submit" class="btn btn-primary" ng-click="saveJob()" id=${jobs[index]._id} value="Save Job"/>
            </div>
            </div>
        </div>`;
                }
        $scope.jobLists = $sce.trustAsHtml(htmlData);
        console.log($scope.jobLists);
            }
        });
        // $scope.jobSearch.byTitle = "";
        // $scope.jobSearch.byTitle = "";
        // $scope.jobSearch.byKeyword = "";
        // $scope.jobSearch.byLocation = "";
        // var jobSearchDetails = {};
        // if($scope.jobSearch.byTitle != ""){
        //    jobSearchDetails.title = $scope.jobSearch.byTitle;
        // }
        // if($scope.jobSearch.byKeyword != ""){
        // jobSearchDetails.description = $scope.jobSearch.byKeyword;
        // }
        // if($scope.jobSearch.byLocation != ""){
        //     jobSearchDetails.location = $scope.jobSearch.byLocation;
        // }
        // if(!isEmptyObjectService.isEmpty(jobSearchDetails)){
        //     console.log("Empty");
        // }
    };

    $scope.resetAll = function () {
        $scope.jobSearch.byTitle = "";
        $scope.jobSearch.byTitle = "";
        $scope.jobSearch.byKeyword = "";
        $scope.jobSearch.byLocation = "";
    }
    $scope.applyJob = function () {
        
        console.log("In apply Job")
    }
    $scope.saveJob = function(){
       
        console.log("In save Job")
    }
});

app.controller('postJobController', function ($scope, $http) {
    $scope.saveJob = function () {
        var newJob = {
            title: $scope.job.title,
            description: $scope.job.description,
            keyword: $scope.job.keyword,
            location: $scope.job.location
        }
        console.log(newJob);
        $http.post('http://localhost:3000/saveJob', JSON.stringify(newJob)).then((data) => {
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
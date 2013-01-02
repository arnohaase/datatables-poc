function EmptyCtrl($scope) {
}

function SimpleCtrl($scope, $http) {
  $http.get('rest/person/list/0/9999999')
  .success(function(data) {
    $scope.persons=data.persons;
  })
  .error(function(data, status, headers, config) {
    alert('Fehler beim Holen der Daten: ' + status);
  });
}

function PagingCtrl($scope, $http, $filter) {
	$scope.personSortModel = {
      sortBy: [],
	  sortAsc: {}
	};
	
	$scope.rowsPerPage = 10;
	$scope.offset = 0;
	$scope.persons = [];
	
	$http.get('rest/person/list/0/9999999')
	.success(function(data) {
		$scope.persons=data.persons;
	})
	.error(function(data, status, headers, config) {
		alert('Fehler beim Holen der Daten: ' + status);
	});
	
	$scope.hasPrevPage = function() {
      return $scope.offset > 0;
	};
	$scope.hasNextPage = function() {
	  return $scope.offset < $scope.persons.length - $scope.rowsPerPage;
    };
	
	$scope.prevPage = function() {
	  $scope.offset -= $scope.rowsPerPage;
	  if ($scope.offset < 0)
		$scope.offset = 0;
	};
	$scope.nextPage = function() {
	  $scope.offset += $scope.rowsPerPage;
	};
	$scope.firstPage = function() {
	  $scope.offset = 0;
	};
	$scope.lastPage = function() {
	  var raw = $scope.persons.length - 1;
	  $scope.offset = raw - raw % $scope.rowsPerPage;
	  if ($scope.offset < 0)
        $scope.offset = 0;
	};
	
	$scope.curPage = function() {
	  return Math.floor($scope.offset / $scope.rowsPerPage)+1;
	};
	$scope.numPages = function() {
      var filtered = $filter('filter')($scope.persons, $scope.searchPerson);
	  return Math.ceil(filtered.length / $scope.rowsPerPage);
	};
	
	$scope.locales = function() {
	  var result = [];
	  
	  var hasLocale = function(l) {
		var i;
		for(i=0; i<result.length; i++) {
	      if(result[i] === l) {
	        return true;
	      }
		}
		return false;
	  };
	  
	  var i;
	  for (i=0; i<$scope.persons.length; i++) {
		if (! hasLocale($scope.persons[i].locale)) {
		  result.push($scope.persons[i].locale);
		}
	  }
	  
	  return result;
	};
}

//function SimpleWithIncrementalLoadCtrl($scope, $http) {
//	$scope.persons = [];
//	
//	$http.get('rest/person/list/0/50')
//	.success(function(data) {
//		$scope.persons=data.persons.concat($scope.persons);
//	})
//	.error(function(data, status, headers, config) {
//		alert('Fehler beim Holen der Daten: ' + status);
//	});
//	$http.get('rest/person/list/50/9999999')
//	.success(function(data) {
//		$scope.persons=$scope.persons.concat(data.persons);
//	})
//	.error(function(data, status, headers, config) {
//		alert('Fehler beim Holen der Daten: ' + status);
//	});
//}

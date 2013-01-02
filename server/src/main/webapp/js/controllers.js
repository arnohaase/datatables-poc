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
	$scope.showFilters = true;
	$scope.$watch('showFilters', function(newValue) {
	  if(! newValue) {
		$scope.searchPerson = {};
		$scope.searchPersonMisc = {};
	  }
	});
	
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
      filtered = $filter('filter')(filtered, $scope.miscFilters);
	  return Math.ceil(filtered.length / $scope.rowsPerPage);
	};
	
	$scope.miscFilters = function(p) { // special filters that go beyond simple field matching
	  var name = (p.zip + " " + p.city).toLowerCase();
	  if ($scope.searchPersonMisc && $scope.searchPersonMisc.zipCity) {
        return name.indexOf($scope.searchPersonMisc.zipCity.toLowerCase()) >= 0;
	  }
	  return true;
	}
	
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

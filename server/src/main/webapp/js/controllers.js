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

function PagingCtrl($scope, $http) {
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
	}
	$scope.hasNextPage = function() {
	  return $scope.offset < $scope.persons.length - $scope.rowsPerPage;
    }
	
	$scope.prevPage = function() {
	  $scope.offset -= $scope.rowsPerPage;
	  if ($scope.offset < 0)
		$scope.offset = 0;
	}
	$scope.nextPage = function() {
	  $scope.offset += $scope.rowsPerPage;
	}
	$scope.firstPage = function() {
	  $scope.offset = 0;
	}
	$scope.lastPage = function() {
	  var raw = $scope.persons.length - 1;
	  $scope.offset = raw - raw % $scope.rowsPerPage;
	  if ($scope.offset < 0)
        $scope.offset = 0;
	}
	
	$scope.curPage = function() {
	  return Math.floor($scope.offset / $scope.rowsPerPage)+1;
	}
	$scope.numPages = function() {
	  return Math.ceil($scope.persons.length / $scope.rowsPerPage);
	}
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

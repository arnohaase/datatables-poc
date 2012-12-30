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

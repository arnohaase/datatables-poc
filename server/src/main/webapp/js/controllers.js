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

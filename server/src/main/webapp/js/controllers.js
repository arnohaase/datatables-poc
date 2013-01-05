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
	$scope.$watch('combinedName', function(newValue) {
		if(newValue) {
		  $('.separateNames').hide();
		  $('.combinedName').show();
		  $scope.searchPerson.firstname='';
		  $scope.searchPerson.lastname='';
		}
		else {
		  $('.separateNames').show();
		  $('.combinedName').hide();
		  $scope.searchPersonMisc.name='';
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
	  var zipCity = function() {
        var name = (p.zip + " " + p.city).toLowerCase();
	    if ($scope.searchPersonMisc && $scope.searchPersonMisc.zipCity) {
          return name.indexOf($scope.searchPersonMisc.zipCity.toLowerCase()) >= 0;
	    }
	    return true;
	  };
		
	  var fullName = function() {
        var name = (p.firstname + " " + p.lastname).toLowerCase();
	    if ($scope.searchPersonMisc && $scope.searchPersonMisc.name) {
          return name.indexOf($scope.searchPersonMisc.name.toLowerCase()) >= 0;
	    }
	    return true;
	  };
	  
	  var rowStatus = $scope.rowStatus(p);
	  var changesOnly = function() {
		if (! $scope.showChangesOnly) {
		  return true;
		}
		return rowStatus !== 'clean';
	  };
	  var showDeleted = function() {
		if ($scope.showDeleted) {
		  return true;
		}
		return rowStatus !== 'deleted';
	  }
	  
	  return zipCity() && fullName() && changesOnly() && showDeleted();
	};
	
	$scope.rowStatus = function(row) {
	  if(!row || !row.datatable_inplace_internal) {
		return 'clean';
	  }
	  var internal = row.datatable_inplace_internal;
	  if (internal.deleted) {
		return 'deleted';
	  }
	  if (internal.isNew) {
		return 'new';
	  }
	  if (internal.dirty) {
		return 'dirty';
	  }
	  return 'clean';
	};
	$scope.rowStatusIcon = function(row) {
	  var rowStatus = $scope.rowStatus(row);
	  if(rowStatus === "dirty") {
		return "icon-edit";
	  }
	  if(rowStatus === "new") {
		return "icon-cog";
	  }
	  if(rowStatus === "deleted") {
		  return "icon-trash";
	  }
	  return "";
	};
	
	var countStatus = function(status) {
	  return function() {
        var result=0;
	    for (var i=0; i<$scope.persons.length; i++) {
          if($scope.rowStatus($scope.persons[i]) === status) {
		    result++;
	      }
	    }
	    return result;
	  };
	};
	$scope.numNew = countStatus('new');
	$scope.numChanged = countStatus('dirty');
	$scope.numDeleted = countStatus('deleted');
	
	var indexOf = function(p) {
	  for(var i=0; i<$scope.persons.length; i++) {
		if(p === $scope.persons[i]) {
	      return i;
		}
	  }
	  return -1;
	}
	$scope.addPerson = function(p) {
	  var i = indexOf(p);
	  var before = $scope.persons.slice(0, i+1);
	  var after = $scope.persons.slice(i+1);

	  var newElement = {
	    datatable_inplace_internal: {isNew: true}
	  };
	  
	  before.push(newElement);
	  $scope.persons = before.concat(after);
	}
	$scope.deletePerson = function(p) {
	  if($scope.rowStatus(p) === 'new') {
	    var i = indexOf(p);
	    var before = $scope.persons.slice(0, i);
	    var after = $scope.persons.slice(i+1);
	    $scope.persons = before.concat(after);
	  }
	  else {
	    if(! p.datatable_inplace_internal) {
	      p.datatable_inplace_internal = {};
	    }
	    p.datatable_inplace_internal.deleted=true;
	  }
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


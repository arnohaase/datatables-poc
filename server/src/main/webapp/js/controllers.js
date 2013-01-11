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
	
	$scope.isUndoable = function(row) {
		var rowStatus = $scope.rowStatus(row);
		
		return rowStatus === 'deleted' || rowStatus === 'dirty';
	}
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
	$scope.undoPerson = function(p, idx) {
		if(p.datatable_inplace_internal.deleted) {
			p.datatable_inplace_internal.deleted=false;
		}
		else {
		  $scope.persons[$scope.offset+idx]=p.datatable_inplace_internal.orig;
		}
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
		var newLocale=$scope.persons[i].locale;
		if (! hasLocale($scope.persons[i].locale)) {
		  result.push($scope.persons[i].locale);
		}
	  }
	  
	  return result;
	};
	
	$scope.refresh = function() {
      $http.get('rest/person/list/0/9999999')
	  .success(function(data) {
		$scope.persons=data.persons;
	  })
	  .error(function(data, status, headers, config) {
		alert('Fehler beim Holen der Daten: ' + status);
	  });
	};
	
	$scope.save = function() {
	  var inserts = [];
	  var updates = [];
	  var deletes = [];
		
	  for(var i=0; i<$scope.persons.length; i++) {
		var p = $scope.persons[i];
		var status = $scope.rowStatus(p);
		if(status === 'new') {
          delete p.datatable_inplace_internal;
		  inserts.push(p);
		}
		if(status === 'deleted') {
		  delete p.datatable_inplace_internal;
		  deletes.push(p);
		  $scope.persons = $scope.persons.slice(0, i).concat($scope.persons.slice(i+1));
		  i--;
		}
		if(status === 'dirty') {
		  delete p.datatable_inplace_internal;
		  updates.push(p);
		}
	  }
	  
	  $http.post('rest/person/push', {'inserts': inserts, 'updates': updates, 'deletes': deletes})
	  .success(function(data) {
		if(! data.insertViolations && !data.updateViolations) {
		  // constraint checks passed
          for(var i=0; i<inserts.length; i++) {
			inserts[i].oid = data.oids[i];
			delete inserts[i].datatable_inplace_internal;
		  }
		}
		else {
		  alert('Constraint-Verletzungen');
		  for(var i=0; i<inserts.length; i++) {
			inserts[i].datatable_inplace_internal = {isNew: true};
		  }
	      for(var i=0; i<updates.length; i++) {
		    updates[i].datatable_inplace_internal = {dirty: true};
		  }
		  for(var i=0; i<deletes.length; i++) {
		    deletes[i].datatable_inplace_internal = {deleted: true};
		    $scope.persons.push(deletes[i]);
		  }
          if (data.insertViolations) {
	        for(var i=0; i<inserts.length; i++) {
	    	  if(data.insertViolations[i].violations) {
	    		inserts[i].datatable_inplace_internal.serverViolations=data.insertViolations[i].violations;
	    	  }
            }
          }
          if (data.updateViolations) {
        	for(var i=0; i<updates.length; i++) {
        	  if(data.updateViolations[i].violations) {
        	    updates[i].datatable_inplace_internal.serverViolations=data.updateViolations[i].violations;
        	  }
        	}
          }
		}
	  })
      .error(function(data, status, headers, config) {
	    alert('Fehler beim Speichern der Daten: ' + status);
	    for(var i=0; i<inserts.length; i++) {
	      inserts[i].datatable_inplace_internal = {isNew: true};
	    }
	    for(var i=0; i<updates.length; i++) {
	    	updates[i].datatable_inplace_internal = {dirty: true};
	    }
	    for(var i=0; i<deletes.length; i++) {
	      deletes[i].datatable_inplace_internal = {deleted: true};
	      $scope.persons.push(deletes[i]);
	    }
	  });
	}
	
	$scope.violations = function(row, prop) {
	  if(! row.datatable_inplace_internal || ! row.datatable_inplace_internal.serverViolations) {
		return "";
	  }
	  
	  var result=[];
	  for(var i=0; i<row.datatable_inplace_internal.serverViolations.length; i++) {
		  var v = row.datatable_inplace_internal.serverViolations[i];
		  if(v.prop === prop) {
			  result.push(v.msg);
		  }
	  }
	  
	  return result.join('\n');
	}
	
	$scope.cellClass = function(row, prop) {
		if(! row.datatable_inplace_internal || ! row.datatable_inplace_internal.serverViolations) {
			return "";
		}

		var v = row.datatable_inplace_internal.serverViolations;
		for(var i=0; i<v.length; i++) {
			if(v[i].prop === prop) {
				return "cell-invalid";
			}
		}
		
		return "";
	}
	
	$scope.rowClass = function(row) {
	  var invalid = row.datatable_inplace_internal.serverViolations ? "row-invalid " : "";
		
	  var status = $scope.rowStatus(row);
	  if(status === 'dirty') {
		return invalid + "row-dirty";
	  }
	  if(status === 'new') {
		return invalid + "row-new";
	  }
	  if(status === 'deleted') {
		return "row-deleted";
	  }
	  return invalid + "row-clean";
	}
	
	$scope.refresh();
}


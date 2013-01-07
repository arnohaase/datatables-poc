angular.module('datatable', [])
.filter('inGroupsOf', function() { // converts an array into an array of arrays
  return function(input, groupSize) {
    var result = [];
    
    var curGroup = [];
    var i=0;
    while(i<input.length) {
      curGroup.push(input[i]);
      i+=1;
      if(i%groupSize === 0) {
	result.push(curGroup);
	curGroup = [];
      }
    }
    if(curGroup.length > 0)
      result.push(curGroup);
    
    return result;
  };
})
.filter('sexSymbol', function() {
  return function(input) {
	if(input == 'm')
	  return '\u2642';
	if(input == 'f')
	  return '\u2640';
	return input;
  }
})
.filter('flagForLocale', function() {
  return function(input) {
    if(input === 'de_DE') {
      return 'img/flags/de.png';
    }
    if(input === 'de_AT') {
    	return 'img/flags/at.png';
    }
    if(input === 'en_UK') {
      return 'img/flags/gb.png';
    }
    if(input === 'en_US') {
    	return 'img/flags/us.png';
    }
    if(input === 'en_AU') {
    	return 'img/flags/au.png';
    }
    if(input === 'fr_FR') {
    	return 'img/flags/fr.png';
    }
    return 'img/flags/__.png';
  }
})
.filter('flagForCountry', function() {
	return function(input) {
		if(input === 'Deutschland') {
			return 'img/flags/de.png';
		}
		if(input === 'Great Britain') {
			return 'img/flags/gb.png';
		}
		if(input === 'France') {
			return 'img/flags/fr.png';
		}
		return 'img/flags/__.png';
	}
})
.filter('numberFormat', function() {
  return function(v, m) { // value, mask
	  if (!m || isNaN(+v)) {
	        return v; //return as it is.
	    }
	    //convert any string to number according to formation sign.
	    var v = m.charAt(0) == '-'? -v: +v;
	    var isNegative = v<0? v= -v: 0; //process only abs(), and turn on flag.
	    
	    //search for separator for grp & decimal, anything not digit, not +/- sign, not #.
	    var result = m.match(/[^\d\-\+#]/g);
	    var Decimal = (result && result[result.length-1]) || '.'; //treat the right most symbol as decimal 
	    var Group = (result && result[1] && result[0]) || ',';  //treat the left most symbol as group separator
	    
	    //split the decimal for the format string if any.
	    var m = m.split( Decimal);
	    //Fix the decimal first, toFixed will auto fill trailing zero.
	    v = v.toFixed( m[1] && m[1].length);
	    v = +(v) + ''; //convert number to string to trim off *all* trailing decimal zero(es)

	    //fill back any trailing zero according to format
	    var pos_trail_zero = m[1] && m[1].lastIndexOf('0'); //look for last zero in format
	    var part = v.split('.');
	    //integer will get !part[1]
	    if (!part[1] || part[1] && part[1].length <= pos_trail_zero) {
	        v = (+v).toFixed( pos_trail_zero+1);
	    }
	    var szSep = m[0].split( Group); //look for separator
	    m[0] = szSep.join(''); //join back without separator for counting the pos of any leading 0.

	    var pos_lead_zero = m[0] && m[0].indexOf('0');
	    if (pos_lead_zero > -1 ) {
	        while (part[0].length < (m[0].length - pos_lead_zero)) {
	            part[0] = '0' + part[0];
	        }
	    }
	    else if (+part[0] == 0){
	        part[0] = '';
	    }
	    
	    v = v.split('.');
	    v[0] = part[0];
	    
	    //process the first group separator from decimal (.) only, the rest ignore.
	    //get the length of the last slice of split result.
	    var pos_separator = ( szSep[1] && szSep[ szSep.length-1].length);
	    if (pos_separator) {
	        var integer = v[0];
	        var str = '';
	        var offset = integer.length % pos_separator;
	        for (var i=0, l=integer.length; i<l; i++) { 
	            
	            str += integer.charAt(i); //ie6 only support charAt for sz.
	            //-pos_separator so that won't trail separator on full length
	            if (!((i-offset+1)%pos_separator) && i<l-pos_separator ) {
	                str += Group;
	            }
	        }
	        v[0] = str;
	    }

	    v[1] = (m[1] && v[1])? Decimal+v[1] : "";
	    return (isNegative?'-':'') + v[0] + v[1]; //put back any negation and combine integer and fraction.
	}
})
.filter('numberParse', function() {
  return function(s, thousandsSep, decimalSep) {
	var withoutThousands = s.split(thousandsSep).join('');
	var num = withoutThousands.split(decimalSep).join('.');
	return parseFloat(num);
  };
})
.filter('dateFormat', function() {
  return function(d, pattern) {
	  if(!d) {
		return '';
	  }
	  return pattern
	    .replace('dd', d.substr(8, 2))
	    .replace('MM', d.substr(5, 2))
	    .replace('yyyy', d.substr(0, 4))
	    .replace('yy', d.substr(2, 2));
  }
})
.filter('paged', function() { // returns a 'page' out of an array
  return function(arr, offset, maxSize) {
	var result = [];
	var i=0;
	for (i=offset; i<offset+maxSize && i<arr.length; i++) {
	  result.push(arr[i]);
	}
	return result;
  }
})
.directive('toNumber', function ($filter) {
    return {
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
    	var config = attrs['toNumber'] || ',.2';
    	var thousandsSep = config.substr(0,1);
    	var decimalSep = config.substr(1,1);
    	var numDecimals = parseInt(config.substr(2,1));
    	
        ctrl.$parsers.push(function (value) {
          if(! value) 
        	return undefined;
          return $filter('numberParse')(value || '', thousandsSep, decimalSep);
        });
        ctrl.$formatters.push(function(value) {
          if (! value)
        	return undefined;
        	
          var pattern = '#' + thousandsSep + '##0' + decimalSep;
          for (var i=0; i<numDecimals; i++) {
        	pattern += '0';  
          };
          
          return $filter('numberFormat')(value || 0, pattern);
        });
      }
    };
})
.directive('inplaceEditable', function($parse, $compile) { 
	// expects exactly two child elements, the first being for display and the second for editing. The editing
	//  must bind to datatable_edit_value  //TODO make this configurable?
    return function (scope, element, attrs) {
      var displayElement = element.children().first();
      var editElement    = element.children().last();
      displayElement.addClass('inplace-editable');
      editElement.addClass('inplace-editable');

      var modelAccess = $parse(attrs['inplaceEditable']);
      var rowAccess = $parse(attrs['inplaceEditRow']);
      
      var clickHandler = function() {
    	element.unbind('click');
    	scope.$apply(function() {
    	  scope.datatable_edit_value = modelAccess(scope);
    	  displayElement.hide();
    	  element.append(editElement);
    	  editElement.focus();
    	});
      }; 
      
      editElement.blur (function() {
        element.bind('click', clickHandler);
        displayElement.show(); 
        editElement.detach();
        
        scope.$apply(function() {
          var oldValue = modelAccess(scope);
          var newValue = scope.datatable_edit_value;
          
          if (oldValue !== newValue) {
        	var row = rowAccess(scope);
        	
        	if (! row.datatable_inplace_internal) {
        	  row.datatable_inplace_internal={};
        	}
        	if (! row.datatable_inplace_internal.dirty) {
        	  row.datatable_inplace_internal.orig = angular.fromJson(angular.toJson(row)); 
        	  row.datatable_inplace_internal.dirty = true;
        	}
        	  
            modelAccess.assign(scope, scope.datatable_edit_value);
          }
        });
      });
      
      editElement.keydown(function(e) {
    	if(e.keyCode === 27) {
    	  scope.$apply(function() {scope.datatable_edit_value = modelAccess(scope)});
    	}
    	
    	if(e.keyCode === 13 || e.keyCode === 27) {
    	  editElement.blur();
    	}
      });

      editElement.detach();
      element.bind('click', clickHandler);
    };
})
.directive('sortable', function($compile) {
	var directiveDefinitionObject = {
	  transclude: false,
	  scope: {
		sortField: '@sortable',
		sortModel: '=sortModel'
	  },
	  controller: function($scope) {
		var ensure = function() { 
	      if (! $scope.sortModel.sortBy) {
	        $scope.sortModel.sortBy = [];
		  }
		  if (! $scope.sortModel.sortAsc) {
		    $scope.sortModel.sortAsc = {};
		  }
		  if (! $scope.sortModel.orderBy) {
			$scope.sortModel.orderBy = function() {
			  var result = [];
			  var i;
			  for(i=0; i<$scope.sortModel.sortBy.length; i++) {
				var colKey = $scope.sortModel.sortBy[i];
				var byComma = colKey.split(',');
				var j;
				for (j=0; j<byComma.length; j++) {
				  var bySpace = byComma[j].split(' ');
				  var k;
				  for (k=0; k<bySpace.length; k++) {
					var cur = bySpace[k];
					if (cur !== '') {
                      if($scope.sortModel.sortAsc[colKey]) {
						result.push(cur);
					  }
                      else {
					    result.push('-'+cur);
					  }
					} 
				  }
				}
			  }
			  
			  return result;
			}
		  }
		};

		var isSorted = function() {
			  var i;
			  for(i=0; i<$scope.sortModel.sortBy.length; i++) {
	          if($scope.sortModel.sortBy[i] === $scope.sortField)
	            return true;
	          }
	          return false;
	        };

		$scope.$watch('sortModel.sortAsc[sortField]', function(newValue) {
		  refresh();
		});
		$scope.$watch('sortModel.sortBy', function(newValue) {
		  refresh();
		});
		
        var refresh = function() {
          if(isSorted()) {
  	        if($scope.sortModel.sortAsc[$scope.sortField])
  	          $scope.sortImg = "img/sort_down.png";
  	        else
  	          $scope.sortImg = "img/sort_up.png";
          }
          else {		  
            $scope.sortImg = "img/sort_neutral.png";
          }
        };
          
        $scope.sortclick = function() {
          ensure();
          
          if (isSorted()) {
		    if ($scope.sortModel.sortAsc[$scope.sortField]) {
		      $scope.sortModel.sortAsc[$scope.sortField] = false;
		    }
		  	else {
              $scope.sortModel.sortBy = [];
	  	    }
	  	  }
	      else {
            $scope.sortModel.sortBy = [$scope.sortField];
	  	    $scope.sortModel.sortAsc[$scope.sortField] = true;
	      }
	  	};
	  }
	  ,
	  compile: function compile(tElement, tAttrs, transclude) {
        return {
	      post: function postLink(scope, element, attrs, controller) {
	    	// explicit compile function because ng-click appears not to be linked for templates
	    	var x = $compile('<th ng-click="sortclick()"><img ng-src="{{sortImg}}"></img></th>', transclude);
	    	var newElement = x(scope);

	    	// attributes are not transcluded
            for(var a in attrs) {
	    	  if (a.indexOf('$')!= 0)
  	            newElement.attr(a, attrs[a]);
	    	}

	    	element.replaceWith(newElement);
	    	
	    	var childNodes = element[0].childNodes;
	    	while(childNodes.length > 0) {
	    	  // prepending the element gives it a new parent, automatically removing it from the 
	          //  child collection of the old element
	    	  newElement.prepend(childNodes[childNodes.length-1]);
	    	}

	    	scope.refresh();
	      }
	    }
	  }
	};
	
	return directiveDefinitionObject;	
})
;

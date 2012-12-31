angular.module('datatableFilters', [])
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
.filter('paged', function() { // returns a 'page' out of an array
  return function(arr, offset, maxSize) {
	var result = [];
	var i=0;
	for (i=offset; i<offset+maxSize && i<arr.length; i++) {
	  result.push(arr[i]);
	}
	return result;
  }
});
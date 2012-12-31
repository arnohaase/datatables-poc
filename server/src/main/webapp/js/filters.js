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
.filter('sexSymbol', function() {
  return function(input) {
	if(input == 'm')
	  return '\u2642';
	if(input == 'f')
	  return '\u2640';
	return '???' + input;
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
    if(input === 'fr_FR') {
    	return 'img/flags/fr.png';
    }
    return 'img/flags/ao.png';
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
		return 'img/flags/ao.png';
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
.filter('dateFormat', function() {
  return function(d, pattern) {
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
});
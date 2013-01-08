package de.arnohaase.datatables.model;

public enum Sex {
    m('♂'), f('♀');

    char _sign;

    Sex(char sign) {
    	_sign = sign;
    }

//    @Override
//    public String toString() {
//    	return Character.toString(_sign);
//    }
}

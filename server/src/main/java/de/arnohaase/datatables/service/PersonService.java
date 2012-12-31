package de.arnohaase.datatables.service;

import java.util.ArrayList;
import java.util.List;

import de.arnohaase.datatables.model.Person;
import de.arnohaase.datatables.model.Sex;


public class PersonService {
    public int getNumPersons() {
        return 1000;
    }
    
	public List<Person> findPersons(int offset, int maxNum) {
		final List<Person> result = new ArrayList<Person>();
		
		for (int i=offset; i<Math.min(offset+maxNum, getNumPersons()); i++) {
		    final Person p = new Person();
		    
		    p.setOid(i);
		    p.setFirstname("Vorname-" + i);
		    p.setLastname("Nachname-" + i);
		    p.setStreet("Straße " + i);
		    p.setZip("12345");
		    p.setCity("Stadt " + i);
		    p.setCountry(i%2 == 0 ? "Deutschland" : "Great Britain");
		    p.setLocale(getLocale(i));
		    p.setBirthday(String.format("%4d-%02d-%02d", 1960+i%30, i%12 + 1, i%10 + 10));
		    p.setSex(i%4 < 2 ? Sex.m : Sex.f);
		    p.setIncome(40000 + (i*123471 % 8000000) /100.0);

		    result.add(p);
		}
		
		return result;
	}
	
	private String getLocale(int i) {
	    switch(i%5) {
	    case 0: return "de_DE";
	    case 1: return "de_AT";
	    case 2: return "en_UK";
	    case 3: return "en_US";
	    default: return "fr_FR";
	    }
	}
}

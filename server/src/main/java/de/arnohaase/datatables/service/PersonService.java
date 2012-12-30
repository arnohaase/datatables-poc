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
		    p.setLocale(i%2 == 0 ? "de_DE" : "en_UK");
		    p.setBirthday((1960+i%30) + "-" + (i%12 +1) + "-" + (i%10 + 10));
		    p.setSex(i%4 < 2 ? Sex.m : Sex.f);
		    p.setIncome(30000 + i*12347 % 70000 + .23);

		    result.add(p);
		}
		
		return result;
	}
}

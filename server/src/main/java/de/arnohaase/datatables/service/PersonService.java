package de.arnohaase.datatables.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.log4j.Logger;

import de.arnohaase.datatables.model.Person;
import de.arnohaase.datatables.model.Sex;
import de.arnohaase.datatables.util.GenericCloner;


public class PersonService {
    private static final Logger log = Logger.getLogger(PersonService.class);
    
    private static final Map<Integer, Person> persons = new TreeMap<Integer, Person>();
    private static int nextOid=0;
    
    private static final int INITIAL_NUM_PERSONS = 1000;
    
    static {
        for (int i=0; i<INITIAL_NUM_PERSONS; i++) {
            final Person p = new Person();
            
            p.setOid(createNewOid());
            p.setFirstname("Vorname-" + i);
            p.setLastname("Nachname-" + i);
            p.setStreet("Straße " + i);
            p.setZip("12345");
            p.setCity("Stadt " + i);
            switch(i%3) {
            case 0: p.setCountry("Deutschland");break;
            case 1: p.setCountry("Great Britain");break;
            case 2: p.setCountry("France");break;
            }
            p.setLocale(getLocale(i));
            p.setBirthday(String.format("%4d-%02d-%02d", 1960+i%30, i%12 + 1, i%10 + 10));
            p.setSex(i%4 < 2 ? Sex.m : Sex.f);
            p.setIncome(40000 + (i*123471 % 8000000) /100.0);

            persons.put(p.getOid(), p);
        }
    }

    private static String getLocale(int i) {
        switch(i%6) {
        case 0: return "de_DE";
        case 1: return "de_AT";
        case 2: return "en_UK";
        case 3: return "en_US";
        case 4: return "en_AU";
        default: return "fr_FR";
        }
    }

    public static PersonService INSTANCE = new PersonService();
    
    private PersonService() {
    }
    
    public synchronized int getNumPersons() {
        return persons.size();
    }

    private static int createNewOid() {
        return nextOid++;
    }
    
    public synchronized void insert(Person p) {
        if(p.getOid() != null) {
            throw new IllegalArgumentException("was already inserted");
        }
        p.setOid(createNewOid());
        persons.put(p.getOid(), GenericCloner.clone(p));
    }
    
    public synchronized void update(Person p) {
        System.out.println("!!!!!!!!!!!!!!!!!!");
        log.info("updating person " + p.getOid());
        if (!persons.containsKey(p.getOid())) {
            throw new IllegalArgumentException("does not exist");
        }
        persons.put(p.getOid(), GenericCloner.clone(p));
    }

    public synchronized void delete(Integer oid) {
        if (!persons.containsKey(oid)) {
            throw new IllegalArgumentException("does not exist");
        }
        persons.remove(oid);
    }
    
	public synchronized List<Person> findPersons(int offset, int maxNum) {
		final List<Person> result = new ArrayList<Person>();
		
		int count=0;
		for (Person p: persons.values()) {
		    if(count >= offset) {
		        result.add(GenericCloner.clone(p)); // isolate references in the internal map from the outside world
		    }
		    count++;
		    if(count >= offset+maxNum) {
		        break;
		    }
		}
		
		return result;
	}

    public synchronized Person findPerson(int oid) {
        return GenericCloner.clone(persons.get(oid));
    }
}

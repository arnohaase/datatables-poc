package de.arnohaase.datatables.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;

import org.apache.log4j.Logger;

import de.arnohaase.datatables.model.Person;
import de.arnohaase.datatables.model.Sex;
import de.arnohaase.datatables.util.GenericCloner;

public class PersonService {
    private static final Logger log = Logger.getLogger(PersonService.class);

    static final char[] UPPERCASE = new char[29];
    static final char[] LOWERCASE = new char[30];
    static final long _01011960 = new GregorianCalendar(1960, Calendar.JANUARY, 1).getTimeInMillis();
    static final int PERIOD = (30 * 365 + 8) * 86400; // 30 a

    static final Random rand = new Random();

    private static final Map<Integer, Person> persons = new TreeMap<Integer, Person>();
    private static int nextOid=0;

    private static final int INITIAL_NUM_PERSONS = 1000;

    static {
    	for (char c = 'A'; c <= 'Z'; c++)
    		UPPERCASE[c - 'A'] = c;
    	System.arraycopy(new char[] { 'Ä',  'Ö',  'Ü' },  0,  UPPERCASE, 26, 3);
    	for (char c = 'a'; c <= 'z'; c++)
    		LOWERCASE[c - 'a'] = c;
    	System.arraycopy(new char[] { 'ä',  'ö',  'ü', 'ß' },  0,  LOWERCASE, 26, 4);

        for (int i=0; i<INITIAL_NUM_PERSONS; i++) {
            Person p = createPerson(i);
            persons.put(p.getOid(), p);
        }
    }

    static DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	static Person createPerson(int i) {
		Person p = new Person();

		p.setOid(createNewOid());
		p.setFirstname(randomString(8));
		p.setLastname(randomString(10));
		p.setStreet(randomString(10) + "straße " + rand.nextInt(100));
		p.setZip(String.format("%05d", rand.nextInt(100000)));
		p.setCity(randomString(6) + "stadt");
		switch(i%3) {
		case 0: p.setCountry("Deutschland"); break;
		case 1: p.setCountry("Great Britain"); break;
		case 2: p.setCountry("France"); break;
		}
		p.setLocale(getLocale(i));
		p.setBirthday(format.format(new Date(_01011960 + rand.nextInt(PERIOD) * 1000L)));
		p.setSex(randomEnum(Sex.class));
		p.setIncome(40000 + i*123471 % 8000000 / 100.0);
		return p;
	}

	/**
	 * @param len unverbindliche Wunschlänge
	 */
	static String randomString(int len) {
		len += rand.nextInt() % len / 3; // +/- 33%
		StringBuilder sb = new StringBuilder(len);
		sb.append(randomUppercase());
		for (int i = 1; i < len; i++)
			sb.append(randomLowercase());
		return sb.toString();
	}

	static char randomUppercase() {
		return UPPERCASE[rand.nextInt(UPPERCASE.length)];
	}
	static char randomLowercase() {
		return LOWERCASE[rand.nextInt(LOWERCASE.length)];
	}

	static <E extends Enum<E>> E randomEnum(Class<E> clazz) {
		E[] values = clazz.getEnumConstants();
		return values[rand.nextInt(values.length)];
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

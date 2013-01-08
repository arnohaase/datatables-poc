package de.thomas.jsf;

import java.io.Serializable;
import java.util.List;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;

import de.arnohaase.datatables.model.Person;
import de.arnohaase.datatables.service.PersonService;

@ViewScoped
@ManagedBean
public class PersonBean implements Serializable {

	private static final long serialVersionUID = 5682704689436209238L;

	List<Person> _persons;
	int _rows = 20;

	public PersonBean() {
		_persons = PersonService.INSTANCE.findPersons(0, 999999999);
	}

	public List<Person> getPersons() {
		return _persons;
	}

	public int getRows() {
		return _rows;
	}
	public void setRows(int rows) {
		_rows = rows;
	}
}

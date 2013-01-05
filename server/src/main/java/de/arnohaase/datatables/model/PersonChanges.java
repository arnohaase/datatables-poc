package de.arnohaase.datatables.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class PersonChanges {
    private List<Person> inserts = new ArrayList<Person>();
    private List<Person> updates = new ArrayList<Person>();
    private List<Person> deletes = new ArrayList<Person>();
    
    public List<Person> getInserts() {
        return inserts;
    }
    public void setInserts(List<Person> inserts) {
        this.inserts = inserts;
    }
    public List<Person> getUpdates() {
        return updates;
    }
    public void setUpdates(List<Person> updates) {
        this.updates = updates;
    }
    public List<Person> getDeletes() {
        return deletes;
    }
    public void setDeletes(List<Person> deletes) {
        this.deletes = deletes;
    }
}

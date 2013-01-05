package de.arnohaase.datatables.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class PersonOidList {
    private List<Integer> oids = new ArrayList<Integer>();

    public PersonOidList() {
    }
    public PersonOidList(List<Integer> oids) {
        this.oids = oids;
    }
    
    public List<Integer> getOids() {
        return oids;
    }

    public void setOids(List<Integer> oids) {
        this.oids = oids;
    }
}

package de.arnohaase.datatables.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class ViolationList {
    private List<String> violations = new ArrayList<String>();

    public ViolationList() {}
    public ViolationList(List<String> violations) {
        this.violations = violations;
    }
    
    public List<String> getViolations() {
        return violations;
    }

    public void setViolations(List<String> violations) {
        this.violations = violations;
    }
}

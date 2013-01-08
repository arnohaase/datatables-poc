package de.arnohaase.datatables.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class ViolationList {
    private List<Violation> violations = new ArrayList<Violation>();

    public ViolationList() {}
    public ViolationList(List<Violation> violations) {
        this.violations = violations;
    }
    
    public List<Violation> getViolations() {
        return violations;
    }

    public void setViolations(List<Violation> violations) {
        this.violations = violations;
    }
    
    public static class Violation {
        private String prop;
        private String msg;

        public Violation() {
        }
        public Violation(String prop, String msg) {
            this.prop = prop;
            this.msg = msg;
        }
        
        public String getProp() {
            return prop;
        }
        public void setProp(String prop) {
            this.prop = prop;
        }
        
        public String getMsg() {
            return msg;
        }
        public void setMsg(String msg) {
            this.msg = msg;
        }
    }
}

package de.arnohaase.datatables.model;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class PushResult {
    private List<Integer> oids;
    private List<ViolationList> insertViolations;
    private List<ViolationList> updateViolations;

    public PushResult() {
    }
    public static PushResult createWithOids(List<Integer> oids) {
        final PushResult result = new PushResult();
        result.oids = oids;
        return result;
    }
    public static PushResult createWithConstraintViolations(List<ViolationList> insertViolations, List<ViolationList> updateViolations) {
        final PushResult result = new PushResult();
        result.insertViolations = insertViolations;
        result.updateViolations = updateViolations;
        return result;
    }
    
    public List<Integer> getOids() {
        return oids;
    }
    public void setOids(List<Integer> oids) {
        this.oids = oids;
    }
    
    public List<ViolationList> getInsertViolations() {
        return insertViolations;
    }
    public void setInsertViolations(List<ViolationList> insertViolations) {
        this.insertViolations = insertViolations;
    }
    
    public List<ViolationList> getUpdateViolations() {
        return updateViolations;
    }
    public void setUpdateViolations(List<ViolationList> updateViolations) {
        this.updateViolations = updateViolations;
    }
}


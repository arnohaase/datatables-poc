package de.arnohaase.datatables.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.log4j.Logger;

import de.arnohaase.datatables.model.Person;
import de.arnohaase.datatables.model.PersonChanges;
import de.arnohaase.datatables.model.PersonList;
import de.arnohaase.datatables.model.PushResult;
import de.arnohaase.datatables.model.ViolationList;
import de.arnohaase.datatables.service.PersonService;


@Path("person")
public class PersonRestService {
    private static final Logger LOG = Logger.getLogger(PersonRestService.class);
    
    @Path("/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Person getPerson(@PathParam("id") int oid) {
        return PersonService.INSTANCE.findPerson(oid);
    }

    @Path("/list/{from}/{maxNum}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public PersonList getPersonList(@PathParam("from") int from, @PathParam("maxNum") int maxNum) {
        LOG.info("getting persons from " + from + " with maxNum " + maxNum);
        
        final PersonList result = new PersonList();
        
        result.setFrom(from);
        result.setMaxNum(maxNum);
        result.setPersons(PersonService.INSTANCE.findPersons(from, maxNum));
        result.setTotalNum(PersonService.INSTANCE.getNumPersons());
        
        return result;
    }
    
    private static class ConstraintCheckResult {
        private boolean valid=true;
        private final List<ViolationList> violationLists = new ArrayList<ViolationList>();
    }
    private ConstraintCheckResult transform(List<Person> input, Map<Person, Set<ConstraintViolation<Person>>> newViolations) {
        final ConstraintCheckResult result = new ConstraintCheckResult();
        
        for (Person p: input) {
            final ArrayList<String> vl = new ArrayList<String>();
            
            if(newViolations.containsKey(p)) {
                for(ConstraintViolation<Person> cv: newViolations.get(p)) {
                    vl.add(cv.getMessage());
                    result.valid = false;
                }
            }
            result.violationLists.add(new ViolationList(vl));
        }
        
        return result;
    }
    
    @Path("/push")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public PushResult pushChanges(PersonChanges changes) {
        LOG.info("pushing changes: " + changes.getInserts().size() + " inserts, " + changes.getUpdates().size() + " updates, " + changes.getDeletes().size() + " deletes.");

        final ConstraintCheckResult insertViolations = transform(changes.getInserts(), PersonService.INSTANCE.validate(changes.getInserts()));
        final ConstraintCheckResult updateViolations = transform(changes.getUpdates(), PersonService.INSTANCE.validate(changes.getUpdates()));
        if(! updateViolations.valid || !insertViolations.valid) {
            return PushResult.createWithConstraintViolations(insertViolations.violationLists, updateViolations.violationLists);
        }
        
        final List<Integer> oids = new ArrayList<Integer>();
        for(Person p: changes.getInserts()) {
            PersonService.INSTANCE.insert(p);
            oids.add(p.getOid());
        }
        for(Person p: changes.getUpdates()) {
            PersonService.INSTANCE.update(p);
        }
        for(Person p: changes.getDeletes()) {
            PersonService.INSTANCE.delete(p.getOid());
        }
        
        return PushResult.createWithOids(oids);
    }
}

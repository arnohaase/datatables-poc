package de.arnohaase.datatables.rest;

import java.util.ArrayList;
import java.util.List;

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
import de.arnohaase.datatables.model.PersonOidList;
import de.arnohaase.datatables.service.PersonService;


@Path("person")
public class PersonRestService {
    private static final Logger LOG = Logger.getLogger(PersonRestService.class);
    
    @Path("/{id}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Person getPerson(@PathParam("id") int oid) {
        return new PersonService().findPersons(oid, 1).get(0);
    }

    @Path("/list/{from}/{maxNum}")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public PersonList getPersonList(@PathParam("from") int from, @PathParam("maxNum") int maxNum) {
        LOG.info("getting persons from " + from + " with maxNum " + maxNum);
        
        final PersonList result = new PersonList();
        
        result.setFrom(from);
        result.setMaxNum(maxNum);
        result.setPersons(new PersonService().findPersons(from, maxNum));
        result.setTotalNum(new PersonService().getNumPersons());
        
        return result;
    }
    
    @Path("/push")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public PersonOidList pushChanges(PersonChanges changes) {
        LOG.info("pushing changes: " + changes.getInserts().size() + " inserts, " + changes.getUpdates().size() + " updates, " + changes.getDeletes().size() + " deletes.");

        final List<Integer> result = new ArrayList<Integer>();
        for(Person p: changes.getInserts()) {
            new PersonService().insert(p);
            result.add(p.getOid());
        }
        for(Person p: changes.getUpdates()) {
            new PersonService().update(p);
        }
        for(Person p: changes.getDeletes()) {
            new PersonService().delete(p.getOid());
        }
        return new PersonOidList(result);
    }
}

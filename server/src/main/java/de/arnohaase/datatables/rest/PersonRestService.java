package de.arnohaase.datatables.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import de.arnohaase.datatables.model.Person;
import de.arnohaase.datatables.model.PersonList;
import de.arnohaase.datatables.service.PersonService;


@Path("person")
public class PersonRestService {
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
        final PersonList result = new PersonList();
        
        result.setFrom(from);
        result.setMaxNum(maxNum);
        result.setPersons(new PersonService().findPersons(from, maxNum));
        result.setTotalNum(new PersonService().getNumPersons());
        
        return result;
    }
}

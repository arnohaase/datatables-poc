package de.arnohaase.datatables.util;

import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;
import javax.xml.bind.JAXBContext;

import com.sun.jersey.api.json.JSONConfiguration;
import com.sun.jersey.api.json.JSONJAXBContext;

import de.arnohaase.datatables.model.Person;
import de.arnohaase.datatables.model.PersonChanges;
import de.arnohaase.datatables.model.PersonList;
import de.arnohaase.datatables.model.PushResult;
import de.arnohaase.datatables.model.ViolationList;


@Provider
public class JaxbResolver implements ContextResolver<JAXBContext> {
    private final JAXBContext context;

    public JaxbResolver() throws Exception { 
        this.context = new JSONJAXBContext (JSONConfiguration.natural().build(), 
                PersonList.class, Person.class, PersonChanges.class, PushResult.class, ViolationList.class); 
    }

    public JAXBContext getContext(Class<?> objectType) { 
        return context;
    }
}

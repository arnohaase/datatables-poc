package de.arnohaase.datatables.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;


public class GenericCloner {
    @SuppressWarnings("unchecked")
    public static <T> T clone(T o) {
        try {
            final ByteArrayOutputStream baos = new ByteArrayOutputStream();
            final ObjectOutputStream oos = new ObjectOutputStream(baos);
            oos.writeObject(o);
            oos.close();

            final ObjectInputStream ois = new ObjectInputStream(new ByteArrayInputStream(baos.toByteArray()));
            return (T) ois.readObject();
        }
        catch(Exception exc) {
            throw new RuntimeException(exc);
        }
    }
}

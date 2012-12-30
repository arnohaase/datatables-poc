package de.arnohaase.probieren;

import java.io.*;


/**
 * Helper-Klasse, umd JSON-Dateien zu erzeugen
 */
public class JsonGenerator {
    private static final int NUM_ROWS=1000;

    private static PrintWriter out;
    
    public static void main(String[] args) throws Exception {
        out = new PrintWriter(new FileWriter("persons-" + NUM_ROWS + ".json"));
        
        out.println("[");
        for (int i=0; i<NUM_ROWS; i++) {
            out.print("  {");
            
            out.print("\"oid\": " + i);
            kv("firstname", "Vorname-" + i);
            kv("lastname", "Nachname-" + i);
            kv("street", "Straße " + i);
            kv("zip", "12345");
            kv("city", "Stadt" + i);
            kv("country", i%2 == 0 ? "Deutschland" : "Great Britain");
            kv("locale", i%2 == 0 ? "de_DE" : "en_UK");
            kv("birthday", (1960+i%30) + "-" + (i%12 +1) + "-" + (i%10 + 10));
            kv("sex", i%4 < 2 ? "m" : "f");
            kv("income", (30000 + (i*12347 % 70000)) + .23);
            
            if (i < NUM_ROWS - 1)
                out.println("}, ");
            else
                out.println("}");
        }
        
        out.println("]");
        
        out.close();
    }
    
    private static void kv(String key, Object value) {
        out.print(", " + s(key) + ": ");
        
        if (value instanceof String)
            out.print(s((String) value));
        else
            out.print(value);
    }
    
    private static String s(String s) {
        return "\"" + s + "\"";
    }
}


// [
//   {"oid": 1, "firstname": "Vorname-1", "lastname": "Nachname-1", "street": "Straße 1", "zip": "12345", "city": "Stadt1", "country": "Germany", "locale": "de_DE", "birthday": "1980-01-01", "phone": "++49-555-100001", "sex": "m", "income": 10001.23
//   }
// ]

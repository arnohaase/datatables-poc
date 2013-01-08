package de.arnohaase.datatables.model;

import java.util.HashMap;
import java.util.Map;

public enum Country {
    DEUTSCHLAND, GROSSBRITANNIEN("Großbritannien", "GB"), FRANKREICH;

    String _name;
    String _iso3166;

    Country() {
        _name = name().charAt(0) + name().substring(1).toLowerCase();
        _iso3166 = name().substring(0, 2);
    }
    Country(String name, String iso3166) {
        _name = name;
        _iso3166 = iso3166;
    }

    public String getName() {
        return _name;
    }

    public String getIso3166() {
        return _iso3166;
    }

    @Override
    public String toString() {
        return _name;
    }

    static Map<String, Country> _byIso3166;
    static Country byIso3166(String iso3166) {
        if (_byIso3166 == null) {
            _byIso3166 = new HashMap<String, Country>();
            for (Country c : values())
                _byIso3166.put(c._iso3166, c);
        }
        return _byIso3166.get(iso3166);
    }
}

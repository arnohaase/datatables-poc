package de.arnohaase.datatables.model;

import java.io.Serializable;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.log4j.Logger;
import org.hibernate.validator.constraints.Length;


@XmlRootElement
public class Person implements Serializable {

	private static final long serialVersionUID = 1973340482397719127L;
	static final Logger log = Logger.getLogger(Person.class);

	private Integer oid;
	private String firstname;
	private String lastname;
	@Length(min=2, max=30)
	private String street;
	private String zip;
	private String city;
	private Country country;
	private String locale;
	private Date birthdate;
	@NotNull
	private Sex sex;
	private double income;

	public Integer getOid() {
        return oid;
    }
    public void setOid(Integer oid) {
        this.oid = oid;
    }

    public String getFirstname() {
        return firstname;
    }
    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }
    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getStreet() {
        return street;
    }
    public void setStreet(String street) {
        this.street = street;
    }

    public String getZip() {
        return zip;
    }
    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }

    public Country getCountry() {
        return country;
    }
    public void setCountry(Country country) {
        this.country = country;
    }

    public String getLocale() {
        return locale;
    }
    public void setLocale(String locale) {
        this.locale = locale;
    }

    static DateFormat dFormat = new SimpleDateFormat("yyyy-MM-dd");
    /** Die JS-Variante scheint dies zu benötigen. */
    public String getBirthday() {
        return dFormat.format(birthdate);
    }
    public void setBirthday(String birthday) {
        try {
			birthdate = dFormat.parse(birthday);
		} catch (ParseException px) { // TODO bessere Lösung?
			log.error("invalid date format: " + birthday, px);
		}
    }

    public Date getBirthdate() {
		return birthdate;
	}
	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}

	public Sex getSex() {
        return sex;
    }
    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public double getIncome() {
        return income;
    }
    public void setIncome(double income) {
        this.income = income;
    }
}

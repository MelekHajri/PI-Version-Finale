package pi.pperformance.elite.entities;
import jakarta.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.io.Serializable;
import org.springframework.security.core.userdetails.UserDetails;



@Table(name = "`appel`")

@Entity
public class Appel implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long call_id;

    private LocalDateTime date;

    private int duration; // in seconds or minutes

    private String description;


    @ManyToOne
    @JoinColumn(name = "id")
    private User user;

    // Getters and Setters
    public Long getId() {
     return call_id; }
    public void setId(Long id) {
    	this.call_id = call_id; }
    public LocalDateTime getDate() {
    	return date; }
    public void setDate(LocalDateTime date) {
    	this.date = date; }
    public int getDuration() {
    	return duration; }
    public void setDuration(int duration) {
    	this.duration = duration; }
    public String getDescription() {
    	return description; }
    public void setDescription(String description) { 
    	this.description = description; }
    public User getUser() {
    	return user; }
    public void setUser(User user) {
    	this.user = user; }
}

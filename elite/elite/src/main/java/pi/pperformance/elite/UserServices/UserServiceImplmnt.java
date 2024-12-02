package pi.pperformance.elite.UserServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import pi.pperformance.elite.UserRepository.UserRepository;
import pi.pperformance.elite.entities.User;
import pi.pperformance.elite.exceptions.AccountNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImplmnt implements UserServiceInterface {

    @Autowired
    private UserRepository UsrRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Add a new user and hash the password before saving
    @Override
    public User addUser(User user) {
        // Hash the password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);  // Set the hashed password

        return UsrRepo.save(user);
    }

    // Returns a list of all users
    @Override
    public List<User> getAllUsers() {
        return UsrRepo.findAll();
    }

    // Returns a user by id, throws AccountNotFoundException if not found
    @Override
    public User getUserById(Long id) {
        return UsrRepo.findById(id).orElseThrow(() -> new AccountNotFoundException("User with ID " + id + " not found"));
    }

    // Returns a user by email. Throws AccountNotFoundException if not found.
    @Override
    public User getUserByEmail(String email) {
        User user = UsrRepo.findByEmail(email);
        if (user == null) {
            throw new AccountNotFoundException("User with email " + email + " not found");
        }
        return user;
    }

    // Updates a user's information if they exist; throws AccountNotFoundException if not found
    @Override
    public User updateUser(Long id, User userDetails) {
        Optional<User> optionalUser = UsrRepo.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setFirst_name(userDetails.getFirst_name());
            user.setLast_name(userDetails.getLast_name());
            user.setEmail(userDetails.getEmail());
            user.setBirthDate(userDetails.getBirthDate());
            user.setRole(userDetails.getRole());
            // If password is being updated, encode it
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(userDetails.getPassword());
                user.setPassword(encodedPassword);
            }

            return UsrRepo.save(user);
        } else {
            throw new AccountNotFoundException("User with ID " + id + " not found");
        }
    }

    // Deletes a user by id; throws AccountNotFoundException if user doesn't exist
    @Override
    public void deleteUser(Long id) {
        if (UsrRepo.existsById(id)) {
            UsrRepo.deleteById(id);
        } else {
            throw new AccountNotFoundException("User with ID " + id + " does not exist");
        }
    }

    // Finds a user by email, returns null if not found
    @Override
    public User findByEmail(String email) {
        return UsrRepo.findByEmail(email);
    }
    
   
    
      // Marwa
    
    /* 
     @Override
    public User toggleUserStatus(Long id) {
        // Retrieve the user by ID
        User user = UsrRepo.findById(id)
         .orElseThrow(() -> new AccountNotFoundException("User with ID " + id + " not found"));
        
        
        // Toggle the current isActive status
        user.setIsActive(!user.getIsActive());
        
        // Save and return the updated user
        return UsrRepo.save(user);
    }
       */
    
      //Marwa


    
    //wissal 
    
    
    
    @Override
	public List<User> getactiveUsers (boolean is_active) {
	 
		 return UsrRepo.findByIsActive(is_active);
	}
    
    
    
    
    @Override
	public List<User> getUsersByIsActive(boolean is_active) {
		 
		 return UsrRepo.findByIsActive(is_active);
	}
    
    
    
    
    
    
    
    
    
    @Override
    public User AddActiveUser (User user){
        // Hash the password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);  // Set the hashed password
        user.setIsActive(true);
        return UsrRepo.save(user);

    }
    @Override
	public User activateUser(Long id) {
	    // Retrieve the user from the database by ID
	    User user = UsrRepo.findById(id)
	            .orElseThrow(() -> new AccountNotFoundException("User with ID " + id + " not found"));

	    // If the user is not active, set the status to active (true)
	    if (!user.getIsActive()) {
	        user.setIsActive(true); // Automatically activate the user without requiring further input
	        UsrRepo.save(user); // Save the updated user object to the database
	    }

	    // Return the updated user object
	    return user;
	}

	 
	public User deactivateUser(Long id) throws AccountNotFoundException {
	    User user = UsrRepo.findById(id).orElseThrow(() -> new AccountNotFoundException("Utilisateur non trouvé"));
	    user.setIsActive(false); // Désactive l'utilisateur
	    return UsrRepo.save(user);
	}
}
    
    //wissal


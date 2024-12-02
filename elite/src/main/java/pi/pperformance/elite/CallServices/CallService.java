package pi.pperformance.elite.CallServices;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.Optional;

import pi.pperformance.elite.CallRepository.CallRepository;
import pi.pperformance.elite.UserRepository.UserRepository;
import pi.pperformance.elite.entities.Appel;
import pi.pperformance.elite.entities.Role;
import pi.pperformance.elite.entities.User;

import java.util.List;

@Service
public class CallService {
    private final CallRepository callRepository;
    private final UserRepository userRepository;

    public CallService(CallRepository callRepository, UserRepository userRepository) {
        this.callRepository = callRepository;
        this.userRepository = userRepository;
    }

    public Appel addCall(Appel call) {
        User authenticatedUser = getAuthenticatedUser();

        if (authenticatedUser.getRole() != Role.EMPLOYEE) {
            throw new IllegalArgumentException("Only EMPLOYEE users can create calls.");
        }

        call.setUser(authenticatedUser); // Attach the current EMPLOYEE user
        return callRepository.save(call);
    }

    public List<Appel> getAllCalls() {
        User authenticatedUser = getAuthenticatedUser();

        if (authenticatedUser.getRole() != Role.EMPLOYEE) {
            throw new IllegalArgumentException("Only EMPLOYEE users can view calls.");
        }

        return callRepository.findByUser(authenticatedUser); // Retrieve only calls for this EMPLOYEE
    }

    public Appel getCallById(Long id) {
        User authenticatedUser = getAuthenticatedUser();

        Appel call = callRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Call not found"));

        if (!call.getUser().equals(authenticatedUser)) {
            throw new IllegalArgumentException("You do not have permission to view this call.");
        }

        return call;
    }

    public void deleteCall(Long id) {
        User authenticatedUser = getAuthenticatedUser();

        Appel call = callRepository.findById(id).orElseThrow(() -> 
            new RuntimeException("Call not found"));

        if (!call.getUser().equals(authenticatedUser)) {
            throw new IllegalArgumentException("You do not have permission to delete this call.");
        }

        callRepository.delete(call);
    }


    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Authenticated user not found");
        }

        return user;
    }
    
    public Appel updateCall(Appel updatedCall) {
        return callRepository.save(updatedCall);  // Assuming you're using JPA and the repository handles the update automatically
    }



}

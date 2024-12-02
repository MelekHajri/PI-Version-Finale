package pi.pperformance.elite.CallController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import pi.pperformance.elite.CallServices.CallService;
import pi.pperformance.elite.entities.Appel;

import java.util.List;

@RestController
@RequestMapping("/calls")
public class CallController {
    private final CallService callService;

    public CallController(CallService callService) {
        this.callService = callService;
    }

    
    

    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/add")
    public ResponseEntity<Appel> addCall(@RequestBody Appel call) {
        return ResponseEntity.status(HttpStatus.CREATED).body(callService.addCall(call));
    }
    
    
    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping ("/getcalls")
    public ResponseEntity<List<Appel>> getAllCalls() {
        return ResponseEntity.ok(callService.getAllCalls());
    }
    
    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/getbyid/{id}")
    public ResponseEntity<Appel> getCallById(@PathVariable Long id) {
        return ResponseEntity.ok(callService.getCallById(id));
    }
    
    @PreAuthorize("hasRole('EMPLOYEE')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCall(@PathVariable Long id) {
        callService.deleteCall(id);
        return ResponseEntity.noContent().build();
    }
    
    
    
    
    @PreAuthorize("hasRole('EMPLOYEE')")
    @PutMapping("/update/{id}")
    public ResponseEntity<Appel> updateCall(@PathVariable Long id, @RequestBody Appel updatedCall) {
        // Fetch the call by ID
        Appel existingCall = callService.getCallById(id);
       
        if (existingCall == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // Return 404 if not found
        }
        // Update the existing call with new details
        existingCall.setDate(updatedCall.getDate());
        existingCall.setDuration(updatedCall.getDuration());
        existingCall.setDescription(updatedCall.getDescription());

        // Save the updated call
        Appel savedCall = callService.addCall(existingCall); // You can use the same method to save the updated call

        return ResponseEntity.ok(savedCall); // Return the updated call
    }

    
    
    
    
    
}

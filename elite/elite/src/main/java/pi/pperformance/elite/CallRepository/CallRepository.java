package pi.pperformance.elite.CallRepository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pi.pperformance.elite.entities.Appel;
import pi.pperformance.elite.entities.User;

public interface CallRepository  extends JpaRepository<Appel, Long>{
    List<Appel> findByUser(User user); // Fetch calls for a specific user

}

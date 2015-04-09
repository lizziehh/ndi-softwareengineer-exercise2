package sg.ndi.exercise.e2;

import java.util.ArrayList;
import java.util.logging.Logger;

import javax.inject.Named;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.users.User;

/**
 * Defines v1 of a helloworld API, which provides simple "greeting" methods.
 */
@Api(
    name = "helloworld",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID}
)
public class Greetings {

  private static final Logger log = Logger.getLogger(Greetings.class.getName());
  
  DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
  
  @ApiMethod(httpMethod = "post")
  public HelloGreeting createGreeting(User user, HelloGreeting greeting) {
    return create(greeting);
  }

  @ApiMethod(httpMethod = "post")
  public HelloGreeting deleteGreeting(User user, @Named("key") String keyStr) throws EntityNotFoundException {
    return delete(keyStr);
  }

  @ApiMethod(httpMethod = "post")
  public ArrayList<HelloGreeting> deleteAllGreetings(User user) throws EntityNotFoundException {
    
    ArrayList<HelloGreeting> storedGreetings = list();
    for(HelloGreeting greeting : storedGreetings) {
      delete(greeting.getKey());
    }
      
    return storedGreetings;
  }
  
  @ApiMethod(httpMethod = "post")
  public ArrayList<HelloGreeting> findGreetingByMessage(User user, @Named("message") String message) {
    // TODO Implement me.
    ArrayList<HelloGreeting> list = list();
    ArrayList<HelloGreeting> tmp = new ArrayList<HelloGreeting>();
    int i = 0;
    for (HelloGreeting row : list){
          log.info("data row nya " + i + " = " + row.getMessage());
          if (message.compareToIgnoreCase(row.getMessage().toString()) == 0){
        	  tmp.add(row);
              log.info("test " + i + " = " + row.getMessage());
          }
          i++;
    } 
    return tmp;
  }
  
  @ApiMethod(httpMethod = "post")
  public HelloGreeting updateGreeting(User user, HelloGreeting greeting) {
    // TODO Implement me.
    try{
    	
    	//HelloGreeting gt = get(greeting.getKey());
    	//gt.setMessage("Hello Eileen!");
    	//return gt;
    	
    	delete(greeting.getKey());
    	
        HelloGreeting gt2 = new HelloGreeting();
        gt2.setMessage("Hello Eileen!");
        return create(gt2);
        
    }
    catch(Exception e){
	    log.info("error opo  " +e);
	    return null;
	}
  }
  
  public HelloGreeting getGreetingByKey(User user, @Named("key") String keyStr) {
    try
	  {
		  return get(keyStr);
	  } 
	  catch(Exception e){return null;}
  }
  
  
  public ArrayList<HelloGreeting> listGreetings(User user) {
    return list();
  }
  

  private HelloGreeting create(HelloGreeting greeting) {
    Entity hg = new Entity("HelloGreeting");
    hg.setProperty("message", greeting.getMessage());
    
    log.info("Create: " + hg.toString());
    datastore.put(hg);
    
    Key keyObj = hg.getKey();
    String keyStr = KeyFactory.keyToString(keyObj);
    
    HelloGreeting storedGreeting = new HelloGreeting();
    storedGreeting.setKey(keyStr);
    storedGreeting.setMessage((String)hg.getProperty("message"));
    
    return storedGreeting;  
  }
  
  private HelloGreeting delete(String keyStr) throws EntityNotFoundException {
    
    HelloGreeting storedGreeting = get(keyStr);
    
    Key keyObj = KeyFactory.stringToKey(keyStr);
    
    HelloGreeting deletedGreeting = new HelloGreeting();
    deletedGreeting.setKey(keyStr);
    deletedGreeting.setMessage(storedGreeting.getMessage());
    
    log.info("Delete: " + keyStr);
    datastore.delete(keyObj);
      
    return deletedGreeting;
 
  }
  
  private HelloGreeting get(String keyStr) throws EntityNotFoundException {

    Key keyObj = KeyFactory.stringToKey(keyStr);
    Entity hg = datastore.get(keyObj);
    
    HelloGreeting storedGreeting = new HelloGreeting();
    storedGreeting.setKey(keyStr);
    storedGreeting.setMessage((String)hg.getProperty("message"));

    return storedGreeting;
  }
  
  private ArrayList<HelloGreeting> list() {
    ArrayList<HelloGreeting> storedGreetings = new ArrayList<HelloGreeting>();
    
    Query q = new Query("HelloGreeting");
    PreparedQuery pq = datastore.prepare(q);
    for(Entity hg : pq.asIterable()) {
      Key keyObj = hg.getKey();
      String keyStr = KeyFactory.keyToString(keyObj);

      HelloGreeting storedGreeting = new HelloGreeting();
      storedGreeting.setKey(keyStr);
      storedGreeting.setMessage((String)hg.getProperty("message"));
      
      storedGreetings.add(storedGreeting);
    }
    
    return storedGreetings;

  }
  
}

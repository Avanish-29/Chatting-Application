package com.avastha.chat_app.controller;

import com.avastha.chat_app.model.Message;
import com.avastha.chat_app.model.Room;
import com.avastha.chat_app.repositories.RoomRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {
    private RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){
        if(roomRepository.findByRoomId(roomId)!=null){
            return ResponseEntity.badRequest().body("Room Already Taken !...Try different Room ID");
        }
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom= roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }
    //get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
       Room room = roomRepository.findByRoomId(roomId);
       if(room==null){
           return ResponseEntity.badRequest().body("Room not found!..");
       }
       return ResponseEntity.ok(room);
    }
    //get room messages
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessage(@PathVariable String roomId,
                                                    @RequestParam(value = "page",defaultValue = "0", required = false)int page,
                                                    @RequestParam(value = "size",defaultValue = "20", required = false)int size
    ){
        Room room = roomRepository.findByRoomId((roomId));
        if(room==null){
            return ResponseEntity.badRequest().build();
        }
        //get messages
        //pagination

        List<Message> messages= room.getMessages();
        int start = Math.max(0,messages.size()-(page+1*size));
        int end = Math.min(messages.size(),start+size);
        List<Message> paginatedMessage = messages.subList(start,end);
        return ResponseEntity.ok(messages);

    }
}

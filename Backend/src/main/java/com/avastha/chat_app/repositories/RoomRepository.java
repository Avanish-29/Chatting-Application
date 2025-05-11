package com.avastha.chat_app.repositories;

import com.avastha.chat_app.model.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room,String> {
    Room findByRoomId(String roomId);
}

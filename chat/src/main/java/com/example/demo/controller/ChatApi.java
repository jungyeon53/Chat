package com.example.demo.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.vo.Message;
import com.example.demo.vo.Send;

@RestController
public class ChatApi {
	
// 백엔드 테스트 
//	@GetMapping("/")
//	public String test() {
//		return "test";
//	}
	
	@MessageMapping("/chat")
	@SendTo("/game/message")
	public Send send(Message message) {
		String time = new SimpleDateFormat("HH:mm").format(new Date());
		return new Send(message.getFrom(), message.getMessage(), time);
	}
}

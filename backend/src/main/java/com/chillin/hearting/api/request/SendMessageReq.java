package com.chillin.hearting.api.request;

import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@ToString
@Builder
public class SendMessageReq {

    @NotBlank
    private long heartId;

    @NotBlank
    private String senderId;

    @NotBlank
    private String receiverId;

    @NotBlank
    private String title;

    private String content;

    @Builder
    public SendMessageReq(long heartId, String senderId, String receiverId, String title) {
        this.heartId = heartId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.title = title;
    }
}

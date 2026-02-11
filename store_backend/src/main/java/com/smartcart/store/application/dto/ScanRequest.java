package com.smartcart.store.application.dto; 

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor; 

@Data 
@NoArgsConstructor
public class ScanRequest {
    
    @NotBlank(message = "Image data is required") 
    private String image;
}
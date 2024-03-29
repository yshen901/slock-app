export const JOIN_CALL = "JOIN_CALL";
export const EXCHANGE = "EXCHANGE";
export const LEAVE_CALL = "LEAVE_CALL";
export const REJECT_CALL = "REJECT_CALL";
export const PICKUP_CALL = "PICKUP_CALL";
export const RECEIVED_CALL = "RECEIVED_CALL";

// Public stun server you can ping to get your information
export const ice = {
  iceServers: [
    {
      urls: "stun:stun2.l.google.com:19302" 
    }
  ],
  // iceTransportPolicy: "relay"
}; 

// Sends data to the calls controller, similar to AJAX
export const broadcastData = data => {
  fetch("calls", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {"content-type": "application/json"}
    }
  );
};
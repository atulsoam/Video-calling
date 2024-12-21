class PeerServices {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }
  async getAnswer(offer){
    if (this.peer){
        await this.peer.setRemoteDescription(offer)
        const asnwer  =  await this.peer.createAnswer()
        await this.peer.setLocalDescription(new RTCSessionDescription(asnwer));
        return asnwer

    }
  }
  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
  async setLocalDescriptions(ans){
    if (this.peer){
        await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
    }
  }
}

export default new PeerServices()
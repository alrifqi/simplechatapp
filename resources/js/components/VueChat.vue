<template>
    <div class="chat">
        

        <vue-chat-new-message :active-channel="activeChannel" :username="username"></vue-chat-new-message>
    </div>
</template>

<script>
export default {
  props: ['channels'],
  data() {
      return {
          activeChannel: this.channels[0].id,
          messages: [],
          participants: [],
      };
  },
  created() {
    this.fetchMessages();
    this.socket = io(`http://localhost:3000?username=${this.username}`);
    let socket = io(`http://localhost:3000`);
    for (let channel of this.channels) {
        socket.on(`${channel.name}:App\\Events\\MessageSent`, data => {
            if (this.activeChannel == channel.id) {
                this.messages.push(data.data);
            }
        });
    }

    this.socket.on(`user-joined`, data => {
        this.participants = data.participants;
        this.messages.push({
            message: `${data.username} has joined the chat.`,
            author_username: 'system',
        });
    });

    this.socket.on(`user-left`, data => {
        this.participants = data.participants;
        this.messages.push({
            message: `${data.username} has left the chat.`,
            author_username: 'system',
        });
    });
  },
  methods: {
    fetchMessages() {
      let endpoint = `/channels/${this.activeChannel}/messages`;

      axios.get(endpoint)
          .then(({ data }) => {
              this.messages = data;
          });
    },
    onChannelChanged(id) {
      this.activeChannel = id;
      this.fetchMessages();
    }
  }
}
</script>

<style>

</style>
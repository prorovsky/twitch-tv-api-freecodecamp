const nav = document.querySelector("nav");
const mainContainer = document.querySelector("main.container");

const streamers = [
    "ESL_SC2", 
    "OgamingSC2", 
    "cretetion", 
    "freecodecamp",  
    "habathcx", 
    "RobotCaleb", 
    "noobs2ninjas",
    "comster404"
];

nav.addEventListener("click", event => {
    const target = event.target;
    if(target.dataset.status == "offline"){
        $(".online-channel").hide();
        $(".offline-channel").show();
    } else if(target.dataset.status == "online"){
        $(".offline-channel").hide();
        $(".online-channel").show();
    } else if(target.dataset.status == "all"){
        $(".online-channel").show();
        $(".offline-channel").show();
    }
});

function getChannelInfo(streamers) {
    streamers.forEach(streamer => {
        var dataStream;
        $.getJSON(fullUrl("streams", streamer), function (data){
            dataStream = data;
        }).then(function() {
            $.getJSON(fullUrl("channels", streamer), function(data){
                createDom(data, dataStream);
            });
        });
    });
}

function fullUrl (channel, streamer) {
    return `https://wind-bow.gomix.me/twitch-api/${channel}/${streamer}?callback=?`;
}

function createDom(channel, dataStream) {
    const online = dataStream.stream == null ? "offline-channel" : "online-channel";
    const background = dataStream.stream == null ? "red-background" : "green-background";

    // Create New Channel Section
    const section = document.createElement("section");
    section.classList.add(online, background);
    const divContainer = document.createElement("div");
    divContainer.classList.add("row", "channel-info");

    // Create Channel Logo
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("col-sm-2");
    const channelLogo = document.createElement("img");
    channelLogo.classList.add("channel-logo");
    channelLogo.src = channel.status === 404 ? "http://placehold.it/50x50" : channel.logo;

    // Create Channel Name
    const channelNameContainer = document.createElement("div");
    channelNameContainer.classList.add("col-sm-2");
    const channelNameLink = document.createElement("a");
    channelNameLink.href = channel.status === 404 ? "https://www.twitch.tv/404" : channel.url;
    channelNameLink.target = "_blank" 
    const channelName = document.createElement("p");
    channelName.textContent = channel.status === 404 ? channel.message : channel.display_name;

    // Create Channel Status
    const channelStatusContainer = document.createElement("div");
    channelStatusContainer.classList.add("col-sm-8");
    const channelStatus = document.createElement("p");
    channelStatus.textContent = dataStream.stream == null ? "OFFLINE" : dataStream.stream.channel.status;

    // append image to div container
    imageContainer.appendChild(channelLogo);
    divContainer.appendChild(imageContainer);

    // append channel name to div container
    channelNameLink.appendChild(channelName);
    channelNameContainer.appendChild(channelNameLink);
    divContainer.appendChild(channelNameContainer);

    // append channel status to div container
    channelStatusContainer.appendChild(channelStatus);
    divContainer.appendChild(channelStatusContainer);

    // append new channel section to main container
    section.appendChild(divContainer);
    mainContainer.appendChild(section);
}

$(function () {
    getChannelInfo(streamers);
});
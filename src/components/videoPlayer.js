import { Modal } from '@geist-ui/core';

function convertToEmbedLink(url) {
    var videoID = getVideoID(url);

    if (videoID) {
        var embedLink = 'https://www.youtube.com/embed/' + videoID;
        return embedLink;
    } else {
        return 'Invalid YouTube URL';
    }
}

function getVideoID(url) {
    var regex = /[?&]v=([^&#]*)/;
    var match = url.match(regex);

    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}

const VideoPlayer = ({ playingVideo, closePlayer }) => {
    const closeHandler = () => {
        closePlayer();
    };
    return (
        <Modal
            width="90%"
            height="90vh"
            visible={playingVideo === null ? false : true}
            onClose={closeHandler}
        >
            <iframe
                width="100%"
                height="100%"
                frameborder="0"
                src={convertToEmbedLink(playingVideo?.link)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            />
        </Modal>
    );
};

export default VideoPlayer;

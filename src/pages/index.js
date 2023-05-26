import Head from 'next/head';
import meta from '../../meta.json';
import { useEffect, useState } from 'react';
import { Input, Text } from '@geist-ui/core';
import { Search } from 'iconoir-react';
import PoweredBy from '@/components/poweredBy';
import VideoPlayer from '@/components/videoPlayer';
let stopper = true;
export default function Home() {
    const [videos, setVideos] = useState([]);
    const [copyVideos, setCopyVideos] = useState([]);
    const [timer, setTimer] = useState(null);
    const [playingVideo, setPlayingVideo] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            stopper = false;
            try {
                const res = await fetch(
                    process.env.NEXT_PUBLIC_TABLE_BACKEND_API,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { data } = await res.json();
                setVideos(data);
                setCopyVideos(data);
                setTimeout(() => {
                    stopper = true;
                }, 1000);
            } catch (error) {
                console.error(error);
            }
        };
        if (stopper) fetchData();
    }, []);

    const searchResult = (e) => {
        const { value } = e.target;

        if (value === '') {
            setVideos(copyVideos);
            return;
        }

        clearTimeout(timer);
        const newTimer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_TABLE_BACKEND_API}/search?q=${value}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const { hits } = await res.json();
                setVideos(hits);
                // handle success
            } catch (error) {
                console.error(error);
                // handle error
            }
        }, 500);

        setTimer(newTimer);
    };
    const playThisVideo = (v) => {
        setPlayingVideo(v);
    };
    return (
        <>
            <Head>
                <title>{meta.title.value}</title>
                <meta name="description" content={meta.description.value} />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <PoweredBy />
                {playingVideo && (
                    <VideoPlayer
                        playingVideo={playingVideo}
                        closePlayer={() => setPlayingVideo(null)}
                    />
                )}
                <div className="main-container">
                    <div className="search-input">
                        <Text h2>Video Template</Text>
                        <Input
                            icon={<Search />}
                            placeholder="Advance search to video from YouTube"
                            width="100%"
                            onChange={searchResult}
                        />
                    </div>
                    <br />
                    <div className="videos">
                        {videos.map((video, key) => (
                            <div
                                class="video-card"
                                key={key}
                                onClick={() => playThisVideo(video)}
                            >
                                <div class="video-thumbnail">
                                    <img
                                        src={video['video-thumbnail']}
                                        alt={video.title}
                                    />
                                </div>
                                <div class="video-details">
                                    <div class="video-title">
                                        <Text h5 my={0}>
                                            {video.title}
                                        </Text>
                                    </div>
                                    <div class="video-info">
                                        <img
                                            src={video['channel-logo']}
                                            width="25px"
                                            height="25px"
                                        />
                                        <Text small my={0}>
                                            {video['channel-title']}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
}
